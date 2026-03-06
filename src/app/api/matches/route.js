import { supabaseAdmin } from '@/lib/supabase-server';
import { NextResponse } from 'next/server';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const EMBED_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-embedding-001:embedContent?key=${GEMINI_API_KEY}`;

function cosineSimilarity(a, b) {
    let dot = 0, normA = 0, normB = 0;
    for (let i = 0; i < a.length; i++) {
        dot += a[i] * b[i];
        normA += a[i] * a[i];
        normB += b[i] * b[i];
    }
    return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

// GET: Find matches for a user
export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId');
        const limit = parseInt(searchParams.get('limit') || '10');

        if (!userId) {
            return NextResponse.json({ error: 'userId is required' }, { status: 400 });
        }

        // Get user's embedding
        const { data: userProfile, error: userError } = await supabaseAdmin
            .from('profiles')
            .select('id, embedding, offer_description, search_description')
            .eq('id', userId)
            .single();

        if (userError || !userProfile) {
            return NextResponse.json({ error: 'User profile not found' }, { status: 404 });
        }

        if (!userProfile.embedding) {
            return NextResponse.json({ matches: [], message: 'No embedding yet. Complete your profile.' });
        }

        const userEmbedding = typeof userProfile.embedding === 'string'
            ? JSON.parse(userProfile.embedding)
            : userProfile.embedding;

        // Get all other profiles with embeddings
        const { data: candidates, error: candidatesError } = await supabaseAdmin
            .from('profiles')
            .select('id, full_name, title, company_name, offer_description, search_description, photo_url, embedding')
            .not('id', 'eq', userId)
            .not('embedding', 'is', null);

        if (candidatesError) {
            return NextResponse.json({ error: candidatesError.message }, { status: 500 });
        }

        if (!candidates || candidates.length === 0) {
            return NextResponse.json({ matches: [], message: 'No other profiles with embeddings yet.' });
        }

        // Calculate cosine similarity for each candidate
        const scored = candidates.map(candidate => {
            const candidateEmbedding = typeof candidate.embedding === 'string'
                ? JSON.parse(candidate.embedding)
                : candidate.embedding;

            const similarity = cosineSimilarity(userEmbedding, candidateEmbedding);

            return {
                id: candidate.id,
                full_name: candidate.full_name,
                title: candidate.title,
                company_name: candidate.company_name,
                offer_description: candidate.offer_description,
                search_description: candidate.search_description,
                photo_url: candidate.photo_url,
                match_score: Math.round(similarity * 100),
            };
        });

        // Sort by score descending, take top N
        scored.sort((a, b) => b.match_score - a.match_score);
        const topMatches = scored.slice(0, limit).filter(m => m.match_score > 20);

        return NextResponse.json({ matches: topMatches });
    } catch (err) {
        console.error('Match error:', err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
