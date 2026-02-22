import Link from 'next/link';

export default function DashboardLayout({ children }) {
    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-primary)' }}>

            {/* Sidebar */}
            <aside style={{
                width: '280px',
                background: 'var(--bg-secondary)',
                borderRight: '1px solid var(--surface-border)',
                padding: 'var(--space-xl) var(--space-lg)',
                display: 'flex',
                flexDirection: 'column'
            }}>
                <div style={{ marginBottom: 'var(--space-2xl)' }}>
                    <Link href="/" className="navbar-logo">
                        <div className="logo-mark">C</div>
                        <span>CONECTA <span className="logo-year">2026</span></span>
                    </Link>
                </div>

                <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
                    <Link href="/dashboard" className="btn btn-outline" style={{ justifyContent: 'flex-start' }}>
                        Mi Gafete QR
                    </Link>
                    <Link href="/dashboard/escaner" className="btn btn-primary" style={{ justifyContent: 'flex-start' }}>
                        Escanear Contacto
                    </Link>
                    <Link href="/dashboard/contactos" className="btn btn-outline" style={{ justifyContent: 'flex-start' }}>
                        Mis Leads Generados
                    </Link>
                </nav>

                <div style={{ marginTop: 'auto', paddingTop: 'var(--space-lg)', borderTop: '1px solid var(--surface-border)' }}>
                    <Link href="/login" className="btn btn-outline" style={{ width: '100%', justifyContent: 'center' }}>
                        Cerrar Sesión
                    </Link>
                </div>
            </aside>

            {/* Main Content */}
            <main style={{ flex: 1, padding: 'var(--space-2xl)' }}>
                {children}
            </main>
        </div>
    );
}
