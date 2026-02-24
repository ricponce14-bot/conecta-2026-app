import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const envContent = fs.readFileSync('.env.local', 'utf-8');
const lines = envContent.split('\n');
const supabaseUrl = lines.find(l => l.startsWith('NEXT_PUBLIC_SUPABASE_URL')).split('=')[1].trim();
const supabaseKey = lines.find(l => l.startsWith('NEXT_PUBLIC_SUPABASE_ANON_KEY')).split('=')[1].trim();

const supabase = createClient(supabaseUrl, supabaseKey);

async function testScan() {
    console.log("Starting test...");
    try {
        const { data, error } = await supabase.from('connections').select('*').limit(1);
        if (error) throw error;
        console.log("Columns in connections:", Object.keys(data[0] || {}));
    } catch (err) {
        console.error("General error:", err);
    }
}
testScan();
