import { useState, useEffect } from 'react'
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore'
import { db } from '../../firebase/firebaseConfig'
import './Documents.css'

interface Document {
  id: string
  title: string
  description: string
  category: string
  fileName: string
  fileType: string
  fileSize: string
  uploadDate: string
  downloads: number
  url: string
}

function Documents() {
  const [documents, setDocuments] = useState<Document[]>([])
  const [isAdmin, setIsAdmin] = useState(false)
  const [showUpload, setShowUpload] = useState(false)
  const [uploadMessage, setUploadMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [newDoc, setNewDoc] = useState({
    title: '',
    description: '',
    category: 'estatutos',
    file: null as File | null
  })

  // Verificar si hay admin logueado
  useEffect(() => {
    const adminSession = localStorage.getItem('fusch_admin_session')
    setIsAdmin(adminSession === 'true')
  }, [])

  // Cargar documentos desde Firestore
  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'documents'))
        const docsData: Document[] = []
        querySnapshot.forEach((docSnapshot) => {
          docsData.push({ id: docSnapshot.id, ...docSnapshot.data() } as Document)
        })
        setDocuments(docsData)
      } catch (error) {
        console.error('Error al cargar documentos:', error)
      }
    }
    fetchDocuments()
  }, [])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setNewDoc({ ...newDoc, file: e.target.files[0] })
    }
  }

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault()
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
    if (!newDoc.file) {
      setUploadMessage('❌ Selecciona un archivo')
      setLoading(false)
      return
    }

    try {
      const fileUrl = URL.createObjectURL(newDoc.file)

      const newDocument = {
        title: newDoc.title.trim(),
        description: newDoc.description.trim(),
        category: newDoc.category,
        fileName: newDoc.file.name,
        fileType: newDoc.file.type,
        fileSize: (newDoc.file.size / 1024).toFixed(1) + ' KB',
        uploadDate: new Date().toLocaleDateString('es-PE', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        }),
        downloads: 0,
        url: fileUrl
      }

      const docRef = await addDoc(collection(db, 'documents'), newDocument)
      
      setDocuments(prev => [...prev, { id: docRef.id, ...newDocument }])
      setNewDoc({ title: '', description: '', category: 'estatutos', file: null })
      setShowUpload(false)
      setUploadMessage('✅ Documento subido exitosamente!')
      
      setTimeout(() => setUploadMessage(''), 4000)
    } catch (error) {
      console.error('Error al subir documento:', error)
      setUploadMessage('❌ Error al subir el documento. Inténtalo de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = async (doc: Document) => {
    try {
      const currentDoc = doc(db, 'documents', doc.id)
      await updateDoc(currentDoc, { downloads: doc.downloads + 1 })
      setDocuments(prev => prev.map(d => d.id === doc.id ? { ...d, downloads: d.downloads + 1 } : d))
    } catch (error) {
      console.error('Error al actualizar descargas:', error)
    }

    const link = document.createElement('a')
    link.href = doc.url
    link.download = doc.fileName
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleDelete = async (id: string) => {
    if (!isAdmin) return
    if (confirm('¿Eliminar este documento?')) {
      try {
        const currentDoc = doc(db, 'documents', doc.id)
        await deleteDoc(currentDoc)
        setDocuments(prev => prev.filter(d => d.id !== id))
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

  return (
    <div className="documents-container">
      <div className="documents-header">
        <div>
          <h2>📄 Documentos Oficiales</h2>
          <p>
            Accede a los documentos oficiales de la FUSCH
            {isAdmin && <span className="admin-badge">🔐 Admin</span>}
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
              onClick={() => {
                localStorage.removeItem('fusch_admin_session')
                setIsAdmin(false)
                setShowUpload(false)
              }}
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

      {showUpload && isAdmin && (
        <div className="upload-form-container">
          <h3>📤 Subir Nuevo Documento</h3>
          <form onSubmit={handleUpload} className="upload-form">
            <div className="form-group">
              <label>Título *</label>
              <input
                type="text"
                value={newDoc.title}
                onChange={(e) => setNewDoc({ ...newDoc, title: e.target.value })}
                placeholder="Ej: Estatuto FUSCH 2026"
                required
              />
            </div>
            <div className="form-group">
              <label>Descripción *</label>
              <textarea
                value={newDoc.description}
                onChange={(e) => setNewDoc({ ...newDoc, description: e.target.value })}
                placeholder="Breve descripción del documento"
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
            <div className="form-group">
              <label>Archivo (PDF, Word, etc.) *</label>
              <input
                type="file"
                onChange={handleFileChange}
                accept=".pdf,.doc,.docx,.xls,.xlsx,.txt"
                required
              />
              {newDoc.file && (
                <span className="file-name">📎 {newDoc.file.name}</span>
              )}
            </div>
            <button type="submit" className="upload-submit-btn" disabled={loading}>
              {loading ? '⏳ Subiendo...' : '📤 Subir Documento'}
            </button>
          </form>
        </div>
      )}

      {documents.length === 0 ? (
        <div className="documents-empty">
          <span className="empty-icon">📭</span>
          <h3>No hay documentos disponibles</h3>
          <p>Próximamente se publicarán documentos oficiales.</p>
          {isAdmin && (
            <button 
              className="upload-btn-empty"
              onClick={() => setShowUpload(true)}
            >
              📤 Subir el primer documento
            </button>
          )}
        </div>
      ) : (
        <div className="documents-grid">
          {documents.map((doc) => (
            <div key={doc.id} className="document-card">
              <div className="document-icon">
                {doc.fileType.includes('pdf') ? '📄' :
                 doc.fileType.includes('word') ? '📝' :
                 doc.fileType.includes('excel') ? '📊' : '📁'}
              </div>
              <div className="document-info">
                <h3>{doc.title}</h3>
                <p>{doc.description}</p>
                <div className="document-meta">
                  <span className="doc-category">{categories[doc.category] || doc.category}</span>
                  <span className="doc-size">📦 {doc.fileSize}</span>
                  <span className="doc-date">📅 {doc.uploadDate}</span>
                  <span className="doc-downloads">⬇️ {doc.downloads}</span>
                </div>
              </div>
              <div className="document-actions">
                <button 
                  className="doc-download-btn"
                  onClick={() => handleDownload(doc)}
                >
                  ⬇️ Descargar
                </button>
                {isAdmin && (
                  <button 
                    className="doc-delete-btn"
                    onClick={() => handleDelete(doc.id)}
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