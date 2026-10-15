import { useState } from 'react';
import { Link } from 'react-router-dom';
import Stats from '../Stats/Stats';
import Hero from '../Hero/Hero';
import './Home.css';

interface PollOption {
  id: string;
  text: string;
  votes: number;
}

function Home() {
  // Encuesta estudiantil interactiva con persistencia local
  const [selectedPoll, setSelectedPoll] = useState<string | null>(() => {
    return localStorage.getItem('fusch_poll_selected') || null;
  });

  const [pollVotes, setPollVotes] = useState<Record<string, number>>(() => {
    const saved = localStorage.getItem('fusch_poll_votes_map');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // Fallback
      }
    }
    return {
      comedor: 148,
      transporte: 96,
      infraestructura: 82,
      conectividad: 114
    };
  });

  const handleVote = (optionId: string) => {
    if (selectedPoll) return; // Ya votó
    setSelectedPoll(optionId);
    localStorage.setItem('fusch_poll_selected', optionId);

    setPollVotes((prev) => {
      const next = { ...prev, [optionId]: (prev[optionId] || 0) + 1 };
      localStorage.setItem('fusch_poll_votes_map', JSON.stringify(next));
      return next;
    });
  };

  const totalVotes = Object.values(pollVotes).reduce((a, b) => a + b, 0);

  const pollOptions: PollOption[] = [
    { id: 'comedor', text: '🍽️ Raciones y calidad del Comedor Universitario', votes: pollVotes.comedor || 0 },
    { id: 'transporte', text: '🚌 Ampliación de rutas y buses universitarios', votes: pollVotes.transporte || 0 },
    { id: 'infraestructura', text: '🏗️ Mantenimiento de pabellones, aulas y servicios higiénicos', votes: pollVotes.infraestructura || 0 },
    { id: 'conectividad', text: '💻 WiFi de alta velocidad y laboratorios de cómputo', votes: pollVotes.conectividad || 0 }
  ];

  return (
    <div className="home-container">
      {/* CINTA TICKER DE COMUNICADOS EN VIVO */}
      <div className="home-live-ticker" role="region" aria-label="Avisos estudiantiles en tiempo real">
        <span className="home-ticker-badge">🔴 FUSCH EN VIVO</span>
        <div className="home-ticker-text">
          <span>🏛️ Portal Oficial de la Federación Universitaria • 🤝 Campañas de Ayudas Solidarias activas • 📸 Galería de imágenes a pantalla completa disponible • 📢 Atención en el Comedor Universitario</span>
        </div>
      </div>

      {/* CARRUSEL DE INICIO HERO 3D */}
      <Hero />

      {/* BARRA DE AVISOS PRIORITARIOS (AYUDA SOLIDARIA Y ONOMÁSTICOS) */}
      <section className="home-priority-banner" aria-label="Avisos prioritarios institucionales">
        <div className="priority-banner-card urgency-card">
          <div className="priority-badge-row">
            <span className="priority-pulse-badge">
              <span className="live-dot" />
              Ayudas Solidarias
            </span>
            <span className="priority-tag">Prioritario</span>
          </div>
          <h3 className="priority-card-title">Ayudas Solidarias</h3>
          <p className="priority-card-desc">
            Campañas de apoyo social y solidaridad estudiantil promovidas por la Federación Universitaria para la comunidad sancristobalina.
          </p>
          <div className="priority-card-actions">
            <Link to="/activities?cat=ayuda" className="priority-cta-btn primary">
              <span>Ver publicaciones de ayuda</span>
              <span>→</span>
            </Link>
          </div>
        </div>

        <div className="priority-banner-card birthday-card">
          <div className="priority-badge-row">
            <span className="priority-festive-badge">
              🎂 Onomásticos
            </span>
            <span className="priority-tag-gold">Publicaciones</span>
          </div>
          <h3 className="priority-card-title">Onomásticos</h3>
          <p className="priority-card-desc">
            Reconocimiento y saludos fraternos de cumpleaños a dirigentes, docentes y estudiantes de la tricentenaria UNSCH.
          </p>
          <div className="priority-card-actions">
            <Link to="/activities?cat=onomastico" className="priority-cta-btn secondary">
              <span>Ver saludos de onomásticos</span>
              <span>→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* CENTRO DE SERVICIOS ESTUDIANTILES RÁPIDOS (COMO EN LAS GRANDES FEDERACIONES) */}
      <section className="home-services-hub" aria-label="Servicios universitarios esenciales">
        <div className="section-title-block">
          <span className="section-pill">Accesos Rápidos</span>
          <h2 className="section-main-heading">Centro de Servicios Estudiantiles</h2>
          <p className="section-sub-heading">
            Enlaces directos a las herramientas y beneficios más utilizados por los estudiantes de la UNSCH.
          </p>
        </div>

        <div className="services-grid">
          <div className="service-card">
            <div className="service-icon-box comedor">🍽️</div>
            <h4>Comedor Universitario</h4>
            <p>Fiscalización de menú diario, raciones nutricionales y turnos de atención.</p>
            <Link to="/activities?cat=gestion" className="service-card-link">Ver inspecciones →</Link>
          </div>

          <div className="service-card">
            <div className="service-icon-box bus">🚌</div>
            <h4>Bus Universitario</h4>
            <p>Rutas troncales, paraderos y horarios de transporte hacia la Ciudad Universitaria.</p>
            <Link to="/documents" className="service-card-link">Consultar rutas →</Link>
          </div>

          <div className="service-card">
            <div className="service-icon-box virtual">🎓</div>
            <h4>Campus & Trámites</h4>
            <p>Matrícula, actas, carné universitario y reglamentos académicos vigentes.</p>
            <Link to="/documents" className="service-card-link">Ver normativas →</Link>
          </div>

          <div className="service-card">
            <div className="service-icon-box def">⚖️</div>
            <h4>Defensoría Gremial</h4>
            <p>Asesoría gratuita, defensa de derechos estudiantiles y reclamos ante el tribunal de honor.</p>
            <Link to="/suggestions" className="service-card-link">Pedir asesoría →</Link>
          </div>
        </div>
      </section>

      {/* TARJETAS DE CARACTERÍSTICAS INSTITUCIONALES */}
      <section className="home-features-section" aria-label="Pilares de la gestión">
        <div className="section-title-block">
          <span className="section-pill">Gestión FUSCH</span>
          <h2 className="section-main-heading">Pilares de Nuestra Representación</h2>
          <p className="section-sub-heading">
            Información transparente, acción solidaria y defensa gremial continua para los más de 14,000 estudiantes sancristobalinos.
          </p>
        </div>

        <div className="features">
          <div className="feature-card highlighted-card">
            <div className="feature-card-glow" />
            <span className="feature-icon">📢</span>
            <h3>Galería de Actividades</h3>
            <p>
              Explora las evidencias fotográficas al 90% de pantalla, obras y noticias al estilo red social.
            </p>
            <Link to="/activities" className="feature-link">
              Ver fotos a pantalla completa →
            </Link>
          </div>

          <div className="feature-card">
            <span className="feature-icon">📋</span>
            <h3>Transparencia</h3>
            <p>
              Accede a resoluciones oficiales, balances económicos y actas gremiales de acceso público.
            </p>
            <Link to="/documents" className="feature-link">
              Ver documentos oficiales →
            </Link>
          </div>

          <div className="feature-card">
            <span className="feature-icon">👥</span>
            <h3>Representación</h3>
            <p>
              Conoce a los secretarios y delegados que conforman la Junta Directiva FUSCH 2026-2027.
            </p>
            <Link to="/members" className="feature-link">
              Conoce a la directiva →
            </Link>
          </div>

          <div className="feature-card">
            <span className="feature-icon">📩</span>
            <h3>Buzón y Sugerencias</h3>
            <p>
              Haz llegar tus solicitudes de apoyo, quejas, reclamos o sugerencias de forma rápida y anónima.
            </p>
            <Link to="/suggestions" className="feature-link">
              Enviar mensaje o solicitud →
            </Link>
          </div>
        </div>
      </section>

      {/* DESTACADOS VISUALES DE ACTIVIDADES */}
      <section className="home-showcase-section" aria-label="Evidencias en fotos">
        <div className="showcase-header">
          <div>
            <span className="section-pill">Evidencias en Alta Definición</span>
            <h2 className="section-main-heading">Fotografías y Obras de Gestión</h2>
          </div>
          <Link to="/activities" className="showcase-all-link">
            <span>Ver visor gigante (90% de pantalla)</span>
            <span>→</span>
          </Link>
        </div>

        <div className="showcase-cards-grid">
          <div className="showcase-card">
            <div
              className="showcase-img"
              style={{ backgroundImage: `url('/images/fiesta_juventud/825278784_1055597570645909_9030828714501720814_n.jpg')` }}
            />
            <div className="showcase-card-overlay">
              <span className="showcase-tag">🎉 Confraternidad</span>
              <h4>Fiesta de la Juventud FUSCH</h4>
              <Link to="/activities?cat=especial" className="showcase-card-link">Ver álbum completo (22 fotos) →</Link>
            </div>
          </div>

          <div className="showcase-card">
            <div
              className="showcase-img"
              style={{ backgroundImage: `url('/images/simulacro_unsch/799404705_954775091006085_6853324726728218399_n.jpg')` }}
            />
            <div className="showcase-card-overlay">
              <span className="showcase-tag">🏛️ Seguridad y Prevención</span>
              <h4>Simulacro Nacional en la UNSCH</h4>
              <Link to="/activities?cat=gestion" className="showcase-card-link">Ver álbum completo (15 fotos) →</Link>
            </div>
          </div>

          <div className="showcase-card">
            <div
              className="showcase-img"
              style={{ backgroundImage: `url('/images/ayudas_solidarias/1.jpg')` }}
            />
            <div className="showcase-card-overlay">
              <span className="showcase-tag">🤝 Campaña Activa</span>
              <h4>Ayudas Solidarias Estudiantiles</h4>
              <Link to="/activities?cat=ayuda" className="showcase-card-link">Ver publicación y colaborar →</Link>
            </div>
          </div>
        </div>
      </section>

      {/* ENCUESTA DE OPINIÓN ESTUDIANTIL INTERACTIVA */}
      <section className="home-poll-section" aria-label="Encuesta estudiantil">
        <div className="poll-container-box">
          <div className="poll-header-info">
            <span className="poll-badge">🗳️ Participación Estudiantil</span>
            <h3>Encuesta Universitaria del Mes</h3>
            <p>
              ¿Cuál de estos aspectos consideras prioritario para la fiscalización y acción gremial de la FUSCH en este semestre?
            </p>
            <span className="poll-count-note">Total de votos registrados: <strong>{totalVotes}</strong></span>
          </div>

          <div className="poll-options-list">
            {pollOptions.map((opt) => {
              const isSelected = selectedPoll === opt.id;
              const percent = totalVotes > 0 ? Math.round((opt.votes / totalVotes) * 100) : 0;

              return (
                <button
                  key={opt.id}
                  type="button"
                  className={`poll-option-btn ${isSelected ? 'selected' : ''}`}
                  onClick={() => handleVote(opt.id)}
                  disabled={!!selectedPoll}
                >
                  <div
                    className="poll-bar-fill"
                    style={{ width: `${percent}%` }}
                  />
                  <div className="poll-option-content">
                    <span className="poll-option-text">{opt.text}</span>
                    <span className="poll-option-percent">{percent}% ({opt.votes})</span>
                  </div>
                </button>
              );
            })}
          </div>

          {selectedPoll && (
            <div className="poll-voted-feedback">
              ✓ ¡Gracias por tu voto! Tu opinión orienta la agenda gremial de la FUSCH.
            </div>
          )}
        </div>
      </section>

      {/* SECCIÓN DE ESTADÍSTICAS */}
      <Stats />
    </div>
  );
}

export default Home;