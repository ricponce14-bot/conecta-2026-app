'use client';

import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Image from 'next/image';

const MUNICIPALITIES = [
    'Todos', 'Tepatitlán de Morelos', 'Arandas', 'Lagos de Moreno',
    'San Juan de los Lagos', 'Jalostotitlán', 'San Miguel el Alto',
    'Yahualica de González Gallo', 'Encarnación de Díaz', 'San Julián',
    'Valle de Guadalupe', 'Cañadas de Obregón', 'Mexticacán',
    'San Diego de Alejandría', 'Unión de San Antonio', 'Villa Hidalgo',
    'Ojuelos de Jalisco', 'Acatic', 'Teocaltiche', 'Cuquío',
    'San Ignacio Cerro Gordo',
];

const SECTORS = [
    'Todos', 'Agroindustria', 'Tecnología', 'Manufactura', 'Distribución',
    'Servicios', 'Comercio', 'Salud', 'Educación', 'Construcción',
];

const MUNICIPALITY_IMAGES = {
    'Tepatitlán de Morelos': '/images/muni-tepatitlan.png',
    'Arandas': '/images/muni-arandas.png',
    'Lagos de Moreno': '/images/muni-lagos.png',
};

const DEFAULT_MUNI_IMAGE = '/images/hero-bg.png';

// Dynamic data will be fetched from Supabase instead of this array

export default function DirectorioPage() {
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [municipalityFilter, setMunicipalityFilter] = useState('Todos');
    const [sectorFilter, setSectorFilter] = useState('Todos');
    const [searchQuery, setSearchQuery] = useState('');
    const [expandedCard, setExpandedCard] = useState(null);

    useEffect(() => {
        async function loadCompanies() {
            setLoading(true);
            try {
                const { supabase } = await import('@/lib/supabase');

                const { data, error } = await supabase
                    .from('companies')
                    .select('id, trade_name, municipality, sector, offer_description, search_description, is_verified, logo_url')
                    .order('trade_name');

                if (error) throw error;

                // Map to frontend structure
                const mapped = data.map(c => ({
                    id: c.id,
                    name: c.trade_name,
                    initials: c.trade_name.substring(0, 2).toUpperCase(),
                    sector: c.sector,
                    municipality: c.municipality,
                    offer: c.offer_description,
                    search: c.search_description,
                    verified: c.is_verified,
                    logo_url: c.logo_url
                }));

                setCompanies(mapped);
            } catch (err) {
                console.error("Error loading directory:", err);
            } finally {
                setLoading(false);
            }
        }
        loadCompanies();
    }, []);

    const filtered = companies.filter((c) => {
        const matchMuni = municipalityFilter === 'Todos' || c.municipality === municipalityFilter;
        const matchSector = sectorFilter === 'Todos' || c.sector === sectorFilter;
        const matchSearch = searchQuery === '' ||
            c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (c.offer && c.offer.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (c.search && c.search.toLowerCase().includes(searchQuery.toLowerCase()));
        return matchMuni && matchSector && matchSearch;
    });

    const getMuniImage = (muni) => MUNICIPALITY_IMAGES[muni] || DEFAULT_MUNI_IMAGE;

    return (
        <>
            <Navbar />

            <div className="page-header">
                <div className="container">
                    <div className="section-label">Participantes</div>
                    <h1 className="section-title">
                        Directorio <span className="highlight">Empresarial</span>
                    </h1>
                    <p className="section-subtitle">
                        Explora las empresas participantes. Filtra por municipio o sector
                        para encontrar tu próximo socio comercial.
                    </p>
                </div>
            </div>

            <section className="section" style={{ paddingTop: 0 }}>
                <div className="container">
                    <div className="filter-bar">
                        <input
                            type="text"
                            className="filter-input"
                            placeholder="Buscar empresa, producto o servicio..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <select
                            className="filter-select"
                            value={municipalityFilter}
                            onChange={(e) => setMunicipalityFilter(e.target.value)}
                        >
                            {MUNICIPALITIES.map((m) => (
                                <option key={m} value={m}>{m === 'Todos' ? 'Todos los municipios' : m}</option>
                            ))}
                        </select>
                        <select
                            className="filter-select"
                            value={sectorFilter}
                            onChange={(e) => setSectorFilter(e.target.value)}
                        >
                            {SECTORS.map((s) => (
                                <option key={s} value={s}>{s === 'Todos' ? 'Todos los sectores' : s}</option>
                            ))}
                        </select>
                    </div>

                    <p className="results-count">
                        {loading ? 'Cargando empresas...' : `${filtered.length} empresa${filtered.length !== 1 ? 's' : ''} encontrada${filtered.length !== 1 ? 's' : ''}`}
                    </p>

                    <div className="company-grid">
                        {filtered.map((company, i) => (
                            <div
                                key={i}
                                className="glass-card company-card stagger-item"
                                onClick={() => setExpandedCard(expandedCard === i ? null : i)}
                            >
                                <div className="company-card-image">
                                    <Image src={getMuniImage(company.municipality)} alt={company.municipality} width={300} height={150} style={{ objectFit: 'cover', width: '100%', height: '100%' }} />
                                    <div className="company-card-municipality">{company.municipality}</div>
                                </div>
                                <div className="company-card-body">
                                    <div className="company-card-header">
                                        <div className="company-logo-placeholder">{company.initials}</div>
                                        <div>
                                            <div className="company-name">{company.name}</div>
                                            <div className="company-sector-label">{company.sector}</div>
                                        </div>
                                    </div>
                                    <div className="company-tags">
                                        <span className="tag tag-sector">{company.sector}</span>
                                        {company.verified && <span className="tag tag-verified">Verificada</span>}
                                    </div>

                                    {expandedCard === i ? (
                                        <div style={{ marginTop: 'var(--space-md)' }}>
                                            <div style={{ marginBottom: 'var(--space-md)' }}>
                                                <h4 style={{
                                                    fontSize: '0.82rem', color: 'var(--accent-success)',
                                                    marginBottom: '4px', fontFamily: 'var(--font-heading)',
                                                    textTransform: 'uppercase', letterSpacing: '0.06em',
                                                }}>
                                                    Lo que ofrecemos
                                                </h4>
                                                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.65' }}>
                                                    {company.offer}
                                                </p>
                                            </div>
                                            <div>
                                                <h4 style={{
                                                    fontSize: '0.82rem', color: 'var(--accent-warn)',
                                                    marginBottom: '4px', fontFamily: 'var(--font-heading)',
                                                    textTransform: 'uppercase', letterSpacing: '0.06em',
                                                }}>
                                                    Lo que buscamos
                                                </h4>
                                                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.65' }}>
                                                    {company.search}
                                                </p>
                                            </div>
                                        </div>
                                    ) : (
                                        <p className="company-description">{company.offer}</p>
                                    )}

                                    <div className="company-footer">
                                        <span className="company-cta">
                                            {expandedCard === i ? 'Cerrar' : 'Ver más'}
                                            <svg width="14" height="14" viewBox="0 0 20 20" fill="currentColor" style={{
                                                transform: expandedCard === i ? 'rotate(-90deg)' : 'none',
                                                transition: 'transform 0.2s ease',
                                            }}>
                                                <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
                                            </svg>
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {!loading && filtered.length === 0 && (
                        <div className="empty-state">
                            <div className="empty-state-icon">
                                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                    <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
                                </svg>
                            </div>
                            <p style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>No se encontraron empresas</p>
                            <p style={{ fontSize: '0.88rem' }}>Intenta con otros criterios de búsqueda o revisa más tarde.</p>
                        </div>
                    )}
                </div>
            </section>

            <Footer />
        </>
    );
}
