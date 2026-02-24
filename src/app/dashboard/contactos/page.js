'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

export default function MisContactosPage() {
    const [leads, setLeads] = useState([]);
    const [loading, setLoading] = useState(true);
    const [userRole, setUserRole] = useState('attendee');
    const [selectedLead, setSelectedLead] = useState(null);

    useEffect(() => {
        async function fetchMyLeads() {
            try {
                const { data: { session } } = await supabase.auth.getSession();
                const user = session?.user;
                if (!user) return;

                // Sync role
                const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
                if (profile?.role) setUserRole(profile.role);

                // Active Event ID (Set to null to avoid FK constraints)
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
                                cursor: 'pointer'
                            }} onClick={() => setSelectedLead(lead)}>
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

                                    <div className="lead-priority-control" style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxWidth: '200px', width: '100%' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <div style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: 800 }}>Prioridad / Interés</div>
                                            <div style={{ fontSize: '0.85rem', fontWeight: 800, color: lead.interest_level >= 4 ? '#ff4d4d' : lead.interest_level >= 3 ? '#fbbf24' : 'var(--neon-blue)' }}>
                                                {lead.interest_level || 1}/5
                                            </div>
                                        </div>
                                        <div onClick={e => e.stopPropagation()} style={{ width: '100%', padding: '4px 0' }}>
                                            <input
                                                type="range"
                                                min="1"
                                                max="5"
                                                step="1"
                                                value={lead.interest_level || 1}
                                                onChange={(e) => {
                                                    const val = parseInt(e.target.value);
                                                    setLeads(prev => prev.map(l => l.connection_id === lead.connection_id ? { ...l, interest_level: val } : l));
                                                }}
                                                onMouseUp={(e) => handleUpdateInterest(lead.connection_id, parseInt(e.target.value))}
                                                onTouchEnd={(e) => handleUpdateInterest(lead.connection_id, parseInt(e.target.value))}
                                                className="premium-slider"
                                            />
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
                        
                        .lead-card:hover {
                            transform: translateY(-2px);
                            border-color: var(--neon-blue) !important;
                            background: rgba(255, 255, 255, 0.05) !important;
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

                        .lead-modal-overlay {
                            position: fixed;
                            top: 0;
                            left: 0;
                            right: 0;
                            bottom: 0;
                            background: rgba(0, 0, 0, 0.8);
                            backdrop-filter: blur(8px);
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            z-index: 1000;
                            padding: var(--space-lg);
                        }

                        .lead-modal-content {
                            background: var(--bg-secondary);
                            border: 1px solid var(--surface-border);
                            border-radius: var(--radius-xl);
                            width: 100%;
                            max-width: 600px;
                            max-height: 90vh;
                            overflow-y: auto;
                            position: relative;
                            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
                        }

                        .modal-close {
                            position: absolute;
                            top: 1rem;
                            right: 1rem;
                            background: rgba(255,255,255,0.05);
                            border: none;
                            color: white;
                            width: 32px;
                            height: 32px;
                            border-radius: 50%;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            cursor: pointer;
                            z-index: 10;
                        }

                        .premium-slider {
                            -webkit-appearance: none;
                            width: 100%;
                            height: 8px;
                            border-radius: 4px;
                            background: linear-gradient(to right, #2563eb, #ef4444);
                            outline: none;
                            opacity: 0.9;
                            transition: opacity .2s;
                            cursor: pointer;
                        }

                        .premium-slider:hover {
                            opacity: 1;
                        }

                        .premium-slider::-webkit-slider-thumb {
                            -webkit-appearance: none;
                            appearance: none;
                            width: 24px;
                            height: 24px;
                            border-radius: 50%;
                            background: #ffffff;
                            cursor: pointer;
                            border: 3px solid var(--neon-blue);
                            box-shadow: 0 0 15px var(--neon-blue), 0 0 5px rgba(0,0,0,0.5);
                            transition: all 0.2s ease;
                        }

                        .premium-slider::-webkit-slider-thumb:hover {
                            transform: scale(1.2);
                        }

                        .premium-slider::-moz-range-thumb {
                            width: 24px;
                            height: 24px;
                            border-radius: 50%;
                            background: #ffffff;
                            cursor: pointer;
                            border: 3px solid var(--neon-blue);
                            box-shadow: 0 0 15px var(--neon-blue);
                        }
                    `}</style>

                    {/* Lead Detail Modal */}
                    {selectedLead && (
                        <div className="lead-modal-overlay" onClick={() => setSelectedLead(null)}>
                            <div className="lead-modal-content" onClick={e => e.stopPropagation()}>
                                <button className="modal-close" onClick={() => setSelectedLead(null)}>×</button>

                                <div style={{ padding: 'var(--space-2xl)' }}>
                                    <div style={{ display: 'flex', gap: 'var(--space-xl)', marginBottom: 'var(--space-2xl)', alignItems: 'center' }}>
                                        <div style={{
                                            width: 100, height: 100,
                                            borderRadius: 'var(--radius-lg)',
                                            overflow: 'hidden',
                                            border: '2px solid var(--neon-blue)',
                                            background: 'rgba(37, 99, 235, 0.1)',
                                            flexShrink: 0
                                        }}>
                                            {selectedLead.photo_url ? (
                                                <img src={selectedLead.photo_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                            ) : (
                                                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--neon-blue)" strokeWidth="1.5">
                                                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                                        <circle cx="12" cy="7" r="4"></circle>
                                                    </svg>
                                                </div>
                                            )}
                                        </div>
                                        <div>
                                            <h2 style={{ fontSize: '1.8rem', fontWeight: 700, marginBottom: '4px' }}>{selectedLead.contact_name}</h2>
                                            <p style={{ fontSize: '1.1rem', color: 'var(--neon-blue)', fontWeight: 600 }}>{selectedLead.contact_title || 'Asistente'}</p>
                                            {selectedLead.company_name && (
                                                <p style={{ color: 'var(--text-secondary)' }}>{selectedLead.company_name}</p>
                                            )}
                                        </div>
                                    </div>

                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-lg)', marginBottom: 'var(--space-2xl)' }}>
                                        {selectedLead.contact_whatsapp && (
                                            <a
                                                href={`https://wa.me/${selectedLead.contact_whatsapp.replace(/\D/g, '')}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="btn btn-outline"
                                                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '12px' }}
                                            >
                                                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" /></svg>
                                                WhatsApp
                                            </a>
                                        )}
                                        {selectedLead.contact_email && (
                                            <a
                                                href={`mailto:${selectedLead.contact_email}`}
                                                className="btn btn-outline"
                                                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '12px' }}
                                            >
                                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                                                Email
                                            </a>
                                        )}
                                    </div>

                                    {selectedLead.offer_description && (
                                        <div style={{ marginBottom: 'var(--space-xl)' }}>
                                            <h4 style={{ fontSize: '0.9rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', marginBottom: '8px' }}>Propuesta / Lo que ofrece</h4>
                                            <div style={{ padding: 'var(--space-md)', background: 'rgba(255,255,255,0.03)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(255,255,255,0.05)' }}>
                                                {selectedLead.offer_description}
                                            </div>
                                        </div>
                                    )}

                                    {selectedLead.search_description && (
                                        <div style={{ marginBottom: 'var(--space-xl)' }}>
                                            <h4 style={{ fontSize: '0.9rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', marginBottom: '8px' }}>Intereses / Lo que busca</h4>
                                            <div style={{ padding: 'var(--space-md)', background: 'rgba(255,255,255,0.03)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(255,255,255,0.05)' }}>
                                                {selectedLead.search_description}
                                            </div>
                                        </div>
                                    )}

                                    {selectedLead.gallery_urls && selectedLead.gallery_urls.length > 0 && (
                                        <div style={{ marginBottom: 'var(--space-xl)' }}>
                                            <h4 style={{ fontSize: '0.9rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', marginBottom: '8px' }}>Galería de Negocio</h4>
                                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '12px' }}>
                                                {selectedLead.gallery_urls.map((url, i) => (
                                                    <div key={i} style={{ aspectRatio: '1', borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
                                                        <img src={url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    <div style={{ marginTop: 'var(--space-2xl)', pt: 'var(--space-xl)', borderTop: '1px solid rgba(255,255,255,0.05)', textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>
                                        Contacto sincronizado el {new Date(selectedLead.scanned_at).toLocaleDateString()}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
