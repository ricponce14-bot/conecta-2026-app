import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const EMBED_URL = `https://generativelanguage.googleapis.com/v1beta/models/embedding-001:embedContent?key=${GEMINI_API_KEY}`;

const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function generateEmbedding(text) {
    const res = await fetch(EMBED_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            model: 'models/embedding-001',
            content: { parts: [{ text }] },
        }),
    });
    if (!res.ok) throw new Error(`Gemini error: ${await res.text()}`);
    const data = await res.json();
    return data.embedding.values;
}

const TEST_PROFILES = [
    {
        full_name: 'Ana López Creativos',
        title: 'Directora Creativa',
        company_name: 'Estudio Pixel MX',
        whatsapp: '3312345001',
        offer_description: 'Diseño gráfico, branding corporativo, identidad visual, diseño de packaging y material publicitario. Más de 10 años de experiencia con pymes y startups.',
        search_description: 'Busco empresas que necesiten renovar su imagen corporativa, emprendedores con proyectos nuevos, alianzas con imprentas y agencias de marketing.',
        role: 'exhibitor',
        profile_completed: true,
    },
    {
        full_name: 'Carlos Méndez Studio',
        title: 'Diseñador UX/UI',
        company_name: 'Méndez Digital',
        whatsapp: '3312345002',
        offer_description: 'Diseño web, diseño de apps móviles, interfaces de usuario, experiencia de usuario, prototipado en Figma y desarrollo frontend.',
        search_description: 'Busco startups y empresas que necesiten mejorar sus plataformas digitales, socios de desarrollo backend, inversionistas.',
        role: 'exhibitor',
        profile_completed: true,
    },
    {
        full_name: 'Mariana Torres Design',
        title: 'Diseñadora Industrial',
        company_name: 'Torres & Co Diseño',
        whatsapp: '3312345003',
        offer_description: 'Diseño industrial, diseño de productos, modelado 3D, prototipado rápido, consultoría en manufactura y empaque.',
        search_description: 'Busco fabricantes locales, empresas de manufactura, proveedores de materia prima, distribuidores.',
        role: 'exhibitor',
        profile_completed: true,
    },
    {
        full_name: 'Roberto Aguilar Marketing',
        title: 'Director de Marketing Digital',
        company_name: 'Impulsa360',
        whatsapp: '3312345004',
        offer_description: 'Marketing digital, gestión de redes sociales, campañas de publicidad en Google y Meta, estrategia de contenido, fotografía y video corporativo.',
        search_description: 'Busco diseñadores gráficos freelance, community managers, empresas que necesiten posicionamiento digital.',
        role: 'attendee',
        profile_completed: true,
    },
    {
        full_name: 'Patricia Navarro Interiors',
        title: 'Diseñadora de Interiores',
        company_name: 'PN Espacios',
        whatsapp: '3312345005',
        offer_description: 'Diseño de interiores comerciales y residenciales, renders 3D, remodelación de oficinas, espacios para eventos y showrooms.',
        search_description: 'Busco proveedores de mobiliario, constructoras, desarrolladoras inmobiliarias, arquitectos.',
        role: 'exhibitor',
        profile_completed: true,
    },
];

// POST: Seed test profiles (TEMPORARY - DELETE AFTER TESTING)
export async function POST() {
    try {
        const results = [];

        for (const testProfile of TEST_PROFILES) {
            // Generate a random UUID for the test profile
            const testId = crypto.randomUUID();

            // Build embedding text
            const embeddingText = [
                `Nombre: ${testProfile.full_name}`,
                `Cargo: ${testProfile.title}`,
                `Empresa: ${testProfile.company_name}`,
                `Ofrezco: ${testProfile.offer_description}`,
                `Busco: ${testProfile.search_description}`,
            ].join('. ');

            // Generate embedding
            const embedding = await generateEmbedding(embeddingText);

            // Insert profile with embedding
            const { data, error } = await supabaseAdmin
                .from('profiles')
                .insert({
                    id: testId,
                    email: `test_${testId.substring(0, 8)}@test.com`,
                    ...testProfile,
                    embedding: JSON.stringify(embedding),
                    qr_code_id: `qr_test_${testId.substring(0, 8)}`,
                })
                .select('id, full_name')
                .single();

            if (error) {
                results.push({ name: testProfile.full_name, error: error.message });
            } else {
                results.push({ name: testProfile.full_name, id: data.id, status: 'created' });
            }
        }

        return NextResponse.json({ message: 'Test profiles seeded', results });
    } catch (err) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

// DELETE: Remove test profiles
export async function DELETE() {
    try {
        const { data, error } = await supabaseAdmin
            .from('profiles')
            .delete()
            .like('email', 'test_%@test.com')
            .select('id, full_name');

        if (error) return NextResponse.json({ error: error.message }, { status: 500 });
        return NextResponse.json({ message: 'Test profiles deleted', count: data?.length || 0 });
    } catch (err) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
