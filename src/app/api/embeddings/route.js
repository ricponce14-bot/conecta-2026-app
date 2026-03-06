import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const EMBED_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-embedding-001:embedContent?key=${GEMINI_API_KEY}`;

async function generateEmbedding(text) {
    const res = await fetch(EMBED_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            model: 'models/gemini-embedding-001',
            outputDimensionality: 768,
            content: { parts: [{ text }] },
        }),
    });

    if (!res.ok) {
        const err = await res.text();
        throw new Error(`Gemini API error: ${err}`);
    }

    const data = await res.json();
    return data.embedding.values;
}

// POST: Generate and save embedding for a user profile
export async function POST(request) {
    try {
        const { userId } = await request.json();
        const authHeader = request.headers.get('Authorization');

        // Create a user-specific client for RLS bypass
        const supabaseUserClient = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
            { global: { headers: { Authorization: authHeader || '' } } }
        );

        if (!userId) {
            return NextResponse.json({ error: 'userId is required' }, { status: 400 });
        }

        if (!GEMINI_API_KEY) {
            return NextResponse.json({ error: 'GEMINI_API_KEY not configured' }, { status: 500 });
        }

        // Fetch profile using the user's client so RLS allows it
        const { data: profile, error: profileError } = await supabaseUserClient
            .from('profiles')
            .select('full_name, title, company_name, offer_description, search_description')
            .eq('id', userId)
            .single();

        if (profileError || !profile) {
            return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
        }

        // Build text for embedding
        const textParts = [
            profile.full_name && `Nombre: ${profile.full_name}`,
            profile.title && `Cargo: ${profile.title}`,
            profile.company_name && `Empresa: ${profile.company_name}`,
            profile.offer_description && `Ofrezco: ${profile.offer_description}`,
            profile.search_description && `Busco: ${profile.search_description}`,
        ].filter(Boolean);

        if (textParts.length < 2) {
            return NextResponse.json({ error: 'Profile too incomplete for embedding' }, { status: 400 });
        }

        const embeddingText = textParts.join('. ');
        const embedding = await generateEmbedding(embeddingText);

        // Save embedding to profile using the user client
        const { error: updateError } = await supabaseUserClient
            .from('profiles')
            .update({ embedding: JSON.stringify(embedding) })
            .eq('id', userId);

        if (updateError) {
            return NextResponse.json({ error: updateError.message }, { status: 500 });
        }

        return NextResponse.json({ success: true, dimensions: embedding.length });
    } catch (err) {
        console.error('Embedding error:', err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
