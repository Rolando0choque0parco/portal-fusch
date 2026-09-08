import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
import { auth } from '../../firebase/firebaseConfig';
import {
  getSuggestions,
  getSuggestionFileUrl,
  deleteSuggestion,
  downloadFileAttachment,
  previewFileAttachment,
  type Sugerencia
} from '../../services/suggestionsService';
import './Admin.css';

function Admin() {
  // 🔐 Estados de autenticación (conservados al 100%)
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('fusch_admin_session') === 'true';
  });
  const [currentAdminEmail, setCurrentAdminEmail] = useState<string>('');

  const navigate = useNavigate();

  // 🔐 Estados para el Modal de Recuperación
  const [showRecoveryModal, setShowRecoveryModal] = useState(false);
  const [recoveryEmail, setRecoveryEmail] = useState('');
  const [recoveryMessage, setRecoveryMessage] = useState('');

  // 📊 Estados del Panel de Administración (Sugerencias)
  const [suggestions, setSuggestions] = useState<Sugerencia[]>([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('todas');
  const [searchTerm, setSearchTerm] = useState('');
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [actionNotice, setActionNotice] = useState('');

  // Escuchar estado real de autenticación de Firebase
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAuthenticated(true);
        setCurrentAdminEmail(user.email || 'admin@fusch.edu.pe');
        localStorage.setItem('fusch_admin_session', 'true');
      } else {
        const cached = localStorage.getItem('fusch_admin_session') === 'true';
        setIsAuthenticated(cached);
        if (!cached) {
          setCurrentAdminEmail('');
        }
      }
    });
    return () => unsubscribe();
  }, []);

  // Cargar sugerencias al estar autenticado
  useEffect(() => {
    if (isAuthenticated) {
      loadSuggestions();
    }
  }, [isAuthenticated]);

  const loadSuggestions = async () => {
    setLoadingSuggestions(true);
    try {
      const data = await getSuggestions();
      setSuggestions(data);
    } catch (err) {
      console.error('Error al cargar sugerencias en el panel de admin:', err);
    } finally {
      setLoadingSuggestions(false);
    }
  };

  // 🔐 LOGIN REAL CON FIREBASE (Credenciales intactas)
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const userCred = await signInWithEmailAndPassword(auth, email, password);
      localStorage.setItem('fusch_admin_session', 'true');
      setIsAuthenticated(true);
      setCurrentAdminEmail(userCred.user.email || email);
    } catch (err: any) {
      if (err.code === 'auth/user-not-found') {
        setError('❌ Usuario no encontrado.');
      } else if (err.code === 'auth/wrong-password') {
        setError('❌ Contraseña incorrecta.');
      } else if (err.code === 'auth/invalid-email') {
        setError('❌ Correo electrónico inválido.');
      } else {
        setError('❌ Error al iniciar sesión. Verifica tus datos.');
      }
    } finally {
      setLoading(false);
    }
  };

  // 🔐 CERRAR SESIÓN
  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error('Error al cerrar sesión:', err);
    } finally {
      localStorage.removeItem('fusch_admin_session');
      setIsAuthenticated(false);
      setEmail('');
      setPassword('');
    }
  };

  // 🔐 RECUPERACIÓN DE CONTRASEÑA
  const handleRecoverySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRecoveryMessage('');

    if (!recoveryEmail.trim()) {
      setRecoveryMessage('❌ Por favor, ingresa tu correo electrónico.');
      return;
    }

    try {
      await sendPasswordResetEmail(auth, recoveryEmail);
      setRecoveryMessage(`✅ Se ha enviado un correo de recuperación a ${recoveryEmail}. Revisa tu bandeja de entrada.`);
      setTimeout(() => {
        setShowRecoveryModal(false);
        setRecoveryEmail('');
        setRecoveryMessage('');
      }, 3500);
    } catch (err: any) {
      if (err.code === 'auth/user-not-found') {
        setRecoveryMessage('❌ No existe una cuenta con este correo electrónico.');
      } else {
        setRecoveryMessage('❌ Error al enviar el correo. Inténtalo de nuevo más tarde.');
      }
    }
  };

  // 🗑️ ELIMINAR SUGERENCIA
  const handleDeleteSuggestion = async (item: Sugerencia) => {
    if (!confirm(`¿Estás seguro de eliminar el mensaje de "${item.nombre}"?`)) return;

    setProcessingId(item.id);
    try {
      await deleteSuggestion(item.id);
      setSuggestions((prev) => prev.filter((s) => s.id !== item.id));
      setActionNotice('✅ Mensaje eliminado correctamente.');
      setTimeout(() => setActionNotice(''), 3000);
    } catch (err) {
      console.error('Error al eliminar mensaje:', err);
      setActionNotice('❌ Error al eliminar el mensaje.');
    } finally {
      setProcessingId(null);
    }
  };

  // 👁️ VER ARCHIVO ADJUNTO
  const handleViewAttachment = async (item: Sugerencia) => {
    if (!item.archivo) return;
    setProcessingId(item.id);
    try {
      const dataUrl = await getSuggestionFileUrl(item);
      if (dataUrl) {
        previewFileAttachment(dataUrl);
      } else {
        alert('No se pudo cargar el archivo adjunto.');
      }
    } catch (err) {
      console.error('Error al abrir archivo:', err);
      alert('Error al visualizar el archivo.');
    } finally {
      setProcessingId(null);
    }
  };

  // ⬇️ DESCARGAR ARCHIVO ADJUNTO
  const handleDownloadAttachment = async (item: Sugerencia) => {
    if (!item.archivo) return;
    setProcessingId(item.id);
    try {
      const dataUrl = await getSuggestionFileUrl(item);
      if (dataUrl) {
        downloadFileAttachment(dataUrl, item.archivo.nombre);
      } else {
        alert('No se pudo descargar el archivo adjunto.');
      }
    } catch (err) {
      console.error('Error al descargar:', err);
      alert('Error al descargar el archivo.');
    } finally {
      setProcessingId(null);
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

  // Filtrado de sugerencias
  const filteredSuggestions = suggestions.filter((item) => {
    const matchesCategory = selectedCategory === 'todas' || item.categoria === selectedCategory;
    const term = searchTerm.toLowerCase().trim();
    const matchesSearch =
      !term ||
      item.nombre.toLowerCase().includes(term) ||
      item.correo.toLowerCase().includes(term) ||
      item.mensaje.toLowerCase().includes(term) ||
      (item.archivo && item.archivo.nombre.toLowerCase().includes(term));
    return matchesCategory && matchesSearch;
  });

  // Si está autenticado, renderizar el Panel de Administración completo
  if (isAuthenticated) {
    const totalCount = suggestions.length;
    const withFilesCount = suggestions.filter((s) => !!s.archivo).length;
    const complaintsCount = suggestions.filter((s) => s.categoria === 'queja' || s.categoria === 'reclamo' || s.categoria === 'denuncia').length;

    return (
      <div className="admin-dashboard-container">
        {/* ENCABEZADO DEL DASHBOARD */}
        <header className="dashboard-header">
          <div className="dashboard-title-area">
            <span className="dashboard-logo-badge">🔐 FUSCH ADMIN</span>
            <h2>Panel de Administración</h2>
            <p className="admin-email-display">
              Sesión activa: <strong>{currentAdminEmail || 'Administrador'}</strong>
            </p>
          </div>

          <div className="dashboard-header-actions">
            <button
              className="dashboard-nav-btn docs-btn"
              onClick={() => navigate('/documents')}
              title="Ir a gestionar y subir documentos oficiales"
            >
              📄 Gestión de Documentos
            </button>
            <button
              className="dashboard-nav-btn logout-btn"
              onClick={handleLogout}
              title="Cerrar la sesión de administración"
            >
              🚪 Cerrar Sesión
            </button>
          </div>
        </header>

        {/* NOTIFICACIÓN DE ACCIÓN */}
        {actionNotice && <div className="admin-action-notice">{actionNotice}</div>}

        {/* TARJETAS DE ESTADÍSTICAS */}
        <section className="dashboard-stats-grid">
          <div className="stat-card">
            <span className="stat-icon">📩</span>
            <div className="stat-info">
              <span className="stat-value">{totalCount}</span>
              <span className="stat-label">Total de Sugerencias</span>
            </div>
          </div>
          <div className="stat-card">
            <span className="stat-icon">⚠️</span>
            <div className="stat-info">
              <span className="stat-value">{complaintsCount}</span>
              <span className="stat-label">Quejas y Denuncias</span>
            </div>
          </div>
          <div className="stat-card">
            <span className="stat-icon">📎</span>
            <div className="stat-info">
              <span className="stat-value">{withFilesCount}</span>
              <span className="stat-label">Con Archivo Adjunto</span>
            </div>
          </div>
        </section>

        {/* SECCIÓN DEL BUZÓN DE SUGERENCIAS */}
        <main className="dashboard-main">
          <div className="mailbox-toolbar">
            <div className="mailbox-title">
              <h3>📬 Buzón de Sugerencias y Mensajes Recibidos</h3>
              <button
                className="refresh-btn"
                onClick={loadSuggestions}
                disabled={loadingSuggestions}
                title="Recargar mensajes desde Firestore"
              >
                {loadingSuggestions ? '⏳ Cargando...' : '🔄 Actualizar'}
              </button>
            </div>

            {/* BARRA DE FILTROS Y BÚSQUEDA */}
            <div className="mailbox-controls">
              <div className="category-pills">
                <button
                  className={`pill-btn ${selectedCategory === 'todas' ? 'active' : ''}`}
                  onClick={() => setSelectedCategory('todas')}
                >
                  Todas ({suggestions.length})
                </button>
                <button
                  className={`pill-btn ${selectedCategory === 'sugerencia' ? 'active' : ''}`}
                  onClick={() => setSelectedCategory('sugerencia')}
                >
                  Sugerencias ({suggestions.filter((s) => s.categoria === 'sugerencia').length})
                </button>
                <button
                  className={`pill-btn ${selectedCategory === 'queja' ? 'active' : ''}`}
                  onClick={() => setSelectedCategory('queja')}
                >
                  Quejas ({suggestions.filter((s) => s.categoria === 'queja').length})
                </button>
                <button
                  className={`pill-btn ${selectedCategory === 'reclamo' ? 'active' : ''}`}
                  onClick={() => setSelectedCategory('reclamo')}
                >
                  Reclamos ({suggestions.filter((s) => s.categoria === 'reclamo').length})
                </button>
                <button
                  className={`pill-btn ${selectedCategory === 'denuncia' ? 'active' : ''}`}
                  onClick={() => setSelectedCategory('denuncia')}
                >
                  Denuncias ({suggestions.filter((s) => s.categoria === 'denuncia').length})
                </button>
                <button
                  className={`pill-btn ${selectedCategory === 'felicitacion' ? 'active' : ''}`}
                  onClick={() => setSelectedCategory('felicitacion')}
                >
                  Felicitaciones ({suggestions.filter((s) => s.categoria === 'felicitacion').length})
                </button>
              </div>

              <div className="search-input-wrapper">
                <input
                  type="text"
                  placeholder="🔍 Buscar por nombre, correo o palabra clave..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-box"
                />
                {searchTerm && (
                  <button className="clear-search-btn" onClick={() => setSearchTerm('')}>
                    ✕
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* LISTA DE MENSAJES */}
          {loadingSuggestions ? (
            <div className="dashboard-loading-state">
              <span className="loading-spinner">⏳</span>
              <p>Cargando mensajes del buzón en tiempo real...</p>
            </div>
          ) : filteredSuggestions.length === 0 ? (
            <div className="dashboard-empty-state">
              <span className="empty-icon">📭</span>
              <h4>No se encontraron sugerencias</h4>
              <p>
                {suggestions.length === 0
                  ? 'Aún no se han recibido mensajes en el buzón.'
                  : 'No hay mensajes que coincidan con los filtros seleccionados.'}
              </p>
              {suggestions.length === 0 && (
                <Link to="/suggestions" className="test-mailbox-link">
                  Ir al formulario de sugerencias para enviar una de prueba
                </Link>
              )}
            </div>
          ) : (
            <div className="suggestions-cards-list">
              {filteredSuggestions.map((item) => (
                <div key={item.id} className="admin-suggestion-item">
                  <div className="suggestion-item-header">
                    <div className="header-left">
                      <span className={`category-tag ${getCategoryBadgeClass(item.categoria)}`}>
                        {item.categoria.toUpperCase()}
                      </span>
                      <span className="suggestion-timestamp">📅 {item.fecha}</span>
                    </div>

                    <button
                      className="delete-item-btn"
                      onClick={() => handleDeleteSuggestion(item)}
                      disabled={processingId === item.id}
                      title="Eliminar este mensaje"
                    >
                      {processingId === item.id ? '⏳' : '🗑️ Eliminar'}
                    </button>
                  </div>

                  <div className="suggestion-item-user">
                    <div className="user-field">
                      <span className="user-icon">👤</span>
                      <span className="user-name">
                        {item.nombre && item.nombre !== 'Anónimo' ? item.nombre : <em>Anónimo</em>}
                      </span>
                    </div>

                    {item.correo && item.correo !== 'No proporcionado' && (
                      <div className="user-field">
                        <span className="user-icon">✉️</span>
                        <a href={`mailto:${item.correo}`} className="user-email-link">
                          {item.correo}
                        </a>
                      </div>
                    )}
                  </div>

                  <div className="suggestion-item-content">
                    <p>{item.mensaje}</p>
                  </div>

                  {/* ARCHIVO ADJUNTO */}
                  {item.archivo && (
                    <div className="suggestion-item-attachment">
                      <div className="attachment-left">
                        <span className="attachment-badge-icon">📎</span>
                        <div className="attachment-details">
                          <span className="attachment-filename" title={item.archivo.nombre}>
                            {item.archivo.nombre}
                          </span>
                          <span className="attachment-filesize">({item.archivo.tamano})</span>
                        </div>
                      </div>

                      <div className="attachment-buttons">
                        <button
                          type="button"
                          className="action-btn preview-action-btn"
                          onClick={() => handleViewAttachment(item)}
                          disabled={processingId === item.id}
                          title="Visualizar archivo"
                        >
                          👁️ Ver archivo
                        </button>
                        <button
                          type="button"
                          className="action-btn download-action-btn"
                          onClick={() => handleDownloadAttachment(item)}
                          disabled={processingId === item.id}
                          title="Descargar archivo en tu computadora"
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
        </main>
      </div>
    );
  }

  // Si NO está autenticado, renderizar el Formulario de Login existente
  return (
    <div className="admin-container">
      <div className="admin-card">
        <div className="admin-card-header">
          <div className="admin-icon">🔒</div>
          <h2>Panel de Administración</h2>
          <p>Ingresa con tus credenciales de administrador</p>
        </div>

        <form className="admin-form" onSubmit={handleLogin}>
          <div className="form-group">
            <label htmlFor="email">Correo Electrónico (Admin)</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@fusch.edu.pe"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <div className="password-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Ingresa tu contraseña"
                required
              />
              <button
                type="button"
                className="toggle-password-btn"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
          </div>

          <div className="form-options">
            <button
              type="button"
              className="forgot-password-link"
              onClick={() => setShowRecoveryModal(true)}
            >
              ¿Olvidaste tu contraseña?
            </button>
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? '🔐 Cargando...' : '🔑 Iniciar Sesión'}
          </button>
        </form>
      </div>

      {/* MODAL DE RECUPERACIÓN DE CONTRASEÑA */}
      {showRecoveryModal && (
        <div className="modal-overlay" onClick={() => setShowRecoveryModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => setShowRecoveryModal(false)}>
              ✕
            </button>

            <div className="modal-header">
              <span className="modal-icon">🔐</span>
              <h3>Recuperar Contraseña</h3>
              <p>Te enviaremos un enlace a tu correo para restablecer tu acceso.</p>
            </div>

            <form onSubmit={handleRecoverySubmit} className="modal-form">
              <div className="form-group">
                <label htmlFor="recovery-email">Correo Electrónico</label>
                <input
                  type="email"
                  id="recovery-email"
                  value={recoveryEmail}
                  onChange={(e) => setRecoveryEmail(e.target.value)}
                  placeholder="ejemplo@correo.com"
                  required
                />
              </div>

              {recoveryMessage && (
                <div className={`recovery-message ${recoveryMessage.includes('✅') ? 'success' : 'error'}`}>
                  {recoveryMessage}
                </div>
              )}

              <button type="submit" className="modal-submit-btn">
                📤 Enviar enlace de recuperación
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Admin;