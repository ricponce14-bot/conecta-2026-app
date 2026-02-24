import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const envContent = fs.readFileSync('.env.local', 'utf-8');
const lines = envContent.split('\n');
const supabaseUrl = lines.find(l => l.startsWith('NEXT_PUBLIC_SUPABASE_URL')).split('=')[1].trim();
const supabaseKey = lines.find(l => l.startsWith('NEXT_PUBLIC_SUPABASE_ANON_KEY')).split('=')[1].trim();

const supabase = createClient(supabaseUrl, supabaseKey);

async function debugLeads() {
    try {
        // 1. Get a scanner ID which has connections
        console.log("Checking for connections in DB...");
        const { data: connData, error: connErr } = await supabase.from('connections').select('scanner_id').limit(1);
        if (connErr) throw connErr;
        if (!connData || connData.length === 0) {
            console.log("No connections found in database. Scanning some might be needed.");
            return;
        }

        const testUserId = connData[0].scanner_id;
        console.log("Testing get_my_leads for User ID:", testUserId);

        // 2. Call the RPC
        const { data, error } = await supabase.rpc('get_my_leads', {
            p_user_id: testUserId,
            p_event_id: '00000000-0000-0000-0000-000000000001'
        });

        if (error) {
            console.error("RPC Error:", error.message, error);
        } else {
            console.log(`Found ${data.length} leads for user.`);
            if (data.length > 0) {
                console.log("First lead sample:", data[0]);
            }
        }

        // 3. Check profiles accessibility
        console.log("\nChecking if profiles are reachable for join...");
        const { data: pData, error: pErr } = await supabase.from('profiles').select('id, full_name').limit(1);
        if (pErr) console.error("Profiles read error:", pErr.message);
        else console.log("Profiles sample:", pData[0]);

    } catch (err) {
        console.error("General error:", err.message);
    }
}

debugLeads();
