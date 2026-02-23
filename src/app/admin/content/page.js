'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function ContentCMS() {
    const [speakers, setSpeakers] = useState([]);
    const [alliances, setAlliances] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            const { data: s } = await supabase.from('speakers').select('*').order('display_order');
            const { data: a } = await supabase.from('alliances_sponsors').select('*').order('display_order');
            if (s) setSpeakers(s);
            if (a) setAlliances(a);
            setLoading(false);
        };
        fetchData();
    }, []);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
            <section>
                <h2 style={{ fontSize: '1.75rem', marginBottom: '1.5rem' }}>Gestión de <span className="highlight">Ponentes</span></h2>
                <div className="glass-card" style={{ padding: '1.5rem' }}>
                    {speakers.map(s => (
                        <div key={s.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem 0', borderBottom: '1px solid #222' }}>
                            <div>
                                <strong>{s.name}</strong> ({s.is_regional ? 'Regional' : 'Estelar'})
                                <div style={{ fontSize: '0.85rem', color: '#888' }}>{s.topic}</div>
                            </div>
                            <button className="btn-edit">Editar</button>
                        </div>
                    ))}
                    <button className="btn-add" style={{ marginTop: '1.5rem' }}>+ Agregar Ponente</button>
                </div>
            </section>

            <section>
                <h2 style={{ fontSize: '1.75rem', marginBottom: '1.5rem' }}>Alianzas y <span className="highlight">Patrocinios</span></h2>
                <div className="glass-card" style={{ padding: '1.5rem' }}>
                    {alliances.map(a => (
                        <div key={a.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem 0', borderBottom: '1px solid #222' }}>
                            <div>
                                <strong>{a.name}</strong>
                                <div style={{ fontSize: '0.85rem', color: '#888' }}>Tipo: {a.type}</div>
                            </div>
                            <button className="btn-edit">Editar</button>
                        </div>
                    ))}
                    <button className="btn-add" style={{ marginTop: '1.5rem' }}>+ Agregar Alianza/Sponsor</button>
                </div>
            </section>

            <style jsx>{`
        .highlight { color: #00d2ff; }
        .btn-edit { background: none; border: 1px solid #444; color: white; padding: 4px 12px; border-radius: 4px; cursor: pointer; }
        .btn-add { background: #00d2ff; color: black; border: none; padding: 10px 20px; border-radius: 8px; font-weight: bold; cursor: pointer; }
      `}</style>
        </div>
    );
}
