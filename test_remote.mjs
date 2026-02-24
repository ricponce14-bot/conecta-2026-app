import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const envContent = fs.readFileSync('.env.local', 'utf-8');
const lines = envContent.split('\n');
const supabaseUrl = lines.find(l => l.startsWith('NEXT_PUBLIC_SUPABASE_URL')).split('=')[1].trim();
const supabaseKey = lines.find(l => l.startsWith('NEXT_PUBLIC_SUPABASE_ANON_KEY')).split('=')[1].trim();

const supabase = createClient(supabaseUrl, supabaseKey);

async function verifyBucket() {
    console.log("Checking buckets...");
    const { data: buckets, error: bErr } = await supabase.storage.listBuckets();
    if (bErr) {
        console.error("Could not list buckets:", bErr);
        return;
    }

    const publicAssets = buckets.find(b => b.name === 'public-assets');
    console.log("public-assets bucket exists?", !!publicAssets);

    if (publicAssets) {
        console.log("Is public?", publicAssets.public);

        // Simular intento de lectura
        console.log("\nAttempting to read from public-assets...");
        const { data: files, error: fErr } = await supabase.storage.from('public-assets').list('avatars', { limit: 1 });
        if (fErr) console.log("List error (might be expected if avatars dir is empty or read is blocked):", fErr);
        else console.log("List success! Found files:", files?.length);

        // El verdadero test de escritura requeriría autenticación (token JWT) debido a nuestras
        // políticas creadas que requieren 'authenticated'. Por tanto, fallaremos escribiendo como anon.
        console.log("\nAttempting to ping storage table directly...");
        const { data: objData, error: objErr } = await supabase.from('storage.objects').select('id').limit(1);
        console.log("Direct table select (likely blocked):", objErr?.message || "Success");

        console.log("\nBucket is ready if it exists and is public.");
    } else {
        console.log("\nWARNING: The bucket 'public-assets' was not found in Supabase.");
    }
}

verifyBucket();
