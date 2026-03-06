'use client';
import Navbar from '@/components/Navbar';
import CountdownTimer from '@/components/CountdownTimer';
import AnimatedCounter from '@/components/AnimatedCounter';
import Footer from '@/components/Footer';
import Link from 'next/link';
import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

// ... (skip lines 9-145 in instruction)
/* ── DATA ── */

const FEATURES = [
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
        <circle cx="9" cy="7" r="4"></circle>
        <polyline points="16 11 18 13 22 9"></polyline>
      </svg>
    ),
    color: 'blue',
    title: 'Matchmaking Inteligente',
    description:
      'Nuestro sistema analiza lo que ofreces y lo que buscas para sugerirte los contactos más relevantes automáticamente.',
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
        <rect x="7" y="7" width="3" height="3"></rect>
        <rect x="14" y="7" width="3" height="3"></rect>
        <rect x="7" y="14" width="3" height="3"></rect>
        <rect x="14" y="14" width="3" height="3"></rect>
      </svg>
    ),
    color: 'teal',
    title: 'QR Networking',
    description:
      'Escanea el QR de cualquier asistente y guárdalo en tu lista de contactos al instante. Sin tarjetas de papel.',
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
      </svg>
    ),
    color: 'sky',
    title: 'Directorio Empresarial',
    description:
      'Explora las empresas participantes, filtra por municipio o sector y encuentra tu próximo socio comercial.',
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
        <line x1="3" y1="9" x2="21" y2="9"></line>
        <line x1="9" y1="21" x2="9" y2="9"></line>
      </svg>
    ),
    color: 'blue',
    title: 'Dashboard en Tiempo Real',
    description:
      'Visualiza tus leads capturados, da seguimiento y califica tus contactos desde una sola pantalla.',
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
      </svg>
    ),
    color: 'green',
    title: '20 Municipios Conectados',
    description:
      'Empresas y talento de toda la región reunidos en Tepatitlán para impulsar negocios locales.',
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
        <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
      </svg>
    ),
    color: 'teal',
    title: 'Datos Protegidos',
    description:
      'Tu información de contacto solo es visible para personas con quienes te conectas. Privacidad garantizada.',
  },
];

const EXPO_STANDS = [
  {
    name: 'Stand Básico',
    price: '$4,900',
    features: ['Espacio 2×2m', 'Stand modular rotulado completo', 'Mesa, 2 sillas, eléctrico', 'QR empresarial'],
    popular: false
  },
  {
    name: 'Stand Regional Plus',
    price: '$5,900',
    features: ['Espacio 3×2m', 'Stand modular rotulado completo', 'Mobiliario completo', 'Directorio destacado', 'Matchmaking prioritario'],
    popular: true
  }
];

const SPONSORS = [
  { label: 'Patrocinador Oro' },
  { label: 'Patrocinador Oro' },
  { label: 'Patrocinador Plata' },
  { label: 'Patrocinador Plata' },
];

/* ── DATA ── */
// These will be fetched from DB in the component logic


/* ── PAGE ── */

export default function HomePage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [modalDay, setModalDay] = useState(1);
  const [leadInfo, setLeadInfo] = useState({ name: '', company: '', phone: '', interest: 'Stand Básico' });

  // Dynamic Data States
  // LuisMi Negocios fallback — always show even if not yet in Supabase
  const LUISMI_FALLBACK = {
    name: 'Luis Miguel Altamirano',
    role: 'Conferencista Estelar',
    company: 'LuisMi Negocios',
    topic: 'Enfoque: Finanzas para negocios y emprendimientos.',
    description: 'Luis Miguel Altamirano es un especialista en finanzas personales y negocios, conocido como LuisMi Negocios en redes sociales, donde educa a millones de personas sobre cómo manejar dinero, ahorrar e invertir. Comparte estrategias accesibles para emprendedores y dueños de negocio. Autor del libro "Rico el que lo lea", una guía práctica de educación financiera.',
    image_url: '/luismi.jpg',
    accent_color: '#ffd700',
    is_regional: false,
    display_order: 0,
  };

  const [headliners, setHeadliners] = useState([]);
  const [regionalSpeakers, setRegionalSpeakers] = useState([]);
  const [conectaAlliances, setConectaAlliances] = useState([
    { name: 'Promoción Económica de Tepatitlán', image_url: '/4.png' },
    { name: 'Cámara de Comercio Tepatitlán', image_url: '/3.png' },
    { name: 'Jóvenes Empresarios', image_url: '/2.png' },
    { name: 'Universidad Nueva Ciencia', image_url: '/1.png' },
    { name: 'UNID', image_url: '/5.png' }
  ]);
  const [specialGuests, setSpecialGuests] = useState([
    { name: 'REDI', image_url: '/6.png' },
    { name: 'CIIO', image_url: '/7.png' }
  ]);
  const [itinerary, setItinerary] = useState([]);
  const [officialSponsors, setOfficialSponsors] = useState([]);
  const [strategicAlliances, setStrategicAlliances] = useState([]);
  const [universityAlliances, setUniversityAlliances] = useState([]);

  useEffect(() => {
    const fetchContent = async () => {
      // Fetch Speakers
      const { data: speakersData } = await supabase.from('speakers').select('*').order('display_order');
      if (speakersData) {
        let stars = speakersData.filter(s => !s.is_regional);
        // Ensure LuisMi is always shown
        const hasLuisMi = stars.some(s => s.name && s.name.toLowerCase().includes('altamirano'));
        if (!hasLuisMi) stars = [LUISMI_FALLBACK, ...stars];

        // Enforce custom order: Farid -> Luis -> Jess
        const getOrder = (name) => {
          const lowerName = (name || '').toLowerCase();
          if (lowerName.includes('farid')) return 1;
          if (lowerName.includes('luismi') || lowerName.includes('altamirano')) return 2;
          if (lowerName.includes('jess')) return 3;
          return 99;
        };
        stars.sort((a, b) => getOrder(a.name) - getOrder(b.name));

        setHeadliners(stars);

        const MEMO_REGIONAL = {
          name: 'Dr. Guillermo del Toro',
          role: 'Talento Regional',
          company: 'Vicepresidente de la Red Incuba Jalisco y Director del CIIO en CUAltos',
          topic: 'Conferencia: “El poder del fracaso en el camino hacia el éxito emprendedor”',
          description: 'Doctor en Ciencias de la Educación, Maestro en Administración de Negocios e Ingeniero en Sistemas Computacionales. Miembro del Sistema Nacional de Investigadores y especialista en innovación y emprendimiento con más de 30 publicaciones académicas. Ha realizado estancias en University of Arizona, Harvard University y el MIT.',
          image_url: '/memo.jpg',
          accent_color: '#0ea5e9',
          is_regional: true,
          display_order: 1,
        };

        const KARINA_REGIONAL = {
          name: 'Karina Navarro',
          role: 'Talento Regional',
          company: 'Fundadora de Grupo Krasny',
          topic: 'Conferencia: “Me dijeron que no: convertir los obstáculos en impulso para emprender”',
          description: 'Es empresaria y promotora del emprendimiento. Es autora del libro "Me dijeron que no", donde comparte su experiencia sobre resiliencia, mentalidad emprendedora y cómo convertir los obstáculos en oportunidades. A través de su historia inspira a emprendedores a persistir, reinventarse y construir proyectos con propósito.',
          image_url: '/kary.jpg',
          accent_color: '#ec4899',
          is_regional: true,
          display_order: 2,
        };

        const DAVID_REGIONAL = {
          name: 'David Aceves',
          role: 'Talento Regional',
          company: 'Sexólogo y Especialista en Inteligencia Sexual',
          topic: 'Conferencia: “Inteligencia sexual: clave para relaciones más sanas y conscientes”',
          description: 'Enfocado en educación, bienestar y desarrollo personal desde una perspectiva integral de la sexualidad. Promueve una visión informada y consciente, ayudando a las personas a fortalecer su autoestima, relaciones y toma de decisiones.',
          image_url: '/david.jpg',
          accent_color: '#8b5cf6',
          is_regional: true,
          display_order: 3,
        };

        const GEMMA_REGIONAL = {
          name: 'Gemma Martín',
          role: 'Talento Regional',
          company: 'Escritora y Conferencista',
          topic: 'Conferencia: “Reconecta con tu historia: transforma tu pasado en tu mayor fortaleza”',
          description: 'Enfocada en desarrollo personal y bienestar emocional. Autora del libro "Reconecta con tu historia", donde invita a las personas a comprender su pasado para transformar su presente y construir un futuro con mayor conciencia.',
          image_url: '/gema.jpg',
          accent_color: '#f59e0b',
          is_regional: true,
          display_order: 4,
        };

        setRegionalSpeakers([MEMO_REGIONAL, KARINA_REGIONAL, DAVID_REGIONAL, GEMMA_REGIONAL]);
      } else {
        // If fetch fails, still show LuisMi & Hardcoded Regional
        setHeadliners([LUISMI_FALLBACK]);
        setRegionalSpeakers([MEMO_REGIONAL, KARINA_REGIONAL, DAVID_REGIONAL, GEMMA_REGIONAL]);
      }

      // Fetch Alliances & Sponsors
      const { data: allianceData } = await supabase.from('alliances_sponsors').select('*').order('display_order');
      if (allianceData) {
        setOfficialSponsors(allianceData.filter(a => a.type === 'official'));
        setStrategicAlliances(allianceData.filter(a => a.type === 'strategic'));
        setUniversityAlliances(allianceData.filter(a => a.type === 'university'));
        // conectaAlliances are now hardcoded
      }
    };

    fetchContent();
  }, []);

  useEffect(() => {
    if (isModalOpen) {
      const fetchItinerary = async () => {
        const { data } = await supabase.from('itinerary').select('*').eq('day', modalDay).order('time_label');
        if (data) setItinerary(data);
      };
      fetchItinerary();
    }
  }, [isModalOpen, modalDay]);

  const openModal = (day) => {
    setModalDay(day);
    setIsModalOpen(true);
  };

  const openLeadModal = (interest = 'Stand Básico') => {
    setLeadInfo(prev => ({ ...prev, interest }));
    setIsSuccess(false);
    setIsLeadModalOpen(true);
  };

  const handleLeadSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {

      const { error } = await supabase
        .from('stand_leads')
        .insert([
          {
            name: leadInfo.name,
            company: leadInfo.company,
            phone: leadInfo.phone,
            interest: leadInfo.interest,
            status: 'pending'
          }
        ]);

      if (error) throw error;

      setIsSuccess(true);
      // Optional: Logic to notify admin via email/webhook could go here
    } catch (err) {
      console.error('Error saving lead:', err);
      alert('Hubo un error al guardar tu información. Por favor, intenta de nuevo o contáctanos por WhatsApp.');
    } finally {
      setIsSubmitting(false);
    }
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
            <div className="hero-content">
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
                <a href="https://www.masentrada.app/events/conecta-2026?referred_by=31b3f378-7a92-4b16-87ad-92fa7b1397ac" target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-lg">
                  Comprar Boleto
                  <svg className="btn-icon" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" /></svg>
                </a>
                <Link href="#schedule" className="btn btn-outline btn-lg">
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
            {/* Right Side Image (Ponentes) */}
            <div className="hero-image-wrapper" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
              <div className="hero-image-glow" style={{ width: '100%', height: '80%', top: '10%', left: '0' }}></div>
              <Image
                src="/ponentes.png"
                alt="Ponentes Estelares: LuisMi, Farid, Jessica Fernández"
                className="hero-person-img"
                width={900}
                height={600}
                style={{ objectFit: 'contain', zIndex: 1, marginBottom: '1rem', width: '100%', height: 'auto', maxWidth: '800px' }}
                priority
              />
              <div style={{
                display: 'flex',
                justifyContent: 'space-around',
                width: '100%',
                maxWidth: '800px',
                zIndex: 2,
                padding: '0 1rem',
                marginTop: '-1rem'
              }}>
                <div className="hero-person-label" style={{ position: 'relative', bottom: 'auto', left: 'auto', transform: 'none', padding: '0.4rem 0.8rem', minWidth: '120px', textAlign: 'center' }}>
                  <span className="hero-person-name" style={{ fontSize: '0.8rem', letterSpacing: '0.5px' }}>LuisMi Negocios</span>
                </div>
                <div className="hero-person-label" style={{ position: 'relative', bottom: 'auto', left: 'auto', transform: 'none', padding: '0.4rem 0.8rem', minWidth: '120px', textAlign: 'center' }}>
                  <span className="hero-person-name" style={{ fontSize: '0.8rem', letterSpacing: '0.5px' }}>Farid Dieck</span>
                </div>
                <div className="hero-person-label" style={{ position: 'relative', bottom: 'auto', left: 'auto', transform: 'none', padding: '0.4rem 0.8rem', minWidth: '120px', textAlign: 'center' }}>
                  <span className="hero-person-name" style={{ fontSize: '0.8rem', letterSpacing: '0.5px' }}>Jessica Fernández</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* ══════════ OFFICIAL SPONSORS & CONECTA ALLIANCES ══════════ */}
      <section className="section" style={{ paddingBottom: 'var(--space-2xl)', background: 'rgba(6, 11, 24, 0.4)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 'var(--space-2xl)' }}>
            <div className="section-label" style={{ justifyContent: 'center' }}>Aliados Principales</div>
            <h2 className="section-title center">
              Patrocinadores <span className="highlight">Oficiales</span>
            </h2>
          </div>

          <div className="sponsors-row" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 'var(--space-lg)', marginBottom: 'var(--space-3xl)' }}>
            {officialSponsors.length > 0 ? officialSponsors.map((s, i) => (
              <div key={i} className={`sponsor-slot ${!s.is_filled ? 'sponsor-slot-available' : ''}`} style={{
                flex: '1 1 200px',
                maxWidth: '240px',
                minHeight: '140px',
                background: s.is_filled ? 'var(--bg-glass)' : 'rgba(255,255,255,0.02)',
                border: s.is_filled ? '1px solid var(--border-color)' : '1px dashed var(--border-color)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 'var(--radius-lg)',
                padding: '1.5rem',
                transition: 'all 0.3s ease'
              }}>
                {s.image_url && s.is_filled ? (
                  <Image src={s.image_url} alt={s.name} width={180} height={70} style={{ objectFit: 'contain' }} />
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '10px', width: '100%' }}>
                    <div style={{ textAlign: 'center', color: s.is_filled ? 'white' : 'var(--text-tertiary)', fontSize: '0.85rem' }}>
                      {s.is_filled ? s.name : "Espacio Disponible"}
                    </div>
                    {!s.is_filled && (
                      <a href="https://wa.me/523781002683?text=Hola,%20me%20interesa%20ser%20patrocinador%20Oficial%20de%20CONECTA%202026" target="_blank" rel="noopener noreferrer" className="btn btn-outline" style={{ fontSize: '0.75rem', padding: '6px 12px', width: '100%', whiteSpace: 'normal', textAlign: 'center', lineHeight: '1.2' }}>
                        Quiero ser Patrocinador
                      </a>
                    )}
                  </div>
                )}
              </div>
            )) : Array(4).fill(0).map((_, i) => (
              <div key={i} className="sponsor-slot" style={{
                flex: '1 1 200px',
                maxWidth: '240px',
                minHeight: '140px',
                background: 'rgba(255,255,255,0.02)',
                border: '1px dashed rgba(255,255,255,0.1)',
                borderRadius: 'var(--radius-lg)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ color: 'var(--text-tertiary)', fontSize: '0.75rem', marginBottom: '0.5rem' }}>Espacio disponible</div>
                  <a href="https://wa.me/523781002683" target="_blank" rel="noopener noreferrer" className="btn btn-outline" style={{ fontSize: '0.65rem', padding: '4px 8px' }}>Contactar</a>
                </div>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginBottom: 'var(--space-2xl)' }}>
            <h3 className="alliance-category-title" style={{ fontSize: '1.3rem', color: 'var(--text-primary)', fontWeight: '700' }}>Aliados Estratégicos</h3>
          </div>

          <div className="alliance-grid" style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '1.5rem',
            marginBottom: 'var(--space-3xl)'
          }}>
            {conectaAlliances.map((alliance, i) => (
              <div key={i} style={{
                background: 'var(--bg-glass)',
                border: '1px solid var(--border-color)',
                borderRadius: '12px',
                padding: '1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '180px',
                height: '90px'
              }}>
                <Image src={alliance.image_url} alt={alliance.name} width={100} height={50} style={{ objectFit: 'contain' }} />
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginBottom: 'var(--space-xl)' }}>
            <h3 className="alliance-category-title" style={{ fontSize: '1.1rem', color: 'var(--text-secondary)' }}>Invitados Especiales</h3>
          </div>

          <div className="alliance-grid" style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '1.5rem'
          }}>
            {specialGuests.map((guest, i) => (
              <div key={i} style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.05)',
                borderRadius: '12px',
                padding: '0.75rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '150px',
                height: '70px'
              }}>
                <Image src={guest.image_url} alt={guest.name} width={80} height={40} style={{ objectFit: 'contain' }} />
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
            {/* UNIFIED TICKET CARD REDESIGN */}
            <div className="glass-card stagger-item" style={{
              gridColumn: '1 / -1',
              maxWidth: '900px',
              margin: '0 auto',
              background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.12) 0%, rgba(6, 11, 24, 0.8) 50%, rgba(14, 165, 233, 0.08) 100%)',
              border: '1px solid rgba(37, 99, 235, 0.3)',
              borderRadius: '24px',
              padding: 'var(--space-2xl)',
              boxShadow: '0 20px 50px rgba(0,0,0,0.5), inset 0 0 40px rgba(37, 99, 235, 0.1)',
              position: 'relative',
              overflow: 'hidden'
            }}>
              {/* Decorative background elements */}
              <div style={{ position: 'absolute', top: '-100px', right: '-100px', width: '300px', height: '300px', background: 'var(--accent-primary)', filter: 'blur(120px)', opacity: 0.15, zIndex: 0 }}></div>
              <div style={{ position: 'absolute', bottom: '-100px', left: '-100px', width: '250px', height: '250px', background: 'var(--accent-secondary)', filter: 'blur(100px)', opacity: 0.1, zIndex: 0 }}></div>

              <div style={{ position: 'relative', zIndex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
                  <span style={{
                    background: 'var(--gradient-primary)',
                    color: 'white',
                    padding: '6px 16px',
                    borderRadius: '100px',
                    fontSize: '0.75rem',
                    fontWeight: '800',
                    textTransform: 'uppercase',
                    letterSpacing: '2px',
                    boxShadow: '0 4px 15px rgba(37, 99, 235, 0.4)'
                  }}>1 Boleto, 2 Días de Impacto</span>
                </div>

                <div className="day-header" style={{ justifyContent: 'center', marginBottom: '2rem', textAlign: 'center' }}>
                  <div className="day-date" style={{ fontSize: '1.4rem', color: 'var(--text-primary)', fontWeight: '700' }}>18 y 19 de Abril, 2026</div>
                  <div style={{ color: 'var(--text-tertiary)', fontSize: '0.85rem', marginTop: '0.5rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Centro de Convenciones Olimpo</div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem', marginBottom: '3rem' }}>
                  {/* Day 1 Column */}
                  <div style={{ background: 'rgba(255,255,255,0.02)', padding: '2rem', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                      <div style={{ width: '40px', height: '40px', background: 'rgba(37, 99, 235, 0.1)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-primary)', fontWeight: '800' }}>1</div>
                      <h4 style={{ fontSize: '1.25rem', color: 'var(--text-primary)', margin: 0, fontWeight: '700' }}>Estrategia y Conexiones</h4>
                    </div>
                    <ul className="day-features" style={{ margin: 0 }}>
                      <li><span className="check" style={{ color: 'var(--accent-primary)' }}>&#10003;</span> <strong>Feria de Empleo:</strong> Talento con vacantes regionales.</li>
                      <li><span className="check" style={{ color: 'var(--accent-primary)' }}>&#10003;</span> <strong>Networking Pro:</strong> Matchmaking inteligente IA.</li>
                      <li><span className="check" style={{ color: 'var(--accent-primary)' }}>&#10003;</span> <strong>LuisMi Negocios:</strong> Apertura de impacto financiero.</li>
                      <li><span className="check" style={{ color: 'var(--accent-primary)' }}>&#10003;</span> <strong>Workshops:</strong> Marketing, IA, Ventas y Capital Humano.</li>
                    </ul>
                  </div>

                  {/* Day 2 Column */}
                  <div style={{ background: 'rgba(255,255,255,0.02)', padding: '2rem', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                      <div style={{ width: '40px', height: '40px', background: 'rgba(14, 165, 233, 0.1)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-secondary)', fontWeight: '800' }}>2</div>
                      <h4 style={{ fontSize: '1.25rem', color: 'var(--text-primary)', margin: 0, fontWeight: '700' }}>Gran Cierre Magistral</h4>
                    </div>
                    <ul className="day-features" style={{ margin: 0 }}>
                      <li><span className="check" style={{ color: 'var(--accent-secondary)' }}>&#10003;</span> <strong>Conferencias:</strong> Líderes de opinión nacionales.</li>
                      <li><span className="check" style={{ color: 'var(--accent-secondary)' }}>&#10003;</span> <strong>Talento Regional:</strong> Expertos con alto impacto local.</li>
                      <li><span className="check" style={{ color: 'var(--accent-secondary)' }}>&#10003;</span> <strong>Expo Empresarial:</strong> 50+ marcas líderes regionales.</li>
                      <li><span className="check" style={{ color: 'var(--accent-secondary)' }}>&#10003;</span> <strong>Brindis Networking:</strong> Barra libre de clausura.</li>
                    </ul>
                  </div>
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '1.5rem', marginTop: 'auto' }}>
                  <a href="https://www.masentrada.app/events/conecta-2026?referred_by=31b3f378-7a92-4b16-87ad-92fa7b1397ac" target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-lg" style={{ minWidth: '280px', height: '60px', borderRadius: '12px', boxShadow: '0 10px 25px rgba(37, 99, 235, 0.3)' }}>
                    Adquiere tu Acceso Único
                    <svg className="btn-icon" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" /></svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

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
            <div className="section-label" style={{ justifyContent: 'center' }}>18 y 19 de Abril</div>
            <h2 className="section-title center">
              Conferencistas <span className="highlight">Estelares</span>
            </h2>
            <p className="section-subtitle center">
              Conferencias magistrales con los líderes que están transformando los negocios en México.
            </p>
          </div>

          <div className="speakers-grid">
            {headliners.length > 0 ? headliners.map((speaker, i) => (
              <div
                key={i}
                className="speaker-card stagger-item"
                style={speaker.accent_color ? {
                  '--speaker-accent': speaker.accent_color,
                  '--speaker-gradient': `linear-gradient(90deg, ${speaker.accent_color}, ${speaker.accent_color})`,
                  '--speaker-shadow': `0 20px 60px ${speaker.accent_color}25`,
                  '--speaker-glow': `conic-gradient(from 0deg, transparent, ${speaker.accent_color}40, transparent, ${speaker.accent_color}40, transparent)`,
                  '--speaker-role-color': speaker.accent_color,
                } : {}}
              >
                <div className="speaker-photo-wrap">
                  <Image src={speaker.image_url || '/images/speaker-jessica.png'} alt={speaker.name} className="speaker-photo" width={400} height={400} />
                  <div className="speaker-photo-glow" />
                </div>
                <div className="speaker-info">
                  <div className="speaker-role" style={speaker.accent_color ? { background: `${speaker.accent_color}10`, padding: '4px 12px', borderRadius: 'var(--radius-pill)', display: 'inline-block', border: `1px solid ${speaker.accent_color}30` } : { padding: '4px 0' }}>{speaker.role}</div>
                  <h3 className="speaker-name" style={{ marginTop: '0.5rem' }}>{speaker.name}</h3>
                  <p className="speaker-topic" style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.4rem', fontSize: '0.95rem' }}>{speaker.topic}</p>
                  <p className="speaker-description" style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>{speaker.description}</p>
                </div>
              </div>
            )) : (
              <p style={{ gridColumn: '1/-1', textAlign: 'center', color: 'var(--text-secondary)' }}>Cargando conferencistas...</p>
            )}
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
              Casos de éxito y estrategias de los empresarios que están moviendo la economía de Sede 2026 Tepatitlán de Morelos.
            </p>
          </div>

          <div className="speakers-grid" style={{ maxWidth: '1200px', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))' }}>
            {regionalSpeakers.length > 0 ? (
              <>
                {regionalSpeakers.map((speaker, i) => (
                  <div
                    key={i}
                    className="speaker-card stagger-item"
                    style={{
                      padding: 'var(--space-2xl) var(--space-xl)',
                      '--speaker-accent': speaker.accent_color || 'var(--accent-primary)',
                      '--speaker-gradient': `linear-gradient(90deg, ${speaker.accent_color || 'var(--accent-primary)'}, ${speaker.accent_color || 'var(--accent-primary)'})`,
                      '--speaker-shadow': `0 20px 60px ${speaker.accent_color || 'var(--accent-primary)'}25`,
                      '--speaker-glow': `conic-gradient(from 0deg, transparent, ${speaker.accent_color || 'var(--accent-primary)'}40, transparent, ${speaker.accent_color || 'var(--accent-primary)'}40, transparent)`,
                      '--speaker-role-color': speaker.accent_color || 'var(--accent-primary)',
                    }}
                  >
                    <div className="speaker-photo-wrap" style={{ width: '180px', height: '180px', margin: '0 auto var(--space-xl)' }}>
                      {speaker.image_url ? (
                        <Image src={speaker.image_url} alt={speaker.name} width={180} height={180} style={{ borderRadius: '50%', objectFit: 'cover', border: '4px solid var(--surface-border)' }} />
                      ) : (
                        <div style={{ width: '100%', height: '100%', borderRadius: '50%', background: 'var(--bg-glass)', border: '2px dashed var(--surface-border-hover)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--text-tertiary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                        </div>
                      )}
                    </div>
                    <div className="speaker-info">
                      <div className="speaker-role" style={{
                        color: 'var(--speaker-role-color)',
                        fontWeight: '700',
                        textTransform: 'uppercase',
                        letterSpacing: '0.1em',
                        fontSize: '0.7rem',
                        marginBottom: '0.5rem'
                      }}>{speaker.role}</div>
                      <h3 className="speaker-name" style={{ marginBottom: '0.75rem', fontSize: '1.5rem' }}>{speaker.name}</h3>
                      <p className="speaker-company" style={{ color: 'var(--text-tertiary)', fontSize: '0.85rem', marginBottom: '1rem' }}>{speaker.company}</p>
                      <p className="speaker-topic" style={{
                        background: 'rgba(255,255,255,0.03)',
                        padding: '0.75rem',
                        borderRadius: '12px',
                        border: '1px solid rgba(255,255,255,0.05)',
                        fontWeight: 600,
                        color: 'var(--text-primary)',
                        marginBottom: '1rem',
                        fontSize: '0.9rem'
                      }}>{speaker.topic}</p>
                      <p className="speaker-description" style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{speaker.description}</p>
                    </div>
                  </div>
                ))}

              </>
            ) : (
              <p style={{ textAlign: 'center', color: 'var(--text-tertiary)', width: '100%' }}>Cargando talento regional...</p>
            )}
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
                Conecta es la expo que une a todas las potencias de Sede 2026 Tepatitlán de Morelos
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
              {/* Card 1 */}
              <div className="why-visual-card">
                <div className="why-visual-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="7" height="7"></rect>
                    <rect x="14" y="3" width="7" height="7"></rect>
                    <rect x="14" y="14" width="7" height="7"></rect>
                    <rect x="3" y="14" width="7" height="7"></rect>
                    <path d="M9 14v1a2 2 0 0 1-2 2H6m12-8h-1a2 2 0 0 1-2-2V6"></path>
                  </svg>
                </div>
                <div className="why-visual-title">Networking Digital</div>
                <div className="why-visual-text">Intercambia contactos al instante usando tecnología de códigos QR.</div>
              </div>

              {/* Card 2 */}
              <div className="why-visual-card">
                <div className="why-visual-icon" style={{ color: 'var(--neon-green)', background: 'rgba(0, 255, 170, 0.1)', boxShadow: '0 4px 15px rgba(0, 255, 170, 0.1)' }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                    <polyline points="16 11 18 13 22 9"></polyline>
                  </svg>
                </div>
                <div className="why-visual-title">Matchmaking Inteligente</div>
                <div className="why-visual-text">Encuentra con precisión a tu cliente o socio ideal.</div>
              </div>

              {/* Card 3 */}
              <div className="why-visual-card">
                <div className="why-visual-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 10v6M2 10l10-5 10 5-10 5z"></path>
                    <path d="M6 12v5c3 3 9 3 12 0v-5"></path>
                  </svg>
                </div>
                <div className="why-visual-title">Formación Especializada</div>
                <div className="why-visual-text">Capacítate con talleres impartidos por líderes de la industria.</div>
              </div>

              {/* Card 4 */}
              <div className="why-visual-card">
                <div className="why-visual-icon" style={{ color: 'var(--neon-green)', background: 'rgba(0, 255, 170, 0.1)', boxShadow: '0 4px 15px rgba(0, 255, 170, 0.1)' }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                    <path d="M2 12h20"></path>
                  </svg>
                </div>
                <div className="why-visual-title">Ecosistema Regional</div>
                <div className="why-visual-text">Todas las potencias empresariales integradas en un solo lugar.</div>
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

          {/* Consolidated Logo Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
            gap: '2rem',
            marginTop: '3.5rem',
            maxWidth: '1000px',
            margin: '3.5rem auto 0 auto',
            alignItems: 'center',
            justifyItems: 'center'
          }}>
            {[...conectaAlliances, ...specialGuests].map((alliance, i) => (
              <div key={i} style={{
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.05)',
                borderRadius: '16px',
                padding: '1.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                maxWidth: '200px',
                height: '110px',
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
              }} className="alliance-logo-card">
                <Image
                  src={alliance.image_url}
                  alt={alliance.name}
                  width={140}
                  height={90}
                  style={{
                    objectFit: 'contain',
                    filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))'
                  }}
                  className="alliance-logo-img"
                />
              </div>
            ))}

            {/* Added CTA for Sponsorships within the grid */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.1), rgba(14, 165, 233, 0.05))',
              border: '1px dashed rgba(37, 99, 235, 0.4)',
              borderRadius: '16px',
              padding: '1.5rem',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
              maxWidth: '200px',
              height: '110px',
              textAlign: 'center',
              gap: '8px'
            }}>
              <span style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--text-tertiary)' }}>Tu logo aquí</span>
              <a href="https://wa.me/523781002683" target="_blank" rel="noopener noreferrer" className="btn btn-outline" style={{ fontSize: '0.65rem', padding: '4px 10px', border: '1px solid var(--accent-primary)' }}>
                Patrocinar
              </a>
            </div>
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

          {/* Alianzas Estratégicas y Universitarias Removed */}
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
            más importante de la región. Sede 2026: Tepatitlán de Morelos.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 'var(--space-md)', flexWrap: 'wrap' }}>
            <a href="https://www.masentrada.app/events/conecta-2026?referred_by=31b3f378-7a92-4b16-87ad-92fa7b1397ac" target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-lg">
              Comprar Boleto
              <svg className="btn-icon" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" /></svg>
            </a>
            <Link href="/pymatch" className="btn btn-secondary btn-lg">
              Ir a la App PyMatch
            </Link>
            <a href="https://wa.me/523781002683" target="_blank" rel="noopener noreferrer" className="btn btn-outline btn-lg">
              Contactar por WhatsApp
            </a>
          </div>
        </div>
      </section>

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

            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '1.5rem',
              marginBottom: '2rem'
            }}>
              {itinerary.length > 0 ? itinerary.map((item, index) => (
                <div key={index} style={{
                  padding: '1.25rem',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--bg-glass)',
                  display: 'flex',
                  gap: '1.5rem',
                  alignItems: 'flex-start'
                }}>
                  <div style={{
                    color: 'var(--neon-green)',
                    fontWeight: 'bold',
                    fontSize: '0.9rem',
                    minWidth: '80px',
                    paddingTop: '0.2rem'
                  }}>
                    {item.time_label}
                  </div>
                  <div>
                    <h4 style={{ margin: '0 0 0.5rem 0', color: 'var(--text-primary)' }}>{item.title}</h4>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', margin: '0 0 0.5rem 0' }}>{item.description}</p>
                    {item.location && <p style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', margin: 0 }}>📍 {item.location}</p>}
                  </div>
                </div>
              )) : (
                <p style={{ textAlign: 'center', color: 'var(--text-tertiary)', padding: '2rem' }}>
                  Agenda para el Día {modalDay} próximamente disponible.
                </p>
              )}
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
              <h2 style={{ fontSize: '1.75rem', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                {isSuccess ? <>¡Registro <span className="highlight">Exitoso</span>!</> : <>Reserva tu <span className="highlight">Espacio</span></>}
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                {isSuccess
                  ? 'Hemos recibido tu información empresarial. Un asesor se pondrá en contacto contigo muy pronto para formalizar tu participación.'
                  : 'Déjanos tus datos y un asesor se pondrá en contacto contigo para los detalles técnicos y de pago.'}
              </p>
            </div>

            {isSuccess ? (
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>✅</div>
                <button onClick={() => setIsLeadModalOpen(false)} className="btn btn-primary" style={{ width: '100%' }}>
                  Entendido
                </button>
                <p style={{ marginTop: '1.5rem', fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>
                  ¿Tienes prisa? También puedes <a href="https://wa.me/523781002683" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--neon-green)', textDecoration: 'underline' }}>contactarnos vía WhatsApp</a>.
                </p>
              </div>
            ) : (
              <form onSubmit={handleLeadSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {/* ... existing fields ... */}
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
                    <option value="Stand Básico" style={{ background: '#111', color: 'white' }}>Stand Básico ($4,900)</option>
                    <option value="Stand Regional Plus" style={{ background: '#111', color: 'white' }}>Stand Regional Plus ($5,900)</option>
                    <option value="Información General" style={{ background: '#111', color: 'white' }}>Información sobre patrocinios</option>
                  </select>
                </div>
                <button type="submit" disabled={isSubmitting} className="btn btn-primary btn-lg" style={{ width: '100%', marginTop: '1rem', opacity: isSubmitting ? 0.7 : 1 }}>
                  {isSubmitting ? 'Enviando...' : 'Enviar y ser contactado'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}
