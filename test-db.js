import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://jyluhrxkqnabdcmgczcy.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp5bHVocnhrcW5hYmRjbWdjemN5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE2NTM4OTgsImV4cCI6MjA4NzIyOTg5OH0.eAIyyJnmT6oRHyFGPA8FJJVs-alMKQCjjPnvWac6h1g';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function getAllPricing() {
    try {
        const { data, error } = await supabase.from('pricing_catalog').select('*');
        if (error) {
            console.error('Error fetching data:', error);
        } else {
            console.log(JSON.stringify(data, null, 2));
        }
    } catch (err) {
        console.error('Unexpected error:', err.message);
    }
}

getAllPricing();
