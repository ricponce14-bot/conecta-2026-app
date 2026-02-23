'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function RegisterPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        fullName: '',
        whatsapp: '',
        role: 'attendee'
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            // Create user in Auth
            const { data, error } = await supabase.auth.signUp({
                email: formData.email,
                password: formData.password,
                options: {
                    data: {
                        full_name: formData.fullName,
                        role: formData.role,
                        whatsapp: formData.whatsapp
                    }
                }
            });

            if (error) throw error;

            // Update URL and show success message
            const url = new URL(window.location);
            url.searchParams.set('success', 'true');
            url.searchParams.set('email', formData.email);
            window.history.pushState({}, '', url);
            setIsSuccess(true);

        } catch (err) {
            setError(err.message || 'Error al registrarse. Intenta nuevamente.');
        } finally {
            setLoading(false);
        }
    };

    // We rely on Middleware for redirecting already logged-in users.
    // This effect only handles the post-registration success view.
    useEffect(() => {
        const checkUser = async () => {
            const params = new URLSearchParams(window.location.search);
            const successParam = params.get('success') === 'true';

            if (successParam) {
                setIsSuccess(true);
                if (params.get('email')) {
                    setFormData(prev => ({ ...prev, email: params.get('email') }));
                }
            }
        };

        checkUser();
    }, [isSuccess]);

    if (isSuccess) {
        return (
            <>
                <Navbar />
                <div className="page-header" style={{ paddingBottom: 'var(--space-2xl)', minHeight: '80vh', display: 'flex', alignItems: 'center' }}>
                    <div className="container" style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>📧</div>
                        <h1 className="section-title">
                            ¡Ya casi <span className="highlight">estás dentro</span>!
                        </h1>
                        <p className="section-subtitle center">
                            Hemos enviado un enlace de confirmación a <strong>{formData.email || 'tu correo electrónico'}</strong>.
                            Por favor, revisa tu bandeja de entrada (y tu carpeta de spam) para activar tu cuenta.
                        </p>
                        <div style={{ marginTop: '2rem' }}>
                            <Link href="/login" className="btn btn-primary btn-lg">
                                Ir al Inicio de Sesión
                            </Link>
                        </div>
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
                    <div className="section-label">Registro CONECTA 2026</div>
                    <h1 className="section-title">
                        Crea tu <span className="highlight">Cuenta</span>
                    </h1>
                    <p className="section-subtitle">
                        Regístrate para obtener tu gafete QR, acceder al directorio de empresas
                        y comenzar a usar el matchmaking inteligente.
                    </p>
                </div>
            </div>

            <section className="section" style={{ paddingTop: 0, minHeight: '50vh' }}>
                <div className="container" style={{ display: 'flex', justifyContent: 'center' }}>
                    <div className="glass-card" style={{ width: '100%', maxWidth: '500px', padding: 'var(--space-2xl)' }}>

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

                        <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>

                            {/* Nombre Completo */}
                            <div>
                                <label style={{ display: 'block', fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                                    Nombre Completo
                                </label>
                                <input
                                    type="text"
                                    name="fullName"
                                    required
                                    value={formData.fullName}
                                    onChange={handleChange}
                                    className="filter-input"
                                    style={{ width: '100%' }}
                                    placeholder="Juan Pérez"
                                />
                            </div>

                            {/* Correo y WhatsApp (2 columnas) */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-md)' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                                        Correo Electrónico
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        required
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="filter-input"
                                        style={{ width: '100%' }}
                                        placeholder="email@empresa.com"
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                                        WhatsApp
                                    </label>
                                    <input
                                        type="tel"
                                        name="whatsapp"
                                        value={formData.whatsapp}
                                        onChange={handleChange}
                                        className="filter-input"
                                        style={{ width: '100%' }}
                                        placeholder="33 1234 5678"
                                    />
                                </div>
                            </div>

                            {/* Contraseña */}
                            <div>
                                <label style={{ display: 'block', fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                                    Contraseña segura
                                </label>
                                <input
                                    type="password"
                                    name="password"
                                    required
                                    minLength={6}
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="filter-input"
                                    style={{ width: '100%' }}
                                    placeholder="Mínimo 6 caracteres"
                                />
                            </div>

                            {/* Rol */}
                            <div>
                                <label style={{ display: 'block', fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                                    Tipo de Pase
                                </label>
                                <div style={{ display: 'flex', gap: 'var(--space-md)' }}>
                                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.9rem' }}>
                                        <input
                                            type="radio"
                                            name="role"
                                            value="attendee"
                                            checked={formData.role === 'attendee'}
                                            onChange={handleChange}
                                        />
                                        Asistente General
                                    </label>
                                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.9rem' }}>
                                        <input
                                            type="radio"
                                            name="role"
                                            value="company_rep"
                                            checked={formData.role === 'company_rep'}
                                            onChange={handleChange}
                                        />
                                        Representante de Empresa (Stand)
                                    </label>
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="btn btn-primary"
                                style={{ width: '100%', marginTop: 'var(--space-md)' }}
                                disabled={loading}
                            >
                                {loading ? 'Creando cuenta...' : 'Completar Registro y Generar QR'}
                            </button>
                        </form>

                        <div style={{ textAlign: 'center', marginTop: 'var(--space-lg)', paddingTop: 'var(--space-md)', borderTop: '1px solid var(--surface-border)' }}>
                            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                                ¿Ya tienes cuenta?{' '}
                                <Link href="/login" style={{ color: 'var(--accent-light)', fontWeight: '600' }}>
                                    Inicia sesión
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
