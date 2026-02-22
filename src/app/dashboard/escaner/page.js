'use client';

import { useEffect, useState, useRef } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { supabase } from '@/lib/supabase';

export default function EscanerPage() {
    const [scanResult, setScanResult] = useState(null);
    const [error, setError] = useState(null);
    const [isScanning, setIsScanning] = useState(true);
    const scannerRef = useRef(null);

    // Active Event ID (Can be dynamic later, typically stored in context or cookies)
    const ACTIVE_EVENT_ID = 'e19b5b24-b19b-4f9e-a892-12b2a6f2b4c1'; // Default seed UUID

    useEffect(() => {
        // Initialize scanner only on client side
        if (typeof window !== 'undefined' && !scannerRef.current) {
            scannerRef.current = new Html5QrcodeScanner(
                "qr-reader",
                { fps: 10, qrbox: { width: 250, height: 250 }, aspectRatio: 1.0 },
                /* verbose= */ false
            );

            scannerRef.current.render(onScanSuccess, onScanFailure);
        }

        return () => {
            if (scannerRef.current) {
                scannerRef.current.clear().catch(error => {
                    console.error("Failed to clear html5QrcodeScanner. ", error);
                });
                scannerRef.current = null;
            }
        };
    }, []);

    const onScanSuccess = async (decodedText, decodedResult) => {
        // Pause scanning to prevent multiple triggers
        if (!isScanning) return;
        setIsScanning(false);
        setError(null);

        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error("Debes iniciar sesión para escanear.");

            // Call Supabase RPC
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
            setTimeout(() => setIsScanning(true), 3000); // Resume scanning after 3s on error
        }
    };

    const onScanFailure = (error) => {
        // handle scan failure, usually better to ignore and keep scanning
        // console.warn(`Code scan error = ${error}`);
    };

    const resetScanner = () => {
        setScanResult(null);
        setError(null);
        setIsScanning(true);
    };

    return (
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
            <div style={{ marginBottom: 'var(--space-xl)' }}>
                <h1 className="section-title" style={{ fontSize: '2rem', marginBottom: 'var(--space-sm)' }}>
                    Escanear <span className="highlight">Gafete</span>
                </h1>
                <p style={{ color: 'var(--text-secondary)' }}>
                    Apunta la cámara al código QR de otro asistente para agregarlo a tus contactos (Leads).
                </p>
            </div>

            <div className="glass-card" style={{ padding: 'var(--space-xl)', overflow: 'hidden' }}>

                {/* Scanner Container */}
                <div style={{ display: scanResult ? 'none' : 'block' }}>
                    <div id="qr-reader" style={{ width: '100%', border: 'none', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}></div>
                    {error && (
                        <div style={{
                            marginTop: 'var(--space-md)',
                            padding: 'var(--space-md)',
                            background: 'rgba(239, 68, 68, 0.1)',
                            color: '#fca5a5',
                            borderRadius: 'var(--radius-md)',
                            textAlign: 'center',
                            fontSize: '0.9rem'
                        }}>
                            {error}
                            <p style={{ fontSize: '0.8rem', marginTop: '4px', opacity: 0.8 }}>Reintentando en unos segundos...</p>
                        </div>
                    )}
                </div>

                {/* Success Result */}
                {scanResult && (
                    <div style={{ textAlign: 'center', animation: 'slideIn 0.5s ease-out forwards' }}>
                        <div style={{
                            width: 64, height: 64,
                            background: 'rgba(16, 185, 129, 0.1)',
                            color: 'var(--accent-success)',
                            borderRadius: '50%',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            margin: '0 auto var(--space-lg)'
                        }}>
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                        </div>

                        <h2 style={{ fontSize: '1.4rem', color: 'var(--accent-success)', marginBottom: 'var(--space-sm)' }}>
                            ¡Contacto Registrado!
                        </h2>
                        <p style={{ fontSize: '1.1rem', marginBottom: 'var(--space-md)' }}>
                            Has agregado a <strong>{scanResult.contact?.full_name}</strong> a tus leads.
                        </p>

                        {scanResult.company && (
                            <div style={{
                                background: 'rgba(255, 255, 255, 0.03)',
                                padding: 'var(--space-md)',
                                borderRadius: 'var(--radius-md)',
                                marginBottom: 'var(--space-xl)'
                            }}>
                                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Empresa</div>
                                <div style={{ fontSize: '1.1rem', fontWeight: 600 }}>{scanResult.company.trade_name}</div>
                                <div style={{ fontSize: '0.9rem', color: 'var(--accent-light)' }}>{scanResult.company.sector}</div>
                            </div>
                        )}

                        <button onClick={resetScanner} className="btn btn-primary" style={{ width: '100%' }}>
                            Escanear otro gafete
                        </button>
                    </div>
                )}
            </div>

            <style jsx global>{`
                /* Override html5-qrcode default ugly styles */
                #qr-reader {
                    border: 1px solid var(--surface-border) !important;
                }
                #qr-reader__dashboard_section_csr span {
                    color: var(--text-primary) !important;
                }
                #qr-reader__dashboard_section_csr button {
                    background: var(--accent-light) !important;
                    color: white !important;
                    border: none !important;
                    padding: 8px 16px !important;
                    border-radius: var(--radius-md) !important;
                    cursor: pointer !important;
                    margin: 10px 0 !important;
                }
                #qr-reader__dashboard_section_swaplink {
                    color: var(--accent-light) !important;
                    text-decoration: none !important;
                }
            `}</style>
        </div>
    );
}
