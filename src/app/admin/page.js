'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

export default function AdminDashboard() {
    const [stats, setStats] = useState({ leads: 0, speakers: 0, content: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            const { count: leadsCount } = await supabase.from('stand_leads').select('*', { count: 'exact', head: true });
            const { count: speakersCount } = await supabase.from('speakers').select('*', { count: 'exact', head: true });
            const { count: contentCount } = await supabase.from('alliances_sponsors').select('*', { count: 'exact', head: true });

            setStats({
                leads: leadsCount || 0,
                speakers: speakersCount || 0,
                content: contentCount || 0
            });
            setLoading(false);
        };

        fetchStats();
    }, []);

    return (
        <div>
            <h1 style={{ fontSize: '2.5rem', color: 'white', marginBottom: '1rem' }}>Panel de <span className="highlight">Control</span></h1>
            <p style={{ color: '#888', marginBottom: '3rem' }}>Resumen operativo de la plataforma CONECTA 2026.</p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
                <div className="glass-card" style={{ padding: '2rem', border: '1px solid rgba(255,255,255,0.1)' }}>
                    <h3 style={{ fontSize: '0.9rem', color: '#888', textTransform: 'uppercase', tracking: '0.05em' }}>Leads de Venta</h3>
                    <div style={{ fontSize: '3rem', fontWeight: 'bold', margin: '1rem 0' }}>{stats.leads}</div>
                    <Link href="/admin/leads" style={{ color: '#00d2ff', textDecoration: 'none', fontSize: '0.9rem' }}>Gestionar leads &rarr;</Link>
                </div>

                <div className="glass-card" style={{ padding: '2rem', border: '1px solid rgba(255,255,255,0.1)' }}>
                    <h3 style={{ fontSize: '0.9rem', color: '#888', textTransform: 'uppercase' }}>Conferencistas</h3>
                    <div style={{ fontSize: '3rem', fontWeight: 'bold', margin: '1rem 0' }}>{stats.speakers}</div>
                    <Link href="/admin/content" style={{ color: '#00d2ff', textDecoration: 'none', fontSize: '0.9rem' }}>Editar ponentes &rarr;</Link>
                </div>

                <div className="glass-card" style={{ padding: '2rem', border: '1px solid rgba(255,255,255,0.1)' }}>
                    <h3 style={{ fontSize: '0.9rem', color: '#888', textTransform: 'uppercase' }}>Alianzas y Sponsors</h3>
                    <div style={{ fontSize: '3rem', fontWeight: 'bold', margin: '1rem 0' }}>{stats.content}</div>
                    <Link href="/admin/content" style={{ color: '#00d2ff', textDecoration: 'none', fontSize: '0.9rem' }}>Gestionar socios &rarr;</Link>
                </div>
            </div>

            <style jsx>{`
        .highlight { color: #00d2ff; }
        .glass-card { background: rgba(255,255,255,0.03); border-radius: 16px; backdrop-filter: blur(10px); }
      `}</style>
        </div>
    );
}
