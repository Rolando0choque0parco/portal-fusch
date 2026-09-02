import { useState, useEffect, useRef } from 'react';
import './Stats.css';

interface StatItem {
  icon: string;
  number: number;
  label: string;
  suffix?: string;
}

interface AnimatedNumberProps {
  target: number;
  suffix?: string;
  duration?: number;
}

const statsData: StatItem[] = [
  { icon: '🏛️', number: 9, label: 'Facultades' },
  { icon: '📚', number: 31, label: 'Escuelas Profesionales' },
  { icon: '🎓', number: 39, label: 'Programas de Estudio' },
  { icon: '👨‍🎓', number: 12000, label: 'Estudiantes', suffix: '+' },
  { icon: '👨‍🏫', number: 800, label: 'Docentes', suffix: '+' },
  { icon: '📜', number: 350, label: 'Años de Historia', suffix: '+' }
];

function Stats() {
  const [isVisible, setIsVisible] = useState(false);
  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (statsRef.current) {
      observer.observe(statsRef.current);
    }

    return () => {
      if (statsRef.current) {
        observer.unobserve(statsRef.current);
      }
    };
  }, []);

  const AnimatedNumber = ({ target, suffix = '', duration = 2000 }: AnimatedNumberProps) => {
    const [count, setCount] = useState(0);
    const [hasAnimated, setHasAnimated] = useState(false);

    useEffect(() => {
      if (isVisible && !hasAnimated) {
        setHasAnimated(true);
        let startTime: number;

        const animate = (timestamp: number) => {
          if (!startTime) startTime = timestamp;
          const progress = Math.min((timestamp - startTime) / duration, 1);
          const current = Math.floor(progress * target);
          setCount(current);

          if (progress < 1) {
            requestAnimationFrame(animate);
          } else {
            setCount(target);
          }
        };

        requestAnimationFrame(animate);
      }
    }, [isVisible, target, duration, hasAnimated]);

    return <span className="animated-number">{count}{suffix}</span>;
  };

  return (
    <div className="stats-section" ref={statsRef}>
      <div className="stats-header">
        <h2>📊 La UNSCH en Números</h2>
        <p>Conoce la magnitud de nuestra universidad</p>
      </div>
      <div className="stats-grid">
        {statsData.map((stat, index) => (
          <div key={index} className="stat-card">
            <div className="stat-icon">{stat.icon}</div>
            <div className="stat-number">
              <AnimatedNumber target={stat.number} suffix={stat.suffix || ''} />
            </div>
            <div className="stat-label">{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Stats;