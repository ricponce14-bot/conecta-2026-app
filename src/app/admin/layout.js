'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import '@/app/globals.css';

export default function AdminLayout({ children }) {
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const checkAdmin = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            const user = session?.user;
            if (!user) {
                router.push('/login');
                return;
            }

            const { data: profile } = await supabase
                .from('profiles')
                .select('role')
                .eq('id', user.id)
                .single();

            if (profile?.role === 'admin' || user.email === 'ricponce14@gmail.com') {
                setIsAdmin(true);
            } else {
                router.push('/');
            }
            setLoading(false);
        };

        checkAdmin();
    }, [router]);

    // Close sidebar when clicking outside on mobile
    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    if (loading) {
        return (
            <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0a0a' }}>
                <div style={{ color: 'white' }}>Verificando credenciales...</div>
            </div>
        );
    }

    if (!isAdmin) return null;

    return (
        <div className="admin-container" style={{ display: 'flex', minHeight: '100vh', background: '#0a0a0a', flexDirection: 'column' }}>
            {/* Mobile Header */}
            <header className="admin-mobile-header" style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '1rem 1.5rem',
                borderBottom: '1px solid #333',
                background: '#0a0a0a',
                zIndex: 60
            }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'white', margin: 0 }}>CONECTA <span className="highlight">ADMIN</span></h2>
                <button onClick={toggleSidebar} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', padding: '0.5rem' }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        {sidebarOpen ? (
                            <path d="M18 6L6 18M6 6l12 12" />
                        ) : (
                            <path d="M3 12h18M3 6h18M3 18h18" />
                        )}
                    </svg>
                </button>
            </header>

            <div style={{ display: 'flex', flex: 1, position: 'relative' }}>
                {/* Overlay for mobile */}
                {sidebarOpen && (
                    <div
                        className="admin-sidebar-overlay"
                        onClick={() => setSidebarOpen(false)}
                        style={{
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            background: 'rgba(0,0,0,0.5)',
                            zIndex: 40,
                            display: 'block'
                        }}
                    />
                )}

                {/* Sidebar */}
                <aside className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`} style={{
                    width: '260px',
                    borderRight: '1px solid #333',
                    padding: '2rem',
                    display: 'flex',
                    flexDirection: 'column',
                    background: '#0a0a0a',
                    zIndex: 50,
                    transition: 'transform 0.3s ease'
                }}>
                    <div className="admin-sidebar-logo" style={{ marginBottom: '3rem' }}>
                        <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'white' }}>CONECTA <span className="highlight">ADMIN</span></h2>
                    </div>

                    <nav style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <Link href="/admin" className="nav-link-admin" onClick={() => setSidebarOpen(false)}>Dashboard</Link>
                        <Link href="/admin/leads" className="nav-link-admin" onClick={() => setSidebarOpen(false)}>Interesados (Leads)</Link>
                        <Link href="/admin/content" className="nav-link-admin" onClick={() => setSidebarOpen(false)}>Contenido (CMS)</Link>
                        <Link href="/admin/catalog" className="nav-link-admin" onClick={() => setSidebarOpen(false)}>Catálogo/Precios</Link>
                        <hr style={{ border: 'none', borderTop: '1px solid #333', margin: '1rem 0' }} />
                        <Link href="/" style={{ fontSize: '0.9rem', color: '#888' }} onClick={() => setSidebarOpen(false)}>Ir al sitio público</Link>
                        <button
                            onClick={async () => { await supabase.auth.signOut(); router.push('/'); }}
                            style={{ background: 'none', border: 'none', color: '#ff4444', textAlign: 'left', cursor: 'pointer', padding: '0.75rem 1rem', fontSize: '0.9rem' }}
                        >
                            Cerrar Sesión
                        </button>
                    </nav>
                </aside>

                <main style={{ flex: 1, padding: '2rem', overflowY: 'auto', color: 'white', width: '100%' }}>
                    {children}
                </main>
            </div>

            <style jsx>{`
                .nav-link-admin {
                    color: #aaa;
                    text-decoration: none;
                    padding: 0.75rem 1rem;
                    border-radius: 8px;
                    transition: all 0.2s;
                }
                .nav-link-admin:hover {
                    background: rgba(255,255,255,0.05);
                    color: white;
                }
                .highlight {
                    color: #00d2ff;
                }

                .admin-mobile-header {
                    display: none !important;
                }

                @media (max-width: 768px) {
                    .admin-mobile-header {
                        display: flex !important;
                    }
                    .admin-sidebar-logo {
                        display: none;
                    }
                    .admin-sidebar {
                        position: fixed;
                        top: 0;
                        left: 0;
                        bottom: 0;
                        transform: translateX(-100%);
                    }
                    .admin-sidebar.open {
                        transform: translateX(0);
                    }
                    main {
                        padding: 1rem !important;
                    }
                }
            `}</style>
        </div>
    );
}
