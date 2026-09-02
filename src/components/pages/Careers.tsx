import { useState } from 'react'
import { faculties } from '../../data/careers'
import './Careers.css'

// Datos extendidos de facultades (con historia e imágenes LOCALES)
const facultyDetails: Record<number, { history: string; description: string; image: string }> = {
  1: {
    history: 'La Facultad de Ciencias Agrarias fue fundada en 1677, siendo una de las más antiguas del Perú. Ha formado profesionales que han contribuido al desarrollo agropecuario de la región.',
    description: 'Formamos profesionales con sólidos conocimientos en ciencias agrarias, comprometidos con el desarrollo sostenible y la seguridad alimentaria.',
    image: '/images/facultades/ciencias_agrarias.jpg'
  },
  2: {
    history: 'La Facultad de Ciencias Biológicas se creó en 1965 con el objetivo de formar biólogos especializados en la diversidad y conservación de los ecosistemas.',
    description: 'Formamos biólogos con capacidad de investigación, conservación y manejo sostenible de la biodiversidad.',
    image: '/images/facultades/ciencias_biologicas.jpg'
  },
  3: {
    history: 'La Facultad de Ciencias de la Educación fue fundada en 1960, formando docentes comprometidos con la educación de calidad en todos los niveles.',
    description: 'Formamos profesionales de la educación con vocación de servicio, innovación y compromiso social.',
    image: '/images/facultades/ciencias_de_la_educacion.png'
  },
  4: {
    history: 'La Facultad de Ciencias de la Salud se estableció en 1975, formando profesionales de la salud con enfoque humanístico y científico.',
    description: 'Formamos profesionales de la salud con sólidos conocimientos científicos y ética profesional.',
    image: '/images/facultades/ciencias_de_la_salud.jpg'
  },
  5: {
    history: 'La Facultad de Ciencias Económicas, Administrativas y Contables inició sus actividades en 1962, formando profesionales en gestión empresarial.',
    description: 'Formamos profesionales con capacidad de liderazgo, análisis y toma de decisiones en el ámbito empresarial.',
    image: '/images/facultades/fcea.png'
  },
  6: {
    history: 'La Facultad de Ciencias Sociales fue creada en 1968, con el objetivo de estudiar y comprender la realidad social peruana.',
    description: 'Formamos profesionales con capacidad de análisis crítico, investigación y compromiso con el desarrollo social.',
    image: '/images/facultades/ciencias_sociales.png'
  },
  7: {
    history: 'La Facultad de Derecho y Ciencias Políticas se fundó en 1677, siendo una de las primeras facultades de derecho del Perú.',
    description: 'Formamos profesionales del derecho con sólidos conocimientos jurídicos, ética y compromiso con la justicia.',
    image: '/images/facultades/derecho.png'
  },
  8: {
    history: 'La Facultad de Ingeniería de Minas, Geología y Civil se estableció en 1965, formando ingenieros para el desarrollo minero e infraestructura.',
    description: 'Formamos ingenieros con capacidad de innovación, gestión de proyectos y desarrollo sostenible.',
    image: '/images/facultades/geologia_minas_civil.jpg'
  },
  9: {
    history: 'La Facultad de Ingeniería Química y Metalurgia fue creada en 1970, formando profesionales en procesos industriales y metalúrgicos.',
    description: 'Formamos ingenieros con capacidad de gestión de procesos industriales, innovación y desarrollo tecnológico.',
    image: '/images/facultades/quimica_metalurgia.png'
  },
  10: {
    history: 'Estas son las nuevas carreras aprobadas para el año 2026, en respuesta a las demandas del mercado laboral y el desarrollo sostenible.',
    description: 'Formamos profesionales en áreas estratégicas para el desarrollo regional y nacional.',
    image: '/images/facultades/nuevas_carreras.png'
  }
}

function Careers() {
  const [selectedFaculty, setSelectedFaculty] = useState<number | null>(null)

  return (
    <div className="careers-container">
      <div className="careers-header">
        <h2>🎓 Carreras de la UNSCH</h2>
        <p>Conoce todas las escuelas profesionales de nuestra universidad</p>
      </div>

      <div className="faculties-grid">
        {faculties.map((faculty) => {
          const details = facultyDetails[faculty.id]
          return (
            <div 
              key={faculty.id} 
              className="faculty-card"
              onClick={() => setSelectedFaculty(faculty.id)}
            >
              <div className="faculty-image">
                <img 
                  src={details?.image || '/images/facultades/ciencias_agrarias.jpg'} 
                  alt={faculty.name}
                />
              </div>
              <div className="faculty-content">
                <h3>{faculty.name}</h3>
                <ul>
                  {faculty.schools.map((school, index) => (
                    <li key={index}>
                      <span className="school-icon">📘</span> {school}
                    </li>
                  ))}
                </ul>
                <button className="faculty-more-btn">Ver más</button>
              </div>
            </div>
          )
        })}
      </div>

      {/* Modal para ver detalles de la facultad */}
      {selectedFaculty && (
        <div className="faculty-modal-overlay" onClick={() => setSelectedFaculty(null)}>
          <div className="faculty-modal" onClick={(e) => e.stopPropagation()}>
            <button className="faculty-modal-close" onClick={() => setSelectedFaculty(null)}>✕</button>
            {(() => {
              const faculty = faculties.find(f => f.id === selectedFaculty)
              const details = facultyDetails[selectedFaculty]
              if (!faculty) return null
              return (
                <>
                  <div className="faculty-modal-image">
                    <img src={details?.image || '/images/facultades/ciencias_agrarias.jpg'} alt={faculty.name} />
                  </div>
                  <h2>{faculty.name}</h2>
                  <div className="faculty-modal-history">
                    <h4>📜 Reseña Histórica</h4>
                    <p>{details?.history || 'Información en proceso de actualización.'}</p>
                  </div>
                  <div className="faculty-modal-description">
                    <h4>🎯 Misión</h4>
                    <p>{details?.description || 'Formamos profesionales de excelencia.'}</p>
                  </div>
                  <div className="faculty-modal-schools">
                    <h4>📚 Escuelas Profesionales</h4>
                    <ul>
                      {faculty.schools.map((school, index) => (
                        <li key={index}>📘 {school}</li>
                      ))}
                    </ul>
                  </div>
                </>
              )
            })()}
          </div>
        </div>
      )}
    </div>
  )
}

export default Careers