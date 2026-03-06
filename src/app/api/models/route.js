import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const key = process.env.GEMINI_API_KEY;
        if (!key) {
            return NextResponse.json({ error: 'GEMINI_API_KEY not found' }, { status: 500 });
        }

        const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${key}`;
        const res = await fetch(url);

        if (!res.ok) {
            const err = await res.text();
            return NextResponse.json({ error: `Gemini API error: ${err}` }, { status: res.status });
        }

        const data = await res.json();
        const embeddingModels = data.models.filter(m =>
            m.supportedGenerationMethods && m.supportedGenerationMethods.includes('embedContent')
        );

        return NextResponse.json({
            all_models: data.models.map(m => m.name),
            embedding_models: embeddingModels.map(m => m.name)
        });
    } catch (err) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
