'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function ResetPasswordPage() {
    const router = useRouter();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    // Ensure we have a session (Supabase handles this via the recovery link)
    useEffect(() => {
        const checkSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                setError('El enlace de recuperación ha expirado o no es válido. Por favor, solicita uno nuevo.');
            }
        };
        checkSession();
    }, []);

    const handlePasswordUpdate = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setError('Las contraseñas no coinciden.');
            return;
        }

        if (password.length < 6) {
            setError('La contraseña debe tener al menos 6 caracteres.');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const { error } = await supabase.auth.updateUser({
                password: password
            });

            if (error) throw error;

            setSuccess(true);
            setTimeout(() => {
                router.push('/login');
            }, 3000);

        } catch (err) {
            setError(err.message || 'Error al actualizar la contraseña. Intenta nuevamente.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Navbar />

            <div className="page-header" style={{ paddingBottom: 'var(--space-2xl)' }}>
                <div className="container" style={{ textAlign: 'center' }}>
                    <div className="section-label">Seguridad de Cuenta</div>
                    <h1 className="section-title">
                        Restablecer <span className="highlight">Contraseña</span>
                    </h1>
                    <p className="section-subtitle center">
                        Ingresa tu nueva contraseña para recuperar el acceso a tu cuenta de CONECTA 2026.
                    </p>
                </div>
            </div>

            <section className="section" style={{ paddingTop: 0, minHeight: '50vh' }}>
                <div className="container" style={{ display: 'flex', justifyContent: 'center' }}>
                    <div className="glass-card" style={{ width: '100%', maxWidth: '440px', padding: 'var(--space-2xl)' }}>

                        {success ? (
                            <div style={{ textAlign: 'center' }}>
                                <div style={{ fontSize: '3rem', marginBottom: '1.5rem' }}>✅</div>
                                <h3 style={{ color: 'white', marginBottom: 'var(--space-md)' }}>¡Contraseña Actualizada!</h3>
                                <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-lg)' }}>
                                    Tu contraseña ha sido cambiada con éxito. Te redirigiremos al inicio de sesión en unos segundos...
                                </p>
                            </div>
                        ) : (
                            <>
                                {error && (
                                    <div style={{
                                        background: 'rgba(239, 68, 68, 0.1)',
                                        border: '1px solid rgba(239, 68, 68, 0.3)',
                                        color: '#fca5a5',
                                        padding: 'var(--space-md)',
                                        borderRadius: 'var(--radius-md)',
                                        marginBottom: 'var(--space-md)',
                                        fontSize: '0.88rem'
                                    }}>
                                        {error}
                                    </div>
                                )}

                                <form onSubmit={handlePasswordUpdate} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                                            Nueva Contraseña
                                        </label>
                                        <input
                                            type="password"
                                            required
                                            minLength={6}
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="filter-input"
                                            style={{ width: '100%' }}
                                            placeholder="Mínimo 6 caracteres"
                                        />
                                    </div>

                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                                            Confirmar Contraseña
                                        </label>
                                        <input
                                            type="password"
                                            required
                                            minLength={6}
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            className="filter-input"
                                            style={{ width: '100%' }}
                                            placeholder="Repite tu nueva contraseña"
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        className="btn btn-primary"
                                        style={{ width: '100%', marginTop: 'var(--space-sm)' }}
                                        disabled={loading || error.includes('expirado')}
                                    >
                                        {loading ? 'Actualizando...' : 'Actualizar Contraseña'}
                                    </button>
                                </form>
                            </>
                        )}
                    </div>
                </div>
            </section>

            <Footer />
        </>
    );
}
