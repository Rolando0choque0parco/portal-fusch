import { useState } from 'react';
import './Members.css';

interface MemberItem {
  name: string;
  role: string;
  category: 'presidencia' | 'secretaria';
  photo: string;
  commitment: string;
  tag?: string;
}

const membersData: MemberItem[] = [
  {
    name: 'Rivaldo Vila Mauricio',
    role: 'Presidente',
    category: 'presidencia',
    photo: '/images/integrantes_sin_editar/presidente.jpeg',
    commitment: 'Comprometido con la defensa de la gratuidad, calidad académica y la transparencia absoluta en favor de la comunidad estudiantil.',
    tag: 'Presidencia FUSCH'
  },
  {
    name: 'Henry Salvatierra Perez',
    role: 'Vicepresidente',
    category: 'presidencia',
    photo: '/images/integrantes_sin_editar/vicepresidente.jpeg',
    commitment: 'Articulando el diálogo permanente entre facultades y fiscalizando las obras y servicios prioritarios de la universidad.',
    tag: 'Vicepresidencia'
  },
  {
    name: 'Zahira Zaga Salcedo',
    role: 'Secretaria de Actas y Archivos',
    category: 'secretaria',
    photo: '/images/integrantes_sin_editar/secretaria de actas y archivos.jpeg',
    commitment: 'Custodiando con rigor la memoria institucional, documentación transparente y difusión oportuna de acuerdos de asamblea.'
  },
  {
    name: 'Rolando Choque Parco',
    role: 'Secretario de Cultura',
    category: 'secretaria',
    photo: '/images/integrantes_sin_editar/secretaria de cultura.jpeg',
    commitment: 'Promoviendo el rescate de nuestras raíces andinas, el arte, la música y la identidad cultural san cristobalina.'
  },
  {
    name: 'Romel Huaman Mendoza',
    role: 'Secretario de Deportes',
    category: 'secretaria',
    photo: '/images/integrantes_sin_editar/secretaria de deportes.jpeg',
    commitment: 'Impulsando el deporte formativo y competitivo, torneos interfacultades y modernización de campos deportivos.'
  },
  {
    name: 'Deisy Algoner Lima',
    role: 'Secretaria de Economía',
    category: 'secretaria',
    photo: '/images/integrantes_sin_editar/secretaria de economia.jpeg',
    commitment: 'Gestión austera, fiscalización permanente y rendición de cuentas pública en cada recurso estudiantil.'
  },
  {
    name: 'Katherin Gonzales Cuchuri',
    role: 'Secretaria de Investigación e Innovación',
    category: 'secretaria',
    photo: '/images/integrantes_sin_editar/secretaria de investigacion.jpeg',
    commitment: 'Fomentando semilleros científicos, financiamiento de proyectos de tesis y publicaciones de impacto regional.'
  },
  {
    name: 'Jhordan Mendoza Gómez',
    role: 'Secretario de Organización',
    category: 'secretaria',
    photo: '/images/integrantes_sin_editar/secretaria de organizacion.jpeg',
    commitment: 'Fortaleciendo la unidad gremial, articulación con centros federados y la representatividad en cada escuela.'
  },
  {
    name: 'Celestina Cusi Angulo',
    role: 'Secretaria de Prensa y Propaganda',
    category: 'secretaria',
    photo: '/images/integrantes_sin_editar/secretaria de prensa y propaganda.jpeg',
    commitment: 'Garantizando una comunicación moderna, veraz y transparente a través de todos los canales informativos de la FUSCH.'
  },
  {
    name: 'Ruth Aponte Limache',
    role: 'Secretaria de Proyección Social',
    category: 'secretaria',
    photo: '/images/integrantes_sin_editar/secretaria de proyeccion social.jpeg',
    commitment: 'Vinculando la universidad con las comunidades altoandinas mediante voluntariado social y apoyo solidario continuo.'
  },
  {
    name: 'Carol Espillco Peralta',
    role: 'Secretaria de Relaciones Exteriores',
    category: 'secretaria',
    photo: '/images/integrantes_sin_editar/secretaria de relaciones exteriores.jpeg',
    commitment: 'Consolidando lazos estratégicos con federaciones universitarias del Perú y convenios de apoyo institucional.'
  },
  {
    name: 'Yosselin Mancco Calderón',
    role: 'Secretaria de Salud y Nutrición',
    category: 'secretaria',
    photo: '/images/integrantes_sin_editar/secretaria de salud.jpeg',
    commitment: 'Velando por la inocuidad y balance nutricional del comedor universitario y campañas de prevención sanitaria.'
  },
  {
    name: 'Felipe Espino Huallpa',
    role: 'Secretario de Asistencia Social',
    category: 'secretaria',
    photo: '/images/integrantes_sin_editar/secretario de asistencia social.jpeg',
    commitment: 'Acompañamiento prioritario a compañeros en situación de vulnerabilidad, becas y bienestar socioemocional.'
  },
  {
    name: 'Fray Huaman Lope',
    role: 'Secretario de Asuntos Académicos',
    category: 'secretaria',
    photo: '/images/integrantes_sin_editar/secretario de asuntos academicos.jpeg',
    commitment: 'Defensa de los derechos pedagógicos, mejora de los planes de estudio y transparencia en la evaluación docente.'
  }
];

function Members() {
  const [filter, setFilter] = useState<'todos' | 'presidencia' | 'secretaria'>('todos');

  const filteredMembers = filter === 'todos' 
    ? membersData 
    : membersData.filter(m => m.category === filter);

  return (
    <div className="members-page-wrapper">
      {/* Encabezado Institucional */}
      <header className="members-hero-header">
        <div className="members-header-badge">
          <span>🏛️ Representación Estudiantil Oficial</span>
        </div>
        <h2 className="members-main-title">Junta Directiva FUSCH 2026 – 2027</h2>
        <p className="members-subtitle">
          Líderes elegidos democráticamente para representar, defender los derechos y promover el bienestar de toda la comunidad estudiantil de la Tricentenaria UNSCH.
        </p>

        {/* Filtro interactivo sutil */}
        <div className="members-filter-bar">
          <button
            type="button"
            className={`members-filter-btn ${filter === 'todos' ? 'active' : ''}`}
            onClick={() => setFilter('todos')}
          >
            Todos ({membersData.length})
          </button>
          <button
            type="button"
            className={`members-filter-btn ${filter === 'presidencia' ? 'active' : ''}`}
            onClick={() => setFilter('presidencia')}
          >
            Presidencia
          </button>
          <button
            type="button"
            className={`members-filter-btn ${filter === 'secretaria' ? 'active' : ''}`}
            onClick={() => setFilter('secretaria')}
          >
            Secretarías
          </button>
        </div>
      </header>

      {/* Grid de Tarjetas Estilo "Perfil Ejecutivo" */}
      <div className="members-executive-grid">
        {filteredMembers.map((member, index) => (
          <article 
            key={index} 
            className={`executive-member-card ${member.category === 'presidencia' ? 'presidency-card' : ''}`}
          >
            {/* Foto con Marco Dinámico Rojo Brillante */}
            <div className="executive-photo-frame">
              <img 
                src={member.photo} 
                alt={member.name} 
                className="executive-photo" 
                loading="lazy"
              />
              <div className="photo-glowing-ring" />
              {member.tag && (
                <span className="executive-priority-badge">{member.tag}</span>
              )}
            </div>

            {/* Contenido y Compromiso de Gestión */}
            <div className="executive-info-body">
              <span className="executive-role-pill">{member.role}</span>
              <h3 className="executive-name">{member.name}</h3>

              {/* Bloque: Compromiso de Gestión */}
              <div className="executive-commitment-box">
                <span className="commitment-label">🎯 Compromiso de Gestión:</span>
                <p className="commitment-quote">"{member.commitment}"</p>
              </div>
            </div>

            {/* Acento inferior institucional */}
            <div className="executive-card-bottom-accent" />
          </article>
        ))}
      </div>
    </div>
  );
}

export default Members;