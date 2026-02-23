'use client';

import { useEffect, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

export default function DashboardPage() {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [fetchError, setFetchError] = useState(null);

    const [editing, setEditing] = useState(false);
    const [editData, setEditData] = useState({});
    const [updating, setUpdating] = useState(false);

    useEffect(() => {
        async function fetchProfile() {
            try {
                setFetchError(null);
                const { data: { session }, error: authError } = await supabase.auth.getSession();
                const user = session?.user;
                if (authError) throw authError;
                if (!user) {
                    setFetchError("No se encontró sesión activa.");
                    return;
                }

                let { data, error } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', user.id)
                    .single();

                if (error && error.code === 'PGRST116') {
                    // Profile doesn't exist, try to create it
                    const metadata = user.user_metadata || {};
                    const newProfile = {
                        id: user.id,
                        email: user.email,
                        full_name: metadata.full_name || user.email.split('@')[0],
                        role: metadata.role || 'attendee',
                        whatsapp: metadata.whatsapp || '',
                        qr_code_id: `qr_${user.id.substring(0, 8)}_${Date.now()}`
                    };

                    const { data: created, error: insertError } = await supabase
                        .from('profiles')
                        .insert([newProfile])
                        .select()
                        .single();

                    if (insertError) throw insertError;
                    data = created;
                } else if (error) {
                    throw error;
                }

                setProfile(data);
                setEditData(data);
            } catch (err) {
                console.error("Error fetching/syncing profile:", err);
                setFetchError(err.message || "Error desconocido al sincronizar.");
            } finally {
                setLoading(false);
            }
        }

        fetchProfile();
    }, []);

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setUpdating(true);
        try {
            const { error } = await supabase
                .from('profiles')
                .update({
                    full_name: editData.full_name,
                    title: editData.title,
                    company_name: editData.company_name,
                    whatsapp: editData.whatsapp,
                    offer_description: editData.offer_description,
                    search_description: editData.search_description
                })
                .eq('id', profile.id);

            if (error) throw error;
            setProfile({ ...profile, ...editData });
            setEditing(false);
        } catch (err) {
            alert("Error al actualizar: " + err.message);
        } finally {
            setUpdating(false);
        }
    };

    if (loading) {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: '1rem' }}>
                <div className="loading-spinner" style={{ width: '40px', height: '40px', border: '3px solid rgba(255,255,255,0.1)', borderTopColor: 'var(--neon-blue)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                <p style={{ color: 'var(--text-secondary)' }}>Sincronizando perfil corporativo...</p>
                <style jsx>{`
                    @keyframes spin { to { transform: rotate(360deg); } }
                `}</style>
            </div>
        );
    }

    if (!profile) {
        return (
            <div style={{ textAlign: 'center', padding: 'var(--space-2xl)', background: 'rgba(239, 68, 68, 0.05)', borderRadius: 'var(--radius-lg)', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
                <h2 style={{ color: '#fca5a5', marginBottom: 'var(--space-md)' }}>Perfil no sincronizado</h2>
                <p style={{ color: 'var(--text-tertiary)', maxWidth: '400px', margin: '0 auto 1.5rem' }}>
                    No pudimos cargar la información de tu cuenta corporativa.
                </p>
                {fetchError && (
                    <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', fontSize: '0.85rem', color: '#fca5a5', fontFamily: 'monospace' }}>
                        Error: {fetchError}
                    </div>
                )}
                <button onClick={() => window.location.reload()} className="btn btn-outline" style={{ marginRight: '1rem' }}>Reintentar</button>
                <Link href="/login" className="btn btn-primary" onClick={async () => await supabase.auth.signOut()}>Reautenticar</Link>
            </div>
        );
    }

    const roleLabels = {
        'admin': 'Administrador',
        'attendee': 'Asistente General',
        'company_rep': 'Representante de Empresa'
    };

    return (
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 'var(--space-2xl)', alignItems: 'start' }}>

                {/* Left: Interactive Gafete */}
                <div>
                    <div style={{ marginBottom: 'var(--space-xl)' }}>
                        <h1 className="section-title" style={{ fontSize: '2.5rem', marginBottom: 'var(--space-sm)' }}>
                            Mi Perfil <span className="highlight">Digital</span>
                        </h1>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
                            Gestiona tu identidad profesional y conecta con otros asistentes.
                        </p>
                    </div>

                    <div className="glass-card" style={{ padding: 'var(--space-xl)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-xl)' }}>
                            <h3 style={{ fontSize: '1.2rem', margin: 0, color: 'var(--neon-blue)' }}>Datos del Perfil</h3>
                            <button onClick={() => setEditing(!editing)} className="btn btn-outline" style={{ padding: '0.4rem 1rem', fontSize: '0.85rem' }}>
                                {editing ? 'Cancelar' : 'Editar Datos'}
                            </button>
                        </div>

                        {!editing ? (
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-xl)' }}>
                                <div>
                                    <label style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Nombre</label>
                                    <p style={{ fontSize: '1.1rem', marginBottom: 'var(--space-lg)', fontWeight: 500 }}>{profile.full_name}</p>

                                    <label style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Cargo / Profesión</label>
                                    <p style={{ fontSize: '1.1rem', marginBottom: 'var(--space-lg)', fontWeight: 500 }}>{profile.title || 'No especificado'}</p>
                                </div>
                                <div>
                                    <label style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Empresa</label>
                                    <p style={{ fontSize: '1.1rem', marginBottom: 'var(--space-lg)', fontWeight: 500 }}>{profile.company_name || 'Independiente'}</p>

                                    <label style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>WhatsApp</label>
                                    <p style={{ fontSize: '1.1rem', marginBottom: 'var(--space-lg)', fontWeight: 500 }}>{profile.whatsapp || 'No especificado'}</p>
                                </div>
                                <div style={{ gridColumn: '1 / span 2', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: 'var(--space-lg)' }}>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-xl)' }}>
                                        <div>
                                            <label style={{ fontSize: '0.75rem', color: 'var(--accent-success)', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700 }}>Lo que ofrezco</label>
                                            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '4px' }}>{profile.offer_description || 'No especificado'}</p>
                                        </div>
                                        <div>
                                            <label style={{ fontSize: '0.75rem', color: 'var(--accent-warn)', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700 }}>Lo que busco</label>
                                            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '4px' }}>{profile.search_description || 'No especificado'}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <form onSubmit={handleUpdateProfile} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-md)' }}>
                                <div style={{ gridColumn: '1 / span 2' }}>
                                    <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Nombre Completo</label>
                                    <input
                                        type="text"
                                        className="filter-input"
                                        style={{ width: '100%' }}
                                        value={editData.full_name || ''}
                                        onChange={e => setEditData({ ...editData, full_name: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Cargo / Título</label>
                                    <input
                                        type="text"
                                        className="filter-input"
                                        style={{ width: '100%' }}
                                        placeholder="Ej. Director General"
                                        value={editData.title || ''}
                                        onChange={e => setEditData({ ...editData, title: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Empresa</label>
                                    <input
                                        type="text"
                                        className="filter-input"
                                        style={{ width: '100%' }}
                                        placeholder="Nombre de tu empresa"
                                        value={editData.company_name || ''}
                                        onChange={e => setEditData({ ...editData, company_name: e.target.value })}
                                    />
                                </div>
                                <div style={{ gridColumn: '1 / span 2' }}>
                                    <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>WhatsApp Corporativo</label>
                                    <input
                                        type="text"
                                        className="filter-input"
                                        style={{ width: '100%' }}
                                        value={editData.whatsapp || ''}
                                        onChange={e => setEditData({ ...editData, whatsapp: e.target.value })}
                                    />
                                </div>
                                <div style={{ gridColumn: '1 / span 2' }}>
                                    <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--accent-success)', marginBottom: '4px' }}>¿Qué ofreces? (Para Matchmaking)</label>
                                    <textarea
                                        className="filter-input"
                                        style={{ width: '100%', minHeight: '80px', paddingTop: '10px' }}
                                        placeholder="Ej. Servicios de consultoría legal, Desarrollo de software..."
                                        value={editData.offer_description || ''}
                                        onChange={e => setEditData({ ...editData, offer_description: e.target.value })}
                                    />
                                </div>
                                <div style={{ gridColumn: '1 / span 2' }}>
                                    <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--accent-warn)', marginBottom: '4px' }}>¿Qué buscas? (Para Matchmaking)</label>
                                    <textarea
                                        className="filter-input"
                                        style={{ width: '100%', minHeight: '80px', paddingTop: '10px' }}
                                        placeholder="Ej. Proveedores de empaque, Socios estratégicos..."
                                        value={editData.search_description || ''}
                                        onChange={e => setEditData({ ...editData, search_description: e.target.value })}
                                    />
                                </div>
                                <div style={{ gridColumn: '1 / span 2', marginTop: 'var(--space-md)' }}>
                                    <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={updating}>
                                        {updating ? 'Guardando...' : 'Actualizar Perfil'}
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>

                {/* Right: The Badge Visual */}
                <div style={{ position: 'sticky', top: 'var(--space-xl)' }}>
                    <div className="glass-card" style={{
                        padding: 'var(--space-2xl) var(--space-xl)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        textAlign: 'center',
                        background: 'linear-gradient(180deg, rgba(37, 99, 235, 0.1), rgba(6, 11, 24, 0.95))',
                        border: '1px solid rgba(37, 99, 235, 0.3)',
                        boxShadow: '0 20px 40px rgba(0,0,0,0.4)'
                    }}>
                        {/* Photo placeholder until Storage is ready */}
                        <div style={{
                            width: 100, height: 100,
                            borderRadius: '50%',
                            background: 'linear-gradient(45deg, var(--bg-secondary), var(--surface-border))',
                            border: '2px solid var(--neon-blue)',
                            marginBottom: 'var(--space-xl)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}>
                            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5">
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                <circle cx="12" cy="7" r="4"></circle>
                            </svg>
                        </div>

                        <div style={{
                            background: 'white',
                            padding: 'var(--space-md)',
                            borderRadius: 'var(--radius-lg)',
                            marginBottom: 'var(--space-xl)',
                            boxShadow: '0 10px 20px rgba(0,0,0,0.2)'
                        }}>
                            {profile.qr_code_id ? (
                                <QRCodeSVG value={profile.qr_code_id} size={180} level="H" />
                            ) : (
                                <div style={{ width: 180, height: 180, background: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#666' }}>ID No Generado</div>
                            )}
                        </div>

                        <h2 style={{ fontSize: '1.4rem', marginBottom: '4px', fontWeight: 700 }}>{profile.full_name}</h2>
                        <p style={{ fontSize: '0.9rem', color: 'var(--accent-light)', marginBottom: 'var(--space-md)', fontWeight: 600 }}>{profile.title || roleLabels[profile.role]}</p>

                        <div style={{
                            display: 'inline-block',
                            background: 'rgba(255, 255, 255, 0.05)',
                            padding: '6px 16px',
                            borderRadius: 'var(--radius-pill)',
                            fontSize: '0.75rem',
                            fontWeight: '700',
                            textTransform: 'uppercase',
                            letterSpacing: '0.1em',
                            border: '1px solid rgba(255,255,255,0.1)'
                        }}>
                            {profile.company_name || 'Asistente'}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
