import { useState, useEffect } from 'react';
import { doc, getDoc, setDoc, increment } from 'firebase/firestore';
import { db } from '../../firebase/firebaseConfig';
import './LikeButton.css';

interface FloatingHeart {
  id: number;
  x: number;
  y: number;
  size: number;
}

const DEFAULT_BASE_LIKES = 1428;

export const LikeButton = () => {
  const [likes, setLikes] = useState<number>(DEFAULT_BASE_LIKES);
  const [hasLiked, setHasLiked] = useState<boolean>(false);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const [floatingHearts, setFloatingHearts] = useState<FloatingHeart[]>([]);
  const [showTooltip, setShowTooltip] = useState<string | null>(null);

  // Cargar estado inicial desde localStorage y sincronizar si Firestore está disponible
  useEffect(() => {
    const savedLiked = localStorage.getItem('fusch_portal_liked') === 'true';
    setHasLiked(savedLiked);

    const savedCount = localStorage.getItem('fusch_portal_like_count');
    if (savedCount) {
      const parsed = parseInt(savedCount, 10);
      if (!isNaN(parsed) && parsed >= DEFAULT_BASE_LIKES) {
        setLikes(parsed);
      }
    }

    // Intento de sincronización opcional con Firestore (no bloqueante)
    const syncFirestore = async () => {
      try {
        const docRef = doc(db, 'portal_stats', 'likes');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data && typeof data.count === 'number') {
            setLikes((prev) => {
              const bestCount = Math.max(prev, data.count);
              localStorage.setItem('fusch_portal_like_count', String(bestCount));
              return bestCount;
            });
          }
        }
      } catch {
        // En caso de error de red o permisos, se mantiene 100% funcional con localStorage
      }
    };

    syncFirestore();
  }, []);

  const triggerPopAnimation = () => {
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 600);

    // Generar ráfaga de corazoncitos flotantes
    const newHearts: FloatingHeart[] = Array.from({ length: 6 }).map((_, i) => ({
      id: Date.now() + i,
      x: (Math.random() - 0.5) * 60,
      y: -(20 + Math.random() * 50),
      size: 14 + Math.random() * 12
    }));

    setFloatingHearts(newHearts);
    setTimeout(() => {
      setFloatingHearts([]);
    }, 1200);
  };

  const handleLike = async () => {
    if (hasLiked) {
      // Si ya dio like, mostrar aviso amable sin duplicar el conteo
      setShowTooltip('¡Ya diste tu apoyo a la FUSCH! ❤️');
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 400);
      setTimeout(() => setShowTooltip(null), 2500);
      return;
    }

    const nextLikes = likes + 1;
    setLikes(nextLikes);
    setHasLiked(true);
    triggerPopAnimation();

    setShowTooltip('¡Gracias por apoyar a la FUSCH! 🎉');
    setTimeout(() => setShowTooltip(null), 3000);

    // Guardar en localStorage para evitar doble conteo desde este navegador
    try {
      localStorage.setItem('fusch_portal_liked', 'true');
      localStorage.setItem('fusch_portal_like_count', String(nextLikes));
    } catch {
      // Ignorar si storage está deshabilitado
    }

    // Sincronización en segundo plano con Firestore
    try {
      const docRef = doc(db, 'portal_stats', 'likes');
      await setDoc(docRef, { count: increment(1) }, { merge: true });
    } catch {
      // Continuar silenciosamente con persistencia local
    }
  };

  const formattedLikes = likes.toLocaleString('es-PE');

  return (
    <div className="like-button-container" role="region" aria-label="Botón de aprecio institucional">
      {/* Tooltip de agradecimiento o estado */}
      {showTooltip && (
        <div className="like-tooltip" role="status">
          {showTooltip}
        </div>
      )}

      {/* Corazoncitos flotantes animados */}
      {floatingHearts.map((heart) => (
        <span
          key={heart.id}
          className="floating-heart"
          style={{
            transform: `translate(${heart.x}px, ${heart.y}px)`,
            fontSize: `${heart.size}px`
          }}
        >
          ❤️
        </span>
      ))}

      {/* Botón principal */}
      <button
        type="button"
        className={`like-floating-btn ${hasLiked ? 'has-liked' : ''} ${isAnimating ? 'pop-active' : ''}`}
        onClick={handleLike}
        title={hasLiked ? '¡Ya te encanta esta página!' : 'Me encanta la página de la FUSCH'}
        aria-label={`Me encanta la página (${formattedLikes} apoyos)`}
        aria-pressed={hasLiked}
      >
        <span className="like-heart-icon">
          {hasLiked ? '❤️' : '🤍'}
        </span>
        <span className="like-text">Me encanta</span>
        <span className="like-badge">{formattedLikes}</span>
      </button>
    </div>
  );
};

export default LikeButton;
