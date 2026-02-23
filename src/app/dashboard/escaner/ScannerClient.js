'use client';

import { useEffect, useState, useRef } from 'react';
import { supabase } from '@/lib/supabase';

export default function EscanerPage() {
    const [scanResult, setScanResult] = useState(null);
    const [error, setError] = useState(null);
    const [isScanning, setIsScanning] = useState(true);
    const scannerRef = useRef(null);
    const isScanningRef = useRef(true); // Ref to track scanning state without closure issues

    // Sync ref with state
    useEffect(() => {
        isScanningRef.current = isScanning;
    }, [isScanning]);

    // Active Event ID
    const ACTIVE_EVENT_ID = 'e19b5b24-b19b-4f9e-a892-12b2a6f2b4c1';

    // Move handlers above useEffect and use stable closures via Ref
    const onScanSuccess = async (decodedText, decodedResult) => {
        if (!isScanningRef.current) return;

        setIsScanning(false);
        setError(null);

        try {
            const { data: { session } } = await supabase.auth.getSession();
            const user = session?.user;
            if (!user) throw new Error("Debes iniciar sesión para escanear.");

            const { data, error: rpcError } = await supabase.rpc('scan_qr', {
                p_scanner_id: user.id,
                p_qr_code: decodedText,
                p_event_id: ACTIVE_EVENT_ID,
                p_notes: ''
            });

            if (rpcError) throw rpcError;

            if (data && data.success) {
                setScanResult({
                    message: data.message,
                    contact: data.contact,
                    company: data.company
                });
            } else {
                throw new Error(data?.message || "Error al registrar el contacto.");
            }

        } catch (err) {
            console.error("Scan error:", err);
            setError(err.message || "Ocurrió un error al procesar el código.");
            setTimeout(() => setIsScanning(true), 3000);
        }
    };

    const onScanFailure = (error) => {
        // ignore
    };

    useEffect(() => {
        let qrScanner = null;

        if (typeof window !== 'undefined') {
            import('html5-qrcode').then(({ Html5Qrcode }) => {
                qrScanner = new Html5Qrcode("qr-reader");
                scannerRef.current = qrScanner;

                const config = { fps: 15, qrbox: { width: 250, height: 250 } };

                qrScanner.start(
                    { facingMode: "environment" },
                    config,
                    onScanSuccess,
                    onScanFailure
                ).catch(err => {
                    console.error("Failed to start scanner:", err);
                    setError("No se pudo acceder a la cámara trasera. Asegúrate de dar permisos.");
                });
            });
        }

        return () => {
            if (scannerRef.current) {
                // Check if it's currently scanning before stopping
                if (scannerRef.current.isScanning) {
                    scannerRef.current.stop().then(() => {
                        scannerRef.current.clear();
                    }).catch(e => console.error("Stop error", e));
                }
                scannerRef.current = null;
            }
        };
    }, []);

    const resetScanner = () => {
        setScanResult(null);
        setError(null);
        setIsScanning(true);
        // If we use Html5Qrcode, we don't need to restart the instance if it's still running,
        // but if we stopped it, we might need to. 
        // For simplicity, we keep it running but ignored via isScanningRef.
    };

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <div style={{ marginBottom: 'var(--space-2xl)' }}>
                <h1 className="section-title" style={{ fontSize: '2.5rem', marginBottom: 'var(--space-sm)' }}>
                    Escáner <span className="highlight">Networking</span>
                </h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
                    Sincroniza datos profesionales escaneando el código QR de otros asistentes.
                </p>
            </div>

            <div className="glass-card" style={{ padding: 'var(--space-2xl)', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.05)' }}>

                {/* Scanner Container */}
                <div style={{ display: scanResult ? 'none' : 'block' }}>
                    <div id="qr-reader" style={{ width: '100%', border: 'none', borderRadius: 'var(--radius-lg)', overflow: 'hidden', background: 'rgba(0,0,0,0.2)' }}></div>

                    {!scannerRef.current && !error && (
                        <div style={{ textAlign: 'center', padding: 'var(--space-xl)', color: 'var(--text-tertiary)' }}>
                            Iniciando cámara...
                        </div>
                    )}

                    {error && (
                        <div style={{
                            marginTop: 'var(--space-md)',
                            padding: 'var(--space-md)',
                            background: 'rgba(239, 68, 68, 0.1)',
                            color: '#fca5a5',
                            borderRadius: 'var(--radius-md)',
                            textAlign: 'center',
                            fontSize: '0.9rem',
                            border: '1px solid rgba(239, 68, 68, 0.2)'
                        }}>
                            {error}
                            <p style={{ fontSize: '0.8rem', marginTop: '4px', opacity: 0.8 }}>Reintentando validación en breve...</p>
                        </div>
                    )}
                </div>

                {/* Success Result */}
                {scanResult && (
                    <div style={{ textAlign: 'center', animation: 'slideIn 0.5s ease-out forwards' }}>
                        <div style={{
                            width: 80, height: 80,
                            background: 'rgba(16, 185, 129, 0.1)',
                            color: 'var(--accent-success)',
                            borderRadius: '50%',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            margin: '0 auto var(--space-xl)',
                            border: '1px solid rgba(16, 185, 129, 0.2)'
                        }}>
                            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                        </div>

                        <h2 style={{ fontSize: '1.8rem', color: 'white', marginBottom: 'var(--space-sm)', fontWeight: 700 }}>
                            Conexión Exitosa
                        </h2>
                        <p style={{ fontSize: '1.15rem', marginBottom: 'var(--space-xl)', color: 'var(--text-secondary)' }}>
                            Has sincronizado con <strong>{scanResult.contact?.full_name}</strong>.
                        </p>

                        {scanResult.contact && (
                            <div style={{
                                background: 'rgba(255, 255, 255, 0.03)',
                                padding: 'var(--space-xl)',
                                borderRadius: 'var(--radius-lg)',
                                marginBottom: 'var(--space-2xl)',
                                border: '1px solid rgba(255,255,255,0.05)',
                                textAlign: 'left'
                            }}>
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>Perfil Detectado</div>
                                <div style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '2px' }}>{scanResult.contact.full_name}</div>
                                <div style={{ fontSize: '1rem', color: 'var(--neon-blue)', fontWeight: 600 }}>{scanResult.contact.title || 'Asistente'}</div>
                                {scanResult.contact.company_name && (
                                    <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '4px' }}>{scanResult.contact.company_name}</div>
                                )}
                            </div>
                        )}

                        <button onClick={resetScanner} className="btn btn-primary" style={{ width: '100%', padding: '1rem' }}>
                            Continuar Escaneando
                        </button>
                    </div>
                )}
            </div>

            <style jsx global>{`
                /* Override html5-qrcode default ugly styles */
                #qr-reader {
                    border: 1px solid rgba(255,255,255,0.1) !important;
                }
                #qr-reader__dashboard_section_csr span {
                    color: var(--text-secondary) !important;
                    font-family: inherit !important;
                }
                #qr-reader__dashboard_section_csr button {
                    background: var(--neon-blue) !important;
                    color: white !important;
                    border: none !important;
                    padding: 10px 20px !important;
                    border-radius: var(--radius-md) !important;
                    cursor: pointer !important;
                    margin: 15px 0 !important;
                    font-weight: 600 !important;
                    text-transform: uppercase !important;
                    letter-spacing: 0.5px !important;
                    font-size: 0.8rem !important;
                }
                #qr-reader__dashboard_section_swaplink {
                    color: var(--accent-light) !important;
                    text-decoration: none !important;
                    font-size: 0.85rem !important;
                }
                #qr-reader__camera_selection {
                    padding: 8px !important;
                    background: var(--bg-secondary) !important;
                    color: white !important;
                    border: 1px solid var(--surface-border) !important;
                    border-radius: var(--radius-md) !important;
                    margin-bottom: 10px !important;
                }
            `}</style>
        </div>
    );
}
