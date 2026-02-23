'use client';

import { useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleResetRequest = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setMessage('');

        try {
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/reset-password`,
            });

            if (error) throw error;

            setMessage('Se ha enviado un enlace de recuperación a tu correo electrónico. Por favor, revísalo para continuar.');
        } catch (err) {
            setError(err.message || 'Error al solicitar el restablecimiento. Intenta nuevamente.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Navbar />

            <div className="page-header" style={{ paddingBottom: 'var(--space-2xl)' }}>
                <div className="container" style={{ textAlign: 'center' }}>
                    <div className="section-label">Recuperación de Acceso</div>
                    <h1 className="section-title">
                        ¿Olvidaste tu <span className="highlight">Contraseña</span>?
                    </h1>
                    <p className="section-subtitle center">
                        No te preocupes. Ingresa tu correo y te enviaremos un enlace para que puedas
                        restablecer tu contraseña de forma segura.
                    </p>
                </div>
            </div>

            <section className="section" style={{ paddingTop: 0, minHeight: '50vh' }}>
                <div className="container" style={{ display: 'flex', justifyContent: 'center' }}>
                    <div className="glass-card" style={{ width: '100%', maxWidth: '440px', padding: 'var(--space-2xl)' }}>

                        {message ? (
                            <div style={{ textAlign: 'center' }}>
                                <div style={{ fontSize: '3rem', marginBottom: '1.5rem' }}>📩</div>
                                <div style={{
                                    background: 'rgba(52, 211, 153, 0.1)',
                                    border: '1px solid rgba(52, 211, 153, 0.3)',
                                    color: '#6ee7b7',
                                    padding: 'var(--space-md)',
                                    borderRadius: 'var(--radius-md)',
                                    marginBottom: 'var(--space-lg)',
                                    fontSize: '0.95rem',
                                    lineHeight: '1.6'
                                }}>
                                    {message}
                                </div>
                                <Link href="/login" className="btn btn-outline" style={{ width: '100%' }}>
                                    Volver al Inicio de Sesión
                                </Link>
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

                                <form onSubmit={handleResetRequest} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
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

                                    <button
                                        type="submit"
                                        className="btn btn-primary"
                                        style={{ width: '100%', marginTop: 'var(--space-sm)' }}
                                        disabled={loading}
                                    >
                                        {loading ? 'Enviando enlace...' : 'Enviar Enlace de Recuperación'}
                                    </button>
                                </form>

                                <div style={{ textAlign: 'center', marginTop: 'var(--space-lg)', paddingTop: 'var(--space-md)', borderTop: '1px solid var(--surface-border)' }}>
                                    <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                                        ¿Recordaste tu contraseña?{' '}
                                        <Link href="/login" style={{ color: 'var(--accent-light)', fontWeight: '600' }}>
                                            Inicia sesión
                                        </Link>
                                    </p>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </section>

            <Footer />
        </>
    );
}
