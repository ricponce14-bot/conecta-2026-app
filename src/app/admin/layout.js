'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import '@/app/globals.css';

export default function AdminLayout({ children }) {
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const checkAdmin = async () => {
            const { data: { user } } = await supabase.auth.getUser();

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

    if (loading) {
        return (
            <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0a0a' }}>
                <div style={{ color: 'white' }}>Verificando credenciales...</div>
            </div>
        );
    }

    if (!isAdmin) return null;

    return (
        <div className="admin-container" style={{ display: 'flex', minHeight: '100vh', background: '#0a0a0a' }}>
            <aside style={{ width: '260px', borderRight: '1px solid #333', padding: '2rem', display: 'flex', flexDirection: 'column' }}>
                <div style={{ marginBottom: '3rem' }}>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'white' }}>CONECTA <span className="highlight">ADMIN</span></h2>
                </div>

                <nav style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <Link href="/admin" className="nav-link-admin">Dashboard</Link>
                    <Link href="/admin/leads" className="nav-link-admin">Interesados (Leads)</Link>
                    <Link href="/admin/content" className="nav-link-admin">Contenido (CMS)</Link>
                    <Link href="/admin/catalog" className="nav-link-admin">Catálogo/Precios</Link>
                    <hr style={{ border: 'none', borderTop: '1px solid #333', margin: '1rem 0' }} />
                    <Link href="/" style={{ fontSize: '0.9rem', color: '#888' }}>Ir al sitio público</Link>
                    <button
                        onClick={async () => { await supabase.auth.signOut(); router.push('/'); }}
                        style={{ background: 'none', border: 'none', color: '#ff4444', textAlign: 'left', cursor: 'pointer', padding: '0.75rem 1rem', fontSize: '0.9rem' }}
                    >
                        Cerrar Sesión
                    </button>
                </nav>
            </aside>

            <main style={{ flex: 1, padding: '3rem', overflowY: 'auto', color: 'white' }}>
                {children}
            </main>

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
            `}</style>
        </div>
    );
}
