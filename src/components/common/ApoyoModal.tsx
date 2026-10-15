import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import './ApoyoModal.css';

interface PriorityNotice {
  id: string;
  type: 'ayuda' | 'onomastico';
  badge: string;
  badgeColor: string;
  title: string;
  image: string;
  subtitle: string;
  linkText: string;
  filterCat: string;
}

const PRIORITY_NOTICES: PriorityNotice[] = [
  {
    id: 'ayudas-solidarias',
    type: 'ayuda',
    badge: '🤝 Ayudas Solidarias',
    badgeColor: '#DC2626',
    title: 'Ayudas Solidarias',
    image: '/images/ayudas_solidarias/1.jpg',
    subtitle: 'Campañas de apoyo social y solidaridad estudiantil de la FUSCH.',
    linkText: 'Ver álbum en Actividades',
    filterCat: 'ayuda'
  },
  {
    id: 'onomasticos',
    type: 'onomastico',
    badge: '🎂 Onomásticos',
    badgeColor: '#D97706',
    title: 'Onomásticos',
    image: '/images/onomasticos/841399637_1647768973435010_1674733101720686247_n.jpg',
    subtitle: 'Saludos de onomásticos a los miembros de la comunidad universitaria.',
    linkText: 'Ver álbum en Actividades',
    filterCat: 'onomastico'
  }
];

export const ApoyoModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    // Al recargar o abrir por primera vez en la sesión se muestra siempre empezando en la Ayuda (índice 0)
    const hasSeen = sessionStorage.getItem('fusch_priority_notices_dismissed');
    if (!hasSeen) {
      setIsOpen(true);
      setCurrentIndex(0);
    }

    const handleBeforeUnload = () => {
      sessionStorage.removeItem('fusch_priority_notices_dismissed');
    };
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  const handleClose = useCallback(() => {
    sessionStorage.setItem('fusch_priority_notices_dismissed', 'true');
    setIsOpen(false);
  }, []);

  // Manejo de la tecla Escape y flechas
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      } else if (e.key === 'ArrowRight') {
        setCurrentIndex((prev) => (prev + 1) % PRIORITY_NOTICES.length);
      } else if (e.key === 'ArrowLeft') {
        setCurrentIndex((prev) => (prev - 1 + PRIORITY_NOTICES.length) % PRIORITY_NOTICES.length);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen, handleClose]);

  if (!isOpen) return null;

  const currentNotice = PRIORITY_NOTICES[currentIndex];

  const handleGoToCategory = (cat: string) => {
    handleClose();
    navigate(`/activities?cat=${cat}`);
  };

  return (
    <div 
      className="apoyo-overlay" 
      onClick={handleClose}
      role="dialog"
      aria-modal="true"
      aria-label="Avisos prioritarios FUSCH: Ayuda y Onomásticos"
    >
      {/* Botón cerrar visible en esquina superior derecha */}
      <button 
        type="button" 
        className="apoyo-close-btn" 
        onClick={(e) => {
          e.stopPropagation();
          handleClose();
        }}
        aria-label="Cerrar modal prioritario"
        title="Cerrar y continuar al portal (Esc)"
      >
        <span className="apoyo-close-icon">✕</span>
        <span className="apoyo-close-label">Cerrar</span>
      </button>

      {/* Selector superior de avisos prioritarios */}
      <div className="apoyo-top-tabs" onClick={(e) => e.stopPropagation()}>
        {PRIORITY_NOTICES.map((notice, idx) => (
          <button
            key={notice.id}
            type="button"
            className={`apoyo-tab-btn ${idx === currentIndex ? 'active' : ''}`}
            onClick={() => setCurrentIndex(idx)}
          >
            <span className="tab-dot" style={{ backgroundColor: notice.badgeColor }} />
            <span>{notice.badge}</span>
            <span className="tab-order">({idx + 1}/{PRIORITY_NOTICES.length})</span>
          </button>
        ))}
      </div>

      {/* Contenedor central a pantalla completa */}
      <div 
        className="apoyo-image-container"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Flecha anterior */}
        <button
          type="button"
          className="apoyo-nav-arrow arrow-left"
          onClick={() => setCurrentIndex((prev) => (prev - 1 + PRIORITY_NOTICES.length) % PRIORITY_NOTICES.length)}
          aria-label="Aviso anterior"
        >
          ‹
        </button>

        {/* Imagen y ficha */}
        <div className="apoyo-card-wrapper">
          <div className="apoyo-image-frame">
            <img 
              src={currentNotice.image} 
              alt={currentNotice.title} 
              className="apoyo-image"
            />
          </div>

          {/* Barra de información flotante */}
          <div className="apoyo-info-bar">
            <div className="apoyo-info-text">
              <span 
                className="apoyo-type-badge" 
                style={{ backgroundColor: currentNotice.badgeColor }}
              >
                {currentNotice.badge}
              </span>
              <h3 className="apoyo-info-title">{currentNotice.title}</h3>
              <p className="apoyo-info-subtitle">{currentNotice.subtitle}</p>
            </div>
            
            <div className="apoyo-actions">
              <button 
                type="button" 
                className="apoyo-action-btn primary"
                onClick={() => handleGoToCategory(currentNotice.filterCat)}
              >
                {currentNotice.linkText} →
              </button>

              {currentIndex < PRIORITY_NOTICES.length - 1 ? (
                <button
                  type="button"
                  className="apoyo-action-btn secondary"
                  onClick={() => setCurrentIndex(currentIndex + 1)}
                >
                  Siguiente: Ver Onomásticos ›
                </button>
              ) : (
                <button
                  type="button"
                  className="apoyo-action-btn secondary"
                  onClick={() => setCurrentIndex(0)}
                >
                  ‹ Volver a Campaña Solidaria
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Flecha siguiente */}
        <button
          type="button"
          className="apoyo-nav-arrow arrow-right"
          onClick={() => setCurrentIndex((prev) => (prev + 1) % PRIORITY_NOTICES.length)}
          aria-label="Siguiente aviso"
        >
          ›
        </button>
      </div>

      {/* Barra sutil inferior con atajo */}
      <div className="apoyo-bottom-hint" onClick={handleClose}>
        <span>Haz clic fuera o presiona <strong>Esc</strong> para continuar navegando en el portal</span>
      </div>
    </div>
  );
};

export default ApoyoModal;
