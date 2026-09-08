import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../firebase/firebaseConfig';
import {
  saveSuggestion,
  getSuggestions,
  getSuggestionFileUrl,
  downloadFileAttachment,
  previewFileAttachment,
  formatFileSize,
  type Sugerencia
} from '../../services/suggestionsService';
import './Suggestions.css';

function Suggestions() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    category: 'sugerencia',
    message: ''
  });
  const [attachedFile, setAttachedFile] = useState<File | null>(null);
  const [message, setMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminMessages, setAdminMessages] = useState<Sugerencia[]>([]);
  const [loadingAdminMessages, setLoadingAdminMessages] = useState(false);
  const [loadingFileId, setLoadingFileId] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const messageTimeoutRef = useRef<any>(null);

  // Escuchar estado de sesión de administrador existente
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAdmin(true);
        localStorage.setItem('fusch_admin_session', 'true');
      } else {
        const cached = localStorage.getItem('fusch_admin_session') === 'true';
        setIsAdmin(cached);
      }
    });
    return () => unsubscribe();
  }, []);

  // Si es admin, cargar sugerencias reales desde Firestore
  useEffect(() => {
    if (isAdmin) {
      loadAdminSuggestions();
    }
  }, [isAdmin]);

  const loadAdminSuggestions = async () => {
    setLoadingAdminMessages(true);
    try {
      const list = await getSuggestions();
      setAdminMessages(list);
    } catch (err) {
      console.error('Error al cargar sugerencias para admin:', err);
    } finally {
      setLoadingAdminMessages(false);
    }
  };

  // Manejador de selección de archivo con validación de 5 MB
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMessage('');
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const MAX_SIZE = 5 * 1024 * 1024; // 5 MB

      if (file.size > MAX_SIZE) {
        setErrorMessage('⚠️ El archivo adjunto supera los 5 MB permitidos. Por favor, selecciona uno más pequeño.');
        if (fileInputRef.current) fileInputRef.current.value = '';
        setAttachedFile(null);
        return;
      }

      setAttachedFile(file);
    }
  };

  const handleRemoveFile = () => {
    setAttachedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsSubmitting(true);

    if (!formData.message.trim()) {
      setErrorMessage('Por favor, escribe un mensaje.');
      setIsSubmitting(false);
      return;
    }

    try {
      await saveSuggestion(formData, attachedFile);

      // Mostrar confirmación
      setMessage('✅ Tu mensaje fue enviado correctamente. ¡Gracias por participar!');

      // Limpiar formulario y archivo adjunto
      setFormData({ name: '', email: '', category: 'sugerencia', message: '' });
      setAttachedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';

      // Auto-ocultar mensaje después de 3.5 segundos
      if (messageTimeoutRef.current) clearTimeout(messageTimeoutRef.current);
      messageTimeoutRef.current = setTimeout(() => {
        setMessage('');
      }, 3500);

      // Recargar lista si es admin
      if (isAdmin) {
        loadAdminSuggestions();
      }
    } catch (error: any) {
      console.error('Error al guardar la sugerencia:', error);
      setErrorMessage('❌ Error al enviar el mensaje: ' + (error.message || 'Inténtalo de nuevo.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  // Acciones sobre archivos en la sección admin
  const handleDownloadAttachment = async (sugerencia: Sugerencia) => {
    if (!sugerencia.archivo) return;
    setLoadingFileId(sugerencia.id);
    try {
      const dataUrl = await getSuggestionFileUrl(sugerencia);
      if (dataUrl) {
        downloadFileAttachment(dataUrl, sugerencia.archivo.nombre);
      } else {
        alert('No se pudo descargar el archivo.');
      }
    } catch (err) {
      console.error('Error al descargar:', err);
      alert('Error al descargar el archivo.');
    } finally {
      setLoadingFileId(null);
    }
  };

  const handlePreviewAttachment = async (sugerencia: Sugerencia) => {
    if (!sugerencia.archivo) return;
    setLoadingFileId(sugerencia.id);
    try {
      const dataUrl = await getSuggestionFileUrl(sugerencia);
      if (dataUrl) {
        previewFileAttachment(dataUrl);
      } else {
        alert('No se pudo visualizar el archivo.');
      }
    } catch (err) {
      console.error('Error al previsualizar:', err);
      alert('Error al previsualizar el archivo.');
    } finally {
      setLoadingFileId(null);
    }
  };

  const getCategoryBadgeClass = (cat: string) => {
    switch (cat.toLowerCase()) {
      case 'queja': return 'badge-queja';
      case 'reclamo': return 'badge-reclamo';
      case 'felicitacion': return 'badge-felicitacion';
      case 'denuncia': return 'badge-denuncia';
      default: return 'badge-sugerencia';
    }
  };

  return (
    <div className="suggestions-container">
      <div className="suggestions-header">
        <h2>📩 Buzón de Sugerencias</h2>
        <p>Envía tus quejas, reclamos o sugerencias de forma anónima o identificándote</p>
      </div>

      <form onSubmit={handleSubmit} className="suggestions-form">
        <div className="form-group">
          <label>Nombre (Opcional)</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Tu nombre (puedes dejarlo vacío)"
            disabled={isSubmitting}
          />
        </div>

        <div className="form-group">
          <label>Email (Opcional)</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="Tu correo (puedes dejarlo vacío)"
            disabled={isSubmitting}
          />
        </div>

        <div className="form-group">
          <label>Tipo de mensaje *</label>
          <select
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            disabled={isSubmitting}
          >
            <option value="sugerencia">📝 Sugerencia</option>
            <option value="queja">⚠️ Queja</option>
            <option value="reclamo">📢 Reclamo</option>
            <option value="felicitacion">🎉 Felicitación</option>
            <option value="denuncia">🔒 Denuncia</option>
          </select>
        </div>

        <div className="form-group">
          <label>Tu mensaje *</label>
          <textarea
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            placeholder="Escribe aquí tu sugerencia, queja o reclamo con el mayor detalle posible..."
            rows={5}
            required
            disabled={isSubmitting}
          />
        </div>

        {/* CAMPO PARA ADJUNTAR ARCHIVO (HASTA 5 MB) */}
        <div className="form-group file-upload-group">
          <label>Adjuntar archivo (Opcional)</label>
          <div className="file-input-wrapper">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg,.webp,.txt"
              id="suggestion-file-input"
              className="file-hidden-input"
              disabled={isSubmitting}
            />
            <label htmlFor="suggestion-file-input" className="file-upload-btn">
              📎 Seleccionar archivo (PDF, fotos, docs hasta 5 MB)
            </label>
          </div>

          {attachedFile && (
            <div className="attached-file-chip">
              <span className="file-chip-icon">📄</span>
              <span className="file-chip-name">{attachedFile.name}</span>
              <span className="file-chip-size">({formatFileSize(attachedFile.size)})</span>
              <button
                type="button"
                className="remove-file-btn"
                onClick={handleRemoveFile}
                title="Quitar archivo"
                disabled={isSubmitting}
              >
                ✕
              </button>
            </div>
          )}
        </div>

        {errorMessage && <div className="error-message">{errorMessage}</div>}
        {message && <div className="success-message auto-dismiss">{message}</div>}

        <button type="submit" className="submit-btn" disabled={isSubmitting}>
          {isSubmitting ? '⏳ Guardando sugerencia...' : '📤 Enviar Mensaje'}
        </button>
      </form>

      {/* SECCIÓN PARA EL ADMIN (BUZÓN EN TIEMPO REAL) */}
      {isAdmin && (
        <div className="admin-messages-section">
          <div className="admin-section-header">
            <div>
              <h3>📊 Mensajes recibidos en el Buzón ({adminMessages.length})</h3>
              <p className="admin-subtitle">Visible únicamente para administradores con sesión activa</p>
            </div>
            <Link to="/admin" className="admin-panel-link-btn">
              🔐 Ir al Panel de Administración Completo
            </Link>
          </div>

          {loadingAdminMessages ? (
            <div className="admin-messages-loading">⏳ Cargando sugerencias desde Firestore...</div>
          ) : adminMessages.length === 0 ? (
            <div className="admin-messages-empty">
              <span>📭</span>
              <p>No hay mensajes registrados aún en el buzón.</p>
            </div>
          ) : (
            <div className="admin-messages-grid">
              {adminMessages.map((msg) => (
                <div key={msg.id} className="admin-message-card">
                  <div className="admin-card-top">
                    <span className={`category-tag ${getCategoryBadgeClass(msg.categoria)}`}>
                      {msg.categoria.toUpperCase()}
                    </span>
                    <span className="admin-msg-date">{msg.fecha}</span>
                  </div>

                  <div className="admin-msg-author">
                    <strong>👤 {msg.nombre || 'Anónimo'}</strong>
                    {msg.correo && msg.correo !== 'No proporcionado' && (
                      <span className="admin-msg-email">✉️ {msg.correo}</span>
                    )}
                  </div>

                  <p className="admin-msg-body">{msg.mensaje}</p>

                  {msg.archivo && (
                    <div className="admin-msg-attachment">
                      <div className="attachment-info">
                        <span className="attachment-icon">📎</span>
                        <span className="attachment-name" title={msg.archivo.nombre}>
                          {msg.archivo.nombre}
                        </span>
                        <span className="attachment-size">({msg.archivo.tamano})</span>
                      </div>
                      <div className="attachment-actions">
                        <button
                          type="button"
                          className="attachment-action-btn view-btn"
                          onClick={() => handlePreviewAttachment(msg)}
                          disabled={loadingFileId === msg.id}
                        >
                          👁️ Ver
                        </button>
                        <button
                          type="button"
                          className="attachment-action-btn download-btn"
                          onClick={() => handleDownloadAttachment(msg)}
                          disabled={loadingFileId === msg.id}
                        >
                          ⬇️ Descargar
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Suggestions;