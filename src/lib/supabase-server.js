import { createClient } from '@supabase/supabase-js';

/**
 * Server-side Supabase admin client.
 * Uses the service role key for bypassing RLS in API routes.
 * NEVER import this file from client-side code.
 */

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl) {
    throw new Error('NEXT_PUBLIC_SUPABASE_URL is required for server Supabase client.');
}

if (!supabaseServiceKey) {
    console.warn(
        '⚠️  SUPABASE_SERVICE_ROLE_KEY is not set. Server client will use the anon key as fallback. ' +
        'This may cause RLS issues. Set SUPABASE_SERVICE_ROLE_KEY in your .env.local.'
    );
}

export const supabaseAdmin = createClient(
    supabaseUrl,
    supabaseServiceKey || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);
