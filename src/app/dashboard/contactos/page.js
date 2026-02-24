'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

export default function MisContactosPage() {
    const [leads, setLeads] = useState([]);
    const [loading, setLoading] = useState(true);
    const [userRole, setUserRole] = useState('attendee');

    useEffect(() => {
        async function fetchMyLeads() {
            try {
                const { data: { session } } = await supabase.auth.getSession();
                const user = session?.user;
                if (!user) return;

                // Sync role
                const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
                if (profile?.role) setUserRole(profile.role);

                // Active Event ID
                const ACTIVE_EVENT_ID = null;

                const { data, error } = await supabase.rpc('get_my_leads', {
                    p_user_id: user.id,
                    p_event_id: ACTIVE_EVENT_ID
                });

                if (error) {
                    console.warn("Could not fetch leads:", error.message);
                } else if (data) {
                    setLeads(data);
                }
            } catch (err) {
                console.error("Error fetching leads:", err);
            } finally {
                setLoading(false);
            }
        }

        fetchMyLeads();
    }, []);

    const handleUpdateInterest = async (connectionId, newInterest) => {
        try {
            const { error } = await supabase
                .from('connections')
                .update({ interest_level: newInterest })
                .eq('id', connectionId);

            if (!error) {
                setLeads(prev => prev.map(lead =>
                    lead.connection_id === connectionId
                        ? { ...lead, interest_level: newInterest }
                        : lead
                ));
            }
        } catch (e) {
            console.error("Update failed:", e);
        }
    }

    if (loading) {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: '1rem' }}>
                <div className="loading-spinner" style={{ width: '40px', height: '40px', border: '3px solid rgba(255,255,255,0.1)', borderTopColor: 'var(--neon-blue)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                <p style={{ color: 'var(--text-secondary)' }}>Recuperando red de contactos...</p>
                <style jsx>{`
                    @keyframes spin { to { transform: rotate(360deg); } }
                `}</style>
            </div>
        );
    }

    const subtitleText = userRole === 'attendee'
        ? 'Personas y empresas que has marcado como relevantes para tu crecimiento.'
        : 'Prospectos capturados durante el evento para seguimiento comercial.';

    return (
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
            <div style={{ marginBottom: 'var(--space-2xl)' }}>
                <h1 className="section-title" style={{ fontSize: '2.5rem', marginBottom: 'var(--space-sm)' }}>
                    {userRole === 'attendee' ? 'Mis ' : 'Mis '} <span className="highlight">{userRole === 'attendee' ? 'Intereses' : 'Leads'}</span>
                </h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
                    {subtitleText}
                </p>
            </div>

            {leads.length === 0 ? (
                <div className="glass-card" style={{ padding: 'var(--space-3xl)', textAlign: 'center', border: '1px dashed rgba(255,255,255,0.1)' }}>
                    <div style={{ color: 'var(--text-tertiary)', marginBottom: 'var(--space-lg)' }}>
                        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                            <circle cx="9" cy="7" r="4"></circle>
                            <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                        </svg>
                    </div>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: '400px', margin: '0 auto 1.5rem' }}>
                        Aún no has registrado conexiones. Comienza a escanear gafetes para construir tu red.
                    </p>
                    <Link href="/dashboard/escaner" className="btn btn-primary">Abrir Escáner</Link>
                </div>
            ) : (
                <>
                    <div className="leads-grid">
                        {leads.map((lead) => (
                            <div key={lead.connection_id} className="glass-card lead-card" style={{
                                padding: 'var(--space-lg)',
                                display: 'flex',
                                gap: 'var(--space-lg)',
                                alignItems: 'center',
                                border: '1px solid rgba(255,255,255,0.05)',
                                transition: 'transform 0.2s ease',
                                cursor: 'default'
                            }}>
                                {/* Photo / Avatar */}
                                <div style={{
                                    width: 60, height: 60,
                                    borderRadius: 'var(--radius-md)',
                                    background: 'rgba(37, 99, 235, 0.1)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    border: '1px solid rgba(37, 99, 235, 0.2)',
                                    flexShrink: 0
                                }}>
                                    {lead.photo_url ? (
                                        <img src={lead.photo_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 'var(--radius-md)' }} />
                                    ) : (
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--neon-blue)" strokeWidth="2">
                                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                            <circle cx="12" cy="7" r="4"></circle>
                                        </svg>
                                    )}
                                </div>

                                <div style={{ flex: 1, minWidth: 0 }}> {/* minWidth 0 prevents text overflow in flex flex-1 items */}
                                    <h3 style={{ fontSize: '1.1rem', marginBottom: '2px', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{lead.contact_name}</h3>
                                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '8px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                        {lead.contact_title} {lead.company_name ? `@ ${lead.company_name}` : ''}
                                    </p>

                                    <div className="lead-priority-control" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: 700 }}>Prioridad</div>
                                        <div style={{ display: 'flex', gap: '4px' }}>
                                            {[1, 2, 3, 4, 5].map(level => (
                                                <button
                                                    key={level}
                                                    onClick={() => handleUpdateInterest(lead.connection_id, level)}
                                                    style={{
                                                        width: 24, height: 24,
                                                        borderRadius: '4px',
                                                        border: '1px solid var(--surface-border)',
                                                        background: lead.interest_level >= level ? 'var(--neon-blue)' : 'rgba(255,255,255,0.05)',
                                                        cursor: 'pointer',
                                                        transition: 'all 0.2s ease'
                                                    }}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="lead-date-label" style={{ textAlign: 'right' }}>
                                    <div style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)' }}>
                                        {lead.scanned_at ? new Date(lead.scanned_at).toLocaleDateString() : 'Hoy'}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <style jsx>{`
                        .leads-grid {
                            display: grid;
                            grid-template-columns: repeat(auto-fill, minmax(450px, 1fr));
                            gap: var(--space-lg);
                        }

                        @media (max-width: 768px) {
                            .leads-grid {
                                grid-template-columns: 1fr;
                            }

                            .lead-card {
                                flex-wrap: wrap; /* Allow contents to wrap if very tight */
                                gap: var(--space-md) !important;
                            }

                            .lead-priority-control {
                                flex-direction: column;
                                align-items: flex-start !important;
                                gap: 4px !important;
                            }

                            .lead-date-label {
                                position: absolute;
                                top: 1rem;
                                right: 1rem;
                            }
                        }
                    `}</style>
                </>
            )}
        </div>
    );
}
