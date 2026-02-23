'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [user, setUser] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);

        // Auth Listener
        const checkUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);
            if (user) {
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('role')
                    .eq('id', user.id)
                    .single();
                setIsAdmin(profile?.role === 'admin' || user.email === 'ricponce14@gmail.com');
            }
        };

        checkUser();

        const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
            setUser(session?.user || null);
            if (!session) {
                setIsAdmin(false);
            } else {
                checkUser();
            }
        });

        return () => {
            window.removeEventListener('scroll', handleScroll);
            authListener.subscription.unsubscribe();
        };
    }, []);

    return (
        <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
            <div className="container navbar-inner">
                <Link href="/" className="navbar-logo">
                    <Image src="/conectacorto.png" alt="CONECTA 2026 Logo" width={200} height={60} style={{ height: '60px', width: 'auto' }} />
                </Link>

                <ul className="navbar-links" style={mobileOpen ? {
                    display: 'flex', flexDirection: 'column', position: 'fixed',
                    top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(6, 11, 24, 0.97)', backdropFilter: 'blur(20px)',
                    justifyContent: 'center', alignItems: 'center', gap: '2rem', zIndex: 200,
                } : {}}>
                    {mobileOpen && (
                        <button onClick={() => setMobileOpen(false)} style={{
                            position: 'absolute', top: '1.5rem', right: '1.5rem',
                            background: 'none', color: 'white', fontSize: '1.5rem', cursor: 'pointer',
                        }}>&#x2715;</button>
                    )}
                    <li><Link href="/" onClick={() => setMobileOpen(false)}>Inicio</Link></li>
                    <li><Link href="/#schedule" onClick={() => setMobileOpen(false)}>Programa</Link></li>
                    <li><Link href="/#speakers" onClick={() => setMobileOpen(false)}>Ponentes</Link></li>
                    {isAdmin && <li><Link href="/admin" style={{ color: 'var(--neon-blue)', fontWeight: 'bold' }}>Panel Admin</Link></li>}
                    <li>
                        {user ? (
                            <Link href="/dashboard" className="btn btn-outline" style={{ padding: '0.5rem 1rem' }}>Mi Cuenta</Link>
                        ) : (
                            <Link href="/login" className="btn btn-outline" style={{ padding: '0.5rem 1rem' }}>Acceso</Link>
                        )}
                    </li>
                    <li>
                        <Link href="/registro" className="btn btn-primary" onClick={() => setMobileOpen(false)}>
                            Registrarme
                            <svg className="btn-icon" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" /></svg>
                        </Link>
                    </li>
                </ul>

                <button className="navbar-mobile-toggle" onClick={() => setMobileOpen(true)}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 12h18M3 6h18M3 18h18" /></svg>
                </button>
            </div>
        </nav>
    );
}
