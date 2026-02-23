'use client';

import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function DashboardLayout({ children }) {
    const router = useRouter();

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push('/login');
        router.refresh();
    };

    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-primary)', color: 'white' }}>

            {/* Sidebar */}
            <aside style={{
                width: '280px',
                background: 'var(--bg-secondary)',
                borderRight: '1px solid var(--surface-border)',
                padding: 'var(--space-xl) var(--space-lg)',
                display: 'flex',
                flexDirection: 'column',
                position: 'sticky',
                top: 0,
                height: '100vh'
            }}>
                <div style={{ marginBottom: 'var(--space-2xl)' }}>
                    <Link href="/" className="navbar-logo" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
                        <Image src="/conectacorto.png" alt="Logo" width={40} height={40} />
                        <span style={{ fontSize: '1.2rem', fontWeight: '800', color: 'white' }}>CONECTA <span style={{ color: 'var(--neon-blue)' }}>2026</span></span>
                    </Link>
                </div>

                <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
                    <Link href="/dashboard" className="btn btn-outline" style={{ justifyContent: 'flex-start', width: '100%' }}>
                        <span>👤</span> Mi Gafete QR
                    </Link>
                    <Link href="/dashboard/escaner" className="btn btn-primary" style={{ justifyContent: 'flex-start', width: '100%' }}>
                        <span>📷</span> Escanear Contacto
                    </Link>
                    <Link href="/dashboard/contactos" className="btn btn-outline" style={{ justifyContent: 'flex-start', width: '100%' }}>
                        <span>📇</span> Mis Leads
                    </Link>
                </nav>

                <div style={{ marginTop: 'auto', paddingTop: 'var(--space-lg)', borderTop: '1px solid var(--surface-border)' }}>
                    <button
                        onClick={handleLogout}
                        className="btn btn-outline"
                        style={{ width: '100%', justifyContent: 'center', borderColor: 'rgba(239, 68, 68, 0.3)', color: '#fca5a5' }}
                    >
                        Cerrar Sesión
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main style={{ flex: 1, padding: 'var(--space-2xl)', overflowY: 'auto' }}>
                {children}
            </main>
        </div>
    );
}
