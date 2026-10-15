import { useState, useEffect, useMemo, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import './Activities.css';

export interface ActivityItem {
  id: number;
  title: string;
  category: 'ayuda' | 'onomastico' | 'especial' | 'gestion' | 'social';
  categoryLabel: string;
  badgeColor: string;
  pinned?: boolean;
  folder: string;
  date: string;
  description: string;
  images: string[];
}

// Publicaciones ordenadas por fecha más reciente (Guiadas exactamente por las carpetas en public/images/)
const ALL_ACTIVITIES: ActivityItem[] = [
  // 1. AYUDAS SOLIDARIAS (PINNED - Sale primero al abrir)
  {
    id: 1,
    title: 'Ayudas Solidarias',
    category: 'ayuda',
    categoryLabel: '🤝 Ayudas Solidarias',
    badgeColor: '#DC2626',
    pinned: true,
    folder: '/images/ayudas_solidarias/',
    date: '15 de Octubre, 2026',
    description: 'Campañas de apoyo social y solidaridad universitaria promovidas por la Federación Universitaria San Cristóbal de Huamanga.',
    images: ['1.jpg', '810319735_1395608699388982_405475586826371766_n.jpg']
  },
  // 2. ONOMÁSTICOS (PINNED - Sale después de ayudas antes que todo)
  {
    id: 2,
    title: 'Onomásticos',
    category: 'onomastico',
    categoryLabel: '🎂 Onomásticos',
    badgeColor: '#D97706',
    pinned: true,
    folder: '/images/onomasticos/',
    date: '15 de Octubre, 2026',
    description: 'Saludos de onomásticos y felicitaciones a los miembros de la comunidad universitaria.',
    images: [
      '841399637_1647768973435010_1674733101720686247_n.jpg',
      '840205500_28377993375156016_1992426705842893074_n.jpg',
      '813837166_1702027207763997_8728016022471972766_n.jpg',
      '794385412_1653904689632424_8775557392711405421_n.jpg'
    ]
  },
  // 3. DÍAS ESPECIALES
  {
    id: 3,
    title: 'Días Especiales',
    category: 'especial',
    categoryLabel: '🎉 Días Especiales',
    badgeColor: '#7C3AED',
    pinned: false,
    folder: '/images/dia_especial/',
    date: '15 de Octubre, 2026',
    description: 'Conmemoraciones, efemérides y fechas especiales de la Universidad Nacional de San Cristóbal de Huamanga.',
    images: [
      '848599266_1127415186532230_5976463160219825948_n.jpg',
      '845120850_1131398069452219_4788479476664823161_n.jpg',
      '844795696_2176411882951229_2503316662392301829_n.jpg',
      '841084044_1600755364288954_1153256168714323550_n.jpg',
      '840206486_1114286211148526_7329106095600845277_n.jpg',
      '835529226_1539555247936830_1639236503458719857_n.jpg',
      '830393377_886753837739530_1018346920388592325_n.jpg',
      '825352789_1638382007633846_5692551207411486617_n.jpg',
      '819484446_1972220706779960_6816045905262048813_n.jpg',
      '814818140_1126033486566100_4098369484521653448_n.jpg',
      '813698111_994943726954267_8845653965029272913_n.jpg'
    ]
  },
  // 4. DEBATE REGIONAL
  {
    id: 4,
    title: 'Debate Regional',
    category: 'gestion',
    categoryLabel: '🏛️ Debate Regional',
    badgeColor: '#2563EB',
    folder: '/images/debate_regional/',
    date: 'Octubre, 2026',
    description: 'Debate regional universitario con participación estudiantil y análisis de propuestas gremiales e institucionales.',
    images: [
      '829783614_1730973715026501_4927957782300185680_n.jpg',
      '829806363_1971669160177628_2286302360925085571_n.jpg',
      '830325439_2075355510038545_1599445567924884715_n.jpg',
      '830459245_1575675077576032_890599218651536649_n.jpg',
      '830966946_1035467659543596_6665911824464550745_n.jpg',
      '831237323_970470842762443_7873005482798340606_n.jpg',
      '831342058_1640779597397643_277016593000185517_n.jpg',
      '831534499_2290245995067116_4614162295842666486_n.jpg',
      '831674771_4510151509223338_4910345958765653251_n.jpg',
      '831762340_4576777682606979_2937657204397609004_n.jpg',
      '831959199_2339241366838284_8688114503097997691_n.jpg',
      '832520917_1131254459433351_4413713027124670349_n.jpg',
      '832527843_1439554434724717_177886606319018809_n.jpg',
      '833764333_2634323627038112_1232885881814488150_n.jpg',
      '833913853_1574264100470831_6193998351053331361_n.jpg',
      '834802137_28425314120471808_8031589105829396354_n.jpg',
      '835511180_2255958785189647_5359715723809306497_n.jpg'
    ]
  },
  // 5. FIESTA DE LA JUVENTUD
  {
    id: 5,
    title: 'Fiesta de la Juventud',
    category: 'especial',
    categoryLabel: '🎉 Fiesta de la Juventud',
    badgeColor: '#EC4899',
    folder: '/images/fiesta_juventud/',
    date: 'Septiembre, 2026',
    description: 'Jornada de integración, confraternidad y recreación estudiantil de la juventud universitaria de la UNSCH.',
    images: [
      '825267872_1954204668579253_5585902651032828679_n.jpg',
      '825268291_1725258715246165_1618715306472488476_n.jpg',
      '825273280_1402121878095340_8881452086895297813_n.jpg',
      '825273429_2021746595263207_4137763467403576684_n.jpg',
      '825278535_1566422184763000_7549055317951464284_n.jpg',
      '825278775_1135186989015496_4512753063654588250_n.jpg',
      '825278784_1055597570645909_9030828714501720814_n.jpg',
      '825279041_914490328186423_847046694678319263_n.jpg',
      '825279229_1062842353227311_4041097632720474643_n.jpg',
      '825279313_4550223471902522_7010823925588269944_n.jpg',
      '825279353_1112133384588271_4384633870400266366_n.jpg',
      '825279651_2232221217509175_6324594851990781934_n.jpg',
      '825292037_998176583306973_7609531778050875951_n.jpg',
      '825292105_1399059628446669_671717546233652440_n.jpg',
      '825329166_1083793601022725_7323901817143109128_n.jpg',
      '825329795_4464125363901693_6923597314819414160_n.jpg',
      '825340236_1786394169343934_4175304627796928685_n.jpg',
      '825340440_4606356416266657_7812873163418300855_n.jpg',
      '825340484_1611204664041386_8846890954205976673_n.jpg',
      '825340765_1130152143212068_3191959529925235736_n.jpg',
      '826967825_1907899667283028_7113794245798787204_n.jpg'
    ]
  },
  // 6. ÁREAS VERDES
  {
    id: 6,
    title: 'Áreas Verdes',
    category: 'social',
    categoryLabel: '🌱 Áreas Verdes',
    badgeColor: '#059669',
    folder: '/images/areas_verdes/',
    date: '10 de Septiembre, 2026',
    description: 'Jornada de arborización, siembra de plantones y recuperación de áreas verdes en la Ciudad Universitaria.',
    images: ['1.jpg', '2.jpg', '3.jpg', '4.jpg', '5.jpg']
  },
  // 7. CINCO ESCUELAS
  {
    id: 7,
    title: 'Cinco Escuelas',
    category: 'gestion',
    categoryLabel: '🏛️ Cinco Escuelas',
    badgeColor: '#2563EB',
    folder: '/images/cinco_escuelas/',
    date: '10 de Septiembre, 2026',
    description: 'Movilización pacífica y mesa de trabajo de las cinco escuelas profesionales de la Facultad de Ciencias Agrarias en el Rectorado.',
    images: ['imagen1.jpg', 'imagen2.jpg', 'imagen3.jpg', 'imagen4.jpg', 'imagen5.jpg', 'imagen6.jpg', 'imagen7.jpg', 'imagen8.jpg', 'imagen9.jpg']
  },
  // 8. VISITA COMEDOR (PECS)
  {
    id: 8,
    title: 'Visita Comedor (PECS)',
    category: 'gestion',
    categoryLabel: '🍽️ Visita Comedor',
    badgeColor: '#DC2626',
    folder: '/images/visita-comedor/',
    date: '7 de Septiembre, 2026',
    description: 'Supervisión y evaluación del predio recuperado PECS para garantizar el servicio de los comensales universitarios.',
    images: ['1.png', '2.png', '3.png', '4.png', '5.png']
  },
  // 9. MINKA
  {
    id: 9,
    title: 'Minka Universitaria',
    category: 'social',
    categoryLabel: '🌿 Minka',
    badgeColor: '#0D9488',
    folder: '/images/minka/',
    date: '6 de Septiembre, 2026',
    description: 'Jornada de limpieza y mejora comunitaria de los espacios y pabellones de la Ciudad Universitaria.',
    images: ['imagen1.jpg', 'imagen2.jpg', 'imagen3.jpg', 'imagen4.jpg', 'imagen5.jpg', 'imagen6.jpg', 'imagen7.jpg', 'imagen8.jpg', 'imagen9.jpg']
  },
  // 10. NUEVA CARRERA PICHARI
  {
    id: 10,
    title: 'Nueva Carrera Pichari',
    category: 'gestion',
    categoryLabel: '🎓 Sede Pichari',
    badgeColor: '#2563EB',
    folder: '/images/nueva_carrera_pichari/',
    date: '4 de Septiembre, 2026',
    description: 'Aprobación e inclusión de la Escuela Profesional de Administración de Empresas para la sede de Pichari.',
    images: ['foto1.jpg', 'foto2.jpg', 'foto3.jpg', 'foto4.jpg']
  },
  // 11. POLIDEPORTIVO PICHARI
  {
    id: 11,
    title: 'Polideportivo Pichari',
    category: 'gestion',
    categoryLabel: '🏗️ Polideportivo Pichari',
    badgeColor: '#D97706',
    folder: '/images/polideportivo_pichari/',
    date: '4 de Septiembre, 2026',
    description: 'Colocación de la primera piedra del polideportivo de la Escuela Profesional de Ingeniería Agroforestal en Pichari.',
    images: ['imagen1.jpg', 'imagen2.jpg', 'imagen3.jpg']
  },
  // 12. SIMULACRO UNSCH
  {
    id: 12,
    title: 'Simulacro UNSCH',
    category: 'gestion',
    categoryLabel: '🏛️ Simulacro UNSCH',
    badgeColor: '#F59E0B',
    folder: '/images/simulacro_unsch/',
    date: 'Agosto, 2026',
    description: 'Participación en el Simulacro Nacional Multipeligro en todos los pabellones de la Universidad Nacional de San Cristóbal de Huamanga.',
    images: [
      '799404705_954775091006085_6853324726728218399_n.jpg',
      '799601764_954775497672711_3019285253327879525_n.jpg',
      '800115104_954775654339362_8892252238892346009_n.jpg',
      '800781041_954775001006094_4417042425469528584_n.jpg',
      '806987381_954775354339392_2975545145177421769_n.jpg',
      '813282286_954775881006006_8013079292609054661_n.jpg',
      '813406727_954775134339414_8724866368444200102_n.jpg',
      '813520334_954775401006054_8206270153992858936_n.jpg',
      '813520341_954775057672755_2467058899493023828_n.jpg',
      '813785776_954775991005995_5007732909929775353_n.jpg',
      '813825505_954775607672700_4516047061142488896_n.jpg',
      '813825524_954775037672757_2101254822720653177_n.jpg',
      '813878291_954775277672733_849216405901522045_n.jpg',
      '813966718_954775064339421_2036499087601372758_n.jpg',
      '814406904_954775274339400_3632467641056910809_n.jpg'
    ]
  },
  // 13. CONSEJO REGIONAL
  {
    id: 13,
    title: 'Consejo Regional',
    category: 'gestion',
    categoryLabel: '🏛️ Consejo Regional',
    badgeColor: '#2563EB',
    folder: '/images/consejo-regional/',
    date: '26 de Agosto, 2026',
    description: 'Reunión del Consejo Regional para presupuesto participativo y representatividad gremial estudiantil.',
    images: ['diseno-41.png', 'diseno-42.png', 'diseno-43.png']
  },
  // 14. MESA DE DIÁLOGO
  {
    id: 14,
    title: 'Mesa de Diálogo',
    category: 'gestion',
    categoryLabel: '📢 Mesa de Diálogo',
    badgeColor: '#2563EB',
    folder: '/images/mesa-dialogo/',
    date: '26 de Agosto, 2026',
    description: 'Espacio de diálogo entre representantes estudiantiles y autoridades para resolver demandas académicas.',
    images: ['sa.png', 'sa1.png', 'sa2.png', 'sa3.png']
  },
  // 15. REUNIÓN GORE
  {
    id: 15,
    title: 'Reunión GORE',
    category: 'gestion',
    categoryLabel: '📜 Reunión GORE',
    badgeColor: '#2563EB',
    folder: '/images/reunion-gore/',
    date: '26 de Agosto, 2026',
    description: 'Reunión con el Gobierno Regional para la firma y seguimiento de convenios interinstitucionales.',
    images: ['fusch.png', 'FUSCH2.png', 'FUSCH3.png', 'FUSCH4.png']
  },
  // 16. VISITA COMEDOR JULIO
  {
    id: 16,
    title: 'Nuevo Comedor Universitario',
    category: 'gestion',
    categoryLabel: '🍽️ Comedor Universitario',
    badgeColor: '#DC2626',
    folder: '/images/visita-comedor-julio/',
    date: '26 de Agosto, 2026',
    description: 'Visita e inspección al comedor universitario para supervisar la calidad de atención y sus instalaciones.',
    images: ['2-1.png', '3-1.png', '4-1.png', '5-1.png', '6-1.png', '7-1.png', '8-1.png', '8-2.png']
  },
  // 17. LABOR SOCIAL
  {
    id: 17,
    title: 'Labor Social',
    category: 'social',
    categoryLabel: '🌿 Labor Social',
    badgeColor: '#0D9488',
    folder: '/images/labor-social/',
    date: '25 de Agosto, 2026',
    description: 'Jornada de labor social y apoyo comunitario en la comunidad de Huascahura.',
    images: ['7.png', '8.png', '9.png', '10.png', '11.png', '12.png', '13.png', '14.png']
  },
  // 18. MESA TÉCNICA
  {
    id: 18,
    title: 'Mesa Técnica',
    category: 'gestion',
    categoryLabel: '🏛️ Mesa Técnica',
    badgeColor: '#2563EB',
    folder: '/images/mesa-tecnica/',
    date: '25 de Agosto, 2026',
    description: 'Reunión técnica de coordinación con el consejo regional para planificación del semestre académico.',
    images: ['1.png', '2.png', '3.png', '4.png', '5.png', '6.png', '7.png', '8.png', '9.png']
  },
  // 19. REUNIÓN GOBIERNO
  {
    id: 19,
    title: 'Reunión Gobierno Regional',
    category: 'gestion',
    categoryLabel: '🤝 Reunión Gobierno',
    badgeColor: '#059669',
    folder: '/images/reunion-gobierno/',
    date: '25 de Agosto, 2026',
    description: 'Reunión con el Gobierno Regional para gestionar mejoras y financiamiento de infraestructura universitaria.',
    images: ['1.png', '2.png', '3.png', '4.png', '5.png', '6.png', '7.png', '8.png', '9.png']
  },
  // 20. ENTREGA DE RESOLUCIÓN
  {
    id: 20,
    title: 'Entrega de Resolución',
    category: 'gestion',
    categoryLabel: '📜 Entrega de Resolución',
    badgeColor: '#2563EB',
    folder: '/images/entrega-resolucion/',
    date: '25 de Agosto, 2026',
    description: 'Entrega oficial de resoluciones gremiales a los representantes de la Federación Universitaria.',
    images: ['resolucion.jpeg']
  }
];

const CATEGORY_FILTERS = [
  { key: 'todos', label: '🌟 Todos los Posts', icon: '🌐' },
  { key: 'ayuda', label: '🤝 Ayudas Solidarias', icon: '❤️' },
  { key: 'onomastico', label: '🎂 Onomásticos', icon: '🎉' },
  { key: 'especial', label: '🎉 Días Especiales', icon: '✨' },
  { key: 'gestion', label: '🏛️ Gestión Universitaria', icon: '🏛️' },
  { key: 'social', label: '🌿 Compromiso Social', icon: '🤝' },
];

function Activities() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCat = searchParams.get('cat') || 'todos';

  const [activeCategory, setActiveCategory] = useState<string>(initialCat);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modos de vista: 'cinema' (90% de pantalla) o 'grid' (mosaico completo)
  const [viewModes, setViewModes] = useState<Record<number, 'cinema' | 'grid'>>({});

  // Estado de reproducción automática tipo diapositivas
  const [playingState, setPlayingState] = useState<Record<number, boolean>>({});

  // Botón flotante Volver Arriba y porcentaje de scroll
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Sincronizar parámetro url si cambia
  useEffect(() => {
    const cat = searchParams.get('cat');
    if (cat && CATEGORY_FILTERS.some((c) => c.key === cat)) {
      setActiveCategory(cat);
    }
  }, [searchParams]);

  // Listener de scroll para el botón flotante y progreso
  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      const current = window.scrollY;
      if (totalScroll > 0) {
        setScrollProgress(Math.min(100, Math.round((current / totalScroll) * 100)));
      }
      setShowScrollTop(current > 450);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Manejo de índices de fotos para cada actividad
  const [currentIndices, setCurrentIndices] = useState<Record<number, number>>(() => {
    const initial: Record<number, number> = {};
    ALL_ACTIVITIES.forEach((act) => {
      initial[act.id] = 0;
    });
    return initial;
  });

  // Slideshow automático para publicaciones en modo reproducción
  useEffect(() => {
    const activePlayIds = Object.keys(playingState).filter((id) => playingState[Number(id)]);
    if (activePlayIds.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndices((prev) => {
        const next = { ...prev };
        activePlayIds.forEach((idStr) => {
          const id = Number(idStr);
          const act = ALL_ACTIVITIES.find((a) => a.id === id);
          if (act && act.images.length > 1) {
            next[id] = ((prev[id] ?? 0) + 1) % act.images.length;
          }
        });
        return next;
      });
    }, 4500);

    return () => clearInterval(interval);
  }, [playingState]);

  // Reacciones "Me gusta" por actividad guardadas de forma persistente y robusta
  const [likes, setLikes] = useState<Record<number, number>>(() => {
    const stored = localStorage.getItem('fusch_activities_likes');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        // Fallback
      }
    }
    const initial: Record<number, number> = {};
    ALL_ACTIVITIES.forEach((act, i) => {
      initial[act.id] = 30 + (i * 9) % 45;
    });
    return initial;
  });

  const [userLiked, setUserLiked] = useState<Record<number, boolean>>(() => {
    const stored = localStorage.getItem('fusch_user_liked_posts');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        // Fallback
      }
    }
    return {};
  });

  // Función de Like interactiva y persistente
  const handleLike = (actId: number) => {
    const wasLiked = !!userLiked[actId];
    const willBeLiked = !wasLiked;
    const countChange = willBeLiked ? 1 : -1;

    setUserLiked((prevUserLiked) => {
      const nextUserLiked = { ...prevUserLiked, [actId]: willBeLiked };
      localStorage.setItem('fusch_user_liked_posts', JSON.stringify(nextUserLiked));
      return nextUserLiked;
    });

    setLikes((prevLikes) => {
      const currentCount = prevLikes[actId] ?? 0;
      const nextCount = Math.max(0, currentCount + countChange);
      const nextLikes = { ...prevLikes, [actId]: nextCount };
      localStorage.setItem('fusch_activities_likes', JSON.stringify(nextLikes));
      return nextLikes;
    });
  };

  const togglePlay = (actId: number) => {
    setPlayingState((prev) => ({
      ...prev,
      [actId]: !prev[actId]
    }));
  };

  const toggleViewMode = (actId: number) => {
    setViewModes((prev) => ({
      ...prev,
      [actId]: prev[actId] === 'grid' ? 'cinema' : 'grid'
    }));
  };

  // Toast flotante
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleShareWhatsApp = (act: ActivityItem) => {
    const text = `📢 *${act.title}*\n${act.description}\n\nConoce más en el Portal Oficial de la FUSCH: https://portal-fusch.edu.pe/activities`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleCopyLink = (act: ActivityItem) => {
    const url = `${window.location.origin}/activities?post=${act.id}`;
    navigator.clipboard.writeText(url).then(() => {
      showToast('¡Enlace copiado al portapapeles! 📋');
    }).catch(() => {
      showToast('Enlace listo para compartir');
    });
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCategoryChange = (key: string) => {
    setActiveCategory(key);
    if (key === 'todos') {
      searchParams.delete('cat');
      setSearchParams(searchParams);
    } else {
      setSearchParams({ cat: key });
    }
  };

  // Filtrado de actividades: Ayudas y Onomásticos siempre primero si están fijados
  const filteredActivities = useMemo(() => {
    return ALL_ACTIVITIES.filter((act) => {
      const matchesCategory = activeCategory === 'todos' || act.category === activeCategory;
      const matchesSearch =
        searchTerm.trim() === '' ||
        act.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        act.description.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchTerm]);

  // Manejador táctil para deslizar fotos en celular
  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = (actId: number, imagesLength: number) => {
    const diff = touchStartX.current - touchEndX.current;
    if (Math.abs(diff) > 40) {
      if (diff > 0) {
        // swipe izquierda -> siguiente
        setCurrentIndices((prev) => ({
          ...prev,
          [actId]: ((prev[actId] ?? 0) + 1) % imagesLength
        }));
      } else {
        // swipe derecha -> anterior
        setCurrentIndices((prev) => ({
          ...prev,
          [actId]: ((prev[actId] ?? 0) - 1 + imagesLength) % imagesLength
        }));
      }
    }
  };

  return (
    <div className="activities-feed-wrapper">
      {/* Toast flotante */}
      {toastMessage && <div className="activity-toast">{toastMessage}</div>}

      {/* CINTA DE COMUNICADOS URGENTES EN VIVO (LIVE TICKER INSTITUCIONAL) */}
      <div className="activities-live-ticker" role="region" aria-label="Noticias y comunicados en tiempo real">
        <span className="ticker-badge">🔴 COMUNICADOS EN VIVO</span>
        <div className="ticker-track">
          <span className="ticker-item">
            🤝 <strong>Ayudas Solidarias:</strong> Campaña activa en favor de nuestra compañera estudiante • Tu colaboración salva vidas.
          </span>
          <span className="ticker-sep">•</span>
          <span className="ticker-item">
            🎂 <strong>Onomásticos:</strong> Saludo fraternal a todos los cumpleañeros de nuestra comunidad universitaria.
          </span>
          <span className="ticker-sep">•</span>
          <span className="ticker-item">
            🏛️ <strong>Evidencias Disponibles:</strong> Nuevo álbum de fotos del Debate Regional y Simulacro UNSCH en alta resolución.
          </span>
        </div>
      </div>

      {/* Hero Header del Feed */}
      <div className="activities-feed-hero">
        <div className="feed-hero-badge">
          <span className="pulsing-live-dot" />
          <span>Portal de Evidencias • Federación Universitaria (FUSCH)</span>
        </div>
        <h1 className="feed-hero-title">Galería de Impacto & Actividades</h1>
        <p className="feed-hero-subtitle">
          Visualizador inmersivo a gran escala (90% de pantalla). Fotografías en alta definición,
          diapositivas automáticas y evidencias de la gestión gremial universitaria.
        </p>

        {/* Barra de Filtros y Búsqueda Interactiva */}
        <div className="feed-controls-container">
          <div className="feed-search-box">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Buscar por título o palabra clave (ej. debate, pichari, simulacro, ayudas)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="feed-search-input"
            />
            {searchTerm && (
              <button
                type="button"
                className="clear-search-btn"
                onClick={() => setSearchTerm('')}
              >
                ✕
              </button>
            )}
          </div>

          <div className="feed-category-pills" role="tablist">
            {CATEGORY_FILTERS.map((cat) => (
              <button
                key={cat.key}
                type="button"
                role="tab"
                aria-selected={activeCategory === cat.key}
                className={`feed-pill-btn ${activeCategory === cat.key ? 'active' : ''}`}
                onClick={() => handleCategoryChange(cat.key)}
              >
                <span>{cat.label}</span>
                {cat.key === 'ayuda' && <span className="pill-urgent-dot" title="Campaña activa" />}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Lista de Publicaciones Estilo Red Social */}
      <div className="feed-posts-container">
        {filteredActivities.length === 0 ? (
          <div className="feed-empty-state">
            <span className="empty-icon">📭</span>
            <h3>No se encontraron publicaciones</h3>
            <p>Intenta con otra palabra clave o selecciona otra categoría.</p>
            <button
              type="button"
              className="reset-filter-btn"
              onClick={() => {
                setActiveCategory('todos');
                setSearchTerm('');
              }}
            >
              Ver todas las publicaciones
            </button>
          </div>
        ) : (
          filteredActivities.map((activity) => {
            const currentIndex = currentIndices[activity.id] ?? 0;
            const currentImgFile = activity.images[currentIndex] || activity.images[0];
            const fullImgPath = `${activity.folder}${currentImgFile}`;
            const isLiked = !!userLiked[activity.id];
            const likeCount = likes[activity.id] || 0;
            const isGrid = viewModes[activity.id] === 'grid';
            const isAutoPlaying = !!playingState[activity.id];

            return (
              <article
                key={activity.id}
                id={`post-${activity.id}`}
                className={`social-post-card ${activity.pinned ? 'post-is-pinned' : ''}`}
              >
                {/* Cabecera estilo Post de Red Social */}
                <div className="post-header">
                  <div className="post-author-box">
                    <div className="post-avatar-wrapper">
                      <img
                        src="/images/NUEVO LOGO.png"
                        alt="Logo FUSCH"
                        className="post-avatar-img"
                      />
                    </div>
                    <div className="post-meta">
                      <div className="author-title-row">
                        <h4 className="author-name">Federación Universitaria (FUSCH)</h4>
                        <span className="verified-badge" title="Cuenta Institucional Oficial">✓</span>
                        {activity.pinned && (
                          <span className="pinned-badge">📌 Publicación Fijada</span>
                        )}
                      </div>
                      <div className="author-sub-row">
                        <span className="post-date">{activity.date}</span>
                        <span className="post-dot-separator">•</span>
                        <span
                          className="post-category-tag"
                          style={{
                            backgroundColor: `${activity.badgeColor}1A`,
                            color: activity.badgeColor,
                            borderColor: `${activity.badgeColor}4D`
                          }}
                        >
                          {activity.categoryLabel}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="post-header-actions">
                    {/* Switch de Modo Cuadrícula vs Modo Cine 90% */}
                    {activity.images.length > 1 && (
                      <button
                        type="button"
                        className={`view-mode-toggle-btn ${isGrid ? 'grid-active' : ''}`}
                        onClick={() => toggleViewMode(activity.id)}
                        title={isGrid ? 'Cambiar a modo cine 90%' : 'Ver cuadrícula de todas las fotos'}
                      >
                        {isGrid ? '🎬 Modo Cine 90%' : `🖼️ Mosaico (${activity.images.length} fotos)`}
                      </button>
                    )}

                    <button
                      type="button"
                      className="header-share-btn"
                      onClick={() => handleShareWhatsApp(activity)}
                      title="Compartir directo a WhatsApp"
                    >
                      <span className="share-icon">📲</span>
                      <span className="share-label">Compartir</span>
                    </button>
                  </div>
                </div>

                {/* Contenido textual del Post */}
                <div className="post-text-body">
                  <h2 className="post-title">{activity.title}</h2>
                  <p className="post-description">{activity.description}</p>
                </div>

                {/* =========================================================
                    MODO CINE (90% DE PANTALLA) O MODO CUADRÍCULA
                    ========================================================= */}
                {isGrid ? (
                  /* MODO CUADRÍCULA / MOSAICO DE FOTOS ESTILO PINTEREST / INSTAGRAM */
                  <div className="post-grid-gallery">
                    {activity.images.map((imgName, gIdx) => {
                      const gPath = `${activity.folder}${imgName}`;
                      return (
                        <div
                          key={gIdx}
                          className="grid-photo-card"
                          onClick={() => setLightboxImage(gPath)}
                          title="Haz clic para ver pantalla completa"
                        >
                          <img
                            src={gPath}
                            alt={`${activity.title} - Foto ${gIdx + 1}`}
                            className="grid-photo-img"
                            loading="lazy"
                          />
                          <div className="grid-photo-overlay">
                            <span>🔍 Ver foto {gIdx + 1}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  /* VISUALIZADOR INMERSIVO: IMAGEN QUE OCUPA EL 90% DE LA PANTALLA */
                  <div
                    className="post-media-screen"
                    onTouchStart={handleTouchStart}
                    onTouchMove={(e) => {
                      touchEndX.current = e.targetTouches[0].clientX;
                    }}
                    onTouchEnd={() => handleTouchEnd(activity.id, activity.images.length)}
                  >
                    {/* Capa de fondo desenfocado cinematográfico de la misma foto */}
                    <div
                      className="media-backdrop-blur"
                      style={{ backgroundImage: `url(${fullImgPath})` }}
                    />

                    {/* Foto Principal Nítida en Alta Resolución */}
                    <div
                      className="media-image-frame"
                      onClick={() => setLightboxImage(fullImgPath)}
                      title="Haz clic para abrir pantalla completa"
                    >
                      <img
                        src={fullImgPath}
                        alt={`${activity.title} - Foto ${currentIndex + 1}`}
                        className="media-main-img"
                        loading="lazy"
                      />
                    </div>

                    {/* Barra Superior Flotante de Herramientas Ergonómicas */}
                    <div className="media-controls-top" onClick={(e) => e.stopPropagation()}>
                      <div className="media-counter-badge">
                        📸 {currentIndex + 1} / {activity.images.length} fotos
                      </div>

                      <div className="media-top-tools">
                        {/* Botón Reproducción Automática */}
                        {activity.images.length > 1 && (
                          <button
                            type="button"
                            className={`media-tool-btn play-btn ${isAutoPlaying ? 'active-play' : ''}`}
                            onClick={() => togglePlay(activity.id)}
                            title={isAutoPlaying ? 'Pausar reproducción' : 'Iniciar diapositivas automáticas'}
                          >
                            <span>{isAutoPlaying ? '⏸️ Pausar' : '▶️ Diapositivas'}</span>
                          </button>
                        )}

                        {/* Botón Descargar Foto HD */}
                        <a
                          href={fullImgPath}
                          download={`${activity.title.replace(/\s+/g, '_')}_foto_${currentIndex + 1}.jpg`}
                          className="media-tool-btn download-btn"
                          title="Descargar foto original en alta resolución"
                          target="_blank"
                          rel="noreferrer"
                        >
                          <span>⬇️ Descargar HD</span>
                        </a>

                        {/* Botón Pantalla Completa */}
                        <button
                          type="button"
                          className="media-tool-btn fullscreen-btn"
                          onClick={() => setLightboxImage(fullImgPath)}
                          title="Ampliar a pantalla completa"
                        >
                          <span>⛶ Pantalla completa</span>
                        </button>
                      </div>
                    </div>

                    {/* Flechas ergonómicas de navegación si hay más de 1 imagen */}
                    {activity.images.length > 1 && (
                      <>
                        <button
                          type="button"
                          className="media-nav-arrow arrow-left"
                          onClick={(e) => {
                            e.stopPropagation();
                            const prevIndex =
                              (currentIndex - 1 + activity.images.length) % activity.images.length;
                            setCurrentIndices((prev) => ({ ...prev, [activity.id]: prevIndex }));
                          }}
                          aria-label="Foto anterior"
                        >
                          ‹
                        </button>
                        <button
                          type="button"
                          className="media-nav-arrow arrow-right"
                          onClick={(e) => {
                            e.stopPropagation();
                            const nextIndex = (currentIndex + 1) % activity.images.length;
                            setCurrentIndices((prev) => ({ ...prev, [activity.id]: nextIndex }));
                          }}
                          aria-label="Siguiente foto"
                        >
                          ›
                        </button>
                      </>
                    )}

                    {/* Barra de progreso de diapositiva activa si está en reproducción */}
                    {isAutoPlaying && <div className="media-progress-bar-animated" />}
                  </div>
                )}

                {/* Tira interactiva de miniaturas (Photo Strip) si tiene más de 1 foto y está en modo cine */}
                {!isGrid && activity.images.length > 1 && (
                  <div className="post-thumbnails-strip">
                    {activity.images.map((imgName, thumbIdx) => {
                      const thumbPath = `${activity.folder}${imgName}`;
                      return (
                        <button
                          key={thumbIdx}
                          type="button"
                          className={`post-thumb-btn ${thumbIdx === currentIndex ? 'active' : ''}`}
                          onClick={() =>
                            setCurrentIndices((prev) => ({ ...prev, [activity.id]: thumbIdx }))
                          }
                          aria-label={`Ver foto ${thumbIdx + 1}`}
                        >
                          <img
                            src={thumbPath}
                            alt={`Miniatura ${thumbIdx + 1}`}
                            className="post-thumb-img"
                            loading="lazy"
                          />
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* Barra de interacción social inferior */}
                <div className="post-actions-bar">
                  <div className="left-interactions">
                    <button
                      type="button"
                      className={`social-action-btn like-btn ${isLiked ? 'liked' : ''}`}
                      onClick={() => handleLike(activity.id)}
                      aria-pressed={isLiked}
                      title={isLiked ? 'Ya no me gusta' : 'Me gusta'}
                    >
                      <span className="action-icon">{isLiked ? '❤️' : '🤍'}</span>
                      <span className="action-text">{isLiked ? 'Te gusta' : 'Me gusta'}</span>
                      <span className="action-counter">{likeCount}</span>
                    </button>

                    <button
                      type="button"
                      className="social-action-btn whatsapp-action"
                      onClick={() => handleShareWhatsApp(activity)}
                    >
                      <span className="action-icon">💬</span>
                      <span className="action-text">WhatsApp</span>
                    </button>
                  </div>

                  <div className="right-interactions">
                    <button
                      type="button"
                      className="social-action-btn copy-btn"
                      onClick={() => handleCopyLink(activity)}
                      title="Copiar enlace de esta publicación"
                    >
                      <span className="action-icon">🔗</span>
                      <span className="action-text">Copiar enlace</span>
                    </button>
                  </div>
                </div>
              </article>
            );
          })
        )}
      </div>

      {/* BOTÓN FLOTANTE PARA VOLVER ARRIBA CON INDICADOR DE PROGRESO */}
      {showScrollTop && (
        <button
          type="button"
          className="scroll-top-fab"
          onClick={scrollToTop}
          title={`Volver arriba (${scrollProgress}%)`}
          aria-label="Volver arriba"
        >
          <span className="scroll-arrow">↑</span>
          <span className="scroll-label">{scrollProgress}%</span>
        </button>
      )}

      {/* MODAL LIGHTBOX A PANTALLA COMPLETA AL HACER CLIC */}
      {lightboxImage && (
        <div
          className="lightbox-overlay"
          onClick={() => setLightboxImage(null)}
          role="dialog"
          aria-modal="true"
        >
          <button
            type="button"
            className="lightbox-close-btn"
            onClick={() => setLightboxImage(null)}
            title="Cerrar (Esc)"
          >
            ✕ Cerrar
          </button>
          <img
            src={lightboxImage}
            alt="Fotografía en alta definición"
            className="lightbox-image"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}

export default Activities;