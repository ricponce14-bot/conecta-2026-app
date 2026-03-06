'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

const STEPS = [
    { id: 'info', title: 'Tu Información', subtitle: 'Datos básicos de tu perfil profesional' },
    { id: 'business', title: 'Tu Negocio', subtitle: 'Cuéntanos sobre tu empresa o actividad' },
    { id: 'networking', title: 'Networking', subtitle: 'Define qué ofreces y qué buscas de forma estructurada' },
];

const INDUSTRIES = [
    'Tecnología y Software',
    'Manufactura e Industria',
    'Alimentos y Bebidas',
    'Salud y Bienestar',
    'Servicios Financieros',
    'Educación',
    'Construcción e Inmobiliaria',
    'Comercio y Retail',
    'Logística y Transporte',
    'Turismo y Hospitalidad',
    'Energía y Medio Ambiente',
    'Marketing y Publicidad',
    'Consultoría y Asesoría',
    'Otro'
];

const PROFILE_TYPES = [
    'Empresa B2B (Ventas a empresas)',
    'Empresa B2C (Ventas a consumidor)',
    'Profesional Independiente / Freelance',
    'Buscador de Empleo',
    'Inversionista / Capital',
    'Estudiante / Académico',
    'San Ignacio Cerro Gordo',
];

const MUNICIPALITIES = [
    'Tepatitlán de Morelos', 'Arandas', 'Lagos de Moreno',
    'San Juan de los Lagos', 'Jalostotitlán', 'San Miguel el Alto',
    'Yahualica de González Gallo', 'Encarnación de Díaz', 'San Julián',
    'Valle de Guadalupe', 'Cañadas de Obregón', 'Mexticacán',
    'San Diego de Alejandría', 'Unión de San Antonio', 'Villa Hidalgo',
    'Ojuelos de Jalisco', 'Acatic', 'Teocaltiche', 'Cuquío',
];

const TIPS = {
    title: 'Un cargo claro ayuda a que otros asistentes identifiquen rápidamente cómo pueden colaborar contigo.',
    company_name: 'Incluye el nombre oficial de tu empresa. Los perfiles con empresa reciben un 40% más de conexiones.',
    offer_description: 'Sé específico: en lugar de "servicios", escribe "consultoría en marketing digital para pymes".',
    search_description: 'Describe claramente qué buscas: proveedores, socios, clientes, inversionistas, etc.',
};

export default function OnboardingPage() {
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState(0);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [userId, setUserId] = useState(null);
    const [activeTip, setActiveTip] = useState('');
    const [showExitWarning, setShowExitWarning] = useState(false);

    const [formData, setFormData] = useState({
        full_name: '',
        title: '',
        company_name: '',
        whatsapp: '',
        industry: '',
        profileType: '',
        offer_tags: '',
        search_tags: '',
        offer_description: '',
        search_description: '',
        list_in_directory: false,
        business_address: '',
        business_phone: '',
        business_email: '',
        business_website: '',
        business_hours: '',
        municipality: '',
    });

    // Load existing profile data
    useEffect(() => {
        const loadProfile = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session?.user) {
                router.push('/pymatch/login');
                return;
            }

            setUserId(session.user.id);

            const { data: profile } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', session.user.id)
                .single();

            if (profile) {
                // If profile is already complete, go to dashboard
                if (profile.profile_completed) {
                    router.push('/pymatch/dashboard');
                    return;
                }

                setFormData({
                    full_name: profile.full_name || session.user.user_metadata?.full_name || '',
                    title: profile.title || '',
                    company_name: profile.company_name || '',
                    whatsapp: profile.whatsapp || session.user.user_metadata?.whatsapp || '',
                    offer_description: profile.offer_description || '',
                    search_description: profile.search_description || '',
                });
            }

            setLoading(false);
        };

        loadProfile();
    }, [router]);

    // Autosave on step change
    const autoSave = async () => {
        if (!userId) return;
        try {
            await supabase
                .from('profiles')
                .update({
                    full_name: formData.full_name,
                    title: formData.title,
                    company_name: formData.company_name,
                    whatsapp: formData.whatsapp,
                    offer_description: formData.offer_description,
                    search_description: formData.search_description,
                })
                .eq('id', userId);
        } catch (e) {
            console.error('Autosave error:', e);
        }
    };

    const handleNext = async () => {
        await autoSave();
        if (currentStep < STEPS.length - 1) {
            setCurrentStep(currentStep + 1);
        }
    };

    const handlePrev = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handleComplete = async () => {
        setSaving(true);
        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session?.user) throw new Error("No hay sesión activa");

            // Generate structured descriptions for the AI
            let finalOffer = formData.offer_description;
            let finalSearch = formData.search_description;

            if (formData.industry || formData.profileType || formData.offer_tags) {
                finalOffer = `Soy un ${formData.profileType || 'profesional'} en el sector de ${formData.industry || 'varios sectores'}. Ofrezco principalmente: ${formData.offer_tags || formData.offer_description}.`;
            }
            if (formData.search_tags) {
                finalSearch = `Busco conectar con: ${formData.search_tags}.`;
            }

            const { error } = await supabase
                .from('profiles')
                .update({
                    full_name: formData.full_name,
                    title: formData.title,
                    company_name: formData.company_name,
                    whatsapp: formData.whatsapp,
                    offer_description: finalOffer,
                    search_description: finalSearch,
                    profile_completed: true,
                })
                .eq('id', userId);

            if (error) throw error;

            // If user opted into the directory, create/update company record
            if (formData.list_in_directory) {
                const { error: companyError } = await supabase
                    .from('companies')
                    .upsert({
                        owner_id: userId,
                        trade_name: formData.company_name,
                        sector: formData.industry,
                        offer_description: finalOffer,
                        search_description: finalSearch,
                        address: formData.business_address,
                        phone: formData.business_phone,
                        email: formData.business_email,
                        website: formData.business_website,
                        hours: formData.business_hours,
                        municipality: formData.municipality,
                        is_verified: false
                    }, { onConflict: 'owner_id' });

                if (companyError) {
                    console.error("Error saving to directory:", companyError);
                    // We don't block the whole onboarding if directory fails, but notify
                }
            }

            // Generate AI embedding in background (non-blocking)
            fetch('/api/embeddings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId }),
            }).catch(err => console.error('Embedding generation error:', err));

            router.push('/pymatch/dashboard');
        } catch (err) {
            alert('Error al guardar: ' + err.message);
        } finally {
            setSaving(false);
        }
    };

    const handleSkip = async () => {
        await autoSave();
        router.push('/pymatch/dashboard');
    };

    const completionPercent = () => {
        const fields = ['full_name', 'title', 'company_name', 'whatsapp', 'offer_description', 'search_description'];
        const filled = fields.filter(f => formData[f] && formData[f].trim().length > 0).length;
        return Math.round((filled / fields.length) * 100);
    };

    if (loading) {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', gap: '1rem', background: 'var(--bg-primary)' }}>
                <div className="loading-spinner" style={{ width: '40px', height: '40px', border: '3px solid rgba(255,255,255,0.1)', borderTopColor: 'var(--neon-blue)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                <p style={{ color: 'var(--text-secondary)' }}>Preparando tu perfil...</p>
                <style jsx>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
        );
    }

    const pct = completionPercent();

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', display: 'flex', flexDirection: 'column' }}>

            {/* Top Bar */}
            <div className="ob-topbar" style={{
                padding: '1rem 1.5rem',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                borderBottom: '1px solid var(--border-color)',
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--neon-blue)" strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></svg>
                    <span style={{ fontWeight: 700, fontSize: '1.1rem' }}>PyMatch</span>
                </div>
                <button onClick={() => setShowExitWarning(true)} style={{
                    background: 'none', border: 'none', color: 'var(--text-tertiary)',
                    cursor: 'pointer', fontSize: '0.85rem',
                }}>
                    Completar más tarde
                </button>
            </div>

            {/* Progress Bar */}
            <div className="ob-progress" style={{ padding: '0 1.5rem' }}>
                <div style={{
                    height: '4px', background: 'var(--bg-glass)', borderRadius: '4px',
                    overflow: 'hidden', margin: '1rem 0',
                }}>
                    <div style={{
                        height: '100%',
                        width: `${pct}%`,
                        background: pct === 100
                            ? 'var(--neon-green)'
                            : 'linear-gradient(90deg, var(--neon-blue), var(--accent-light))',
                        borderRadius: '4px',
                        transition: 'width 0.5s ease',
                    }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>
                        Paso {currentStep + 1} de {STEPS.length}
                    </span>
                    <span style={{
                        fontSize: '0.8rem', fontWeight: 600,
                        color: pct === 100 ? 'var(--neon-green)' : 'var(--neon-blue)',
                    }}>
                        {pct}% completado
                    </span>
                </div>
            </div>

            {/* Step Indicators */}
            <div className="ob-steps" style={{ display: 'flex', justifyContent: 'center', gap: '2rem', padding: '0.5rem 1.5rem 1rem', flexWrap: 'wrap' }}>
                {STEPS.map((step, i) => (
                    <div key={step.id} style={{
                        display: 'flex', alignItems: 'center', gap: '8px', opacity: i === currentStep ? 1 : 0.4,
                        transition: 'opacity 0.3s',
                    }}>
                        <div style={{
                            width: '28px', height: '28px', borderRadius: '50%',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '0.75rem', fontWeight: 700,
                            background: i <= currentStep ? 'var(--neon-blue)' : 'var(--bg-glass)',
                            color: i <= currentStep ? '#000' : 'var(--text-tertiary)',
                            transition: 'all 0.3s',
                        }}>
                            {i < currentStep ? '✓' : i + 1}
                        </div>
                        <span className="ob-step-label" style={{ fontSize: '0.85rem', fontWeight: i === currentStep ? 600 : 400 }}>{step.title}</span>
                    </div>
                ))}            </div>

            {/* Main Content */}
            <div className="ob-main" style={{ flex: 1, display: 'flex', justifyContent: 'center', padding: '1rem 1.5rem 2rem' }}>
                <div style={{ width: '100%', maxWidth: '580px' }}>

                    <div style={{ marginBottom: 'var(--space-xl)', textAlign: 'center' }}>
                        <h2 style={{ fontSize: 'clamp(1.5rem, 4vw, 2rem)', marginBottom: '0.5rem' }}>
                            {STEPS[currentStep].title}
                        </h2>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                            {STEPS[currentStep].subtitle}
                        </p>
                    </div>

                    <div className="ob-card glass-card" style={{ padding: 'var(--space-xl)' }}>

                        {/* STEP 1: Basic Info */}
                        {currentStep === 0 && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
                                <div>
                                    <label className="ob-label">Nombre Completo *</label>
                                    <input
                                        type="text" required className="filter-input" style={{ width: '100%' }}
                                        placeholder="Tu nombre completo"
                                        value={formData.full_name}
                                        onChange={e => setFormData({ ...formData, full_name: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="ob-label">Cargo / Profesión</label>
                                    <input
                                        type="text" className="filter-input" style={{ width: '100%' }}
                                        placeholder="Ej. Director General, Diseñador, Consultor..."
                                        value={formData.title}
                                        onChange={e => setFormData({ ...formData, title: e.target.value })}
                                        onFocus={() => setActiveTip('title')}
                                        onBlur={() => setActiveTip('')}
                                    />
                                    {activeTip === 'title' && <div className="ob-tip">{TIPS.title}</div>}
                                </div>
                                <div>
                                    <label className="ob-label">WhatsApp</label>
                                    <input
                                        type="tel" className="filter-input" style={{ width: '100%' }}
                                        placeholder="33 1234 5678"
                                        value={formData.whatsapp}
                                        onChange={e => setFormData({ ...formData, whatsapp: e.target.value })}
                                    />
                                </div>
                            </div>
                        )}

                        {/* STEP 2: Business */}
                        {currentStep === 1 && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
                                <div>
                                    <label className="ob-label">Nombre de tu Empresa</label>
                                    <input
                                        type="text" className="filter-input" style={{ width: '100%' }}
                                        placeholder="Ej. Grupo Alteño, TechSolutions MX..."
                                        value={formData.company_name}
                                        onChange={e => setFormData({ ...formData, company_name: e.target.value })}
                                        onFocus={() => setActiveTip('company_name')}
                                        onBlur={() => setActiveTip('')}
                                    />
                                    {activeTip === 'company_name' && <div className="ob-tip">{TIPS.company_name}</div>}
                                </div>

                                <div className="ob-motivation" style={{ textAlign: 'center', padding: 'var(--space-lg)', borderRadius: 'var(--radius-md)', background: 'rgba(0, 210, 255, 0.04)', border: '1px solid rgba(0, 210, 255, 0.1)' }}>
                                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--neon-blue)" strokeWidth="1.5" style={{ marginBottom: '8px' }}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
                                    <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
                                        Los perfiles con empresa e información de negocio reciben en promedio <strong style={{ color: 'var(--neon-blue)' }}>3x más conexiones</strong> durante el evento.
                                    </p>
                                </div>

                                {/* Directory Listing Section */}
                                <div style={{
                                    borderTop: '1px solid rgba(255,255,255,0.05)',
                                    paddingTop: 'var(--space-xl)',
                                    marginTop: 'var(--space-md)'
                                }}>
                                    <h4 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>Directorio Empresarial</h4>

                                    <div style={{
                                        display: 'flex',
                                        gap: '12px',
                                        background: 'rgba(37, 99, 235, 0.05)',
                                        padding: '1rem',
                                        borderRadius: '12px',
                                        border: '1px solid rgba(37, 99, 235, 0.1)',
                                        marginBottom: 'var(--space-md)'
                                    }}>
                                        <div style={{ paddingTop: '2px' }}>
                                            <input
                                                type="checkbox"
                                                id="list_in_directory"
                                                style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                                                checked={formData.list_in_directory}
                                                onChange={e => setFormData({ ...formData, list_in_directory: e.target.checked })}
                                            />
                                        </div>
                                        <label htmlFor="list_in_directory" style={{ cursor: 'pointer' }}>
                                            <div style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--neon-blue)' }}>Publicar mi empresa en el directorio oficial</div>
                                            <p style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)', margin: '4px 0 0 0' }}>
                                                Al habilitar esta opción, los demás asistentes podrán encontrar tu negocio, ver tus productos y contactarte directamente.
                                            </p>
                                        </label>
                                    </div>

                                    {formData.list_in_directory && (
                                        <div style={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            gap: 'var(--space-md)',
                                            animation: 'tipFadeIn 0.4s ease'
                                        }}>
                                            <div>
                                                <label className="ob-label">Giro / Municipio *</label>
                                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                                                    <select
                                                        className="filter-input"
                                                        value={formData.municipality}
                                                        onChange={e => setFormData({ ...formData, municipality: e.target.value })}
                                                    >
                                                        <option value="">Selecciona Municipio</option>
                                                        {MUNICIPALITIES.map(m => <option key={m} value={m}>{m}</option>)}
                                                    </select>
                                                    <input
                                                        type="text"
                                                        className="filter-input"
                                                        placeholder="Giro (Ej. Dulces)"
                                                        value={formData.industry}
                                                        disabled
                                                    />
                                                </div>
                                            </div>

                                            <div>
                                                <label className="ob-label">Dirección Completa</label>
                                                <input
                                                    type="text"
                                                    className="filter-input"
                                                    style={{ width: '100%' }}
                                                    placeholder="Calle, número, colonia, CP..."
                                                    value={formData.business_address}
                                                    onChange={e => setFormData({ ...formData, business_address: e.target.value })}
                                                />
                                            </div>

                                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                                                <div>
                                                    <label className="ob-label">Teléfono</label>
                                                    <input
                                                        type="tel"
                                                        className="filter-input"
                                                        style={{ width: '100%' }}
                                                        placeholder="33 1234 5678"
                                                        value={formData.business_phone}
                                                        onChange={e => setFormData({ ...formData, business_phone: e.target.value })}
                                                    />
                                                </div>
                                                <div>
                                                    <label className="ob-label">Horario</label>
                                                    <input
                                                        type="text"
                                                        className="filter-input"
                                                        style={{ width: '100%' }}
                                                        placeholder="Lun-Vie 9-18"
                                                        value={formData.business_hours}
                                                        onChange={e => setFormData({ ...formData, business_hours: e.target.value })}
                                                    />
                                                </div>
                                            </div>

                                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                                                <div>
                                                    <label className="ob-label">Email Corporativo</label>
                                                    <input
                                                        type="email"
                                                        className="filter-input"
                                                        style={{ width: '100%' }}
                                                        placeholder="ventas@empresa.com"
                                                        value={formData.business_email}
                                                        onChange={e => setFormData({ ...formData, business_email: e.target.value })}
                                                    />
                                                </div>
                                                <div>
                                                    <label className="ob-label">Sitio Web</label>
                                                    <input
                                                        type="url"
                                                        className="filter-input"
                                                        style={{ width: '100%' }}
                                                        placeholder="https://empresa.com"
                                                        value={formData.business_website}
                                                        onChange={e => setFormData({ ...formData, business_website: e.target.value })}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* STEP 3: Networking */}
                        {currentStep === 2 && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
                                <div>
                                    <label className="ob-label">Industria / Sector</label>
                                    <select
                                        className="filter-input" style={{ width: '100%', cursor: 'pointer' }}
                                        value={formData.industry}
                                        onChange={e => setFormData({ ...formData, industry: e.target.value })}
                                        required
                                    >
                                        <option value="" disabled>Selecciona tu industria principal</option>
                                        {INDUSTRIES.map(ind => <option key={ind} value={ind}>{ind}</option>)}
                                    </select>
                                </div>

                                <div>
                                    <label className="ob-label">Tipo de Perfil</label>
                                    <select
                                        className="filter-input" style={{ width: '100%', cursor: 'pointer' }}
                                        value={formData.profileType}
                                        onChange={e => setFormData({ ...formData, profileType: e.target.value })}
                                        required
                                    >
                                        <option value="" disabled>¿Cómo participas en el evento?</option>
                                        {PROFILE_TYPES.map(pt => <option key={pt} value={pt}>{pt}</option>)}
                                    </select>
                                </div>

                                <div>
                                    <label className="ob-label" style={{ color: 'var(--neon-green)' }}>
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '4px', verticalAlign: 'middle' }}><polyline points="20 6 9 17 4 12" /></svg>
                                        Productos o Servicios que Ofreces
                                    </label>
                                    <textarea
                                        className="filter-input" style={{ width: '100%', minHeight: '60px', resize: 'vertical', fontFamily: 'inherit' }}
                                        placeholder="Ej. Diseño web, consultoría fiscal, empaques ecológicos..."
                                        value={formData.offer_tags}
                                        onChange={e => setFormData({ ...formData, offer_tags: e.target.value })}
                                        onFocus={() => setActiveTip('offer_description')}
                                        onBlur={() => setActiveTip('')}
                                    />
                                    {activeTip === 'offer_description' && <div className="ob-tip">{TIPS.offer_description}</div>}
                                </div>

                                <div>
                                    <label className="ob-label" style={{ color: '#ffd700' }}>
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '4px', verticalAlign: 'middle' }}><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
                                        ¿Qué tipo de contactos buscas?
                                    </label>
                                    <textarea
                                        className="filter-input" style={{ width: '100%', minHeight: '60px', resize: 'vertical', fontFamily: 'inherit' }}
                                        placeholder="Ej. Inversionistas ángeles, proveedores de logística, empresas de software..."
                                        value={formData.search_tags}
                                        onChange={e => setFormData({ ...formData, search_tags: e.target.value })}
                                        onFocus={() => setActiveTip('search_description')}
                                        onBlur={() => setActiveTip('')}
                                    />
                                    {activeTip === 'search_description' && <div className="ob-tip">{TIPS.search_description}</div>}
                                </div>

                                <div className="ob-motivation" style={{ textAlign: 'center', padding: 'var(--space-lg)', borderRadius: 'var(--radius-md)', background: 'rgba(0, 255, 136, 0.04)', border: '1px solid rgba(0, 255, 136, 0.1)' }}>
                                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--neon-green)" strokeWidth="1.5" style={{ marginBottom: '8px' }}><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></svg>
                                    <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
                                        Esta información generará un párrafo automático que alimentará al <strong style={{ color: 'var(--neon-green)' }}>algoritmo de IA</strong> para conectarte con los mejores prospectos.
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Navigation Buttons */}
                    <div className="ob-nav" style={{ display: 'flex', gap: 'var(--space-md)', marginTop: 'var(--space-xl)', justifyContent: 'space-between' }}>
                        {currentStep > 0 ? (
                            <button onClick={handlePrev} className="btn btn-outline" style={{ flex: 1 }}>
                                Anterior
                            </button>
                        ) : <div style={{ flex: 1 }} />}

                        {currentStep < STEPS.length - 1 ? (
                            <button onClick={handleNext} className="btn btn-primary" style={{ flex: 1 }}>
                                Siguiente
                                <svg className="btn-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                            </button>
                        ) : (
                            <button onClick={handleComplete} className="btn btn-primary" style={{ flex: 1 }} disabled={saving}>
                                {saving ? 'Guardando...' : 'Completar Perfil'}
                                {!saving && <svg className="btn-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>}
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Exit Warning Modal */}
            {showExitWarning && (
                <div style={{
                    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)',
                    backdropFilter: 'blur(5px)', zIndex: 100,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem',
                }}>
                    <div className="ob-exit-modal glass-card" style={{ maxWidth: '420px', padding: 'var(--space-xl)', textAlign: 'center' }}>
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#ffd700" strokeWidth="1.5" style={{ marginBottom: '1rem' }}><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>
                        <h3 style={{ marginBottom: '0.75rem', fontSize: '1.2rem' }}>Tu perfil está al {pct}%</h3>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                            Un perfil incompleto reduce tus posibilidades de hacer matches de negocio en el evento. Puedes completarlo después desde tu dashboard.
                        </p>
                        <div style={{ display: 'flex', gap: '0.75rem' }}>
                            <button onClick={() => setShowExitWarning(false)} className="btn btn-primary" style={{ flex: 1 }}>
                                Seguir editando
                            </button>
                            <button onClick={handleSkip} className="btn btn-outline" style={{ flex: 1 }}>
                                Salir de todos modos
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <style jsx>{`
                .ob-label {
                    display: block;
                    font-size: 0.88rem;
                    color: var(--text-secondary);
                    margin-bottom: 6px;
                    font-weight: 500;
                }
                .ob-tip {
                    margin-top: 6px;
                    padding: 8px 12px;
                    background: rgba(0, 210, 255, 0.06);
                    border-left: 3px solid var(--neon-blue);
                    border-radius: 0 var(--radius-sm) var(--radius-sm) 0;
                    font-size: 0.8rem;
                    color: var(--text-secondary);
                    line-height: 1.5;
                    animation: tipFadeIn 0.3s ease;
                }
                @keyframes tipFadeIn {
                    from { opacity: 0; transform: translateY(-4px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                /* ── Mobile Optimizations ── */
                @media (max-width: 600px) {
                    .ob-topbar {
                        padding: 0.75rem 1rem !important;
                    }
                    .ob-progress {
                        padding: 0 1rem !important;
                    }
                    .ob-steps {
                        gap: 1rem !important;
                        padding: 0.25rem 1rem 0.75rem !important;
                    }
                    .ob-step-label {
                        display: none;
                    }
                    .ob-main {
                        padding: 0.75rem 1rem 1.5rem !important;
                    }
                    .ob-card {
                        padding: var(--space-md) !important;
                    }
                    .ob-nav {
                        margin-top: var(--space-md) !important;
                    }
                    .ob-exit-modal {
                        padding: var(--space-lg) !important;
                        margin: 0 0.5rem;
                    }
                    .ob-label {
                        font-size: 0.82rem;
                    }
                    .ob-tip {
                        font-size: 0.75rem;
                        padding: 6px 10px;
                    }
                    .ob-motivation {
                        padding: var(--space-md) !important;
                    }
                    .ob-motivation p {
                        font-size: 0.82rem !important;
                    }
                }
            `}</style>
        </div>
    );
}
