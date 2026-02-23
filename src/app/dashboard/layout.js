'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function DashboardLayout({ children }) {
    const router = useRouter();
    const pathname = usePathname();
    const [userRole, setUserRole] = useState('attendee');

    useEffect(() => {
        async function getRole() {
            const { data: { session } } = await supabase.auth.getSession();
            const user = session?.user;
            if (user) {
                const { data } = await supabase
                    .from('profiles')
                    .select('role')
                    .eq('id', user.id)
                    .single();
                if (data?.role) setUserRole(data.role);
            }
        }
        getRole();
    }, []);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        window.location.href = '/login';
    };

    const navItems = [
        {
            href: '/dashboard',
            icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                </svg>
            ),
            label: 'Gafete'
        },
        {
            href: '/dashboard/escaner',
            icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
                    <circle cx="12" cy="13" r="4"></circle>
                </svg>
            ),
            label: 'Escáner'
        },
        {
            href: '/dashboard/contactos',
            icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
            ),
            label: userRole === 'attendee' ? 'Intereses' : 'Leads'
        },
        {
            href: '/dashboard/matchmaking',
            icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
                </svg>
            ),
            label: 'Matches'
        },
        {
            href: '/directorio',
            icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="7" height="7"></rect>
                    <rect x="14" y="3" width="7" height="7"></rect>
                    <rect x="14" y="14" width="7" height="7"></rect>
                    <rect x="3" y="14" width="7" height="7"></rect>
                </svg>
            ),
            label: 'Directorio'
        }
    ];

    return (
        <div className="dashboard-layout">

            {/* Desktop Sidebar */}
            <aside className="dashboard-sidebar">
                <div style={{ marginBottom: 'var(--space-2xl)' }}>
                    <Link href="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
                        <Image src="/conectacorto.png" alt="Logo" width={120} height={40} style={{ objectFit: 'contain' }} />
                    </Link>
                </div>

                <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`btn ${pathname === item.href ? 'btn-primary' : 'btn-outline'}`}
                            style={{ justifyContent: 'flex-start', width: '100%', gap: '12px', padding: '0.8rem 1.2rem' }}
                        >
                            <div style={{ width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                {item.icon}
                            </div>
                            {item.label}
                        </Link>
                    ))}
                </nav>

                <div style={{ marginTop: 'auto', paddingTop: 'var(--space-lg)', borderTop: '1px solid var(--surface-border)' }}>
                    <button
                        onClick={handleLogout}
                        className="btn btn-outline"
                        style={{ width: '100%', justifyContent: 'center', borderColor: 'rgba(239, 68, 68, 0.3)', color: '#fca5a5', gap: '8px' }}
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                            <polyline points="16 17 21 12 16 7"></polyline>
                            <line x1="21" y1="12" x2="9" y2="12"></line>
                        </svg>
                        Cerrar Sesión
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="dashboard-main">
                {children}
            </main>

            {/* Mobile Bottom Navigation */}
            <nav className="bottom-nav-mobile">
                <div className="bottom-nav-links">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`bottom-nav-item ${pathname === item.href ? 'active' : ''}`}
                        >
                            {item.icon}
                            <span>{item.label}</span>
                        </Link>
                    ))}
                </div>
            </nav>
        </div >
    );
}
