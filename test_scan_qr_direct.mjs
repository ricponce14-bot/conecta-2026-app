import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const envContent = fs.readFileSync('.env.local', 'utf-8');
const lines = envContent.split('\n');
const supabaseUrl = lines.find(l => l.startsWith('NEXT_PUBLIC_SUPABASE_URL')).split('=')[1].trim();
const supabaseKey = lines.find(l => l.startsWith('NEXT_PUBLIC_SUPABASE_ANON_KEY')).split('=')[1].trim();

const supabase = createClient(supabaseUrl, supabaseKey);

async function testScan() {
    console.log("Starting connections audit...");
    try {
        const { data: pData } = await supabase.from('profiles').select('id, qr_code_id').limit(2);
        if (!pData || pData.length < 2) return console.log("Need 2 profiles");

        const scannerId = pData[0].id;
        const scannedId = pData[1].id;
        const scannedQr = pData[1].qr_code_id;
        console.log(`Scanner: ${scannerId}, Scanned QR: ${scannedQr}`);

        // Manual insert test
        const { data: iData, error: iErr } = await supabase.from('connections').insert([{
            scanner_id: scannerId,
            scanned_id: scannedId,
            event_id: '00000000-0000-0000-0000-000000000001',
            notes: 'audit'
        }]).select();

        console.log("Insert result:", iErr || iData);

        // Manual fetch test
        const { data: fData, error: fErr } = await supabase.rpc('get_my_leads', { p_user_id: scannerId });
        console.log("Fetch leads result:", fErr || fData);

    } catch (err) {
        console.error("General error:", err);
    }
}
testScan();
