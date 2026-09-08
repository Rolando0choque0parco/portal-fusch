import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  query,
  orderBy
} from 'firebase/firestore'
import { db } from '../firebase/firebaseConfig'

export interface SugerenciaArchivo {
  nombre: string
  tipo: string
  tamano: string
  tamanoBytes: number
  dataUrl?: string
  isChunked?: boolean
  chunkCount?: number
}

export interface Sugerencia {
  id: string
  nombre: string
  correo: string
  categoria: 'sugerencia' | 'queja' | 'reclamo' | 'felicitacion' | 'denuncia' | string
  mensaje: string
  fecha: string
  timestamp: number
  archivo?: SugerenciaArchivo | null
}

const CHUNK_SIZE = 500000 // 500 KB por fragmento para estar seguros bajo el límite de 1MB de Firestore

/**
 * Convierte un objeto File en Data URL (Base64)
 */
function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = (err) => reject(err)
    reader.readAsDataURL(file)
  })
}

/**
 * Formatea el tamaño en bytes a KB o MB
 */
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
}

/**
 * Guarda una sugerencia en la colección 'sugerencias' de Firestore.
 * Soporta archivos adjuntos de hasta 5 MB utilizando Base64 y fragmentación si es necesario.
 */
export async function saveSuggestion(
  formData: {
    name?: string
    email?: string
    category: string
    message: string
  },
  file?: File | null
): Promise<string> {
  // Validación de tamaño del archivo (hasta 5 MB)
  const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5 MB
  if (file && file.size > MAX_FILE_SIZE) {
    throw new Error('El archivo adjunto supera el límite de 5 MB.')
  }

  const now = new Date()
  const fechaStr = `${now.toLocaleDateString('es-PE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })}, ${now.toLocaleTimeString('es-PE', {
    hour: '2-digit',
    minute: '2-digit'
  })}`

  let archivoInfo: SugerenciaArchivo | null = null
  let fileDataUrl: string | null = null
  let isLargeFile = false
  let chunks: string[] = []

  if (file) {
    fileDataUrl = await fileToDataUrl(file)
    const tamano = formatFileSize(file.size)

    // Si es menor a 600 KB, se guarda directo en el documento
    if (file.size <= 600 * 1024) {
      archivoInfo = {
        nombre: file.name,
        tipo: file.type || 'application/octet-stream',
        tamano,
        tamanoBytes: file.size,
        dataUrl: fileDataUrl,
        isChunked: false
      }
    } else {
      // Si supera 600 KB (hasta 5 MB), se fragmenta en subcolección para no exceder límite de 1MB de Firestore
      isLargeFile = true
      for (let i = 0; i < fileDataUrl.length; i += CHUNK_SIZE) {
        chunks.push(fileDataUrl.substring(i, i + CHUNK_SIZE))
      }
      archivoInfo = {
        nombre: file.name,
        tipo: file.type || 'application/octet-stream',
        tamano,
        tamanoBytes: file.size,
        isChunked: true,
        chunkCount: chunks.length
      }
    }
  }

  const docPayload = {
    nombre: formData.name?.trim() || 'Anónimo',
    correo: formData.email?.trim() || 'No proporcionado',
    categoria: formData.category || 'sugerencia',
    mensaje: formData.message.trim(),
    fecha: fechaStr,
    timestamp: now.getTime(),
    archivo: archivoInfo
  }

  const docRef = await addDoc(collection(db, 'sugerencias'), docPayload)

  // Si el archivo fue fragmentado, guardar los chunks en la subcolección
  if (isLargeFile && chunks.length > 0) {
    const chunksColl = collection(db, 'sugerencias', docRef.id, 'chunks')
    for (let index = 0; index < chunks.length; index++) {
      await addDoc(chunksColl, {
        index,
        data: chunks[index]
      })
    }
  }

  return docRef.id
}

/**
 * Obtiene todas las sugerencias de la colección 'sugerencias' ordenadas de más reciente a más antigua
 */
export async function getSuggestions(): Promise<Sugerencia[]> {
  try {
    const collRef = collection(db, 'sugerencias')
    // Usamos orderBy si es posible, o fallback con sort en memoria
    let querySnapshot
    try {
      const q = query(collRef, orderBy('timestamp', 'desc'))
      querySnapshot = await getDocs(q)
    } catch {
      querySnapshot = await getDocs(collRef)
    }

    const items: Sugerencia[] = []
    querySnapshot.forEach((docSnap) => {
      items.push({ id: docSnap.id, ...docSnap.data() } as Sugerencia)
    })

    // Ordenar de forma descendente en memoria como garantía
    items.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0))
    return items
  } catch (error) {
    console.error('Error al obtener sugerencias:', error)
    throw error
  }
}

/**
 * Reconstruye y obtiene la URL completa del archivo adjunto (Data URL)
 */
export async function getSuggestionFileUrl(sugerencia: Sugerencia): Promise<string> {
  if (!sugerencia.archivo) return ''

  // Si ya tiene el Data URL directo
  if (sugerencia.archivo.dataUrl) {
    return sugerencia.archivo.dataUrl
  }

  // Si está fragmentado, obtener los chunks de la subcolección
  if (sugerencia.archivo.isChunked) {
    const chunksColl = collection(db, 'sugerencias', sugerencia.id, 'chunks')
    const chunksSnap = await getDocs(chunksColl)
    const chunkList: { index: number; data: string }[] = []

    chunksSnap.forEach((cSnap) => {
      const data = cSnap.data()
      chunkList.push({ index: data.index, data: data.data })
    })

    chunkList.sort((a, b) => a.index - b.index)
    return chunkList.map((c) => c.data).join('')
  }

  return ''
}

/**
 * Elimina una sugerencia y sus fragmentos en Firestore
 */
export async function deleteSuggestion(id: string): Promise<void> {
  try {
    // Intentar eliminar chunks si existen
    const chunksColl = collection(db, 'sugerencias', id, 'chunks')
    const chunksSnap = await getDocs(chunksColl)
    const deletePromises: Promise<void>[] = []
    chunksSnap.forEach((chunkDoc) => {
      deletePromises.push(deleteDoc(chunkDoc.ref))
    })
    await Promise.all(deletePromises)

    // Eliminar documento principal
    await deleteDoc(doc(db, 'sugerencias', id))
  } catch (error) {
    console.error('Error al eliminar sugerencia:', error)
    throw error
  }
}

/**
 * Inicia la descarga en el navegador con el nombre de archivo correspondiente
 */
export function downloadFileAttachment(dataUrl: string, fileName: string) {
  try {
    const link = document.createElement('a')
    link.href = dataUrl
    link.download = fileName || 'archivo_adjunto'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  } catch (error) {
    console.error('Error al descargar archivo:', error)
    window.open(dataUrl, '_blank')
  }
}

/**
 * Previsualiza el archivo en una nueva pestaña (convierte Base64 a Blob URL para mejor compatibilidad)
 */
export function previewFileAttachment(dataUrl: string) {
  try {
    if (dataUrl.startsWith('data:')) {
      const parts = dataUrl.split(',')
      const mimeMatch = parts[0].match(/:(.*?);/)
      const mime = mimeMatch ? mimeMatch[1] : 'application/octet-stream'
      const binaryStr = atob(parts[1])
      const bytes = new Uint8Array(binaryStr.length)
      for (let i = 0; i < binaryStr.length; i++) {
        bytes[i] = binaryStr.charCodeAt(i)
      }
      const blob = new Blob([bytes], { type: mime })
      const blobUrl = URL.createObjectURL(blob)
      window.open(blobUrl, '_blank')
      setTimeout(() => URL.revokeObjectURL(blobUrl), 60000)
    } else {
      window.open(dataUrl, '_blank')
    }
  } catch (error) {
    console.error('Error al previsualizar archivo:', error)
    window.open(dataUrl, '_blank')
  }
}
