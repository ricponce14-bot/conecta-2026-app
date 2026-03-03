'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

function ResetPasswordForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [sessionReady, setSessionReady] = useState(false);
    const [checking, setChecking] = useState(true);

    useEffect(() => {
        const initSession = async () => {
            // Check if there's a code parameter (PKCE flow from Supabase email)
            const code = searchParams.get('code');

            if (code) {
                try {
                    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
                    if (exchangeError) {
                        console.error('Code exchange error:', exchangeError);
                        setError('El enlace de recuperación ha expirado o ya fue utilizado. Solicita uno nuevo.');
                        setChecking(false);
                        return;
                    }
                    setSessionReady(true);
                    setChecking(false);
                    return;
                } catch (e) {
                    console.error('Exchange error:', e);
                }
            }

            // Fallback: listen for auth state changes (hash fragment flow)
            const { data: { subscription } } = supabase.auth.onAuthStateChange(
                (event, session) => {
                    if (event === 'PASSWORD_RECOVERY' || (event === 'SIGNED_IN' && session)) {
                        setSessionReady(true);
                        setChecking(false);
                    }
                }
            );

            // Also check existing session after a delay
            await new Promise(resolve => setTimeout(resolve, 2000));
            const { data: { session } } = await supabase.auth.getSession();
            if (session) {
                setSessionReady(true);
            } else if (!sessionReady) {
                setError('El enlace de recuperación ha expirado o no es válido. Solicita uno nuevo.');
            }
            setChecking(false);

            return () => subscription.unsubscribe();
        };

        initSession();
    }, [searchParams]);

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
                router.push('/pymatch/login');
            }, 3000);

        } catch (err) {
            setError(err.message || 'Error al actualizar la contraseña. Intenta nuevamente.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="glass-card" style={{ width: '100%', maxWidth: '440px', padding: 'var(--space-2xl)' }}>

            {checking ? (
                <div style={{ textAlign: 'center', padding: 'var(--space-xl)' }}>
                    <div style={{ width: '40px', height: '40px', border: '3px solid rgba(255,255,255,0.1)', borderTopColor: 'var(--neon-blue)', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 1rem' }}></div>
                    <p style={{ color: 'var(--text-secondary)' }}>Verificando enlace de recuperación...</p>
                    <style jsx>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                </div>
            ) : success ? (
                <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '3rem', marginBottom: '1.5rem' }}>✅</div>
                    <h3 style={{ color: 'white', marginBottom: 'var(--space-md)' }}>Contraseña Actualizada</h3>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-lg)' }}>
                        Tu contraseña ha sido cambiada con éxito. Redirigiendo al inicio de sesión...
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

                    {sessionReady ? (
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
                                disabled={loading}
                            >
                                {loading ? 'Actualizando...' : 'Actualizar Contraseña'}
                            </button>
                        </form>
                    ) : (
                        <div style={{ textAlign: 'center' }}>
                            <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-lg)' }}>
                                Si el enlace no funciona, solicita uno nuevo.
                            </p>
                            <a href="/pymatch/forgot-password" className="btn btn-outline" style={{ width: '100%' }}>
                                Solicitar nuevo enlace
                            </a>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

export default function ResetPasswordPage() {
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
                        Ingresa tu nueva contraseña para recuperar el acceso a tu cuenta.
                    </p>
                </div>
            </div>

            <section className="section" style={{ paddingTop: 0, minHeight: '50vh' }}>
                <div className="container" style={{ display: 'flex', justifyContent: 'center' }}>
                    <Suspense fallback={
                        <div className="glass-card" style={{ width: '100%', maxWidth: '440px', padding: 'var(--space-2xl)', textAlign: 'center' }}>
                            <p style={{ color: 'var(--text-secondary)' }}>Cargando...</p>
                        </div>
                    }>
                        <ResetPasswordForm />
                    </Suspense>
                </div>
            </section>

            <Footer />
        </>
    );
}
