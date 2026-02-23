'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [justLoggedIn, setJustLoggedIn] = useState(false);

    // Redirect if already logged in
    useEffect(() => {
        const checkUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user && !justLoggedIn) {
                window.location.href = '/dashboard';
            }
        };
        checkUser();
    }, [justLoggedIn]);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) throw error;

            // Show welcome state before redirect
            setJustLoggedIn(true);
            setTimeout(() => {
                window.location.href = '/dashboard';
            }, 1500);

        } catch (err) {
            setError(err.message || 'Error al iniciar sesión. Verifica tus credenciales.');
        } finally {
            setLoading(false);
        }
    };

    if (justLoggedIn) {
        return (
            <>
                <Navbar />
                <div className="page-header" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center' }}>
                    <div className="container" style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>👋</div>
                        <h1 className="section-title">
                            ¡Bienvenido <span className="highlight">de nuevo</span>!
                        </h1>
                        <p className="section-subtitle center">
                            Estamos preparando tu panel personal. Redirigiendo...
                        </p>
                    </div>
                </div>
                <Footer />
            </>
        );
    }

    return (
        <>
            <Navbar />

            <div className="page-header" style={{ paddingBottom: 'var(--space-2xl)' }}>
                <div className="container">
                    <div className="section-label">Acceso Plataforma</div>
                    <h1 className="section-title">
                        Iniciar <span className="highlight">Sesión</span>
                    </h1>
                    <p className="section-subtitle">
                        Accede a tu cuenta para gestionar tu gafete digital, ver tu directorio de contactos y hacer matchmaking.
                    </p>
                </div>
            </div>

            <section className="section" style={{ paddingTop: 0, minHeight: '50vh' }}>
                <div className="container" style={{ display: 'flex', justifyContent: 'center' }}>
                    <div className="glass-card" style={{ width: '100%', maxWidth: '440px', padding: 'var(--space-2xl)' }}>

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

                        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                                    Correo electrónico
                                </label>
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="filter-input"
                                    style={{ width: '100%' }}
                                    placeholder="ejemplo@empresa.com"
                                />
                            </div>

                            <div>
                                <label style={{ display: 'block', fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                                    Contraseña
                                </label>
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="filter-input"
                                    style={{ width: '100%' }}
                                    placeholder="••••••••"
                                />
                                <div style={{ textAlign: 'right', marginTop: '8px' }}>
                                    <Link href="/forgot-password" style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', textDecoration: 'none' }}>
                                        ¿Olvidaste tu contraseña?
                                    </Link>
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="btn btn-primary"
                                style={{ width: '100%', marginTop: 'var(--space-sm)' }}
                                disabled={loading}
                            >
                                {loading ? 'Iniciando sesión...' : 'Ingresar al Dashboard'}
                            </button>
                        </form>

                        <div style={{ textAlign: 'center', marginTop: 'var(--space-lg)', paddingTop: 'var(--space-md)', borderTop: '1px solid var(--surface-border)' }}>
                            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                                ¿No tienes cuenta?{' '}
                                <Link href="/registro" style={{ color: 'var(--accent-light)', fontWeight: '600' }}>
                                    Regístrate aquí
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </>
    );
}
