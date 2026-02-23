'use client';
import Navbar from '@/components/Navbar';
import CountdownTimer from '@/components/CountdownTimer';
import AnimatedCounter from '@/components/AnimatedCounter';
import Footer from '@/components/Footer';
import Link from 'next/link';
import Image from 'next/image';
import React, { useState } from 'react';

// ... (skip lines 9-145 in instruction)
/* ── DATA ── */

const FEATURES = [
  {
    icon: '',
    color: 'blue',
    title: 'Matchmaking Inteligente',
    description:
      'Nuestro sistema analiza lo que ofreces y lo que buscas para sugerirte los contactos más relevantes automáticamente.',
  },
  {
    icon: '',
    color: 'teal',
    title: 'QR Networking',
    description:
      'Escanea el QR de cualquier asistente y guárdalo en tu lista de contactos al instante. Sin tarjetas de papel.',
  },
  {
    icon: '',
    color: 'sky',
    title: 'Directorio Empresarial',
    description:
      'Explora las empresas participantes, filtra por municipio o sector y encuentra tu próximo socio comercial.',
  },
  {
    icon: '',
    color: 'blue',
    title: 'Dashboard en Tiempo Real',
    description:
      'Visualiza tus leads capturados, da seguimiento y califica tus contactos desde una sola pantalla.',
  },
  {
    icon: '',
    color: 'green',
    title: '20 Municipios Conectados',
    description:
      'Empresas y talento de toda la región reunidos en Tepatitlán para impulsar negocios locales.',
  },
  {
    icon: '',
    color: 'teal',
    title: 'Datos Protegidos',
    description:
      'Tu información de contacto solo es visible para personas con quienes te conectas. Privacidad garantizada.',
  },
];

const HEADLINERS = [
  {
    name: 'Jessica Fernández',
    role: 'Conferencista Estelar',
    topic: 'Enfoque: El Síndrome del Impostor.',
    description: 'Aprende a vencer las barreras que limitan tu potencial. Jessica comparte estrategias clave para superar el síndrome del impostor, impulsando un liderazgo auténtico y valiente desde el poder femenino.',
    image: '/jesduo.png',
    accentColor: '#ec4899', // A modern Pink/Rose from Tailwind
  },
  {
    name: 'Farid Dieck',
    role: 'Conferencista Estelar',
    topic: 'Enfoque: Construyendo un Sentido.',
    description: 'Referente nacional en psicología y emprendimiento con significado. Aporta las herramientas necesarias para encontrar el "porqué" detrás de cada proyecto, transformando la motivación en resultados tangibles con valor humano.',
    image: '/faridduo.png',
  },
];

const REGIONAL_SPEAKERS = Array(5).fill({
  name: 'Buscando Talento',
  role: 'Talento Regional',
  topic: 'Próximamente estaremos anunciando a los expertos locales.',
  description: 'Un espacio dedicado a los líderes de Los Altos de Jalisco que están innovando en sus industrias.',
  image: '/images/speaker-placeholder.png', // Or use a generic placeholder like an empty silhouette
});

const OFFICIAL_SPONSORS = [
  { name: 'Grupo El Alteño', filled: true, image: '/grupoalteño.png' },
  { name: 'Sisay', filled: true, image: '/sisay.png' },
  { name: 'Disponible', filled: false },
  { name: 'Disponible', filled: false },
  { name: 'Disponible', filled: false },
];

const EXPO_STANDS = [
  {
    name: 'Stand Básico',
    price: '$2,900',
    features: ['Espacio estándar 3×3m', 'Mesa, 2 sillas, eléctrico', 'Señalización', 'QR empresarial'],
    popular: false
  },
  {
    name: 'Stand Regional Plus',
    price: '$4,500',
    features: ['Espacio premium 4×4m', 'Mobiliario completo', 'Directorio destacado', 'Matchmaking prioritario'],
    popular: true
  }
];

const SPONSORS = [
  { label: 'Patrocinador Oro' },
  { label: 'Patrocinador Oro' },
  { label: 'Patrocinador Plata' },
  { label: 'Patrocinador Plata' },
];

const STRATEGIC_ALLIANCES = [
  'COPARMEX Los Altos',
  'Cámara de Comercio',
  'Gobierno Municipal',
  'Promoción Económica',
  'CANACO',
  'CANACINTRA',
  'Cluster Tecnológico',
  'Desarrollo Regional',
  'Secretaría de Economía',
  'Red Empresarial Altos',
];

const UNIVERSITY_ALLIANCES = [
  'Universidad de Guadalajara (CUAltos)',
  'ITESO',
  'Tec de Monterrey',
  'UNIVA',
  'Universidad Autónoma',
  'UTEG',
  'UVM',
  'Instituto Tecnológico',
  'Universidad del Valle',
  'Centro Universitario',
];

const CONECTA_ALLIANCES = [
  'Gobierno de Tepatitlán',
  'Promoción Económica de Tepatitlán',
  'Cámara de Comercio de Tepa',
  'COPARMEX Tepatitlán',
];

/* ── PAGE ── */

export default function HomePage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
  const [modalDay, setModalDay] = useState(1);
  const [leadInfo, setLeadInfo] = useState({ name: '', company: '', phone: '', interest: 'Stand Básico' });

  const openModal = (day) => {
    setModalDay(day);
    setIsModalOpen(true);
  };

  const openLeadModal = (interest = 'Stand Básico') => {
    setLeadInfo(prev => ({ ...prev, interest }));
    setIsLeadModalOpen(true);
  };

  const handleLeadSubmit = (e) => {
    e.preventDefault();
    const message = `Hola! Me interesa reservar un espacio en CONECTA 2026.
Nombre: ${leadInfo.name}
Empresa: ${leadInfo.company}
Teléfono: ${leadInfo.phone}
Interés: ${leadInfo.interest}`;
    window.open(`https://wa.me/523781002683?text=${encodeURIComponent(message)}`, '_blank');
    setIsLeadModalOpen(false);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <Navbar />

      {/* ══════════ HERO ══════════ */}
      <section className="hero">
        <div className="hero-bg">
          <Image src="/tepafondo.webp" alt="Fondo Tepatitlán CONECTA" fill style={{ objectFit: 'cover' }} quality={75} />
        </div>

        <div className="container">
          <div className="hero-grid">
            <div className="hero-content" style={{ marginTop: '2rem' }}>
              <div className="hero-eyebrow">
                <span className="dot"></span>
                <span>18 — 19 Abril 2026 &middot; Centro de Convenciones Olimpo</span>
              </div>

              <h1 className="hero-title">
                El poder de la región <span className="highlight">se conecta</span> aquí
              </h1>

              <p className="hero-description">
                Aprende, inspírate y conecta con quienes transforman el ecosistema empresarial. Dos días en Tepatitlán de Morelos para descubrir nuevas ideas. ¡Es para todos!
              </p>

              <div className="hero-actions">
                <Link href="/registro" className="btn btn-primary btn-lg">
                  Registrarme Ahora
                  <svg className="btn-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Link>
                <Link href="/#schedule" className="btn btn-outline btn-lg">
                  Ver Programa
                </Link>
              </div>

              <CountdownTimer targetDate="2026-04-18T09:00:00-06:00" />

              <div className="hero-metrics">
                <div style={{ textAlign: 'center' }}>
                  <div className="hero-metric-value"><AnimatedCounter end={"2,500"} duration={2000} suffix="+" /></div>
                  <div className="hero-metric-label">Asistentes<br />Esperados</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div className="hero-metric-value"><AnimatedCounter end={500} duration={2000} suffix="+" /></div>
                  <div className="hero-metric-label">Empresarios<br />Conectados</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div className="hero-metric-value"><AnimatedCounter end={20} duration={2000} suffix="+" /></div>
                  <div className="hero-metric-label">Municipios<br />Participantes</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div className="hero-metric-value"><AnimatedCounter end={15} duration={1500} suffix="+" /></div>
                  <div className="hero-metric-label">Conferencias<br />Magistrales</div>
                </div>
              </div>
            </div>

            {/* Right Side Image (Farid) */}
            <div className="hero-image-wrapper">
              <div className="hero-image-glow"></div>
              <Image
                src="/farid.png"
                alt="Farid Dieck en CONECTA"
                className="hero-person-img"
                width={500}
                height={600}
                style={{ objectFit: 'contain' }}
              />
              <div className="hero-person-label">
                <span className="hero-person-name">Farid Dieck</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════ OFFICIAL SPONSORS ══════════ */}
      <section className="section" style={{ paddingBottom: 0 }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 'var(--space-2xl)' }}>
            <div className="section-label" style={{ justifyContent: 'center' }}>Aliados Principales</div>
            <h2 className="section-title center">
              Patrocinadores <span className="highlight">Oficiales</span>
            </h2>
          </div>
          <div className="sponsors-row" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
            {OFFICIAL_SPONSORS.map((s, i) => {
              const content = s.image ? (
                <Image src={s.image} alt={s.name} width={200} height={60} style={{ maxWidth: '80%', maxHeight: '60px', objectFit: 'contain' }} />
              ) : (
                s.filled ? s.name : "Sé Patrocinador Oficial"
              );

              const boxStyles = {
                flex: '1 1 180px',
                maxWidth: '220px',
                minHeight: '100px',
                background: s.filled ? 'var(--bg-glass)' : 'rgba(255,255,255,0.02)',
                border: s.filled ? '1px solid var(--border-color)' : '1px dashed var(--border-color)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: s.filled ? '600' : '400',
                color: s.filled ? 'var(--text-primary)' : 'var(--text-tertiary)',
                textDecoration: 'none',
                transition: 'all 0.3s ease',
                cursor: s.filled ? 'default' : 'pointer'
              };

              return s.filled ? (
                <div key={i} className="sponsor-slot" style={boxStyles}>
                  {content}
                </div>
              ) : (
                <a
                  key={i}
                  href="https://wa.me/523781002683?text=Hola,%20me%20gustar%C3%ADa%20ser%20patrocinador%20oficial%20de%20CONECTA%202026."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="sponsor-slot sponsor-slot-available"
                  style={{ ...boxStyles, textAlign: 'center', padding: '1rem' }}
                >
                  {content}
                </a>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══════════ CONECTA ALLIANCES ══════════ */}
      <section className="section" style={{ paddingTop: 'var(--space-lg)', paddingBottom: 'var(--space-2xl)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 'var(--space-xl)' }}>
            <h2 className="section-title center">
              Alianzas <span className="highlight">Conecta</span>
            </h2>
          </div>
          <div className="alliance-grid alliance-grid-4">
            {CONECTA_ALLIANCES.map((name, i) => (
              <div key={i} className="alliance-slot alliance-slot-org">
                <div className="alliance-slot-initials">
                  {name.split(' ').map(w => w[0]).join('').slice(0, 2)}
                </div>
                <div className="alliance-slot-name">{name}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════ SCHEDULE: DAY 1 / DAY 2 ══════════ */}
      <section className="section" id="schedule">
        <div className="container">
          <div style={{ textAlign: 'center' }}>
            <div className="section-label" style={{ justifyContent: 'center' }}>Programa de Actividades</div>
            <h2 className="section-title center">
              Dos días de <span className="highlight">inspiración y crecimiento</span>
            </h2>
            <p className="section-subtitle center">
              Aprende de expertos, haz conexiones valiosas y descubre nuevas oportunidades para tu negocio o carrera profesional.
            </p>
          </div>

          <div className="schedule-grid">
            {/* DAY 1 */}
            <div className="glass-card day-card stagger-item">
              <div className="day-badge free">Acceso Gratuito</div>
              <div className="day-header">
                <div className="day-number">Día 1</div>
                <div className="day-date">18 de Abril, 2026</div>
              </div>
              <h3 className="day-title">Actividades del Día Uno</h3>
              <p className="day-description">
                Contactos estratégicos y aprendizaje práctico. Disfruta la expo comercial, el networking de oportunidades y la <strong>Feria de Empleo y Oportunidades Estudiantiles</strong>.
              </p>
              <ul className="day-features" style={{ marginBottom: '1rem' }}>
                <li><span className="check">&#10003;</span> <strong>Expo Empresarial:</strong> 50+ marcas líderes locales.</li>
                <li><span className="check">&#10003;</span> <strong>Ponencias Regionales:</strong> Estrategias de quienes mueven Los Altos.</li>
                <li><span className="check">&#10003;</span> <strong>Feria de Empleo:</strong> Conecta talento con vacantes clave.</li>
                <li><span className="check">&#10003;</span> <strong>Networking Pro:</strong> Acceso a la mayor base de negocios de la zona.</li>
                <li><span className="check">&#10003;</span> <strong>Invitado Sorpresa:</strong> Para una apertura impactante.</li>
              </ul>

              <h4 style={{ fontSize: '1rem', color: 'var(--text-secondary)', marginBottom: '0.5rem', fontWeight: '600' }}>Cursos y Talleres Incluidos:</h4>
              <ul className="day-features">
                <li><span className="check" style={{ color: 'var(--neon-green)' }}>&#10003;</span> <strong>Neuromarketing:</strong> Véndele a la mente.</li>
                <li><span className="check" style={{ color: 'var(--neon-green)' }}>&#10003;</span> <strong>IA en Ventas:</strong> Automatiza tus cierres.</li>
                <li><span className="check" style={{ color: 'var(--neon-green)' }}>&#10003;</span> <strong>Branding:</strong> Destaca en el mercado.</li>
              </ul>
              <div style={{ display: 'flex', gap: '1rem', marginTop: 'auto', flexWrap: 'wrap' }}>
                <Link href="/registro" className="btn btn-outline" style={{ flex: 1 }}>
                  Regístrate Gratis
                </Link>
                <button onClick={() => openModal(1)} className="btn btn-secondary" style={{ flex: 1 }}>
                  Ver Actividades
                </button>
              </div>
            </div>

            {/* DAY 2 */}
            <div className="glass-card day-card day-card-featured stagger-item">
              <div className="day-badge premium">Boleto Requerido</div>
              <div className="day-header">
                <div className="day-number">Día 2</div>
                <div className="day-date">19 de Abril, 2026</div>
              </div>
              <h3 className="day-title">Actividades del Día 2: Gran Cierre</h3>
              <p className="day-description">
                Inspiración en voz de los líderes de opinión más influyentes de México. Llévate herramientas innovadoras para tu vida y negocios.
              </p>
              <ul className="day-features">
                <li><span className="check">&#10003;</span> <strong>Conferencias Magistrales:</strong> Líderes de opinión nacionales.</li>
                <li><span className="check">&#10003;</span> <strong>Ponencias Regionales:</strong> Expertos con alto impacto local.</li>
                <li><span className="check">&#10003;</span> <strong>Expo Empresarial:</strong> Última oportunidad de cierres comerciales.</li>
                <li><span className="check">&#10003;</span> <strong>Networking Final:</strong> Consolida tu nueva red de contactos.</li>
                <li><span className="check">&#10003;</span> <strong>Barra Libre:</strong> Brindis de clausura por nuevos negocios.</li>
              </ul>
              <div style={{ display: 'flex', gap: '1rem', marginTop: 'auto', flexWrap: 'wrap' }}>
                <a href="https://www.masentrada.app/events/conecta-2026?referred_by=31b3f378-7a92-4b16-87ad-92fa7b1397ac" target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{ flex: 1 }}>
                  Comprar boleto Día 2
                  <svg className="btn-icon" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" /></svg>
                </a>
                <button onClick={() => openModal(2)} className="btn btn-secondary" style={{ flex: 1 }}>
                  Ver Actividades
                </button>
              </div>
            </div>
          </div>
        </div>
      </section >

      {/* ══════════ VENUE BANNER ══════════ */}
      <section className="section" style={{ padding: 0, position: 'relative' }}>
        <div style={{
          position: 'relative',
          width: '100%',
          height: '400px',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          {/* Background Image (Venue) */}
          <Image
            src="/venue.jpg"
            alt="Centro de Convenciones Olimpo"
            fill
            style={{ objectFit: 'cover', zIndex: 0 }}
            quality={85}
          />

          {/* Dark Overlay for Text Readability */}
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to top, rgba(6, 11, 24, 0.95) 0%, rgba(6, 11, 24, 0.6) 100%)',
            zIndex: 1
          }}></div>

          <div className="container" style={{ position: 'relative', zIndex: 2, textAlign: 'center' }}>
            <div className="section-label" style={{ justifyContent: 'center', marginBottom: 'var(--space-sm)', color: 'white' }}>La Sede</div>
            <h2 className="section-title center" style={{ color: 'white', marginBottom: 'var(--space-sm)', fontSize: '2.5rem' }}>
              Centro de Convenciones <span className="highlight">Olimpo</span>
            </h2>
            <p className="section-subtitle center" style={{ color: 'rgba(255, 255, 255, 0.8)', maxWidth: '600px', margin: '0 auto' }}>
              El recinto ideal para albergar el encuentro de Smart Networking más importante de la región. Instalaciones de primer nivel en Tepatitlán de Morelos.
            </p>
          </div>
        </div>
      </section>

      {/* ══════════ HEADLINERS ══════════ */}
      <section className="section" id="speakers" style={{ background: 'var(--bg-secondary)' }}>
        <div className="container">
          <div style={{ textAlign: 'center' }}>
            <div className="section-label" style={{ justifyContent: 'center' }}>19 de Abril</div>
            <h2 className="section-title center">
              Conferencistas <span className="highlight">Estelares</span>
            </h2>
            <p className="section-subtitle center">
              Conferencias magistrales con los líderes que están transformando los negocios en México.
            </p>
          </div>

          <div className="speakers-grid">
            {HEADLINERS.map((speaker, i) => (
              <div
                key={i}
                className="speaker-card stagger-item"
                style={speaker.accentColor ? {
                  '--speaker-accent': speaker.accentColor,
                  '--speaker-gradient': `linear-gradient(90deg, ${speaker.accentColor}, ${speaker.accentColor})`,
                  '--speaker-shadow': `0 20px 60px ${speaker.accentColor}25`,
                  '--speaker-glow': `conic-gradient(from 0deg, transparent, ${speaker.accentColor}40, transparent, ${speaker.accentColor}40, transparent)`,
                  '--speaker-role-color': speaker.accentColor,
                } : {}}
              >
                <div className="speaker-photo-wrap">
                  <Image src={speaker.image} alt={speaker.name} className="speaker-photo" width={400} height={400} />
                  <div className="speaker-photo-glow" />
                </div>
                <div className="speaker-info">
                  <div className="speaker-role" style={speaker.accentColor ? { background: `${speaker.accentColor}10`, padding: '4px 12px', borderRadius: 'var(--radius-pill)', display: 'inline-block', border: `1px solid ${speaker.accentColor}30` } : { padding: '4px 0' }}>{speaker.role}</div>
                  <h3 className="speaker-name" style={{ marginTop: '0.5rem' }}>{speaker.name}</h3>
                  <p className="speaker-topic" style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.4rem', fontSize: '0.95rem' }}>{speaker.topic}</p>
                  <p className="speaker-description" style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>{speaker.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════ REGIONAL SPEAKERS ══════════ */}
      <section className="section" id="regional-speakers">
        <div className="container">
          <div style={{ textAlign: 'center' }}>
            <div className="section-label" style={{ justifyContent: 'center' }}>18 y 19 de Abril</div>
            <h2 className="section-title center">
              Talentos <span className="highlight">Regionales</span>
            </h2>
            <p className="section-subtitle center">
              Casos de éxito y estrategias de los empresarios que están moviendo la economía de Los Altos.
            </p>
          </div>

          <div className="speakers-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', maxWidth: '1200px' }}>
            {REGIONAL_SPEAKERS.map((speaker, i) => (
              <div
                key={i}
                className="speaker-card stagger-item"
                style={{ padding: 'var(--space-xl)' }}
              >
                <div className="speaker-photo-wrap" style={{ width: '120px', height: '120px' }}>
                  <div style={{ width: '100%', height: '100%', borderRadius: '50%', background: 'var(--bg-glass)', border: '2px dashed var(--surface-border-hover)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--text-tertiary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                  </div>
                </div>
                <div className="speaker-info">
                  <div className="speaker-role" style={{ padding: '4px 0', fontSize: '0.65rem' }}>{speaker.role}</div>
                  <h3 className="speaker-name" style={{ marginTop: '0.5rem', fontSize: '1.2rem' }}>{speaker.name}</h3>
                  <p className="speaker-topic" style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.4rem', fontSize: '0.85rem' }}>{speaker.topic}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════ ¿POR QUÉ CONECTA? ══════════ */}
      <section className="section" id="about">
        <div className="container">
          <div className="why-section">
            <div className="why-content">
              <div className="section-label">Propuesta de Valor</div>
              <h2 className="section-title">
                ¿Por qué <span className="highlight">CONECTA 2026</span>?
              </h2>
              <p className="why-lead">
                Una experiencia diseñada para que hagas los mejores contactos de la región,
                sin perder tiempo y con tecnología que trabaja por ti.
              </p>
              <p className="why-body">
                Conecta es la expo que une a todas las potencias de Los Altos de Jalisco
                para convertirse en un referente regional. El enfoque no se limita a
                municipios, sino que integra marcas, escuelas y diversos sectores
                productivos en un solo ecosistema de negocios.
              </p>
              <div className="why-stats">
                <div className="why-stat">
                  <div className="why-stat-value"><AnimatedCounter end={"2,500"} duration={2000} suffix="+" /></div>
                  <div className="why-stat-label">Asistentes esperados</div>
                </div>
                <div className="why-stat">
                  <div className="why-stat-value"><AnimatedCounter end={20} duration={2000} /></div>
                  <div className="why-stat-label">Municipios conectados</div>
                </div>
                <div className="why-stat">
                  <div className="why-stat-value">Infinitas</div>
                  <div className="why-stat-label">Oportunidades de negocio</div>
                </div>
              </div>
            </div>
            <div className="why-visual">
              <div className="why-visual-card glass-card">
                <div className="why-visual-icon"></div>
                <div className="why-visual-text">Networking tecnológico con QR</div>
              </div>
              <div className="why-visual-card glass-card">
                <div className="why-visual-icon"></div>
                <div className="why-visual-text">Matchmaking inteligente de contactos</div>
              </div>
              <div className="why-visual-card glass-card">
                <div className="why-visual-icon"></div>
                <div className="why-visual-text">Formación especializada</div>
              </div>
              <div className="why-visual-card glass-card">
                <div className="why-visual-icon"></div>
                <div className="why-visual-text">Ecosistema regional integrado</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════ FEATURES ══════════ */}
      <section className="section" style={{ background: 'var(--bg-secondary)' }}>
        <div className="container">
          <div style={{ textAlign: 'center' }}>
            <div className="section-label" style={{ justifyContent: 'center' }}>Plataforma</div>
            <h2 className="section-title center">
              Tecnología que <span className="highlight">impulsa tu negocio</span>
            </h2>
            <p className="section-subtitle center">
              Herramientas inteligentes diseñadas para maximizar cada minuto en el evento.
            </p>
          </div>

          <div className="features-grid">
            {FEATURES.map((feature, i) => (
              <div key={i} className="glass-card feature-card stagger-item">
                <div className={`feature-icon ${feature.color}`}>
                  {feature.icon}
                </div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════ ECOSYSTEM: ALLIANCES & SPONSORS ══════════ */}
      <section className="section" id="alliances">
        <div className="container">
          <div style={{ textAlign: 'center' }}>
            <div className="section-label" style={{ justifyContent: 'center' }}>Ecosistema</div>
            <h2 className="section-title center">
              Alianzas y <span className="highlight">Patrocinios</span>
            </h2>
            <p className="section-subtitle center">
              Un ecosistema de organizaciones comprometidas con el desarrollo regional.
            </p>
          </div>

          {/* ══════════ EXPO ZONE ══════════ */}
          <div className="alliance-section" style={{ marginTop: 'var(--space-4xl)' }}>
            <div style={{ textAlign: 'center', marginBottom: 'var(--space-xl)' }}>
              <h3 className="alliance-category-title" style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Zona de Expo</h3>
              <p className="section-subtitle center">Potencia tu marca con un stand comercial y conecta con más empresas.</p>
            </div>

            <div className="pricing-grid" style={{ maxWidth: '900px', margin: '0 auto' }}>
              {EXPO_STANDS.map((stand, i) => (
                <div key={i} className={`glass-card pricing-card stagger-item ${stand.popular ? 'featured' : ''}`}>
                  {stand.popular && <div className="pricing-badge">Recomendado</div>}
                  <div className="pricing-tier">Stand</div>
                  <div className="pricing-name">{stand.name}</div>
                  <div className="pricing-price">
                    {stand.price}<span className="currency"> MXN</span>
                  </div>
                  <ul className="pricing-features">
                    {stand.features.map((feature, j) => (
                      <li key={j}><span className="check">&#10003;</span> {feature}</li>
                    ))}
                  </ul>
                  <button
                    onClick={() => openLeadModal(stand.name)}
                    className={`btn ${stand.popular ? 'btn-primary' : 'btn-outline'}`}
                    style={{ width: '100%', marginTop: 'var(--space-auto)' }}
                  >
                    Reservar espacio
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Patrocinadores */}
          <div className="alliance-section">
            <h3 className="alliance-category-title">Patrocinadores</h3>
            <div className="alliance-grid alliance-grid-4">
              {SPONSORS.map((s, i) => (
                <div key={i} className="alliance-slot">
                  <div className="alliance-slot-label">{s.label}</div>
                </div>
              ))}
            </div>
          </div>



          {/* Alianzas Estratégicas */}
          <div className="alliance-section">
            <h3 className="alliance-category-title">Alianzas Estratégicas</h3>
            <div className="alliance-grid alliance-grid-5">
              {STRATEGIC_ALLIANCES.map((name, i) => (
                <div key={i} className="alliance-slot alliance-slot-org">
                  <div className="alliance-slot-initials">
                    {name.split(' ').map(w => w[0]).join('').slice(0, 2)}
                  </div>
                  <div className="alliance-slot-name">{name}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Alianzas Universitarias */}
          <div className="alliance-section">
            <h3 className="alliance-category-title">Alianzas Universitarias</h3>
            <div className="alliance-grid alliance-grid-5">
              {UNIVERSITY_ALLIANCES.map((name, i) => (
                <div key={i} className="alliance-slot alliance-slot-uni">
                  <div className="alliance-slot-initials">
                    {name.split(' ').map(w => w[0]).join('').slice(0, 2)}
                  </div>
                  <div className="alliance-slot-name">{name}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section >

      {/* ══════════ CTA ══════════ */}
      < section className="section cta-section" >
        <div className="container">
          <h2 className="section-title center">
            ¿Listo para <span className="highlight">conectar</span>?
          </h2>
          <p className="section-subtitle center">
            No te quedes fuera. Asegura tu lugar en la expo de negocios
            más importante de la región. Sede 2026: Tepatitlán de Morelos.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 'var(--space-md)', flexWrap: 'wrap' }}>
            <a href="https://www.masentrada.app/events/conecta-2026?referred_by=31b3f378-7a92-4b16-87ad-92fa7b1397ac" target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-lg">
              Registrarme ahora
              <svg className="btn-icon" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" /></svg>
            </a>
            <a href="https://wa.me/523781002683" target="_blank" rel="noopener noreferrer" className="btn btn-secondary btn-lg">
              Contactar por WhatsApp
            </a>
          </div>
        </div>
      </section >

      {/* ══════════ MODAL ITINERARIO ══════════ */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={closeModal} style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '1rem'
        }}>
          <div className="modal-content glass-card" onClick={(e) => e.stopPropagation()} style={{
            maxWidth: '600px',
            width: '100%',
            maxHeight: '80vh',
            overflowY: 'auto',
            position: 'relative',
            padding: '2rem'
          }}>
            <button onClick={closeModal} style={{
              position: 'absolute',
              top: '1rem',
              right: '1rem',
              background: 'none',
              border: 'none',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              fontSize: '1.5rem',
              lineHeight: 1
            }}>&times;</button>

            <h2 style={{ marginBottom: '1rem', color: 'var(--text-primary)' }}>
              Itinerario Día {modalDay}
            </h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
              Horarios y actividades por confirmar. Próximamente publicaremos la agenda detallada para el Día {modalDay}.
            </p>

            {/* Aquí podrás llenar la información de los itinerarios más adelante */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem'
            }}>
              <div style={{ padding: '1rem', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', background: 'var(--bg-glass)' }}>
                <span style={{ color: 'var(--neon-green)', fontWeight: 'bold' }}>09:00 AM</span>
                <h4 style={{ margin: '0.25rem 0' }}>Registro y Bienvenida</h4>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-tertiary)', margin: 0 }}>Lobby principal</p>
              </div>
              <div style={{ padding: '1rem', border: '1px dashed var(--border-color)', borderRadius: 'var(--radius-md)', textAlign: 'center', color: 'var(--text-tertiary)' }}>
                <em>[Espacio para más actividades]</em>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ══════════ MODAL LEAD CAPTURE ══════════ */}
      {isLeadModalOpen && (
        <div className="modal-overlay" onClick={() => setIsLeadModalOpen(false)} style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.85)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10000,
          padding: '1rem'
        }}>
          <div className="modal-content glass-card" onClick={(e) => e.stopPropagation()} style={{
            maxWidth: '500px',
            width: '100%',
            position: 'relative',
            padding: '2.5rem'
          }}>
            <button onClick={() => setIsLeadModalOpen(false)} style={{
              position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none',
              color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '1.5rem'
            }}>&times;</button>

            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <div className="section-label" style={{ justifyContent: 'center' }}>Expositores</div>
              <h2 style={{ fontSize: '1.75rem', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>Reserva tu <span className="highlight">Espacio</span></h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Déjanos tus datos y un asesor se pondrá en contacto contigo para los detalles técnicos y de pago.</p>
            </div>

            <form onSubmit={handleLeadSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div className="form-group">
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Nombre completo</label>
                <input
                  required
                  type="text"
                  placeholder="Tu nombre"
                  value={leadInfo.name}
                  onChange={(e) => setLeadInfo({ ...leadInfo, name: e.target.value })}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', background: 'var(--bg-glass)', border: '1px solid var(--border-color)', color: 'white' }}
                />
              </div>
              <div className="form-group">
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Empresa</label>
                <input
                  required
                  type="text"
                  placeholder="Nombre de tu empresa"
                  value={leadInfo.company}
                  onChange={(e) => setLeadInfo({ ...leadInfo, company: e.target.value })}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', background: 'var(--bg-glass)', border: '1px solid var(--border-color)', color: 'white' }}
                />
              </div>
              <div className="form-group">
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>WhatsApp / Teléfono</label>
                <input
                  required
                  type="tel"
                  placeholder="378 000 0000"
                  value={leadInfo.phone}
                  onChange={(e) => setLeadInfo({ ...leadInfo, phone: e.target.value })}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', background: 'var(--bg-glass)', border: '1px solid var(--border-color)', color: 'white' }}
                />
              </div>
              <div className="form-group">
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Interés</label>
                <select
                  value={leadInfo.interest}
                  onChange={(e) => setLeadInfo({ ...leadInfo, interest: e.target.value })}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', background: 'var(--bg-glass)', border: '1px solid var(--border-color)', color: 'white' }}
                >
                  <option value="Stand Básico" style={{ background: '#111', color: 'white' }}>Stand Básico ($2,900)</option>
                  <option value="Stand Regional Plus" style={{ background: '#111', color: 'white' }}>Stand Regional Plus ($4,500)</option>
                  <option value="Información General" style={{ background: '#111', color: 'white' }}>Información sobre patrocinios</option>
                </select>
              </div>
              <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%', marginTop: '1rem' }}>
                Enviar y contactar asesor
              </button>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}
