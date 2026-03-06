const fs = require('fs');
require('dotenv').config({ path: '.env.local' });

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
    console.error('No GEMINI_API_KEY found in .env.local');
    process.exit(1);
}

async function testEmbedding(modelName) {
    const EMBED_URL = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:embedContent?key=${GEMINI_API_KEY}`;

    console.log(`Testing model: ${modelName}`);
    try {
        const res = await fetch(EMBED_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: `models/${modelName}`,
                content: { parts: [{ text: "Hello world" }] },
            }),
        });

        if (!res.ok) {
            const errText = await res.text();
            console.error(`Error for ${modelName}: [${res.status}] ${errText}`);
        } else {
            const data = await res.json();
            console.log(`Success for ${modelName}! Embedding length: ${data.embedding?.values?.length}`);
        }
    } catch (e) {
        console.error(`Exception testing ${modelName}:`, e.message);
    }
    console.log('-----------------------------------');
}

async function run() {
    await testEmbedding('embedding-001');
    await testEmbedding('text-embedding-004');
}

run();
