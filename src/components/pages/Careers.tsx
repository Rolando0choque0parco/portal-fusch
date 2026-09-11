import { useState } from 'react';
import { faculties, facultyExtendedDetails, type FacultyExtendedData } from '../../data/careers';
import './Careers.css';

export function Careers() {
  const [selectedFacultyId, setSelectedFacultyId] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<'info' | 'authority' | 'schools' | 'timeline'>('info');

  const selectedFaculty: FacultyExtendedData | undefined = selectedFacultyId 
    ? facultyExtendedDetails[selectedFacultyId] 
    : undefined;

  const handleOpenModal = (id: number) => {
    setSelectedFacultyId(id);
    setActiveTab('info');
  };

  const handleCloseModal = () => {
    setSelectedFacultyId(null);
  };

  return (
    <div className="careers-container">
      <div className="careers-header">
        <h2>🎓 Carreras de la UNSCH</h2>
        <p>Facultades y Escuelas Profesionales de la Tricentenaria Universidad Nacional San Cristóbal de Huamanga</p>
      </div>

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
              <div className="faculty-image">
                <img 
                  src={extended?.image || '/images/facultades/ciencias_agrarias.jpg'} 
                  alt={faculty.name}
                  loading="lazy"
                />
              </div>
              <div className="faculty-content">
                <div className="faculty-title-row">
                  <h3>{faculty.name}</h3>
                </div>

                {extended?.foundationYear && (
                  <span className="faculty-foundation-pill">
                    🏛️ {extended.foundationYear.split('/')[0].trim()}
                  </span>
                )}

                <ul className="faculty-schools-preview">
                  {faculty.schools.map((school, index) => (
                    <li key={index}>
                      <span className="school-icon">📘</span> {school}
                    </li>
                  ))}
                </ul>

                <button 
                  type="button" 
                  className="faculty-more-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOpenModal(faculty.id);
                  }}
                >
                  Ver Historia, Decano y Carreras →
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal enriquecido para ver detalles de la facultad */}
      {selectedFaculty && (
        <div className="faculty-modal-overlay" onClick={handleCloseModal}>
          <div className="faculty-modal" onClick={(e) => e.stopPropagation()}>
            <button 
              type="button" 
              className="faculty-modal-close" 
              onClick={handleCloseModal}
              aria-label="Cerrar modal"
            >
              ✕
            </button>

            {/* Cabecera del modal */}
            <div className="faculty-modal-hero">
              <div className="faculty-modal-image">
                <img src={selectedFaculty.image} alt={selectedFaculty.name} />
                <div className="faculty-modal-image-overlay">
                  <span className="modal-foundation-badge">
                    Fundación: {selectedFaculty.foundationYear}
                  </span>
                </div>
              </div>
              <div className="faculty-modal-title-area">
                <h2>{selectedFaculty.name}</h2>
                <p className="faculty-modal-subtitle">Universidad Nacional de San Cristóbal de Huamanga</p>
              </div>
            </div>

            {/* Barra de pestañas de navegación */}
            <div className="faculty-modal-tabs">
              <button 
                type="button" 
                className={`tab-btn ${activeTab === 'info' ? 'active' : ''}`}
                onClick={() => setActiveTab('info')}
              >
                📜 Historia y Misión
              </button>
              <button 
                type="button" 
                className={`tab-btn ${activeTab === 'authority' ? 'active' : ''}`}
                onClick={() => setActiveTab('authority')}
              >
                👔 Decanato y Autoridades
              </button>
              <button 
                type="button" 
                className={`tab-btn ${activeTab === 'schools' ? 'active' : ''}`}
                onClick={() => setActiveTab('schools')}
              >
                📚 Escuelas ({selectedFaculty.schoolDetails?.length || selectedFaculty.name})
              </button>
              {selectedFaculty.timeline && selectedFaculty.timeline.length > 0 && (
                <button 
                  type="button" 
                  className={`tab-btn ${activeTab === 'timeline' ? 'active' : ''}`}
                  onClick={() => setActiveTab('timeline')}
                >
                  ⏳ Línea de Tiempo
                </button>
              )}
            </div>

            {/* Contenido según la pestaña activa */}
            <div className="faculty-modal-tab-content">
              {/* PESTAÑA: HISTORIA Y MISIÓN */}
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

                  {selectedFaculty.authority && (
                    <div className="dean-mini-card">
                      <img 
                        src={selectedFaculty.authority.photo} 
                        alt={selectedFaculty.authority.name} 
                        className="dean-mini-avatar"
                      />
                      <div>
                        <h5>{selectedFaculty.authority.name}</h5>
                        <p className="dean-mini-title">{selectedFaculty.authority.title}</p>
                        <p className="dean-mini-degree">{selectedFaculty.authority.degree}</p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* PESTAÑA: DECANATO Y AUTORIDADES */}
              {activeTab === 'authority' && selectedFaculty.authority && (
                <div className="tab-pane authority-pane">
                  <div className="dean-full-card">
                    <div className="dean-photo-container">
                      <img 
                        src={selectedFaculty.authority.photo} 
                        alt={selectedFaculty.authority.name} 
                        className="dean-full-photo"
                      />
                      <span className="dean-verified-badge">Autoridad Oficial UNSCH</span>
                    </div>
                    <div className="dean-full-info">
                      <span className="dean-label">Decanatura de Facultad</span>
                      <h3>{selectedFaculty.authority.name}</h3>
                      <p className="dean-official-title">{selectedFaculty.authority.title}</p>
                      <p className="dean-academic-degree">🎓 {selectedFaculty.authority.degree}</p>
                      <div className="dean-bio-box">
                        <p>{selectedFaculty.authority.bio}</p>
                      </div>
                      <div className="dean-commitment-quote">
                        <em>"Al servicio del desarrollo agrario, la excelencia académica y el bienestar estudiantil de la comunidad san cristobalina."</em>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* PESTAÑA: ESCUELAS PROFESIONALES */}
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

              {/* PESTAÑA: LÍNEA DE TIEMPO */}
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