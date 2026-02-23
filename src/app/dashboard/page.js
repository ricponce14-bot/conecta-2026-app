'use client';

import { useEffect, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { supabase } from '@/lib/supabase';

export default function DashboardPage() {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchProfile() {
            try {
                const { data: { user } } = await supabase.auth.getUser();
                if (!user) return;

                const { data, error } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', user.id)
                    .single();

                if (error) throw error;
                setProfile(data);
            } catch (err) {
                console.error("Error fetching profile:", err.message);
            } finally {
                setLoading(false);
            }
        }

        fetchProfile();
    }, []);

    if (loading) {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: '1rem' }}>
                <div className="loading-spinner" style={{ width: '40px', height: '40px', border: '3px solid rgba(255,255,255,0.1)', borderTopColor: 'var(--neon-blue)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                <p style={{ color: 'var(--text-secondary)' }}>Cargando tu gafete digital...</p>
                <style jsx>{`
                    @keyframes spin { to { transform: rotate(360deg); } }
                `}</style>
            </div>
        );
    }

    if (!profile) {
        return (
            <div style={{ textAlign: 'center', padding: 'var(--space-2xl)', background: 'rgba(239, 68, 68, 0.05)', borderRadius: 'var(--radius-lg)', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚠️</div>
                <h2 style={{ color: '#fca5a5', marginBottom: 'var(--space-md)' }}>Perfil no encontrado</h2>
                <p style={{ color: 'var(--text-tertiary)', maxWidth: '400px', margin: '0 auto 2rem' }}>
                    No pudimos cargar la información de tu cuenta. Esto puede pasar si el registro fue incompleto.
                </p>
                <button onClick={() => window.location.reload()} className="btn btn-outline" style={{ marginRight: '1rem' }}>Reintentar</button>
                <Link href="/login" className="btn btn-primary" onClick={async () => await supabase.auth.signOut()}>Cerrar Sesión e intentar de nuevo</Link>
            </div>
        );
    }

    // Role Label Mapping
    const roleLabels = {
        'admin': 'Administrador',
        'attendee': 'Asistente General',
        'company_rep': 'Representante / Stand'
    };

    return (
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
            <div style={{ marginBottom: 'var(--space-xl)' }}>
                <h1 className="section-title" style={{ fontSize: '2rem', marginBottom: 'var(--space-sm)' }}>
                    Bienvenido, <span className="highlight">{profile.full_name?.split(' ')[0]}</span>
                </h1>
                <p style={{ color: 'var(--text-secondary)' }}>
                    Presenta este código QR en el evento para intercambiar datos de contacto rápidamente.
                </p>
            </div>

            <div className="glass-card" style={{
                padding: 'var(--space-3xl) var(--space-xl)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                background: 'linear-gradient(180deg, rgba(37, 99, 235, 0.05), rgba(6, 11, 24, 0.8))'
            }}>
                <div style={{
                    background: 'white',
                    padding: 'var(--space-md)',
                    borderRadius: 'var(--radius-lg)',
                    marginBottom: 'var(--space-xl)'
                }}>
                    {profile.qr_code_id ? (
                        <QRCodeSVG
                            value={profile.qr_code_id}
                            size={220}
                            level="H"
                        />
                    ) : (
                        <div style={{ width: 220, height: 220, background: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#666' }}>No QR</div>
                    )}
                </div>

                <h2 style={{ fontSize: '1.4rem', marginBottom: 'var(--space-xs)' }}>{profile.full_name}</h2>

                <div style={{
                    display: 'inline-block',
                    background: 'rgba(37, 99, 235, 0.15)',
                    color: 'var(--accent-light)',
                    padding: '4px 12px',
                    borderRadius: 'var(--radius-pill)',
                    fontSize: '0.85rem',
                    fontWeight: '600',
                    marginTop: 'var(--space-sm)'
                }}>
                    {roleLabels[profile.role] || profile.role}
                </div>
            </div>

            <div className="glass-card" style={{ padding: 'var(--space-lg)', marginTop: 'var(--space-lg)' }}>
                <h3 style={{ fontSize: '1rem', marginBottom: 'var(--space-sm)' }}>ℹ️ ¿Cómo funciona?</h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                    Cuando otros asistentes o empresas escaneen este código desde su propia app de CONECTA 2026,
                    les aparecerán tus datos automáticamente en su directorio de &quot;Mis Leads&quot;. Tú puedes hacer lo mismo
                    desde el menú &quot;Escanear Contacto&quot;.
                </p>
            </div>
        </div>
    );
}
