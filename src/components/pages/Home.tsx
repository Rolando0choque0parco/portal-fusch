import React from 'react';
import { Link } from 'react-router-dom';
import Stats from '../Stats/Stats';
import Hero from '../Hero/Hero';
import './Home.css';

function Home() {
  return (
    <div className="home-container">
      {/* CARRUSEL DE INICIO */}
      <Hero />

      <div className="features">
        <div className="feature-card">
          <span className="feature-icon">📋</span>
          <h3>Transparencia</h3>
          <p>Accede a documentos oficiales y conoce la gestión de la FUSCH</p>
          <Link to="/documents" className="feature-link">Ver documentos →</Link>
        </div>
        <div className="feature-card">
          <span className="feature-icon">👥</span>
          <h3>Representación</h3>
          <p>Conoce a los miembros de la Junta Directiva 2026-2027</p>
          <Link to="/members" className="feature-link">Conoce a la directiva →</Link>
        </div>
        <div className="feature-card">
          <span className="feature-icon">📩</span>
          <h3>Participación</h3>
          <p>Envía tus sugerencias, quejas o reclamos de forma anónima</p>
          <Link to="/suggestions" className="feature-link">Enviar mensaje →</Link>
        </div>
      </div>

      {/* SECCIÓN DE ESTADÍSTICAS */}
      <Stats />
    </div>
  );
}

export default Home;