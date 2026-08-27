import { Link, useLocation } from 'react-router-dom'
import './Navbar.css'

function Navbar() {
  const location = useLocation()
  const isActive = (path: string) => location.pathname === path ? 'active' : ''

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/" className="brand-link">
          <img 
            src="/images/NUEVO LOGO.png" 
            alt="Escudo UNSCH" 
            className="brand-icon" 
          />
          <span className="brand-name">FUSCH</span>
        </Link>
      </div>
      <div className="navbar-links">
        <Link to="/" className={`nav-link ${isActive('/')}`}>Inicio</Link>
        <Link to="/members" className={`nav-link ${isActive('/members')}`}>Miembros</Link>
        <Link to="/careers" className={`nav-link ${isActive('/careers')}`}>Carreras</Link>
        <Link to="/documents" className={`nav-link ${isActive('/documents')}`}>Documentos</Link>
        
        {/* Solo el enlace directo, sin menú desplegable */}
        <Link to="/activities" className={`nav-link ${isActive('/activities')}`}>
          Actividades
        </Link>

        <Link to="/suggestions" className={`nav-link ${isActive('/suggestions')}`}>Buzón</Link>
        <Link to="/admin" className={`nav-link ${isActive('/admin')}`}>🔐 Admin</Link>
      </div>
    </nav>
  )
}

export default Navbar