import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const envContent = fs.readFileSync('.env.local', 'utf-8');
const lines = envContent.split('\n');
const supabaseUrl = lines.find(l => l.startsWith('NEXT_PUBLIC_SUPABASE_URL')).split('=')[1].trim();
const supabaseKey = lines.find(l => l.startsWith('NEXT_PUBLIC_SUPABASE_ANON_KEY')).split('=')[1].trim();

const supabase = createClient(supabaseUrl, supabaseKey);

async function testFetch() {
    console.log("Fetching Speakers...");
    const { data: s, error: sErr } = await supabase.from('speakers').select('*').order('display_order');
    if (sErr) console.error("Speakers Error:", sErr);
    else console.log(`Found ${s?.length} speakers. First:`, s?.[0]?.name);

    console.log("Fetching Alliances...");
    const { data: a, error: aErr } = await supabase.from('alliances_sponsors').select('*').order('display_order');
    if (aErr) console.error("Alliances Error:", aErr);
    else console.log(`Found ${a?.length} alliances. First:`, a?.[0]?.name);
}

testFetch();
