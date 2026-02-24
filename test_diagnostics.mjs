import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const envContent = fs.readFileSync('.env.local', 'utf-8');
const lines = envContent.split('\n');
const supabaseUrl = lines.find(l => l.startsWith('NEXT_PUBLIC_SUPABASE_URL')).split('=')[1].trim();
const supabaseKey = lines.find(l => l.startsWith('NEXT_PUBLIC_SUPABASE_ANON_KEY')).split('=')[1].trim();

const supabase = createClient(supabaseUrl, supabaseKey);

async function runDiagnostics() {
    console.log("=== DIAGNOSTICS START ===");
    console.log("Environment URL:", supabaseUrl);

    // 1. Test Storage Upload directly (simulating a small text file)
    console.log("\n--- Testing Storage ---");
    const testFile = new Blob(['test content'], { type: 'text/plain' });
    const { data: uploadData, error: uploadError } = await supabase.storage
        .from('public-assets')
        .upload(`test/ping_${Date.now()}.txt`, testFile);

    if (uploadError) {
        console.error("Upload Error:", uploadError.message, uploadError);
    } else {
        console.log("Upload Success! File path:", uploadData.path);
    }

    // 2. Test Connection Insert directly
    console.log("\n--- Testing Connections ---");
    // Get two random profiles to connect
    const { data: profiles } = await supabase.from('profiles').select('id').limit(2);
    if (profiles && profiles.length === 2) {
        const scannerId = profiles[0].id;
        const scannedId = profiles[1].id;
        console.log(`Attempting to connect ${scannerId} to ${scannedId}`);

        const { data: iData, error: iErr } = await supabase.from('connections').insert([{
            scanner_id: scannerId,
            scanned_id: scannedId,
            event_id: '00000000-0000-0000-0000-000000000001',
            notes: 'diagnostic test'
        }]).select();

        if (iErr) {
            console.error("Connection Insert Error:", iErr.message, iErr);
        } else {
            console.log("Connection Insert Success:", iData);
            // Clean up the test connection
            if (iData && iData[0]) {
                await supabase.from('connections').delete().eq('id', iData[0].id);
            }
        }
    } else {
        console.log("Not enough profiles to test connections. Make sure profiles table is populated.");
    }

    console.log("\n=== DIAGNOSTICS END ===");
}

runDiagnostics();
