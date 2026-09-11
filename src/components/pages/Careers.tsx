import { useState, useEffect } from 'react';
import { faculties, facultyExtendedDetails, type FacultyExtendedData } from '../../data/careers';
import './Careers.css';

export function Careers() {
  const [selectedFacultyId, setSelectedFacultyId] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<'info' | 'authority' | 'schools' | 'timeline'>('info');

  const selectedFaculty: FacultyExtendedData | undefined = selectedFacultyId 
    ? facultyExtendedDetails[selectedFacultyId] 
    : undefined;

  const handleOpenModal = (id: number, defaultTab: 'info' | 'authority' | 'schools' | 'timeline' = 'info') => {
    setSelectedFacultyId(id);
    setActiveTab(defaultTab);
  };

  const handleCloseModal = () => {
    setSelectedFacultyId(null);
  };

  // Cerrar modal con tecla Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && selectedFacultyId !== null) {
        handleCloseModal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedFacultyId]);

  // Bloquear scroll de la página cuando el modal está abierto
  useEffect(() => {
    if (selectedFacultyId !== null) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    }
  }, [selectedFacultyId]);

  return (
    <div className="careers-page-container">
      {/* Encabezado Principal */}
      <header className="careers-header">
        <div className="careers-header-badge">
          <span>🏛️ Oferta Académica UNSCH</span>
        </div>
        <h2 className="careers-main-title">Facultades y Escuelas Profesionales</h2>
        <p className="careers-subtitle">
          Explora la historia, decanos oficiales, mallas y escuelas de la Tricentenaria Universidad Nacional San Cristóbal de Huamanga.
        </p>
      </header>

      {/* Grid de Facultades */}
      <div className="faculties-grid">
        {faculties.map((faculty) => {
          const extended = facultyExtendedDetails[faculty.id];
          return (
            <div 
              key={faculty.id} 
              className={`faculty-card ${faculty.id === 1 ? 'featured-faculty' : ''}`}
              onClick={() => handleOpenModal(faculty.id)}
            >
              {faculty.id === 1 && (
                <div className="featured-badge">
                  🌾 Facultad Prioritaria FUSCH
                </div>
              )}
              
              <div className="faculty-image-container">
                <img 
                  src={extended?.image || '/images/facultades/ciencias_agrarias.jpg'} 
                  alt={faculty.name}
                  className="faculty-main-img"
                  loading="lazy"
                />
                <div className="faculty-image-gradient" />
                
                {extended?.foundationYear && (
                  <span className="faculty-foundation-pill">
                    🏛️ {extended.foundationYear.split('/')[0].trim()}
                  </span>
                )}
              </div>

              <div className="faculty-content">
                <h3 className="faculty-title">{faculty.name}</h3>

                {/* Vista previa del Decano Oficial */}
                {extended?.authority && (
                  <div className="faculty-dean-quickview">
                    <img 
                      src={extended.authority.photo} 
                      alt={extended.authority.name}
                      className="dean-quickview-avatar"
                      loading="lazy"
                    />
                    <div className="dean-quickview-info">
                      <span className="dean-quickview-label">Decanatura Oficial</span>
                      <strong className="dean-quickview-name">{extended.authority.name}</strong>
                    </div>
                  </div>
                )}

                {/* Lista compacta de escuelas */}
                <div className="faculty-schools-preview">
                  <span className="schools-preview-title">Escuelas Profesionales:</span>
                  <div className="schools-tags-cluster">
                    {faculty.schools.map((school, index) => (
                      <span key={index} className="school-tag-pill">
                        📘 {school}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="faculty-card-actions">
                  <button 
                    type="button" 
                    className="faculty-more-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenModal(faculty.id, 'info');
                    }}
                  >
                    <span>Ver Historia y Carreras</span>
                    <span>→</span>
                  </button>
                  {extended?.authority && (
                    <button
                      type="button"
                      className="faculty-dean-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenModal(faculty.id, 'authority');
                      }}
                      title="Ver información del Decano"
                    >
                      👔 Decano
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal Enriquecido para Detalles de la Facultad */}
      {selectedFaculty && (
        <div className="faculty-modal-overlay" onClick={handleCloseModal}>
          <div 
            className="faculty-modal" 
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-faculty-title"
          >
            <button 
              type="button" 
              className="faculty-modal-close" 
              onClick={handleCloseModal}
              aria-label="Cerrar ventana"
            >
              ✕
            </button>

            {/* Cabecera del modal con efecto hero */}
            <div className="faculty-modal-hero">
              <div className="faculty-modal-image">
                <img src={selectedFaculty.image} alt={selectedFaculty.name} />
                <div className="faculty-modal-image-overlay" />
                <div className="faculty-modal-hero-content">
                  <span className="modal-foundation-badge">
                    Fundación: {selectedFaculty.foundationYear}
                  </span>
                  <h2 id="modal-faculty-title">{selectedFaculty.name}</h2>
                  <p className="faculty-modal-subtitle">
                    Universidad Nacional de San Cristóbal de Huamanga
                  </p>
                </div>
              </div>
            </div>

            {/* Barra de pestañas con diseño píldora moderno */}
            <div className="faculty-modal-tabs" role="tablist">
              <button 
                type="button" 
                role="tab"
                aria-selected={activeTab === 'info'}
                className={`tab-btn ${activeTab === 'info' ? 'active' : ''}`}
                onClick={() => setActiveTab('info')}
              >
                📜 Historia y Misión
              </button>
              <button 
                type="button" 
                role="tab"
                aria-selected={activeTab === 'authority'}
                className={`tab-btn ${activeTab === 'authority' ? 'active' : ''}`}
                onClick={() => setActiveTab('authority')}
              >
                👔 Decanato y Autoridades
              </button>
              <button 
                type="button" 
                role="tab"
                aria-selected={activeTab === 'schools'}
                className={`tab-btn ${activeTab === 'schools' ? 'active' : ''}`}
                onClick={() => setActiveTab('schools')}
              >
                📚 Escuelas ({selectedFaculty.schoolDetails?.length || selectedFaculty.name})
              </button>
              {selectedFaculty.timeline && selectedFaculty.timeline.length > 0 && (
                <button 
                  type="button" 
                  role="tab"
                  aria-selected={activeTab === 'timeline'}
                  className={`tab-btn ${activeTab === 'timeline' ? 'active' : ''}`}
                  onClick={() => setActiveTab('timeline')}
                >
                  ⏳ Línea de Tiempo
                </button>
              )}
            </div>

            {/* Contenido dinámico según pestaña activa */}
            <div className="faculty-modal-tab-content">
              {/* PESTAÑA 1: HISTORIA Y MISIÓN */}
              {activeTab === 'info' && (
                <div className="tab-pane info-pane">
                  <div className="modal-section-card">
                    <h4>📜 Reseña Histórica</h4>
                    <p>{selectedFaculty.history}</p>
                  </div>

                  <div className="modal-section-card">
                    <h4>🎯 Misión y Compromiso Institucional</h4>
                    <p>{selectedFaculty.mission}</p>
                  </div>

                  <div className="modal-schedule-card">
                    <span className="schedule-card-icon">🕐</span>
                    <div>
                      <strong>Horario de Atención al Estudiante:</strong>
                      <p>{selectedFaculty.schedule || "8:30 am – 12:30 pm y 2:30 pm – 4:00 pm"}</p>
                    </div>
                  </div>

                  {selectedFaculty.authority && (
                    <div 
                      className="dean-mini-card"
                      onClick={() => setActiveTab('authority')}
                      role="button"
                      tabIndex={0}
                    >
                      <img 
                        src={selectedFaculty.authority.photo} 
                        alt={selectedFaculty.authority.name} 
                        className="dean-mini-avatar"
                      />
                      <div className="dean-mini-info">
                        <span className="dean-mini-tag">Decano Oficial • Clic para ver perfil</span>
                        <h5>{selectedFaculty.authority.name}</h5>
                        <p className="dean-mini-title">{selectedFaculty.authority.title}</p>
                      </div>
                      <span className="dean-mini-arrow">→</span>
                    </div>
                  )}
                </div>
              )}

              {/* PESTAÑA 2: DECANATO Y AUTORIDADES (REQUERIMIENTO 5) */}
              {activeTab === 'authority' && selectedFaculty.authority && (
                <div className="tab-pane authority-pane">
                  <div className="dean-executive-card">
                    <div className="dean-portrait-container">
                      <img 
                        src={selectedFaculty.authority.photo} 
                        alt={selectedFaculty.authority.name} 
                        className="dean-portrait-photo"
                      />
                      <div className="dean-portrait-glow" />
                      <span className="dean-verified-pill">
                        ✓ Autoridad Oficial UNSCH
                      </span>
                    </div>

                    <div className="dean-details-column">
                      <span className="dean-label-pill">Decanatura de Facultad</span>
                      <h3 className="dean-official-name">{selectedFaculty.authority.name}</h3>
                      <p className="dean-official-role">{selectedFaculty.authority.title}</p>
                      <p className="dean-academic-degree">🎓 {selectedFaculty.authority.degree}</p>

                      {/* Correo Electrónico Institucional si está presente */}
                      {selectedFaculty.authority.email && (
                        <div className="dean-contact-row">
                          <a 
                            href={`mailto:${selectedFaculty.authority.email}`} 
                            className="dean-email-link"
                            title="Enviar correo institucional"
                          >
                            <span className="email-icon">✉️</span>
                            <span>{selectedFaculty.authority.email}</span>
                          </a>
                        </div>
                      )}

                      {/* Horario de Atención Oficial */}
                      <div className="dean-schedule-badge">
                        <span className="schedule-badge-icon">🕐</span>
                        <div className="schedule-badge-text">
                          <strong>Horario de Atención:</strong>
                          <span>{selectedFaculty.authority.schedule || selectedFaculty.schedule || "8:30 am – 12:30 pm y 2:30 pm – 4:00 pm"}</span>
                        </div>
                      </div>

                      {/* Reseña bio */}
                      <div className="dean-bio-box">
                        <p>{selectedFaculty.authority.bio}</p>
                      </div>

                      {/* Misión Compartida de la Facultad */}
                      <div className="dean-mission-callout">
                        <span className="mission-callout-badge">🎯 Misión de la Facultad</span>
                        <p className="mission-callout-text">
                          "{selectedFaculty.mission}"
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* PESTAÑA 3: ESCUELAS PROFESIONALES */}
              {activeTab === 'schools' && (
                <div className="tab-pane schools-pane">
                  <div className="schools-cards-list">
                    {selectedFaculty.schoolDetails?.map((school, index) => (
                      <div key={index} className="school-detailed-card">
                        <div className="school-card-header">
                          <h4>🎓 {school.name}</h4>
                          <span className="school-year-tag">{school.creationYear}</span>
                        </div>
                        
                        <p className="school-creation-context">
                          <strong>🏛️ Contexto de creación:</strong> {school.creationContext}
                        </p>
                        
                        <p className="school-description">{school.description}</p>

                        <div className="school-meta-grid">
                          <div className="school-meta-item">
                            <span className="meta-label">⏱️ Duración:</span>
                            <span className="meta-value">{school.duration}</span>
                          </div>
                          <div className="school-meta-item">
                            <span className="meta-label">📜 Grado y Título:</span>
                            <span className="meta-value">{school.degree}</span>
                          </div>
                          <div className="school-meta-item">
                            <span className="meta-label">👤 Dirección:</span>
                            <span className="meta-value">{school.director}</span>
                          </div>
                        </div>

                        {school.practiceCenters && school.practiceCenters.length > 0 && (
                          <div className="practice-centers-box">
                            <span className="practice-label">🔬 Centros de Práctica e Investigación:</span>
                            <div className="practice-tags">
                              {school.practiceCenters.map((center, cIdx) => (
                                <span key={cIdx} className="practice-pill">{center}</span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* PESTAÑA 4: LÍNEA DE TIEMPO */}
              {activeTab === 'timeline' && selectedFaculty.timeline && (
                <div className="tab-pane timeline-pane">
                  <div className="timeline-container">
                    {selectedFaculty.timeline.map((item, index) => (
                      <div key={index} className="timeline-item">
                        <div className="timeline-node">
                          <span className="timeline-year">{item.year}</span>
                        </div>
                        <div className="timeline-content">
                          <h5>{item.title}</h5>
                          <p>{item.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Careers;