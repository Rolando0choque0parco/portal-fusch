import { useState } from 'react';
import './Hero.css';

// 📸 Cada frase tiene una foto de fondo (con los nombres renombrados sin espacios)
const slides = [
  {
    image: '/images/reunion-gore/fusch.png',
    title: 'Reuniones con Autoridades',
    subtitle: 'Gestionando mejores condiciones para la FUSCH.',
  },
  {
    image: '/images/labor-social/8.png',
    title: 'Labor Social',
    subtitle: 'Siempre cerca de las comunidades y estudiantes.',
  },
  {
    image: '/images/visita-comedor/diseno-sin-titulo-44.png',
    title: 'Control y Transparencia',
    subtitle: 'Supervisando los servicios estudiantiles.',
  },
  {
    image: '/images/visita-pescas/diseno-sin-titulo-49.png',
    title: 'Visita al nuevo comedor universitario',
    subtitle: 'Escuchando las necesidades de los estudiantes.',
  },
  {
    image: '/images/mesa-dialogo/sa.png',
    title: 'Mesa de Diálogo',
    subtitle: 'Construyendo acuerdos con transparencia.',
  }
];

function Hero() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const goToPrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + slides.length) % slides.length);
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
  };

  // 🔥 ESTA LÍNEA VA DENTRO DE LA FUNCIÓN, ANTES DEL RETURN:
  console.log('Ruta de la imagen:', slides[currentIndex].image);

  return (
    <div className="hero-container">
      <div 
        className="hero-slide"
        style={{ 
          backgroundImage: `url(${slides[currentIndex].image})`,
          backgroundPosition: 'center',
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <div className="hero-overlay">
          <button className="hero-arrow hero-arrow-left" onClick={goToPrev}>‹</button>
          <div className="hero-content">
            <h1>{slides[currentIndex].title}</h1>
            <p>{slides[currentIndex].subtitle}</p>
          </div>
          <button className="hero-arrow hero-arrow-right" onClick={goToNext}>›</button>
        </div>
      </div>
      <div className="hero-dots">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`hero-dot ${index === currentIndex ? 'active' : ''}`}
            onClick={() => goToSlide(index)}
          />
        ))}
      </div>
    </div>
  );
}

export default Hero;