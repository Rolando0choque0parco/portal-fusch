import { useState, useEffect } from 'react';
import './Activities.css';

const activities = [
  {
    id: 15,
    title: 'Jornada de Reforestación y Áreas Verdes',
    folder: '/images/areas_verdes/',
    date: '8 de Septiembre, 2026',
    description: 'Jornada universitaria de arborización, siembra de plantones y recuperación de áreas verdes en la Ciudad Universitaria. Una iniciativa de la FUSCH comprometida con la sostenibilidad ambiental y el embellecimiento de nuestros espacios académicos.',
    images: ['1.jpg', '2.jpg', '3.jpg', '4.jpg', '5.jpg']
  },
  {
    id: 16,
    title: 'Movilización y Diálogo de las Cinco Escuelas',
    folder: '/images/cinco_escuelas/',
    date: '7 de Septiembre, 2026',
    description: 'Movilización pacífica y mesa de trabajo de las cinco escuelas profesionales de la Facultad de Ciencias Agrarias en coordinación con la FUSCH y las autoridades universitarias en el Rectorado, consolidando acuerdos y exigencias estudiantiles.',
    images: ['imagen1.jpg', 'imagen2.jpg', 'imagen3.jpg', 'imagen4.jpg', 'imagen5.jpg', 'imagen6.jpg', 'imagen7.jpg', 'imagen8.jpg', 'imagen9.jpg']
  },
  {
    id: 12,
    title: 'Minka Universitaria',
    folder: '/images/minka/',
    date: '6 de Septiembre, 2026',
    description: 'Jornada de limpieza y mejora de espacios en la Ciudad Universitaria. Actividad que convoca a la comunidad universitaria a sumar esfuerzos para mejorar nuestro entorno. Punto de encuentro: Ciudad Universitaria a las 8:00 AM.',
    images: ['imagen1.jpg', 'imagen2.jpg', 'imagen3.jpg', 'imagen4.jpg', 'imagen5.jpg', 'imagen6.jpg', 'imagen7.jpg', 'imagen8.jpg', 'imagen9.jpg']
  },
  {
    id: 13,
    title: 'Polideportivo para la sede de Pichari',
    folder: '/images/polideportivo_pichari/',
    date: '4 de Septiembre, 2026',
    description: 'Colocación de la primera piedra para la construcción del nuevo polideportivo de la Escuela Profesional de Ingeniería Agroforestal - sede Pichari. La obra contará con una losa deportiva de concreto de 645 m², cobertura metálica, tribunas, baños y vestidores, con una inversión aproximada de S/ 1,750,000.00 y un plazo de ejecución de 4 meses.',
    images: ['imagen1.jpg', 'imagen2.jpg', 'imagen3.jpg']
  },
  {
    id: 14,
    title: 'Nueva carrera para la sede de Pichari',
    folder: '/images/nueva_carrera_pichari/',
    date: '2 de Septiembre, 2026',
    description: 'Mesa de diálogo descentralizada en la sede Pichari donde se logró la aprobación para la inclusión de la Escuela Profesional de Administración de Empresas a partir de los siguientes semestres, ampliando las oportunidades de formación profesional para los jóvenes de la zona. Participaron el rector de la UNSCH, funcionarios, representantes de la Defensoría del Pueblo y dirigentes estudiantiles.',
    images: ['foto1.jpg', 'foto2.jpg', 'foto3.jpg', 'foto4.jpg']
  },
  {
    id: 6,
    title: 'Mesa Técnica para el Consejo Regional',
    folder: '/images/mesa-tecnica/',
    date: '12 de Agosto, 2026',
    description: 'Reunión técnica con el consejo regional para la planificación del semestre académico.',
    images: ['1.png', '2.png', '3.png', '4.png', '5.png', '6.png', '7.png', '8.png', '9.png']
  },
  {
    id: 9,
    title: 'Nuevo comedor universitario',
    folder: '/images/visita-comedor-julio/',
    date: '1 de Agosto, 2026',
    description: 'Visita al nuevo comedor universitario para conocer sus instalaciones',
    images: ['2-1.png', '3-1.png', '4-1.png', '5-1.png', '6-1.png', '7-1.png', '8-1.png']
  },
  {
    id: 10,
    title: 'Visita y evaluacion del predio recuperado - PECS',
    folder: '/images/visita-comedor/',
    date: '1 de Agosto, 2026',
    description: 'Supervisión del PECS para garantizar el servicio de los estudiantes',
    images: ['1.png', '2.png', '3.png', '4.png', '5.png']
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
    id: 1,
    title: 'Consejo Regional - 24 de Julio 2026',
    folder: '/images/consejo-regional/',
    date: '24 de Julio, 2026',
    description: 'Reunión del Consejo Regional para abordar temas de representación estudiantil y presupuesto participativo.',
    images: ['diseno-41.png', 'diseno-42.png', 'diseno-43.png']
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
    id: 4,
    title: 'Labor Social - Huascahura - 21 de Julio',
    folder: '/images/labor-social/',
    date: '21 de Julio, 2026',
    description: 'Jornada de labor social y apoyo comunitario en la comunidad de Huascahura.',
    images: ['7.png', '8.png', '9.png', '10.png', '11.png', '12.png', '13.png', '14.png']
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
    id: 11,
    title: 'Visita al Comedor - 11 de Julio 2026',
    folder: '/images/visita-comedor-julio/',
    date: '11 de Julio, 2026',
    description: 'Primera visita de supervisión al comedor universitario.',
    images: ['2-1.png', '3-1.png', '4-1.png', '5-1.png', '6-1.png', '7-1.png', '8-1.png', '8-2.png']
  },
  {
    id: 2,
    title: 'Entrega de Resolución',
    folder: '/images/entrega-resolucion/',
    date: 'Julio, 2026',
    description: 'Entrega oficial de resoluciones a los nuevos representantes de la Federación.',
    images: ['resolucion.jpeg']
  }
];

function Activities() {
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const [currentIndices, setCurrentIndices] = useState<Record<number, number>>(() => {
    const initial: Record<number, number> = {};
    activities.forEach((act) => {
      initial[act.id] = 0;
    });
    return initial;
  });

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
              onClick={() => setLightboxImage(`${activity.folder}${currentImage}`)}
              title="Haz clic para ampliar la imagen"
            >
              <div className="activity-main-overlay">
                <span className="activity-date-badge">{activity.date}</span>
                <h2>{activity.title}</h2>
                <p>{activity.description}</p>
              </div>

              {/* Flechas de navegación */}
              <button
                type="button"
                className="activity-main-arrow activity-main-arrow-left"
                onClick={(e) => {
                  e.stopPropagation();
                  const prevIndex = (currentIndex - 1 + activity.images.length) % activity.images.length;
                  setCurrentIndices((prev) => ({ ...prev, [activity.id]: prevIndex }));
                }}
                aria-label="Foto anterior"
              >‹</button>
              <button
                type="button"
                className="activity-main-arrow activity-main-arrow-right"
                onClick={(e) => {
                  e.stopPropagation();
                  const nextIndex = (currentIndex + 1) % activity.images.length;
                  setCurrentIndices((prev) => ({ ...prev, [activity.id]: nextIndex }));
                }}
                aria-label="Siguiente foto"
              >›</button>

              {/* Puntos decorativos / indicadores de fotos */}
              {activity.images.length > 1 && (
                <div className="activity-main-dots">
                  {activity.images.map((_, dotIndex) => (
                    <button
                      key={dotIndex}
                      type="button"
                      className={`activity-main-dot ${dotIndex === currentIndex ? 'active' : ''}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        setCurrentIndices((prev) => ({ ...prev, [activity.id]: dotIndex }));
                      }}
                      aria-label={`Ver foto ${dotIndex + 1} de ${activity.title}`}
                    />
                  ))}
                </div>
              )}
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