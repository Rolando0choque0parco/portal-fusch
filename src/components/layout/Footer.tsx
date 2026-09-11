import { Link } from 'react-router-dom';
import './Footer.css';

function Footer() {
  return (
    <footer className="footer-wrapper">
      <div className="footer-container">
        <div className="footer-main-grid">
          {/* Columna Marca */}
          <div className="footer-brand-col">
            <div className="footer-logo-row">
              <img 
                src="/images/NUEVO LOGO.png" 
                alt="Logo FUSCH" 
                className="footer-logo-img" 
              />
              <div>
                <h3 className="footer-brand-title">FUSCH</h3>
                <span className="footer-brand-sub">Federación Universitaria</span>
              </div>
            </div>
            <p className="footer-brand-desc">
              Universidad Nacional de San Cristóbal de Huamanga. Gestión democrática, transparente y comprometida con el bienestar de toda la comunidad estudiantil.
            </p>
            <span className="footer-gestion-badge">Gestión 2026 – 2027</span>
          </div>

          {/* Columna Navegación Rápida */}
          <div className="footer-links-col">
            <h4 className="footer-col-title">Navegación</h4>
            <ul className="footer-nav-list">
              <li><Link to="/">Inicio</Link></li>
              <li><Link to="/members">Junta Directiva</Link></li>
              <li><Link to="/careers">Facultades y Carreras</Link></li>
              <li><Link to="/documents">Documentos Oficiales</Link></li>
              <li><Link to="/activities">Actividades y Eventos</Link></li>
            </ul>
          </div>

          {/* Columna Atención y Participación */}
          <div className="footer-links-col">
            <h4 className="footer-col-title">Participación</h4>
            <ul className="footer-nav-list">
              <li><Link to="/suggestions">Buzón de Sugerencias</Link></li>
              <li><Link to="/admin">Acceso Administrativo 🔐</Link></li>
              <li><a href="https://www.unsch.edu.pe" target="_blank" rel="noopener noreferrer">Portal UNSCH Oficial ↗</a></li>
            </ul>
            <div className="footer-schedule-hint">
              <strong>Horario de Facultades:</strong>
              <span>8:30 am – 12:30 pm | 2:30 pm – 4:00 pm</span>
            </div>
          </div>
        </div>

        {/* Barra de Derechos de Autor Inferior */}
        <div className="footer-bottom-bar">
          <p>© 2026 FUSCH - Federación Universitaria San Cristóbal de Huamanga. Todos los derechos reservados.</p>
          <p className="footer-motto">"Por una universidad transparente, participativa y de excelencia"</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;