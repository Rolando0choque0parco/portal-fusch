import { useState, useEffect, useCallback } from 'react';
import './ApoyoModal.css';

interface ApoyoModalProps {
  imageSrc?: string;
  onClose?: () => void;
}

export const ApoyoModal = ({ 
  imageSrc = '/images/apoyo/1.jpg', 
  onClose 
}: ApoyoModalProps) => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Verificar si ya fue cerrado en esta sesión de navegación
    const hasSeen = sessionStorage.getItem('fusch_apoyo_dismissed');
    if (!hasSeen) {
      setIsOpen(true);
    }

    // Al recargar la página (beforeunload), se reinicia para que vuelva a mostrarse al recargar
    const handleBeforeUnload = () => {
      sessionStorage.removeItem('fusch_apoyo_dismissed');
    };
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  const handleClose = useCallback(() => {
    sessionStorage.setItem('fusch_apoyo_dismissed', 'true');
    setIsOpen(false);
    if (onClose) onClose();
  }, [onClose]);

  // Manejo de la tecla Escape para cerrar
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    // Prevenir scroll del body mientras el modal está abierto
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen, handleClose]);

  if (!isOpen) return null;

  return (
    <div 
      className="apoyo-overlay" 
      onClick={handleClose}
      role="dialog"
      aria-modal="true"
      aria-label="Campaña solidaria de apoyo estudiantil"
    >
      {/* Botón cerrar visible en esquina superior derecha */}
      <button 
        type="button" 
        className="apoyo-close-btn" 
        onClick={(e) => {
          e.stopPropagation();
          handleClose();
        }}
        aria-label="Cerrar afiche de apoyo"
        title="Cerrar (Esc)"
      >
        <span className="apoyo-close-icon">✕</span>
        <span className="apoyo-close-label">Cerrar</span>
      </button>

      {/* Contenedor central a pantalla completa */}
      <div 
        className="apoyo-image-container"
        onClick={(e) => e.stopPropagation()}
      >
        <img 
          src={imageSrc} 
          alt="Campaña Solidaria FUSCH - Apoyo a nuestra compañera" 
          className="apoyo-image"
        />
      </div>

      {/* Barra sutil inferior con atajo e indicación */}
      <div className="apoyo-bottom-hint" onClick={handleClose}>
        <span>❤️ Solidaridad FUSCH • Haz clic fuera o presiona <strong>Esc</strong> para continuar al portal</span>
      </div>
    </div>
  );
};

export default ApoyoModal;
