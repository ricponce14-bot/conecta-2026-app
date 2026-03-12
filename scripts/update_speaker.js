const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://jyluhrxkqnabdcmgczcy.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp5bHVocnhrcW5hYmRjbWdjemN5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE2NTM4OTgsImV4cCI6MjA4NzIyOTg5OH0.eAIyyJnmT6oRHyFGPA8FJJVs-alMKQCjjPnvWac6h1g';

const supabase = createClient(supabaseUrl, supabaseKey);

async function updateSpeaker() {
    console.log('Updating speaker record...');
    const { data, error } = await supabase
        .from('speakers')
        .update({
            name: 'Invitado Estelar Sorpresa',
            topic: 'Próximamente',
            description: 'Un invitado muy especial que revelaremos pronto. Prepárate para una charla que transformará tu visión de los negocios.',
            display_order: 2
        })
        .ilike('name', '%Altamirano%');

    if (error) {
        console.error('Error updating speaker:', error);
    } else {
        console.log('Speaker updated successfully:', data);
    }
}

updateSpeaker();
