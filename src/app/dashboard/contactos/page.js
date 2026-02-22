'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function MisContactosPage() {
    const [leads, setLeads] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchMyLeads() {
            try {
                const { data: { user } } = await supabase.auth.getUser();
                if (!user) return;

                // Active Event ID (Can be dynamic later)
                const ACTIVE_EVENT_ID = 'e19b5b24-b19b-4f9e-a892-12b2a6f2b4c1'; // Default seed UUID

                const { data, error } = await supabase.rpc('get_my_leads', {
                    p_user_id: user.id,
                    p_event_id: ACTIVE_EVENT_ID
                });

                if (error) {
                    // Suppress if event ID is wrong on a fresh DB, just show empty
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
        return <div style={{ padding: 'var(--space-xl)' }}>Cargando contactos...</div>;
    }

    return (
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
            <div style={{ marginBottom: 'var(--space-xl)' }}>
                <h1 className="section-title" style={{ fontSize: '2rem', marginBottom: 'var(--space-sm)' }}>
                    Mis <span className="highlight">Contactos</span>
                </h1>
                <p style={{ color: 'var(--text-secondary)' }}>
                    Aquí aparecerán todas las personas que has escaneado en el evento.
                </p>
            </div>

            {leads.length === 0 ? (
                <div className="glass-card" style={{ padding: 'var(--space-2xl)', textAlign: 'center' }}>
                    <div style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-md)' }}>
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                        </svg>
                    </div>
                    <h3 style={{ fontSize: '1.2rem', marginBottom: 'var(--space-sm)' }}>Aún no tienes contactos</h3>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                        Usa la herramienta "Escanear Contacto" para leer los gafetes de otros asistentes y añadirlos aquí.
                    </p>
                </div>
            ) : (
                <div style={{ display: 'grid', gap: 'var(--space-md)' }}>
                    {leads.map((lead) => (
                        <div key={lead.connection_id} className="glass-card" style={{
                            padding: 'var(--space-lg)',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}>
                            <div>
                                <h3 style={{ fontSize: '1.2rem', marginBottom: '4px' }}>{lead.contact_name}</h3>
                                {lead.company_name && (
                                    <div style={{
                                        fontSize: '0.85rem',
                                        color: 'var(--accent-light)',
                                        background: 'rgba(37, 99, 235, 0.1)',
                                        padding: '2px 8px',
                                        borderRadius: 'var(--radius-pill)',
                                        display: 'inline-block',
                                        marginBottom: '8px'
                                    }}>
                                        {lead.company_name}
                                    </div>
                                )}
                                <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                                    {lead.scanned_at ? new Date(lead.scanned_at).toLocaleString() : 'Recientemente'}
                                </div>
                            </div>

                            <div style={{ textAlign: 'right' }}>
                                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                    Nivel de interés (1-5)
                                </div>
                                <div style={{ display: 'flex', gap: '4px' }}>
                                    {[1, 2, 3, 4, 5].map(level => (
                                        <button
                                            key={level}
                                            onClick={() => handleUpdateInterest(lead.connection_id, level)}
                                            style={{
                                                width: 32, height: 32,
                                                borderRadius: '50%',
                                                border: '1px solid var(--surface-border)',
                                                background: lead.interest_level >= level ? 'var(--accent-warn)' : 'transparent',
                                                color: lead.interest_level >= level ? 'var(--bg-primary)' : 'var(--text-secondary)',
                                                cursor: 'pointer',
                                                transition: 'all 0.2s ease',
                                                fontWeight: 'bold'
                                            }}
                                        >
                                            {level}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
