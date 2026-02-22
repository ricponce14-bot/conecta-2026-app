import Navbar from '@/components/Navbar';
import CountdownTimer from '@/components/CountdownTimer';
import Footer from '@/components/Footer';
import Link from 'next/link';

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
      'Todos los municipios de Los Altos de Jalisco reunidos para impulsar negocios regionales.',
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
    role: 'Keynote Speaker',
    topic: 'Liderazgo y transformación empresarial en la era digital',
    image: '/images/speaker-jessica.png',
  },
  {
    name: 'Farid Dieck',
    role: 'Keynote Speaker',
    topic: 'Innovación disruptiva y oportunidades de negocio en México',
    image: '/images/speaker-farid.png',
  },
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

/* ── PAGE ── */

export default function HomePage() {
  return (
    <>
      <Navbar />

      {/* ══════════ HERO ══════════ */}
      <section className="hero">
        <div className="hero-bg">
          <img src="/images/hero-bg.png" alt="" />
        </div>

        <div className="container">
          <div className="hero-content">
            <div className="hero-eyebrow">
              <span className="dot"></span>
              <span>18 — 19 Abril 2026 &middot; Centro de Convenciones Olimpo</span>
            </div>

            <h1 className="hero-title">
              El poder de Los Altos <span className="highlight">se conecta aquí</span>
            </h1>

            <p className="hero-description">
              La expo de negocios B2B más importante de Los Altos de Jalisco.
              Matchmaking inteligente, networking con QR y oportunidades
              de crecimiento para toda la región.
            </p>

            <div className="hero-actions">
              <Link href="/precios" className="btn btn-primary btn-lg">
                Registrarme ahora
                <svg className="btn-icon" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" /></svg>
              </Link>
              <a href="#schedule" className="btn btn-outline btn-lg">
                Ver programa
              </a>
            </div>

            <CountdownTimer targetDate="2026-04-18T09:00:00-06:00" />

            <div className="hero-metrics">
              <div>
                <div className="hero-metric-value">2,500+</div>
                <div className="hero-metric-label">Asistentes</div>
              </div>
              <div>
                <div className="hero-metric-value">100+</div>
                <div className="hero-metric-label">Empresas</div>
              </div>
              <div>
                <div className="hero-metric-value">20</div>
                <div className="hero-metric-label">Municipios</div>
              </div>
              <div>
                <div className="hero-metric-value">2</div>
                <div className="hero-metric-label">Días</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════ SPONSORS TOP ROW ══════════ */}
      <section className="section" style={{ paddingBottom: 0 }}>
        <div className="container">
          <div className="sponsors-row">
            {SPONSORS.map((s, i) => (
              <div key={i} className="sponsor-slot">
                <div className="sponsor-slot-label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════ SCHEDULE: DAY 1 / DAY 2 ══════════ */}
      <section className="section" id="schedule">
        <div className="container">
          <div style={{ textAlign: 'center' }}>
            <div className="section-label" style={{ justifyContent: 'center' }}>Programa</div>
            <h2 className="section-title center">
              Dos días de <span className="highlight">contenido de alto nivel</span>
            </h2>
            <p className="section-subtitle center">
              Formación, networking y las conferencias más relevantes de la región, todo en un solo evento.
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
              <h3 className="day-title">Formación y Registro</h3>
              <p className="day-description">
                Obtén las herramientas y el conocimiento técnico. Un día completo dedicado a tu crecimiento profesional con talleres, diplomados y cursos. Enfoque en registro y acceso gratuito.
              </p>
              <ul className="day-features">
                <li><span className="check">&#10003;</span> Talleres especializados</li>
                <li><span className="check">&#10003;</span> Diplomados y cursos</li>
                <li><span className="check">&#10003;</span> Networking abierto</li>
                <li><span className="check">&#10003;</span> Registro de base de datos</li>
                <li><span className="check">&#10003;</span> Acceso completamente gratuito</li>
              </ul>
              <Link href="/precios" className="btn btn-outline" style={{ width: '100%' }}>
                Registrar mi boleto gratis
              </Link>
            </div>

            {/* DAY 2 */}
            <div className="glass-card day-card day-card-featured stagger-item">
              <div className="day-badge premium">Boleto Requerido</div>
              <div className="day-header">
                <div className="day-number">Día 2</div>
                <div className="day-date">19 de Abril, 2026</div>
              </div>
              <h3 className="day-title">Headliners y Conferencias</h3>
              <p className="day-description">
                Inspírate con los grandes y aplica lo aprendido conectando con los líderes de la región. Las conferencias más esperadas del año con ponentes de talla nacional.
              </p>
              <ul className="day-features">
                <li><span className="check">&#10003;</span> Jessica Fernández — Keynote</li>
                <li><span className="check">&#10003;</span> Farid Dieck — Keynote</li>
                <li><span className="check">&#10003;</span> Conferencias magistrales</li>
                <li><span className="check">&#10003;</span> Matchmaking prioritario</li>
                <li><span className="check">&#10003;</span> Networking premium</li>
              </ul>
              <Link href="/precios" className="btn btn-primary" style={{ width: '100%' }}>
                Comprar boleto Día 2
                <svg className="btn-icon" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" /></svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════ HEADLINERS ══════════ */}
      <section className="section" id="speakers" style={{ background: 'var(--bg-secondary)' }}>
        <div className="container">
          <div style={{ textAlign: 'center' }}>
            <div className="section-label" style={{ justifyContent: 'center' }}>19 de Abril</div>
            <h2 className="section-title center">
              Nuestros <span className="highlight">Headliners</span>
            </h2>
            <p className="section-subtitle center">
              Conferencias magistrales con los líderes que están transformando los negocios en México.
            </p>
          </div>

          <div className="speakers-grid">
            {HEADLINERS.map((speaker, i) => (
              <div key={i} className="speaker-card stagger-item">
                <div className="speaker-photo-wrap">
                  <img src={speaker.image} alt={speaker.name} className="speaker-photo" />
                  <div className="speaker-photo-glow"></div>
                </div>
                <div className="speaker-info">
                  <div className="speaker-role">{speaker.role}</div>
                  <h3 className="speaker-name">{speaker.name}</h3>
                  <p className="speaker-topic">{speaker.topic}</p>
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
                  <div className="why-stat-value">2,500+</div>
                  <div className="why-stat-label">Asistentes esperados</div>
                </div>
                <div className="why-stat">
                  <div className="why-stat-value">20</div>
                  <div className="why-stat-label">Municipios conectados</div>
                </div>
                <div className="why-stat">
                  <div className="why-stat-value">B2B</div>
                  <div className="why-stat-label">Enfoque de negocios</div>
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
      </section>

      {/* ══════════ CTA ══════════ */}
      <section className="section cta-section">
        <div className="container">
          <h2 className="section-title center">
            ¿Listo para <span className="highlight">conectar</span>?
          </h2>
          <p className="section-subtitle center">
            No te quedes fuera. Asegura tu lugar en la expo de negocios
            más importante de Los Altos de Jalisco.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 'var(--space-md)', flexWrap: 'wrap' }}>
            <Link href="/precios" className="btn btn-primary btn-lg">
              Registrarme ahora
              <svg className="btn-icon" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" /></svg>
            </Link>
            <a href="https://wa.me/523781002683" target="_blank" rel="noopener noreferrer" className="btn btn-secondary btn-lg">
              Contactar por WhatsApp
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
