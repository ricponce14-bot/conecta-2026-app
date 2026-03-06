const fs = require('fs');
require('dotenv').config({ path: '.env.local' });

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

async function testDim() {
    const EMBED_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-embedding-001:embedContent?key=${GEMINI_API_KEY}`;

    const bodyArgs1 = {
        model: 'models/gemini-embedding-001',
        outputDimensionality: 768,
        content: { parts: [{ text: "Hello" }] }
    };

    // Some docs say it should be outside the main object, some inside
    console.log("Testing with outputDimensionality:", bodyArgs1);

    const res = await fetch(EMBED_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyArgs1)
    });

    const data = await res.json();
    if (!res.ok) {
        console.error("Error:", data);
    } else {
        console.log("Success! Dimensions:", data.embedding?.values?.length);
    }
}

testDim();
