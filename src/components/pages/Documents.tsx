import { useState, useEffect, type ChangeEvent, type FormEvent } from 'react'
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { auth, db } from '../../firebase/firebaseConfig'
import { defaultDocuments, type DocumentItem } from '../../data/defaultDocuments'
import './Documents.css'

/**
 * Función robusta para iniciar la descarga inmediata de un archivo.
 * Se ejecuta de forma sincrónica con el clic del usuario para evitar que
 * los bloqueadores de ventanas emergentes (popup blockers) del navegador cancelen la descarga.
 */
function downloadFile(url: string, fileName: string) {
  try {
    // 1. Archivo en Base64 (Data URL) o Blob URL
    if (url.startsWith('data:') || url.startsWith('blob:')) {
      const link = document.createElement('a')
      link.href = url
      link.download = fileName || 'documento_fusch'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      return
    }

    // 2. Archivo alojado en el mismo origen (ej: /documents/archivo.pdf)
    if (url.startsWith('/') || url.startsWith('./')) {
      const link = document.createElement('a')
      link.href = url
      link.download = fileName || 'documento_fusch.pdf'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      return
    }

    // 3. Archivo remoto HTTP/HTTPS: intentamos blob fetch para forzar descarga directa con el nombre correcto
    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error('Error al descargar el archivo remoto')
        return res.blob()
      })
      .then((blob) => {
        const blobUrl = window.URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = blobUrl
        link.download = fileName || 'documento_fusch'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        window.URL.revokeObjectURL(blobUrl)
      })
      .catch(() => {
        // Fallback en caso de CORS estricto en el servidor externo
        const link = document.createElement('a')
        link.href = url
        link.target = '_blank'
        link.rel = 'noopener noreferrer'
        link.download = fileName || 'documento_fusch'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      })
  } catch (err) {
    console.error('Error al iniciar la descarga:', err)
    window.open(url, '_blank')
  }
}

/**
 * Función para visualizar o previsualizar el documento en una pestaña nueva
 */
function previewFile(url: string) {
  try {
    if (url.startsWith('data:')) {
      // Convertir Base64 data URI a Blob URL para compatibilidad con navegadores modernos
      const parts = url.split(',')
      const mimeMatch = parts[0].match(/:(.*?);/)
      const mime = mimeMatch ? mimeMatch[1] : 'application/pdf'
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
      window.open(url, '_blank', 'noopener,noreferrer')
    }
  } catch (err) {
    console.error('Error al previsualizar:', err)
    window.open(url, '_blank')
  }
}

function Documents() {
  const [documents, setDocuments] = useState<DocumentItem[]>([])
  const [isAdmin, setIsAdmin] = useState(false)
  const [showUpload, setShowUpload] = useState(false)
  const [uploadMessage, setUploadMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [uploadType, setUploadType] = useState<'file' | 'link'>('file')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  const [newDoc, setNewDoc] = useState({
    title: '',
    description: '',
    category: 'estatutos',
    file: null as File | null,
    externalUrl: ''
  })

  // Escuchar estado de autenticación
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAdmin(true)
        localStorage.setItem('fusch_admin_session', 'true')
      } else {
        const cached = localStorage.getItem('fusch_admin_session') === 'true'
        setIsAdmin(cached)
      }
    })
    return () => unsubscribe()
  }, [])

  // Cargar documentos desde Firestore + Documentos oficiales predeterminados
  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'documents'))
        const firestoreDocs: DocumentItem[] = []
        querySnapshot.forEach((docSnapshot) => {
          firestoreDocs.push({ id: docSnapshot.id, ...docSnapshot.data() } as DocumentItem)
        })

        // Unir documentos de Firebase con los documentos oficiales por defecto
        const defaultNotDuplicated = defaultDocuments.filter(
          (def) => !firestoreDocs.some((d) => d.fileName === def.fileName || d.title === def.title)
        )
        setDocuments([...firestoreDocs, ...defaultNotDuplicated])
      } catch (error) {
        console.warn('Cargando documentos locales por defecto:', error)
        setDocuments(defaultDocuments)
      }
    }
    fetchDocuments()
  }, [])

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      // Validar tamaño máximo recomendado (800 KB para almacenamiento Base64 en Firestore)
      if (file.size > 850 * 1024) {
        setUploadMessage('⚠️ Archivo mayor a 800 KB. Se recomienda ingresar un enlace directo (Google Drive, etc.) o comprimir el PDF.')
      } else {
        setUploadMessage('')
      }
      setNewDoc({ ...newDoc, file })
    }
  }

  const handleLogout = async () => {
    try {
      await signOut(auth)
      setIsAdmin(false)
      localStorage.removeItem('fusch_admin_session')
      setShowUpload(false)
    } catch (error) {
      console.error('Error al cerrar sesión:', error)
      setIsAdmin(false)
      localStorage.removeItem('fusch_admin_session')
    }
  }

  const handleUpload = async (e: FormEvent) => {
    e.preventDefault()
    if (!isAdmin) return
    setLoading(true)
    setUploadMessage('')

    if (!newDoc.title.trim()) {
      setUploadMessage('❌ Ingresa un título')
      setLoading(false)
      return
    }
    if (!newDoc.description.trim()) {
      setUploadMessage('❌ Ingresa una descripción')
      setLoading(false)
      return
    }

    let fileUrl = ''
    let fileName = ''
    let fileType = 'application/pdf'
    let fileSize = '1.0 KB'

    try {
      if (uploadType === 'file') {
        if (!newDoc.file) {
          setUploadMessage('❌ Selecciona un archivo para subir')
          setLoading(false)
          return
        }

        if (newDoc.file.size > 1000 * 1024) {
          setUploadMessage('❌ El archivo supera 1 MB. Para archivos grandes, usa la opción "Enlace directo (Google Drive)".')
          setLoading(false)
          return
        }

        // Convertir a Data URL (Base64) - almacenamiento 100% confiable y autónomo
        fileUrl = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader()
          reader.onload = () => resolve(reader.result as string)
          reader.onerror = reject
          reader.readAsDataURL(newDoc.file!)
        })

        fileName = newDoc.file.name
        fileType = newDoc.file.type || 'application/pdf'
        fileSize = (newDoc.file.size / 1024).toFixed(1) + ' KB'
      } else {
        // Enlace externo (Google Drive, repositorio UNSCH, etc.)
        if (!newDoc.externalUrl.trim()) {
          setUploadMessage('❌ Ingresa el enlace o URL del documento')
          setLoading(false)
          return
        }
        fileUrl = newDoc.externalUrl.trim()
        fileName = newDoc.title.trim().toLowerCase().replace(/\s+/g, '_') + '.pdf'
        fileType = 'application/pdf'
        fileSize = 'Enlace externo'
      }

      const newDocument: Omit<DocumentItem, 'id'> = {
        title: newDoc.title.trim(),
        description: newDoc.description.trim(),
        category: newDoc.category,
        fileName,
        fileType,
        fileSize,
        uploadDate: new Date().toLocaleDateString('es-PE', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        }),
        downloads: 0,
        url: fileUrl
      }

      const docRef = await addDoc(collection(db, 'documents'), newDocument)

      setDocuments((prev) => [{ id: docRef.id, ...newDocument }, ...prev])
      setNewDoc({ title: '', description: '', category: 'estatutos', file: null, externalUrl: '' })
      setShowUpload(false)
      setUploadMessage('✅ ¡Documento publicado exitosamente!')

      setTimeout(() => setUploadMessage(''), 4000)
    } catch (error) {
      console.error('Error al subir documento:', error)
      setUploadMessage('❌ Error al publicar el documento: ' + (error instanceof Error ? error.message : 'Inténtalo de nuevo.'))
    } finally {
      setLoading(false)
    }
  }

  /**
   * Manejador de descarga:
   * 1. Inicia la descarga sincrónica (nunca bloqueada por popups)
   * 2. Actualiza el contador en la interfaz
   * 3. Sincroniza el contador en Firestore en segundo plano
   */
  const handleDownload = (item: DocumentItem) => {
    downloadFile(item.url, item.fileName)

    // Incrementar visualmente el contador
    setDocuments((prev) =>
      prev.map((d) => (d.id === item.id ? { ...d, downloads: (d.downloads || 0) + 1 } : d))
    )

    // Si está en Firestore, actualizar remotamente
    if (item.id && !item.id.startsWith('default-')) {
      const docRef = doc(db, 'documents', item.id)
      updateDoc(docRef, { downloads: (item.downloads || 0) + 1 }).catch((err) => {
        console.warn('Error al sincronizar contador de descargas:', err)
      })
    }
  }

  const handleDelete = async (item: DocumentItem) => {
    if (!isAdmin) return
    if (confirm(`¿Eliminar el documento "${item.title}"?`)) {
      try {
        if (!item.id.startsWith('default-')) {
          await deleteDoc(doc(db, 'documents', item.id))
        }
        setDocuments((prev) => prev.filter((d) => d.id !== item.id))
        setUploadMessage('✅ Documento eliminado correctamente.')
        setTimeout(() => setUploadMessage(''), 3000)
      } catch (error) {
        console.error('Error al eliminar documento:', error)
        setUploadMessage('❌ Error al eliminar el documento.')
      }
    }
  }

  const categories: Record<string, string> = {
    'estatutos': '📜 Estatutos y Reglamentos',
    'informes': '📊 Informes de Gestión',
    'comunicados': '📢 Comunicados Oficiales',
    'transparencia': '📋 Transparencia',
    'otros': '📁 Otros'
  }

  const filteredDocuments = selectedCategory === 'all'
    ? documents
    : documents.filter((d) => d.category === selectedCategory)

  return (
    <div className="documents-container">
      <div className="documents-header">
        <div>
          <h2>📄 Documentos Oficiales</h2>
          <p>
            Accede y descarga los documentos oficiales, resoluciones y estatutos de la FUSCH.
            {isAdmin && <span className="admin-badge">🔐 Modo Admin</span>}
          </p>
        </div>

        {isAdmin && (
          <div className="admin-actions">
            <button
              className="upload-btn"
              onClick={() => setShowUpload(!showUpload)}
            >
              {showUpload ? '✕ Cerrar' : '📤 Subir Documento'}
            </button>
            <button
              className="logout-btn"
              onClick={handleLogout}
            >
              🚪 Cerrar Sesión
            </button>
          </div>
        )}
      </div>

      {uploadMessage && (
        <div className={`upload-message ${uploadMessage.includes('✅') ? 'success' : 'error'}`}>
          {uploadMessage}
        </div>
      )}

      {/* Formulario de subida para Admin */}
      {showUpload && isAdmin && (
        <div className="upload-form-container">
          <h3>📤 Publicar Nuevo Documento</h3>

          <div className="upload-type-selector">
            <button
              type="button"
              className={`type-btn ${uploadType === 'file' ? 'active' : ''}`}
              onClick={() => setUploadType('file')}
            >
              📁 Subir archivo PDF / Doc
            </button>
            <button
              type="button"
              className={`type-btn ${uploadType === 'link' ? 'active' : ''}`}
              onClick={() => setUploadType('link')}
            >
              🔗 Enlace directo (Drive, Web)
            </button>
          </div>

          <form onSubmit={handleUpload} className="upload-form">
            <div className="form-group">
              <label>Título del Documento *</label>
              <input
                type="text"
                value={newDoc.title}
                onChange={(e) => setNewDoc({ ...newDoc, title: e.target.value })}
                placeholder="Ej: Estatuto FUSCH 2026-2027"
                required
              />
            </div>
            <div className="form-group">
              <label>Descripción detallada *</label>
              <textarea
                value={newDoc.description}
                onChange={(e) => setNewDoc({ ...newDoc, description: e.target.value })}
                placeholder="Breve resumen del contenido y alcance del documento..."
                rows={3}
                required
              />
            </div>
            <div className="form-group">
              <label>Categoría</label>
              <select
                value={newDoc.category}
                onChange={(e) => setNewDoc({ ...newDoc, category: e.target.value })}
              >
                <option value="estatutos">📜 Estatutos y Reglamentos</option>
                <option value="informes">📊 Informes de Gestión</option>
                <option value="comunicados">📢 Comunicados Oficiales</option>
                <option value="transparencia">📋 Transparencia</option>
                <option value="otros">📁 Otros</option>
              </select>
            </div>

            {uploadType === 'file' ? (
              <div className="form-group">
                <label>Archivo (PDF, Word, Excel) *</label>
                <input
                  type="file"
                  onChange={handleFileChange}
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.txt"
                  required
                />
                {newDoc.file && (
                  <span className="file-name">📎 {newDoc.file.name} ({(newDoc.file.size / 1024).toFixed(1)} KB)</span>
                )}
                <small className="form-hint">Máximo recomendado: 800 KB para almacenamiento directo.</small>
              </div>
            ) : (
              <div className="form-group">
                <label>URL / Enlace del Documento *</label>
                <input
                  type="url"
                  value={newDoc.externalUrl}
                  onChange={(e) => setNewDoc({ ...newDoc, externalUrl: e.target.value })}
                  placeholder="https://drive.google.com/... o https://unsch.edu.pe/doc.pdf"
                  required
                />
                <small className="form-hint">Enlace de Google Drive, OneDrive o enlace institucional público.</small>
              </div>
            )}

            <button type="submit" className="upload-submit-btn" disabled={loading}>
              {loading ? '⏳ Guardando documento...' : '📤 Publicar Documento'}
            </button>
          </form>
        </div>
      )}

      {/* Filtro de Categorías */}
      <div className="category-filter">
        <button
          className={`filter-btn ${selectedCategory === 'all' ? 'active' : ''}`}
          onClick={() => setSelectedCategory('all')}
        >
          Todos ({documents.length})
        </button>
        {Object.entries(categories).map(([key, label]) => {
          const count = documents.filter((d) => d.category === key).length
          return (
            <button
              key={key}
              className={`filter-btn ${selectedCategory === key ? 'active' : ''}`}
              onClick={() => setSelectedCategory(key)}
            >
              {label} ({count})
            </button>
          )
        })}
      </div>

      {filteredDocuments.length === 0 ? (
        <div className="documents-empty">
          <span className="empty-icon">📭</span>
          <h3>No hay documentos en esta categoría</h3>
          <p>Selecciona otra categoría o consulta más tarde.</p>
        </div>
      ) : (
        <div className="documents-grid">
          {filteredDocuments.map((item) => (
            <div key={item.id} className="document-card">
              <div className="document-icon">
                {item.fileType.includes('pdf') ? '📄' :
                 item.fileType.includes('word') ? '📝' :
                 item.fileType.includes('excel') ? '📊' : '📁'}
              </div>
              <div className="document-info">
                <h3>{item.title}</h3>
                <p>{item.description}</p>
                <div className="document-meta">
                  <span className="doc-category">{categories[item.category] || item.category}</span>
                  <span className="doc-size">📦 {item.fileSize}</span>
                  <span className="doc-date">📅 {item.uploadDate}</span>
                  <span className="doc-downloads">⬇️ {item.downloads} descargas</span>
                </div>
              </div>
              <div className="document-actions">
                <button
                  className="doc-download-btn"
                  onClick={() => handleDownload(item)}
                  title="Descargar archivo en tu dispositivo"
                >
                  ⬇️ Descargar
                </button>
                <button
                  className="doc-preview-btn"
                  onClick={() => previewFile(item.url)}
                  title="Abrir o ver en una nueva pestaña"
                >
                  👁️ Ver
                </button>
                {isAdmin && (
                  <button
                    className="doc-delete-btn"
                    onClick={() => handleDelete(item)}
                    title="Eliminar documento"
                  >
                    🗑️
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Documents