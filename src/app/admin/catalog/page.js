'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function CatalogAdmin() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCatalog();
    }, []);

    const fetchCatalog = async () => {
        setLoading(true);
        const { data } = await supabase.from('pricing_catalog').select('*').order('price_mxn', { ascending: true });
        if (data) setItems(data);
        setLoading(false);
    };

    const toggleStatus = async (id, currentStatus) => {
        await supabase.from('pricing_catalog').update({ is_active: !currentStatus }).eq('id', id);
        fetchCatalog();
    };

    return (
        <div>
            <h1 style={{ fontSize: 'clamp(1.8rem, 5vw, 2.5rem)', marginBottom: '2rem' }}>Gestión de <span className="highlight">Catálogo</span></h1>

            <div className="glass-card" style={{ padding: '0', overflow: 'hidden' }}>
                <div style={{ overflowX: 'auto', width: '100%' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '500px' }}>
                        <thead>
                            <tr style={{ background: 'rgba(255,255,255,0.05)', textAlign: 'left' }}>
                                <th style={{ padding: '1rem' }}>Producto</th>
                                <th style={{ padding: '1rem' }}>Precio (MXN)</th>
                                <th style={{ padding: '1rem' }}>Estado</th>
                                <th style={{ padding: '1rem' }}>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map(item => (
                                <tr key={item.id} style={{ borderBottom: '1px solid #222' }}>
                                    <td style={{ padding: '1rem', whiteSpace: 'nowrap' }}>{item.item_name}</td>
                                    <td style={{ padding: '1rem' }}>${item.price_mxn}</td>
                                    <td style={{ padding: '1rem' }}>
                                        <span style={{
                                            padding: '2px 8px', borderRadius: '4px', fontSize: '0.75rem',
                                            background: item.is_active ? '#003314' : '#330000',
                                            color: item.is_active ? '#00ff66' : '#ff4444'
                                        }}>
                                            {item.is_active ? 'Activo' : 'Oculto'}
                                        </span>
                                    </td>
                                    <td style={{ padding: '1rem' }}>
                                        <button
                                            onClick={() => toggleStatus(item.id, item.is_active)}
                                            className="btn-status"
                                        >
                                            {item.is_active ? 'Ocultar' : 'Mostrar'}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <style jsx>{`
                .highlight { color: #00d2ff; }
                .btn-status { background: none; border: 1px solid #444; color: white; padding: 4px 12px; border-radius: 4px; cursor: pointer; }
                .btn-status:hover { border-color: #00d2ff; color: #00d2ff; }
            `}</style>
        </div>
    );
}
