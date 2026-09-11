export interface SchoolDetail {
  name: string;
  creationYear: string;
  creationContext: string;
  director: string;
  duration: string;
  degree: string;
  practiceCenters: string[];
  description: string;
}

export interface TimelineMilestone {
  year: string;
  title: string;
  description: string;
}

export interface AuthorityInfo {
  name: string;
  title: string;
  degree: string;
  bio: string;
  photo: string;
  email?: string;
  schedule?: string;
}

export interface FacultyExtendedData {
  id: number;
  name: string;
  shortName: string;
  image: string;
  foundationYear: string;
  history: string;
  mission: string;
  authority: AuthorityInfo;
  timeline: TimelineMilestone[];
  schoolDetails: SchoolDetail[];
  schedule?: string;
}

export const COMMON_FACULTY_MISSION = "Brindar formación académica integral a los estudiantes de pre y posgrado de la facultad, con una concepción holística del ser humano y la sociedad, incidiendo en la investigación e innovación, responsabilidad social, tutoría y gestión que contribuya al bienestar de la población de la región y del país.";
export const COMMON_FACULTY_SCHEDULE = "8:30 am – 12:30 pm y 2:30 pm – 4:00 pm";

export const faculties = [
  {
    id: 1,
    name: 'Ciencias Agrarias',
    schools: ['Agronomía', 'Ingeniería Agrícola', 'Medicina Veterinaria', 'Ingeniería Agroforestal']
  },
  {
    id: 2,
    name: 'Ciencias Biológicas',
    schools: ['Biología']
  },
  {
    id: 3,
    name: 'Ciencias de la Educación',
    schools: ['Educación Inicial', 'Educación Primaria', 'Educación Secundaria', 'Educación Física']
  },
  {
    id: 4,
    name: 'Ciencias de la Salud',
    schools: ['Enfermería', 'Obstetricia', 'Medicina Humana', 'Farmacia y Bioquímica']
  },
  {
    id: 5,
    name: 'Ciencias Económicas, Administrativas y Contables',
    schools: ['Economía', 'Administración de Empresas', 'Contabilidad']
  },
  {
    id: 6,
    name: 'Ciencias Sociales',
    schools: ['Antropología Social', 'Arqueología', 'Historia', 'Sociología', 'Trabajo Social']
  },
  {
    id: 7,
    name: 'Derecho y Ciencias Políticas',
    schools: ['Derecho']
  },
  {
    id: 8,
    name: 'Ingeniería de Minas, Geología y Civil',
    schools: ['Ingeniería Civil', 'Ingeniería de Sistemas', 'Ingeniería de Minas', 'Físico Matemáticas']
  },
  {
    id: 9,
    name: 'Ingeniería Química y Metalurgia',
    schools: ['Ingeniería Agroindustrial', 'Ingeniería Química', 'Ingeniería en Industrias Alimentarias']
  },
  {
    id: 10,
    name: 'Nuevas Carreras 2026',
    schools: ['Ingeniería Ambiental', 'Arquitectura', 'Psicología']
  }
];

export const facultyExtendedDetails: Record<number, FacultyExtendedData> = {
  1: {
    id: 1,
    name: 'Facultad de Ciencias Agrarias (FCAC)',
    shortName: 'Ciencias Agrarias',
    image: '/images/facultades/ciencias_agrarias.jpg',
    foundationYear: '1960 (Instituto de Ingeniería Rural y Zootecnia) / 1984 (Facultad)',
    history: 'La Facultad de Ciencias Agrarias de la UNSCH tiene sus orígenes históricos vinculados a la reactivación de la universidad mediante la Ley N.º 12828 (1957) y su reapertura en 1959. En 1960 se instituyó como Instituto de Ingeniería Rural y Zootecnia, transformándose en la actual Facultad con la Ley Universitaria 23733 en 1984. Ha sido pilar indiscutible de la producción agropecuaria, el manejo sustentable del suelo andino y la seguridad alimentaria de Ayacucho y del país.',
    mission: COMMON_FACULTY_MISSION,
    schedule: COMMON_FACULTY_SCHEDULE,
    authority: {
      name: 'Dr. Felipe Escobar Ramírez',
      title: 'Decano de la Facultad de Ciencias Agrarias',
      degree: 'Doctor en Ciencias Agrarias / Docente Principal UNSCH',
      bio: 'Lidera la gestión académica y científica de la FCAC. Comprometido con la modernización de los laboratorios especializados, la acreditación de calidad, la protección del patrimonio agropecuario regional y el equipamiento integral de los centros experimentales de Wayllapampa y Canaán.',
      photo: '/images/decanos/decanocienciasagrarias.jpg',
      email: 'felipe.escobar@unsch.edu.pe',
      schedule: COMMON_FACULTY_SCHEDULE
    },
    timeline: [
      {
        year: '1677',
        title: 'Fundación de la UNSCH',
        description: 'Fundación de la Real y Pontificia Universidad Nacional San Cristóbal de Huamanga por el obispo Don Cristóbal de Castilla y Zamora.'
      },
      {
        year: '1957 - 1959',
        title: 'Ley 12828 y Reapertura Histórica',
        description: 'Reapertura oficial de la UNSCH con énfasis prioritario en carreras orientadas al desarrollo rural andino.'
      },
      {
        year: '1960',
        title: 'Instituto de Ingeniería Rural y Zootecnia',
        description: 'Inicio formal de la formación agronómica y pecuaria moderna en la Ciudad Universitaria.'
      },
      {
        year: '1984',
        title: 'Constitución como Facultad (Ley 23733)',
        description: 'Consolidación estructural como Facultad de Ciencias Agrarias, integrando cátedras e investigación experimental.'
      },
      {
        year: '1994 - 1996',
        title: 'Creación de Ing. Agrícola y Medicina Veterinaria',
        description: 'Apertura de la Escuela de Formación Profesional de Ingeniería Agrícola (1994) y Medicina Veterinaria (R.R. 109-96 en 1996).'
      },
      {
        year: '2009 - 2010',
        title: 'Expansión a Pichari: Ing. Agroforestal',
        description: 'Creación oficial mediante Ley N.º 29413 de la Escuela Profesional de Ingeniería Agroforestal con sede en Pichari - VRAEM.'
      }
    ],
    schoolDetails: [
      {
        name: 'Escuela Profesional de Agronomía',
        creationYear: '1959 - 1960 (Fundacional en la Reapertura)',
        creationContext: 'Creada para liderar la transformación agrícola regional, optimización de cultivos andinos y seguridad alimentaria.',
        director: 'Dirección de la Escuela Profesional de Agronomía',
        duration: '10 semestres académicos (5 años)',
        degree: 'Bachiller en Ciencias Agrarias / Título Profesional: Ingeniero(a) Agrónomo(a)',
        practiceCenters: ['Centro Experimental Wayllapampa', 'Centro Experimental Canaán', 'Laboratorio de Entomología y Fitopatología'],
        description: 'Forma ingenieros capacitados en manejo agronómico sustentable, mejoramiento genético vegetal, agroecología, sanidad vegetal y gestión de agronegocios con alto compromiso ambiental.'
      },
      {
        name: 'Escuela Profesional de Ingeniería Agrícola',
        creationYear: '1994 (Iniciada como Ingeniería Rural)',
        creationContext: 'Impulsada por la urgente necesidad de tecnificación del riego y gestión hidrológica de las cuencas ayacuchanas.',
        director: 'Dirección de la Escuela Profesional de Ingeniería Agrícola',
        duration: '10 semestres académicos (5 años)',
        degree: 'Bachiller en Ingeniería Agrícola / Título Profesional: Ingeniero(a) Agrícola',
        practiceCenters: ['Laboratorio de Mecánica de Suelos y Aguas', 'Estaciones Hidrometeorológicas', 'Centro Experimental Wayllapampa'],
        description: 'Especialistas en diseño y construcción de obras de riego tecnificado, represamientos, conservación de suelos y agua, mecanización agropecuaria y ordenamiento territorial de cuencas hidrográficas.'
      },
      {
        name: 'Escuela Profesional de Medicina Veterinaria',
        creationYear: '1995 (Aprobada por Resolución Rectoral R.R. 109-96)',
        creationContext: 'Creada para asegurar la sanidad animal, desarrollo pecuario y salud pública veterinaria en el centro y sur del país.',
        director: 'Dirección de la Escuela Profesional de Medicina Veterinaria',
        duration: '10 semestres académicos (5 años)',
        degree: 'Bachiller en Medicina Veterinaria / Título Profesional: Médico(a) Veterinario(a)',
        practiceCenters: ['Clínica Veterinaria Universitaria', 'Módulos Pecuarios Canaán', 'Laboratorio de Patología y Microbiología Animal'],
        description: 'Profesionales líderes en medicina preventiva y curativa de especies menores y mayores, cirugía animal, bioseguridad, epidemiología, inocuidad alimentaria y producción pecuaria sostenible.'
      },
      {
        name: 'Escuela Profesional de Ingeniería Agroforestal',
        creationYear: '2009 (Oficializada por Ley N.º 29413 - Sede Pichari)',
        creationContext: 'Establecida estratégicamente en el VRAEM para responder al desafío ecológico y productivo de la ceja de selva y selva alta.',
        director: 'Dirección de la Escuela Profesional de Ingeniería Agroforestal',
        duration: '10 semestres académicos (5 años)',
        degree: 'Bachiller en Ingeniería Agroforestal / Título Profesional: Ingeniero(a) Agroforestal',
        practiceCenters: ['Campus y Parcelas Demostrativas Sede Pichari', 'Bosques Experimentales VRAEM', 'Nuevo Polideportivo y Complejo Pichari'],
        description: 'Forma profesionales expertos en silvicultura, diseño de sistemas agroforestales multicapa (cacao, café, especies maderables nativas), restauración de suelos degradados y bioeconomía amazónica.'
      }
    ]
  },
  2: {
    id: 2,
    name: 'Facultad de Ciencias Biológicas',
    shortName: 'Ciencias Biológicas',
    image: '/images/facultades/ciencias_biologicas.jpg',
    foundationYear: '1965',
    history: 'Creada para investigar la megadiversidad altoandina y la conservación de los ecosistemas de la cuenca del Mantaro y Pampas, liderando la investigación molecular, biotecnológica y ambiental.',
    mission: COMMON_FACULTY_MISSION,
    schedule: COMMON_FACULTY_SCHEDULE,
    authority: {
      name: 'Dr. Saturnino Martín Tenorio Bautista',
      title: 'Decano de la Facultad de Ciencias Biológicas',
      degree: 'Doctor en Ciencias Biológicas / Investigador Principal UNSCH',
      bio: 'Lidera la investigación científica en flora y fauna altoandina, preservación de recursos genéticos y modernización de los laboratorios de biología molecular y ecología.',
      photo: '/images/decanos/decanocienciasbiologicas.jpg',
      email: 'saturnino.tenorio@unsch.edu.pe',
      schedule: COMMON_FACULTY_SCHEDULE
    },
    timeline: [
      { year: '1965', title: 'Fundación', description: 'Creación de la facultad para la investigación científica de la biodiversidad regional.' },
      { year: '1990', title: 'Laboratorios de Biotecnología', description: 'Modernización del estudio genético y molecular andino.' }
    ],
    schoolDetails: [
      {
        name: 'Escuela Profesional de Biología',
        creationYear: '1965',
        creationContext: 'Estudio sistemático de la biodiversidad y ecosistemas andinos.',
        director: 'Dirección de la Escuela de Biología',
        duration: '10 semestres académicos',
        degree: 'Bachiller en Ciencias Biológicas / Título: Licenciado(a) en Biología',
        practiceCenters: ['Herbario Huamangensis', 'Museo de Historia Natural UNSCH', 'Laboratorio de Genética y Biología Molecular'],
        description: 'Investigación en biotecnología vegetal y animal, microbiología aplicada, genética, bioética y gestión y conservación ambiental.'
      }
    ]
  },
  3: {
    id: 3,
    name: 'Facultad de Ciencias de la Educación',
    shortName: 'Ciencias de la Educación',
    image: '/images/facultades/ciencias_de_la_educacion.png',
    foundationYear: '1960',
    history: 'Institución pionera en la formación pedagógica e intercultural bilingüe para la región de Ayacucho y el sur peruano, forjando generaciones de educadores con vocación de servicio.',
    mission: COMMON_FACULTY_MISSION,
    schedule: COMMON_FACULTY_SCHEDULE,
    authority: {
      name: 'Dr. Víctor Raúl Tumbalobos Huamaní',
      title: 'Decano de la Facultad de Ciencias de la Educación',
      degree: 'Doctor en Ciencias de la Educación / Docente Principal UNSCH',
      bio: 'Promueve la excelencia pedagógica, la investigación en educación intercultural bilingüe, la actualización curricular y la articulación con los colegios de la región.',
      photo: '/images/decanos/decanodecienciasdelaeducacion.jpg',
      schedule: COMMON_FACULTY_SCHEDULE
    },
    timeline: [
      { year: '1960', title: 'Creación Histórica', description: 'Nacimiento de la Facultad de Educación junto a la reapertura universitaria.' }
    ],
    schoolDetails: [
      {
        name: 'Educación Inicial, Primaria, Secundaria y Física',
        creationYear: '1960',
        creationContext: 'Formación docente integral con enfoque humanista, crítico e intercultural.',
        director: 'Direcciones de Escuela de Ciencias de la Educación',
        duration: '10 semestres académicos',
        degree: 'Bachiller en Educación / Título: Licenciado(a) en Educación',
        practiceCenters: ['Institución Educativa de Aplicación Guamán Poma de Ayala', 'Centros Educativos Piloto Región Ayacucho'],
        description: 'Docentes capacitados en pedagogía moderna, tecnologías de la información aplicadas a la enseñanza y didáctica especializada.'
      }
    ]
  },
  4: {
    id: 4,
    name: 'Facultad de Ciencias de la Salud',
    shortName: 'Ciencias de la Salud',
    image: '/images/facultades/ciencias_de_la_salud.jpg',
    foundationYear: '1975',
    history: 'Comprometida con la salud pública, la formación de médicos cirujanos, enfermeros, obstetras y farmacéuticos con los más altos estándares éticos y científicos de la macro región sur.',
    mission: COMMON_FACULTY_MISSION,
    schedule: COMMON_FACULTY_SCHEDULE,
    authority: {
      name: 'Dr. José Yarlequé Chocas',
      title: 'Decanato de la Facultad de Ciencias de la Salud',
      degree: 'Doctor en Ciencias de la Salud / Docente Investigador UNSCH',
      bio: 'Lidera la consolidación de convenios hospitalarios de internado médico, la acreditación de escuelas de salud y la modernización de laboratorios biomédicos y clínicas simuladas.',
      photo: '/images/decanos/decanocienciasdelasalud.png',
      email: 'jose.yarleque@unsch.edu.pe',
      schedule: COMMON_FACULTY_SCHEDULE
    },
    timeline: [
      { year: '1975', title: 'Fundación', description: 'Inicio de la formación en ciencias biomédicas y de la salud.' },
      { year: '2004', title: 'Medicina Humana', description: 'Creación de la Escuela Profesional de Medicina Humana.' }
    ],
    schoolDetails: [
      {
        name: 'Medicina Humana, Enfermería, Obstetricia, Farmacia y Bioquímica',
        creationYear: '1975 - 2004',
        creationContext: 'Desarrollo de servicios médicos de alta especialidad y prevención sanitaria regional.',
        director: 'Direcciones de Escuela de Ciencias de la Salud',
        duration: '10 a 14 semestres académicos (incluye internado médico)',
        degree: 'Médico(a) Cirujano(a) / Licenciado(a) en Enfermería, Obstetricia, Farmacia y Bioquímica',
        practiceCenters: ['Hospital Regional de Ayacucho', 'Hospital de Apoyo Jesús Nazareno', 'Centros de Salud MINSA / EsSalud'],
        description: 'Cuidado integral del paciente, salud reproductiva, bioquímica clínica, terapéutica farmacológica y salud pública comunitaria.'
      }
    ]
  },
  5: {
    id: 5,
    name: 'Facultad de Ciencias Económicas, Administrativas y Contables',
    shortName: 'Ciencias Económicas (FCEA)',
    image: '/images/facultades/fcea.png',
    foundationYear: '1962',
    history: 'Semillero indiscutible de líderes empresariales, gestores públicos y contadores que dinamizan la economía regional y nacional con honestidad y visión estratégica.',
    mission: COMMON_FACULTY_MISSION,
    schedule: COMMON_FACULTY_SCHEDULE,
    authority: {
      name: 'Dr. Pelayo Hilario Valenzuela',
      title: 'Decano de la Facultad de Ciencias Económicas, Administrativas y Contables',
      degree: 'Doctor en Ciencias Económicas / Docente Principal UNSCH',
      bio: 'Impulsa la innovación financiera, convenios empresariales de prácticas preprofesionales, investigación econométrica y la modernización tecnológica de los gabinetes contables.',
      photo: '/images/decanos/decanocienciaseconomicasadministrativascontables.png',
      email: 'pelayo.hilario@unsch.edu.pe',
      schedule: COMMON_FACULTY_SCHEDULE
    },
    timeline: [
      { year: '1962', title: 'Fundación', description: 'Inauguración formal de las cátedras económicas y contables en la UNSCH.' }
    ],
    schoolDetails: [
      {
        name: 'Administración de Empresas, Economía, Contabilidad',
        creationYear: '1962',
        creationContext: 'Formación empresarial, tributaria y gestión económica del Perú.',
        director: 'Direcciones de Escuela FCEA',
        duration: '10 semestres académicos',
        degree: 'Licenciado(a) en Administración / Economista / Contador(a) Público(a)',
        practiceCenters: ['Centros de Asesoría Empresarial y Contable', 'Laboratorio de Simulación Financiera'],
        description: 'Auditoría, formulación de proyectos de inversión pública y privada, dirección estratégica y finanzas corporativas.'
      }
    ]
  },
  6: {
    id: 6,
    name: 'Facultad de Ciencias Sociales',
    shortName: 'Ciencias Sociales',
    image: '/images/facultades/ciencias_sociales.png',
    foundationYear: '1968',
    history: 'Referente nacional e internacional en antropología andina, arqueología del Imperio Wari y análisis crítico de las dinámicas sociopolíticas del Perú contemporáneo.',
    mission: COMMON_FACULTY_MISSION,
    schedule: COMMON_FACULTY_SCHEDULE,
    authority: {
      name: 'Dr. Oscar Juan Roque Siguas',
      title: 'Decano de la Facultad de Ciencias Sociales',
      degree: 'Doctor en Ciencias Sociales / Docente Principal UNSCH',
      bio: 'Promueve la investigación arqueológica, la salvaguarda del patrimonio cultural ayacuchano, proyectos de intervención comunitaria y fortalecimiento de las ciencias sociales.',
      photo: '/images/decanos/decanocienciassociales.jpg',
      email: 'oscar.roque@unsch.edu.pe',
      schedule: COMMON_FACULTY_SCHEDULE
    },
    timeline: [
      { year: '1968', title: 'Creación', description: 'Fundación de la Facultad orientada al estudio social y antropológico andino.' }
    ],
    schoolDetails: [
      {
        name: 'Antropología Social, Arqueología, Historia, Sociología, Trabajo Social',
        creationYear: '1968',
        creationContext: 'Reconocimiento de la herencia milenaria andina y desarrollo social equitativo.',
        director: 'Direcciones de Escuela de Ciencias Sociales',
        duration: '10 semestres académicos',
        degree: 'Bachiller en Ciencias Sociales / Título: Licenciado(a) en la especialidad respectiva',
        practiceCenters: ['Complejo Arqueológico Wari', 'Archivos Históricos de Ayacucho', 'Laboratorio de Arqueometría'],
        description: 'Investigación etnográfica, excavación y puesta en valor del patrimonio arqueológico, formulación de políticas sociales y trabajo comunitario.'
      }
    ]
  },
  7: {
    id: 7,
    name: 'Facultad de Derecho y Ciencias Políticas',
    shortName: 'Derecho y CC.PP.',
    image: '/images/facultades/derecho.png',
    foundationYear: '1677',
    history: 'Una de las facultades de derecho más antiguas y prestigiosas del continente, nacida con la fundación misma de la universidad en 1677 y baluarte de la justicia y el constitucionalismo.',
    mission: COMMON_FACULTY_MISSION,
    schedule: COMMON_FACULTY_SCHEDULE,
    authority: {
      name: 'Dr. Oscar A. Galván Oviedo',
      title: 'Decano de la Facultad de Derecho y Ciencias Políticas',
      degree: 'Doctor en Derecho y Ciencias Políticas / Jurista y Docente Principal',
      bio: 'Firme defensor del Estado de Derecho, los derechos humanos y la modernización de las salas de audiencias simuladas para la formación procesal y penal de los futuros abogados.',
      photo: '/images/decanos/decanoderecho.jpg',
      email: 'oscar.galvan@unsch.edu.pe',
      schedule: COMMON_FACULTY_SCHEDULE
    },
    timeline: [
      { year: '1677', title: 'Fundación Pontificia', description: 'Inicio de la enseñanza del Derecho Canónico y Civil en Huamanga.' },
      { year: '1959', title: 'Reactivación Moderna', description: 'Restablecimiento de la cátedra de Derecho con la reapertura de la UNSCH.' }
    ],
    schoolDetails: [
      {
        name: 'Escuela Profesional de Derecho',
        creationYear: '1677 / Reactivada en 1959',
        creationContext: 'Pilar fundamental de la jurisprudencia, legalidad y defensa de las libertades individuales y colectivas.',
        director: 'Dirección de la Escuela Profesional de Derecho',
        duration: '12 semestres académicos (6 años)',
        degree: 'Bachiller en Derecho / Título Profesional: Abogado(a)',
        practiceCenters: ['Consultorio Jurídico Gratuito UNSCH', 'Corte Superior de Justicia de Ayacucho', 'Ministerio Público'],
        description: 'Litigio penal, derecho constitucional, civil, corporativo, laboral, procesal oral y conciliación extrajudicial.'
      }
    ]
  },
  8: {
    id: 8,
    name: 'Facultad de Ingeniería de Minas, Geología y Civil',
    shortName: 'Minas, Geología y Civil (FIMGC)',
    image: '/images/facultades/geologia_minas_civil.jpg',
    foundationYear: '1965',
    history: 'Cuna de ingenieros de élite que han construido la infraestructura vial, civil y minero-geológica del Perú con los más altos estándares tecnológicos y de seguridad.',
    mission: COMMON_FACULTY_MISSION,
    schedule: COMMON_FACULTY_SCHEDULE,
    authority: {
      name: 'Mg. José Ernesto Estrada Cárdenas',
      title: 'Decano de la Facultad de Ingeniería de Minas, Geología y Civil',
      degree: 'Magíster en Ingeniería / Docente Principal UNSCH',
      bio: 'Lidera la modernización de los laboratorios de mecánica de suelos, geomecánica, software sismorresistente e impulsa la minería ambiental y la transformación tecnológica.',
      photo: '/images/decanos/decanominasgeologiacivil.jpg',
      email: 'jose.estrada@unsch.edu.pe',
      schedule: COMMON_FACULTY_SCHEDULE
    },
    timeline: [
      { year: '1965', title: 'Fundación', description: 'Inauguración de la formación en ingeniería pesada, civil y geológica.' }
    ],
    schoolDetails: [
      {
        name: 'Ingeniería Civil, Ingeniería de Sistemas, Minas, Físico Matemáticas',
        creationYear: '1965 - 1990',
        creationContext: 'Infraestructura vial, edificaciones sismorresistentes, desarrollo de software y recursos minerales estratégicos.',
        director: 'Direcciones de Escuela FIMGC',
        duration: '10 semestres académicos',
        degree: 'Bachiller en Ingeniería / Título: Ingeniero(a) Colegiado(a)',
        practiceCenters: ['Laboratorio de Estructuras y Pavimentos', 'Data Center Universitario', 'Mina Escuela'],
        description: 'Cálculo estructural BIM, ingeniería de software, geomecánica, planeamiento de minas y modelamiento matemático computacional.'
      }
    ]
  },
  9: {
    id: 9,
    name: 'Facultad de Ingeniería Química y Metalurgia',
    shortName: 'Química y Metalurgia (FIQM)',
    image: '/images/facultades/quimica_metalurgia.png',
    foundationYear: '1970',
    history: 'Especializada en la transformación fisicoquímica de la materia prima, agroindustria andina, industrias alimentarias y bioprocesos de alto valor agregado.',
    mission: COMMON_FACULTY_MISSION,
    schedule: COMMON_FACULTY_SCHEDULE,
    authority: {
      name: 'Dr. Agustín Julián Portuguez Murtua',
      title: 'Decano de la Facultad de Ingeniería Química y Metalurgia',
      degree: 'Doctor en Ingeniería Química / Especialista en Bioprocesos Industriales',
      bio: 'Fomenta la innovación en plantas piloto de alimentos, destilados, biofertilizantes, control de calidad y aprovechamiento integral de recursos agroindustriales nativos.',
      photo: '/images/decanos/decanometalurgia.png',
      email: 'agustin.portuguez@unsch.edu.pe',
      schedule: COMMON_FACULTY_SCHEDULE
    },
    timeline: [
      { year: '1970', title: 'Fundación', description: 'Creación formal para el desarrollo agroindustrial y fisicoquímico regional.' }
    ],
    schoolDetails: [
      {
        name: 'Ingeniería Agroindustrial, Ingeniería Química, Industrias Alimentarias',
        creationYear: '1970',
        creationContext: 'Transformación de materias primas con valor agregado, inocuidad alimentaria y bioprocesos sustentables.',
        director: 'Direcciones de Escuela FIQM',
        duration: '10 semestres académicos',
        degree: 'Bachiller en Ingeniería / Título: Ingeniero(a) Agroindustrial / Químico / Alimentos',
        practiceCenters: ['Planta Piloto de Procesamiento de Alimentos', 'Laboratorios de Análisis Químico e Instrumental'],
        description: 'Gestión de plantas industriales, control de calidad HACCP, desarrollo de nuevos productos alimenticios y simulación de bioprocesos.'
      }
    ]
  },
  10: {
    id: 10,
    name: 'Nuevas Carreras Aprobadas 2026',
    shortName: 'Nuevas Carreras 2026',
    image: '/images/facultades/nuevas_carreras.png',
    foundationYear: '2026',
    history: 'Aprobadas por la Asamblea Universitaria en respuesta a las demandas del siglo XXI y el crecimiento urbano, sostenibilidad ambiental y salud mental.',
    mission: COMMON_FACULTY_MISSION,
    schedule: COMMON_FACULTY_SCHEDULE,
    authority: {
      name: 'Comisión de Nuevas Carreras',
      title: 'Coordinación Académica General',
      degree: 'Comisión Especial UNSCH',
      bio: 'Encargada de la implementación de mallas curriculares modernas, laboratorios de vanguardia y convenios para las escuelas de reciente creación.',
      photo: '/images/facultades/nuevas_carreras.png',
      schedule: COMMON_FACULTY_SCHEDULE
    },
    timeline: [
      { year: '2026', title: 'Aprobación Histórica', description: 'Incorporación formal de Ingeniería Ambiental, Arquitectura y Psicología.' }
    ],
    schoolDetails: [
      {
        name: 'Ingeniería Ambiental, Arquitectura, Psicología',
        creationYear: '2026',
        creationContext: 'Respuesta académica integral a las necesidades emergentes del país y la región.',
        director: 'Comisiones de Implementación Académica',
        duration: '10 semestres académicos',
        degree: 'Bachiller / Título Profesional: Ingeniero(a) Ambiental / Arquitecto(a) / Psicólogo(a)',
        practiceCenters: ['Talleres de Diseño Arquitectónico', 'Laboratorios Ambientales y Cámara Gesell'],
        description: 'Diseño urbano sostenible, evaluación de impacto ambiental, psicología clínica y comunitaria.'
      }
    ]
  }
};