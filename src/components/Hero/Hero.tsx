import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Hero.css';

// 📸 Cada frase tiene una foto de fondo y metadatos de presentación
const slides = [
  {
    image: '/images/reunion-gore/fusch.png',
    tag: 'Gestión Institucional',
    title: 'Reuniones con Autoridades',
    subtitle: 'Gestionando mejores condiciones para la FUSCH y la comunidad estudiantil.',
  },
  {
    image: '/images/labor-social/8.png',
    tag: 'Compromiso Social',
    title: 'Labor Social Permanente',
    subtitle: 'Siempre cerca de nuestras comunidades y velando por el bienestar de los estudiantes.',
  },
  {
    image: '/images/visita-comedor/1.png',
    tag: 'Servicios Universitarios',
    title: 'Control y Transparencia',
    subtitle: 'Supervisando continuamente la calidad de los servicios y beneficios estudiantiles.',
  },
  {
    image: '/images/visita-pescas/diseno-sin-titulo-49.png',
    tag: 'Infraestructura',
    title: 'Visita al Comedor Universitario',
    subtitle: 'Escuchando y atendiendo las necesidades reales de cada escuela profesional.',
  },
  {
    image: '/images/mesa-dialogo/sa.png',
    tag: 'Voz y Diálogo',
    title: 'Mesa de Diálogo Abierta',
    subtitle: 'Construyendo acuerdos firmes con transparencia y representatividad gremial.',
  }
];

function Hero() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const goToPrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + slides.length) % slides.length);
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
  };

  const currentSlide = slides[currentIndex];

  return (
    <section className="hero-section" aria-label="Portada interactiva 3D FUSCH">
      {/* Fondo dinámico con gradiente institucional rojo/oscuro */}
      <div className="hero-dynamic-bg" />
      <div className="hero-pattern-overlay" />

      <div className="hero-container">
        {/* Columna Izquierda: Información de impacto y acciones */}
        <div className="hero-text-content">
          <div className="hero-badge-container">
            <span className="hero-institution-badge">
              <span className="badge-pulsing-dot" />
              Portal Oficial FUSCH • 2026-2027
            </span>
          </div>

          <div className="hero-slide-tag-wrapper">
            <span className="hero-slide-tag">{currentSlide.tag}</span>
          </div>

          <h1 className="hero-title" key={`title-${currentIndex}`}>
            {currentSlide.title}
          </h1>

          <p className="hero-subtitle" key={`sub-${currentIndex}`}>
            {currentSlide.subtitle}
          </p>

          <div className="hero-cta-group">
            <Link to="/activities" className="hero-primary-cta">
              <span>Explorar Actividades</span>
              <span className="cta-arrow">→</span>
            </Link>
            <Link to="/documents" className="hero-secondary-cta">
              <span>Ver Documentos Oficiales</span>
            </Link>
          </div>

          {/* Selector de diapositivas estilo cápsula */}
          <div className="hero-controls-bar">
            <div className="hero-dots">
              {slides.map((_, index) => (
                <button
                  key={index}
                  type="button"
                  className={`hero-dot ${index === currentIndex ? 'active' : ''}`}
                  onClick={() => goToSlide(index)}
                  aria-label={`Ir a diapositiva ${index + 1}`}
                />
              ))}
            </div>
            <span className="hero-slide-counter">
              <strong>0{currentIndex + 1}</strong> / 0{slides.length}
            </span>
          </div>
        </div>

        {/* Columna Derecha: Escenario 3D con Efecto Flotante Continuo y Destellos */}
        <div className="hero-3d-stage">
          {/* Destellos de luz radiales detrás de la imagen (Radial Light Glow) */}
          <div className="hero-light-flare flare-primary" />
          <div className="hero-light-flare flare-secondary" />

          {/* Tarjeta Flotante Principal con animación continua `@keyframes float` */}
          <div className="hero-floating-card-wrapper">
            <div className="hero-floating-card">
              <div className="hero-card-image-box">
                <img
                  src={currentSlide.image}
                  alt={currentSlide.title}
                  className="hero-card-image"
                  key={`img-${currentIndex}`}
                />
                <div className="hero-card-gradient-overlay" />
                <div className="hero-card-caption">
                  <span className="caption-tag">UNSCH Tricentenaria</span>
                  <p className="caption-title">{currentSlide.title}</p>
                </div>
              </div>
            </div>

            {/* Sombra 3D en perspectiva proyectada debajo del objeto flotante */}
            <div className="hero-floating-shadow" />

            {/* Tarjetas y Badges Flotantes en Perspectiva 3D */}
            <div className="flying-card flying-card-top">
              <span className="flying-card-icon">🏛️</span>
              <div>
                <strong className="flying-card-title">Gestión FUSCH</strong>
                <span className="flying-card-desc">Transparencia Total</span>
              </div>
            </div>

            <div className="flying-card flying-card-bottom">
              <span className="flying-card-icon">✊</span>
              <div>
                <strong className="flying-card-title">Voz Estudiantil</strong>
                <span className="flying-card-desc">Defensa de Derechos</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Flechas de navegación interactiva */}
      <button 
        type="button" 
        className="hero-arrow-btn hero-arrow-left" 
        onClick={goToPrev}
        aria-label="Diapositiva anterior"
      >
        ‹
      </button>
      <button 
        type="button" 
        className="hero-arrow-btn hero-arrow-right" 
        onClick={goToNext}
        aria-label="Siguiente diapositiva"
      >
        ›
      </button>
    </section>
  );
}

export default Hero;