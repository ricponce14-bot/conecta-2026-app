'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function LeadsAdmin() {
    const [leads, setLeads] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchLeads();
    }, []);

    const fetchLeads = async () => {
        setLoading(true);
        const { data } = await supabase.from('stand_leads').select('*').order('created_at', { ascending: false });
        if (data) setLeads(data);
        setLoading(false);
    };

    const updateStatus = async (id, newStatus) => {
        await supabase.from('stand_leads').update({ status: newStatus }).eq('id', id);
        fetchLeads();
    };

    return (
        <div>
            <h1 style={{ fontSize: '2.5rem', marginBottom: '2rem' }}>Gestión de <span className="highlight">Leads</span></h1>

            <div className="glass-card" style={{ overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ background: 'rgba(255,255,255,0.05)', textAlign: 'left' }}>
                            <th style={{ padding: '1rem' }}>Nombre</th>
                            <th style={{ padding: '1rem' }}>Empresa</th>
                            <th style={{ padding: '1rem' }}>WhatsApp</th>
                            <th style={{ padding: '1rem' }}>Interés</th>
                            <th style={{ padding: '1rem' }}>Estado</th>
                        </tr>
                    </thead>
                    <tbody>
                        {leads.map(lead => (
                            <tr key={lead.id} style={{ borderBottom: '1px solid #222' }}>
                                <td style={{ padding: '1rem' }}>{lead.name}</td>
                                <td style={{ padding: '1rem' }}>{lead.company}</td>
                                <td style={{ padding: '1rem' }}>
                                    <a href={`https://wa.me/${lead.phone.replace(/\D/g, '')}`} target="_blank" style={{ color: '#00ff66' }}>{lead.phone}</a>
                                </td>
                                <td style={{ padding: '1rem' }}>{lead.interest}</td>
                                <td style={{ padding: '1rem' }}>
                                    <select
                                        value={lead.status}
                                        onChange={(e) => updateStatus(lead.id, e.target.value)}
                                        style={{ background: '#111', color: 'white', border: '1px solid #333', padding: '4px', borderRadius: '4px' }}
                                    >
                                        <option value="pending">Pendiente</option>
                                        <option value="contacted">Contactado</option>
                                        <option value="cerrado">Cerrado</option>
                                        <option value="descartado">Descartado</option>
                                    </select>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <style jsx>{`
        .highlight { color: #00d2ff; }
      `}</style>
        </div>
    );
}
