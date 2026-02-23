'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

export default function MatchmakingPage() {
    const [matches, setMatches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [profileIncomplete, setProfileIncomplete] = useState(false);

    useEffect(() => {
        async function fetchMatches() {
            try {
                const { data: { user } } = await supabase.auth.getUser();
                if (!user) return;

                // Check if profile has matchmaking info
                const { data: profile } = await supabase.from('profiles').select('offer_description, search_description').eq('id', user.id).single();

                if (!profile?.offer_description || !profile?.search_description) {
                    setProfileIncomplete(true);
                    setLoading(false);
                    return;
                }

                const { data, error } = await supabase.rpc('get_recommended_matches', {
                    p_user_id: user.id,
                    p_limit: 10
                });

                if (error) throw error;
                setMatches(data || []);
            } catch (err) {
                console.error("Matchmaking error:", err);
            } finally {
                setLoading(false);
            }
        }

        fetchMatches();
    }, []);

    if (loading) {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: '1rem' }}>
                <div className="loading-spinner" style={{ width: '40px', height: '40px', border: '3px solid rgba(255,255,255,0.1)', borderTopColor: 'var(--neon-blue)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                <p style={{ color: 'var(--text-secondary)' }}>Analizando perfiles y oportunidades...</p>
                <style jsx>{` @keyframes spin { to { transform: rotate(360deg); } } `}</style>
            </div>
        );
    }

    if (profileIncomplete) {
        return (
            <div className="glass-card" style={{ padding: 'var(--space-3xl)', textAlign: 'center', maxWidth: '600px', margin: '4rem auto' }}>
                <div style={{ color: 'var(--accent-warn)', marginBottom: 'var(--space-xl)' }}>
                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                    </svg>
                </div>
                <h2 style={{ fontSize: '1.8rem', marginBottom: 'var(--space-md)' }}>Perfil Incompleto</h2>
                <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-2xl)', lineHeight: 1.6 }}>
                    Para activar el Matchmaking Inteligente, necesitamos saber qué ofreces y qué buscas en el evento.
                </p>
                <Link href="/dashboard" className="btn btn-primary">Completar mi Perfil</Link>
            </div>
        );
    }

    return (
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
            <div style={{ marginBottom: 'var(--space-2xl)' }}>
                <h1 className="section-title" style={{ fontSize: '2.5rem', marginBottom: 'var(--space-sm)' }}>
                    Matchmaking <span className="highlight">Inteligente</span>
                </h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
                    Sugerencias automáticas basadas en tus intereses profesionales y oferta comercial.
                </p>
            </div>

            {matches.length === 0 ? (
                <div className="glass-card" style={{ padding: 'var(--space-3xl)', textAlign: 'center' }}>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
                        No encontramos coincidencias exactas por ahora. Prueba ajustando tus descripciones en el perfil.
                    </p>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 'var(--space-lg)' }}>
                    {matches.map((match, i) => (
                        <div key={i} className="glass-card" style={{
                            padding: 'var(--space-lg)',
                            display: 'flex',
                            gap: 'var(--space-xl)',
                            alignItems: 'center',
                            border: '1px solid rgba(255,255,255,0.05)',
                            transition: 'all 0.3s ease',
                            animation: `slideIn 0.5s ease-out forwards ${i * 0.1}s`,
                            opacity: 0
                        }}>
                            {/* Avatar / Logo */}
                            <div style={{
                                width: 80, height: 80,
                                borderRadius: match.match_type === 'profile' ? '50%' : 'var(--radius-md)',
                                background: match.match_type === 'profile' ? 'rgba(37, 99, 235, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                                border: `1px solid ${match.match_type === 'profile' ? 'rgba(37, 99, 235, 0.2)' : 'rgba(16, 185, 129, 0.2)'}`,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                flexShrink: 0,
                                overflow: 'hidden'
                            }}>
                                {match.match_photo ? (
                                    <img src={match.match_photo} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                ) : (
                                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                        {match.match_type === 'profile' ? (
                                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 7a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" />
                                        ) : (
                                            <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                                        )}
                                    </svg>
                                )}
                            </div>

                            <div style={{ flex: 1 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                                    <h3 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>{match.match_name}</h3>
                                    <span style={{
                                        fontSize: '0.65rem', padding: '2px 8px', borderRadius: '10px',
                                        background: match.match_type === 'profile' ? 'rgba(37, 99, 235, 0.2)' : 'rgba(16, 185, 129, 0.2)',
                                        color: match.match_type === 'profile' ? 'var(--neon-blue)' : 'var(--accent-success)',
                                        textTransform: 'uppercase', fontWeight: 800
                                    }}>
                                        {match.match_type === 'profile' ? 'Asistente' : 'Empresa'}
                                    </span>
                                </div>
                                <p style={{ color: 'var(--text-secondary)', marginBottom: '12px' }}>
                                    {match.match_title} {match.match_company ? `@ ${match.match_company}` : ''}
                                </p>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-light)', fontSize: '0.85rem' }}>
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14M22 4L12 14.01l-3-3" /></svg>
                                    {match.match_reason}
                                </div>
                            </div>

                            <div style={{ textAlign: 'right' }}>
                                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--neon-blue)', marginBottom: '4px' }}>
                                    {Math.round(match.match_score * 100)}%
                                </div>
                                <div style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>Match</div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <style jsx global>{`
                @keyframes slideIn {
                    from { transform: translateX(-20px); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
            `}</style>
        </div>
    );
}
