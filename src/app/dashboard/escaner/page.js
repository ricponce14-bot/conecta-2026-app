'use client';

import dynamic from 'next/dynamic';

const ScannerClient = dynamic(() => import('./ScannerClient'), {
    ssr: false,
    loading: () => <div style={{ padding: 'var(--space-xl)', textAlign: 'center' }}>Cargando escáner...</div>
});

export default function EscanerPage() {
    return <ScannerClient />;
}
