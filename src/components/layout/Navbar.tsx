import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import './Navbar.css'

function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const location = useLocation()
  
  const isActive = (path: string) => location.pathname === path ? 'active' : ''

  // Cerrar menú al cambiar de ruta
  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [location.pathname])

  // Bloquear scroll de pantalla cuando el menú móvil está abierto
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isMobileMenuOpen])

  // Cerrar menú con tecla Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMobileMenuOpen) {
        setIsMobileMenuOpen(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isMobileMenuOpen])

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(prev => !prev)
  }

  const navLinks = [
    { to: '/', label: 'Inicio', icon: '🏛️' },
    { to: '/members', label: 'Miembros', icon: '👥' },
    { to: '/careers', label: 'Carreras', icon: '🎓' },
    { to: '/documents', label: 'Documentos', icon: '📄' },
    { to: '/activities', label: 'Actividades', icon: '📢' },
    { to: '/suggestions', label: 'Buzón', icon: '📩' },
  ]

  return (
    <header className="navbar-wrapper">
      <nav className="navbar" aria-label="Navegación principal">
        {/* Marca / Logo FUSCH */}
        <div className="navbar-brand">
          <Link to="/" className="brand-link" onClick={() => setIsMobileMenuOpen(false)}>
            <div className="brand-icon-wrapper">
              <img 
                src="/images/NUEVO LOGO.png" 
                alt="Logo FUSCH" 
                className="brand-icon" 
              />
            </div>
            <div className="brand-text-block">
              <span className="brand-name">FUSCH</span>
              <span className="brand-tagline">UNSCH • Ayacucho</span>
            </div>
          </Link>
        </div>

        {/* Enlaces versión escritorio (>= md) */}
        <div className="navbar-links-desktop">
          {navLinks.map((link) => (
            <Link 
              key={link.to} 
              to={link.to} 
              className={`nav-link ${isActive(link.to)}`}
            >
              <span className="nav-link-label">{link.label}</span>
            </Link>
          ))}
          
          <Link 
            to="/admin" 
            className={`admin-nav-button ${isActive('/admin')}`}
            title="Panel de Administración"
          >
            <span className="admin-btn-icon">🔐</span>
            <span className="admin-btn-text">Admin</span>
          </Link>
        </div>

        {/* Acciones para mobile (< md): Botón Admin siempre visible + Botón Hamburguesa */}
        <div className="navbar-mobile-actions">
          <Link 
            to="/admin" 
            className="mobile-admin-badge" 
            title="Panel de Administración"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <span className="admin-icon-small">🔐</span>
            <span className="admin-text-small">Admin</span>
          </Link>

          <button 
            type="button" 
            className={`hamburger-btn ${isMobileMenuOpen ? 'open' : ''}`}
            onClick={toggleMobileMenu}
            aria-label={isMobileMenuOpen ? 'Cerrar menú de navegación' : 'Abrir menú de navegación'}
            aria-expanded={isMobileMenuOpen}
          >
            <span className="hamburger-line line-1" />
            <span className="hamburger-line line-2" />
            <span className="hamburger-line line-3" />
          </button>
        </div>
      </nav>

      {/* Backdrop oscuro con blur para mobile */}
      <div 
        className={`mobile-backdrop ${isMobileMenuOpen ? 'visible' : ''}`}
        onClick={() => setIsMobileMenuOpen(false)}
        aria-hidden="true"
      />

      {/* Drawer / Menú lateral deslizable para mobile */}
      <div 
        className={`mobile-drawer ${isMobileMenuOpen ? 'open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="Menú de navegación móvil"
      >
        <div className="drawer-header">
          <div className="drawer-brand">
            <img src="/images/NUEVO LOGO.png" alt="Logo FUSCH" className="drawer-logo" />
            <div>
              <h4 className="drawer-title">FUSCH</h4>
              <p className="drawer-subtitle">Federación Universitaria</p>
            </div>
          </div>
          <button 
            type="button" 
            className="drawer-close-btn"
            onClick={() => setIsMobileMenuOpen(false)}
            aria-label="Cerrar menú"
          >
            ✕
          </button>
        </div>

        <div className="drawer-nav-list">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`drawer-link ${isActive(link.to)}`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <span className="drawer-link-icon">{link.icon}</span>
              <span className="drawer-link-label">{link.label}</span>
              <span className="drawer-link-arrow">→</span>
            </Link>
          ))}

          <div className="drawer-divider" />

          <Link
            to="/admin"
            className={`drawer-link drawer-admin-link ${isActive('/admin')}`}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <span className="drawer-link-icon">🔐</span>
            <span className="drawer-link-label">Panel Administrativo</span>
            <span className="drawer-link-badge">Gestión</span>
          </Link>
        </div>

        <div className="drawer-footer">
          <p className="drawer-footer-text">
            Universidad Nacional de San Cristóbal de Huamanga
          </p>
          <span className="drawer-footer-pill">Gestión 2026 - 2027</span>
        </div>
      </div>
    </header>
  )
}

export default Navbar