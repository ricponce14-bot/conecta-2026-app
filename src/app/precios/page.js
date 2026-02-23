'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const FAQ = [
    {
        q: '¿Qué incluye el QR de networking?',
        a: 'Cada asistente recibe un código QR único que otros asistentes pueden escanear para guardarte como contacto. Es como intercambiar tarjetas de presentación, pero digital y sin perder datos.',
    },
    {
        q: '¿Qué es el matchmaking prioritario?',
        a: 'Nuestro sistema analiza lo que tu empresa ofrece y lo que busca, y te sugiere automáticamente las empresas más compatibles. Los paquetes Regional Plus tienen prioridad en estas sugerencias.',
    },
    {
        q: '¿Cómo funciona el pago?',
        a: 'Aceptamos transferencia bancaria, tarjeta y efectivo. Al confirmar tu pago, tu empresa se verifica automáticamente y aparece como "Verificada" en el directorio.',
    },
    {
        q: '¿Puedo cambiar de paquete después?',
        a: 'Sí, puedes hacer upgrade a un paquete superior pagando la diferencia. Contáctanos por WhatsApp para gestionar el cambio.',
    },
];

export default function PreciosPage() {
    const router = useRouter();
    const [pricing, setPricing] = useState([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);

    // Active Event ID (Can be dynamic later)
    const ACTIVE_EVENT_ID = '00000000-0000-0000-0000-000000000001';

    useEffect(() => {
        async function fetchPricing() {
            setLoading(true);
            try {
                const { supabase } = await import('@/lib/supabase');

                // Get current user if any
                const { data: { session } } = await supabase.auth.getSession();
                const currentUser = session?.user;
                setUser(currentUser);

                // Fetch catalog
                const { data, error } = await supabase
                    .from('pricing_catalog')
                    .select('*')
                    .eq('event_id', ACTIVE_EVENT_ID)
                    .neq('item_slug', 'pabellon-municipal')
                    .eq('is_active', true)
                    .order('price_mxn', { ascending: true });

                if (error) throw error;

                // Map to frontend structure using static copies to compensate dynamic lacks
                const mapped = data.map(item => {
                    const isStand = item.item_slug.includes('stand');
                    const isPremium = item.item_slug.includes('premium') || item.item_slug.includes('plus');

                    return {
                        id: item.id,
                        tier: isPremium ? 'Premium' : (isStand ? 'Empresarial' : 'Individual'),
                        name: item.item_name,
                        price: item.price_mxn.toLocaleString('es-MX'),
                        rawPrice: item.price_mxn,
                        period: isStand ? 'Espacio de exhibición' : 'Por persona',
                        description: isStand
                            ? 'Tu espacio para mostrar tu negocio a toda la región.'
                            : 'Acceso general al segundo día del evento.',
                        features: isPremium
                            ? ['Espacio premium 4×4m', 'Mobiliario VIP', 'Directorio destacado', 'QR empresarial premium', 'Panel en tiempo real']
                            : (isStand
                                ? ['Espacio 3×3m', 'Mesa y sillas', 'Señalización', 'Aparición en directorio', 'QR empresarial']
                                : ['Acceso Día 2', 'Networking libre', 'Conferencias', 'QR personal']),
                        featured: isPremium,
                        ctaText: isStand ? 'Reservar stand' : 'Comprar boleto',
                        ctaClass: isPremium ? 'btn-primary' : 'btn-outline',
                    };
                });

                setPricing(mapped);
            } catch (err) {
                console.error("Error loading pricing:", err);
            } finally {
                setLoading(false);
            }
        }
        fetchPricing();
    }, []);

    const handlePurchase = async (plan) => {
        if (!user) {
            alert('Por favor, inicia sesión o regístrate para continuar con la compra.');
            router.push(`/registro?redirect=/precios`);
            return;
        }

        try {
            const { supabase } = await import('@/lib/supabase');
            const { error } = await supabase
                .from('payments')
                .insert({
                    profile_id: user.id,
                    event_id: ACTIVE_EVENT_ID,
                    catalog_item_id: plan.id,
                    amount_mxn: plan.rawPrice,
                    status: 'pending'
                });

            if (error) throw error;

            // Redirect to WhatsApp to complete payment sending the user ID as reference
            const message = `Hola, he iniciado la compra del paquete "${plan.name}" ($${plan.price} MXN) en la plataforma. Mi correo es ${user.email}. ¿A qué cuenta deposito?`;
            window.location.href = `https://wa.me/523781002683?text=${encodeURIComponent(message)}`;

        } catch (err) {
            console.error("Payment error:", err);
            alert("Ocurrió un error al procesar tu solicitud. Intenta de nuevo.");
        }
    };

    return (
        <>
            <Navbar />

            <div className="page-header">
                <div className="container">
                    <div className="section-label">Inversión</div>
                    <h1 className="section-title">
                        Precios y <span className="highlight">paquetes</span>
                    </h1>
                    <p className="section-subtitle">
                        Elige el paquete que mejor se adapte a tus necesidades.
                    </p>
                </div>
            </div>

            <section className="section" style={{ paddingTop: 0 }}>
                <div className="container">
                    {loading ? (
                        <div style={{ textAlign: 'center', padding: 'var(--space-4xl)' }}>Cargando planes...</div>
                    ) : (
                        <div className="pricing-grid">
                            {pricing.map((plan, i) => (
                                <div key={i} className={`glass-card pricing-card stagger-item ${plan.featured ? 'featured' : ''}`}>
                                    {plan.featured && <div className="pricing-badge">Recomendado</div>}
                                    <div className="pricing-tier">{plan.tier}</div>
                                    <div className="pricing-name">{plan.name}</div>
                                    <div className="pricing-price">
                                        <span className="currency">$</span>{plan.price}
                                        <span className="currency"> MXN</span>
                                    </div>
                                    <div className="pricing-period">{plan.period}</div>
                                    <p style={{
                                        fontSize: '0.85rem', color: 'var(--text-secondary)',
                                        marginBottom: 'var(--space-lg)', lineHeight: '1.65',
                                    }}>
                                        {plan.description}
                                    </p>
                                    <ul className="pricing-features">
                                        {plan.features.map((feature, j) => (
                                            <li key={j}><span className="check">&#10003;</span> {feature}</li>
                                        ))}
                                    </ul>
                                    <button
                                        onClick={() => handlePurchase(plan)}
                                        className={`btn ${plan.ctaClass}`}
                                        style={{ width: '100%', marginTop: 'var(--space-auto)' }}
                                    >
                                        {plan.ctaText}
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* FAQ */}
                    <div style={{ marginTop: 'var(--space-4xl)', maxWidth: '700px', margin: 'var(--space-4xl) auto 0' }}>
                        <div style={{ textAlign: 'center' }}>
                            <div className="section-label" style={{ justifyContent: 'center' }}>Dudas</div>
                            <h2 className="section-title center" style={{ fontSize: '1.8rem' }}>
                                Preguntas <span className="highlight">frecuentes</span>
                            </h2>
                        </div>

                        {FAQ.map((faq, i) => (
                            <div key={i} className="glass-card faq-item">
                                <h3 className="faq-question">{faq.q}</h3>
                                <p className="faq-answer">{faq.a}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="section" style={{
                background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.08), rgba(14, 165, 233, 0.05))',
                textAlign: 'center',
            }}>
                <div className="container">
                    <h2 className="section-title center" style={{ fontSize: '1.8rem' }}>
                        ¿Tienes dudas? <span className="highlight">Escríbenos</span>
                    </h2>
                    <p className="section-subtitle center">
                        Nuestro equipo está listo para ayudarte a elegir el paquete ideal.
                    </p>
                    <a
                        href="https://wa.me/523781002683?text=Hola,%20tengo%20dudas%20sobre%20CONECTA%202026"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-secondary btn-lg"
                    >
                        Contactar por WhatsApp
                    </a>
                </div>
            </section>

            <Footer />
        </>
    );
}
