import { useState } from 'react';
import './Activities.css';

const activities = [
  {
    id: 1,
    title: 'Consejo Regional - 24 de Julio 2026',
    folder: '/images/consejo-regional/',
    date: '24 de Julio, 2026',
    description: 'Reunión del Consejo Regional para abordar temas de representación estudiantil y presupuesto participativo.',
    images: ['diseno-41.png', 'diseno-42.png', 'diseno-43.png']
  },
  {
    id: 2,
    title: 'Entrega de Resolución',
    folder: '/images/entrega-resolucion/',
    date: 'Julio, 2026',
    description: 'Entrega oficial de resoluciones a los nuevos representantes de la Federación.',
    images: ['resolucion.jpeg']
  },
  {
    id: 4,
    title: 'Labor Social - Huascahura - 21 de Julio',
    folder: '/images/labor-social/',
    date: '21 de Julio, 2026',
    description: 'Jornada de labor social y apoyo comunitario en la comunidad de Huascahura.',
    images: ['7.png', '8.png', '9.png', '10.png', '11.png', '12.png', '13.png', '14.png']
  },
  {
    id: 5,
    title: 'Mesa de Diálogo - 25 de Julio 2026',
    folder: '/images/mesa-dialogo/',
    date: '25 de Julio, 2026',
    description: 'Espacio de diálogo entre estudiantes y autoridades para resolver conflictos académicos.',
    images: ['sa.png', 'sa1.png', 'sa2.png', 'sa3.png']
  },
  {
    id: 6,
    title: 'Mesa Técnica Consejo Regional - 12 Agosto 2026',
    folder: '/images/mesa-tecnica/',
    date: '12 de Agosto, 2026',
    description: 'Reunión técnica con el consejo regional para la planificación del semestre académico.',
    images: ['1.png', '2.png', '3.png', '4.png', '5.png', '6.png', '7.png', '8.png', '9.png']
  },
  {
    id: 7,
    title: 'Reunión con Gobierno Regional - 24 de Julio',
    folder: '/images/reunion-gobierno/',
    date: '24 de Julio, 2026',
    description: 'Reunión con el Gobierno Regional para gestionar mejoras en la infraestructura universitaria.',
    images: ['1.png', '2.png', '3.png', '4.png', '5.png', '6.png', '7.png', '8.png', '9.png']
  },
  {
    id: 8,
    title: 'Reunión GORE - 20 de Julio 2026',
    folder: '/images/reunion-gore/',
    date: '20 de Julio, 2026',
    description: 'Reunión con el Gobierno Regional (GORE) para la firma de convenios interinstitucionales.',
    images: ['fusch.png', 'FUSCH2.png', 'FUSCH3.png', 'FUSCH4.png']
  },
  {
    id: 9,
    title: 'Visita a los Pescas - 1 de Agosto 2026',
    folder: '/images/visita-pescas/',
    date: '1 de Agosto, 2026',
    description: 'Visita a la escuela profesional de Pesca para conocer sus necesidades e instalaciones.',
    images: ['diseno-sin-titulo-49.png', 'Diseño sin título50.png', 'Diseño sin título51.png', 'Diseño sin título52.png', 'Diseño sin título53.png', 'Diseño sin título54.png', 'Diseño sin título55.png', 'Diseño sin título56.png']
  },
  {
    id: 10,
    title: 'Visita al Comedor - 1 de Agosto 2026',
    folder: '/images/visita-comedor/',
    date: '1 de Agosto, 2026',
    description: 'Inspección al comedor universitario para supervisar la calidad de los servicios alimentarios.',
    images: ['diseno-sin-titulo-44.png', 'Diseño sin título45.png', 'Diseño sin título46.png', 'Diseño sin título47.png', 'Diseño sin título48.png']
  },
  {
    id: 11,
    title: 'Visita al Comedor - 11 de Julio 2026',
    folder: '/images/visita-comedor-julio/',
    date: '11 de Julio, 2026',
    description: 'Primera visita de supervisión al comedor universitario.',
    images: ['2-1.png', '3-1.png', '4-1.png', '5-1.png', '6-1.png', '7-1.png', '8-1.png', '8-2.png']
  }
];

function Activities() {
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const [currentIndices, setCurrentIndices] = useState<Record<number, number>>({});

  // Inicializar índices de cada actividad
  useEffect(() => {
    const initial: Record<number, number> = {};
    activities.forEach((act) => {
      initial[act.id] = 0;
    });
    setCurrentIndices(initial);
  }, []);

  // Cambiar foto automáticamente cada 5 segundos para TODAS las actividades
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndices((prev) => {
        const newState = { ...prev };
        activities.forEach((activity) => {
          const current = prev[activity.id] ?? 0;
          newState[activity.id] = (current + 1) % activity.images.length;
        });
        return newState;
      });
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="activities-long-list">
      <div className="activities-header">
        <h2>📸 Actividades FUSCH</h2>
        <p>Evidencias fotográficas de nuestras gestiones y eventos</p>
      </div>

      {activities.map((activity) => {
        const currentIndex = currentIndices[activity.id] ?? 0;
        const currentImage = activity.images[currentIndex];

        return (
          <div key={activity.id} className="activity-section">
            {/* FOTO PRINCIPAL - ESTILO HERO (CAMBIA AUTOMÁTICAMENTE) */}
            <div 
              className="activity-main-image"
              style={{ 
                backgroundImage: `url(${activity.folder}${currentImage})`,
                backgroundPosition: 'center',
                backgroundSize: 'cover',
                backgroundRepeat: 'no-repeat'
              }}
            >
              <div className="activity-main-overlay">
                <span className="activity-date-badge">{activity.date}</span>
                <h2>{activity.title}</h2>
                <p>{activity.description}</p>
              </div>

              {/* Solo las flechas, sin puntos */}
              <button 
                className="activity-main-arrow activity-main-arrow-left"
                onClick={(e) => {
                  e.stopPropagation();
                  const prevIndex = (currentIndex - 1 + activity.images.length) % activity.images.length;
                  setCurrentIndices((prev) => ({ ...prev, [activity.id]: prevIndex }));
                }}
              >‹</button>
              <button 
                className="activity-main-arrow activity-main-arrow-right"
                onClick={(e) => {
                  e.stopPropagation();
                  const nextIndex = (currentIndex + 1) % activity.images.length;
                  setCurrentIndices((prev) => ({ ...prev, [activity.id]: nextIndex }));
                }}
              >›</button>
            </div>
          </div>
        );
      })}

      {/* LIGHTBOX PARA VER FOTO EN GRANDE */}
      {lightboxImage && (
        <div className="lightbox-overlay" onClick={() => setLightboxImage(null)}>
          <img src={lightboxImage} alt="Foto en grande" className="lightbox-image" />
        </div>
      )}
    </div>
  );
}

export default Activities;