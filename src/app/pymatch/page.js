'use client';

import Link from 'next/link';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function PyMatchPage() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const checkSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            setUser(session?.user || null);
        };
        checkSession();
    }, []);

    return (
        <>
            <Navbar />

            {/* ══════════ HERO ══════════ */}
            <section className="pymatch-hero" style={{ minHeight: '100vh', position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center' }}>
                {/* Subtle animated background */}
                <div style={{
                    position: 'absolute', inset: 0, zIndex: 0,
                    background: 'radial-gradient(ellipse at 30% 20%, rgba(0, 210, 255, 0.08) 0%, transparent 60%), radial-gradient(ellipse at 70% 80%, rgba(0, 255, 136, 0.05) 0%, transparent 50%)',
                }} />

                <div className="container" style={{ position: 'relative', zIndex: 1, width: '100%' }}>
                    <div className="pymatch-hero-grid">
                        {/* Left: Content */}
                        <div className="pymatch-hero-content">
                            <div className="hero-eyebrow" style={{ marginBottom: 'var(--space-md)' }}>
                                <span className="dot" style={{ background: 'var(--neon-green)', boxShadow: '0 0 12px var(--neon-green)' }}></span>
                                <span>Plataforma de Smart Networking</span>
                            </div>

                            <h1 className="hero-title" style={{ fontSize: 'clamp(2.2rem, 5vw, 3.5rem)', lineHeight: 1.1, marginBottom: 'var(--space-lg)' }}>
                                Tu red de contactos <span className="highlight">inteligente</span>
                            </h1>

                            <p className="hero-description" style={{ fontSize: '1.15rem', lineHeight: 1.7, marginBottom: 'var(--space-xl)', maxWidth: '480px' }}>
                                Escanea gafetes QR, descubre matches de negocio y gestiona tus conexiones desde una sola plataforma. <strong>CONECTA 2026</strong> pone la tecnología a tu servicio.
                            </p>

                            <div className="pymatch-hero-buttons">
                                {user ? (
                                    <Link href="/pymatch/dashboard" className="btn btn-primary btn-lg">
                                        Ir a mi Dashboard
                                        <svg className="btn-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                        </svg>
                                    </Link>
                                ) : (
                                    <>
                                        <Link href="/pymatch/registro" className="btn btn-primary btn-lg">
                                            Crear mi Cuenta
                                            <svg className="btn-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                            </svg>
                                        </Link>
                                        <Link href="/pymatch/login" className="btn btn-outline btn-lg">
                                            Ya tengo cuenta
                                        </Link>
                                    </>
                                )}
                            </div>

                            {/* Feature pills — SVG icons instead of emojis */}
                            <div className="pymatch-feature-pills">
                                {[
                                    {
                                        icon: (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="2" width="14" height="20" rx="2" /><line x1="12" y1="18" x2="12" y2="18" /></svg>),
                                        text: 'Gafete Digital QR'
                                    },
                                    {
                                        icon: (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></svg>),
                                        text: 'Matchmaking Inteligente'
                                    },
                                    {
                                        icon: (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" /><line x1="3" y1="9" x2="21" y2="9" /><line x1="9" y1="21" x2="9" y2="9" /></svg>),
                                        text: 'Dashboard en vivo'
                                    },
                                    {
                                        icon: (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /></svg>),
                                        text: 'Directorio Empresarial'
                                    },
                                ].map((item, i) => (
                                    <div key={i} style={{
                                        display: 'flex', alignItems: 'center', gap: '8px',
                                        padding: '8px 16px', borderRadius: 'var(--radius-pill)',
                                        background: 'var(--bg-glass)', border: '1px solid var(--border-color)',
                                        fontSize: '0.85rem', color: 'var(--text-secondary)',
                                        backdropFilter: 'blur(8px)',
                                    }}>
                                        <span style={{ color: 'var(--neon-blue)', display: 'flex' }}>{item.icon}</span>
                                        {item.text}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Right: Phone Image */}
                        <div className="pymatch-hero-image">
                            {/* Glow behind phone */}
                            <div style={{
                                position: 'absolute',
                                width: '400px', height: '400px',
                                borderRadius: '50%',
                                background: 'radial-gradient(circle, rgba(0, 210, 255, 0.15) 0%, transparent 70%)',
                                filter: 'blur(40px)',
                                zIndex: 0,
                            }} />
                            <Image
                                src="/cel.png"
                                alt="CONECTA 2026 App - PyMatch"
                                width={420}
                                height={550}
                                style={{
                                    objectFit: 'contain',
                                    position: 'relative',
                                    zIndex: 1,
                                    maxWidth: '100%',
                                    height: 'auto',
                                    filter: 'drop-shadow(0 20px 60px rgba(0, 210, 255, 0.15))',
                                }}
                                priority
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* ══════════ HOW IT WORKS ══════════ */}
            <section className="section" style={{ background: 'var(--bg-secondary)' }}>
                <div className="container">
                    <div style={{ textAlign: 'center' }}>
                        <div className="section-label" style={{ justifyContent: 'center' }}>Cómo funciona</div>
                        <h2 className="section-title center">
                            Networking en <span className="highlight">3 simples pasos</span>
                        </h2>
                    </div>

                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                        gap: 'var(--space-xl)',
                        maxWidth: '900px',
                        margin: 'var(--space-2xl) auto 0',
                    }}>
                        {[
                            {
                                step: '01',
                                icon: (<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--neon-blue)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><line x1="19" y1="8" x2="19" y2="14" /><line x1="22" y1="11" x2="16" y2="11" /></svg>),
                                title: 'Regístrate',
                                desc: 'Crea tu perfil empresarial con lo que ofreces y lo que buscas en el evento.'
                            },
                            {
                                step: '02',
                                icon: (<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--neon-green)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" /><circle cx="12" cy="13" r="4" /></svg>),
                                title: 'Escanea y Conecta',
                                desc: 'Escanea los gafetes QR de otros asistentes para guardarlos como contactos al instante.'
                            },
                            {
                                step: '03',
                                icon: (<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#ffd700" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>),
                                title: 'Recibe Matches',
                                desc: 'Nuestro sistema te sugiere los contactos más relevantes basándose en tus intereses.'
                            },
                        ].map((item, i) => (
                            <div key={i} className="glass-card" style={{
                                padding: 'var(--space-xl)',
                                textAlign: 'center',
                                position: 'relative',
                                overflow: 'hidden',
                            }}>
                                <div style={{
                                    position: 'absolute', top: '12px', right: '16px',
                                    fontSize: '3rem', fontWeight: 800,
                                    color: 'rgba(0, 210, 255, 0.06)',
                                    lineHeight: 1,
                                }}>{item.step}</div>
                                <div style={{ marginBottom: 'var(--space-md)', display: 'flex', justifyContent: 'center' }}>{item.icon}</div>
                                <h3 style={{ marginBottom: 'var(--space-sm)' }}>{item.title}</h3>
                                <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: 1.6 }}>{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ══════════ CTA ══════════ */}
            <section className="section cta-section">
                <div className="container" style={{ textAlign: 'center' }}>
                    <h2 className="section-title center">
                        Empieza a hacer <span className="highlight">networking inteligente</span>
                    </h2>
                    <p className="section-subtitle center">
                        Regístrate gratis y llega al evento listo para conectar con las personas indicadas.
                    </p>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: 'var(--space-md)', flexWrap: 'wrap' }}>
                        <Link href="/pymatch/registro" className="btn btn-primary btn-lg">
                            Crear mi Cuenta Gratis
                            <svg className="btn-icon" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" /></svg>
                        </Link>
                        <Link href="/" className="btn btn-outline btn-lg">
                            Volver al Evento
                        </Link>
                    </div>
                </div>
            </section>

            <Footer />

            <style jsx>{`
                .pymatch-hero-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: var(--space-3xl);
                    align-items: center;
                    min-height: 85vh;
                    padding-top: var(--space-3xl);
                }
                .pymatch-hero-content {
                    max-width: 560px;
                }
                .pymatch-hero-image {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    position: relative;
                }
                .pymatch-hero-buttons {
                    display: flex;
                    gap: var(--space-md);
                    flex-wrap: wrap;
                    margin-bottom: var(--space-2xl);
                }
                .pymatch-feature-pills {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 12px;
                }

                @media (max-width: 768px) {
                    .pymatch-hero-grid {
                        grid-template-columns: 1fr !important;
                        text-align: center;
                        padding-top: 100px !important;
                        min-height: auto !important;
                        gap: var(--space-lg) !important;
                    }
                    .pymatch-hero-content {
                        max-width: 100% !important;
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                    }
                    .pymatch-hero-image {
                        order: -1;
                        margin-bottom: var(--space-md);
                    }
                    .pymatch-hero-image img {
                        max-height: 320px !important;
                    }
                    .pymatch-hero-buttons {
                        justify-content: center;
                        width: 100%;
                    }
                    .pymatch-hero-buttons .btn {
                        width: 100%;
                        max-width: 300px;
                        justify-content: center;
                    }
                    .pymatch-feature-pills {
                        justify-content: center;
                    }
                    .hero-description {
                        max-width: 100% !important;
                    }
                }
            `}</style>
        </>
    );
}
