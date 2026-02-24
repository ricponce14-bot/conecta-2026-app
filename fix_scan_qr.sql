-- Solución de compatibilidad de esquema para funciones de Networking
-- Ejecutar en el SQL Editor de Supabase

-- 1. Actualizar scan_qr para usar "scanned_id" en lugar de "contact_id"
DROP FUNCTION IF EXISTS scan_qr(UUID, TEXT, UUID, TEXT);
DROP FUNCTION IF EXISTS scan_qr(UUID, TEXT, UUID);
CREATE OR REPLACE FUNCTION scan_qr(
    p_scanner_id UUID,
    p_qr_code TEXT,
    p_event_id UUID DEFAULT NULL,
    p_notes TEXT DEFAULT ''
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_contact_id UUID;
    v_result JSON;
BEGIN
    -- Encontrar al usuario por su código QR
    SELECT id INTO v_contact_id FROM profiles WHERE qr_code_id = p_qr_code;
    
    IF v_contact_id IS NULL THEN
        RETURN json_build_object('success', false, 'message', 'Código QR no reconocido.');
    END IF;

    IF v_contact_id = p_scanner_id THEN
        RETURN json_build_object('success', false, 'message', 'No puedes escanear tu propio código.');
    END IF;

    -- Insertar conexión (Nota: La tabla connections usa scanner_id y scanned_id)
    INSERT INTO connections (scanner_id, scanned_id, event_id, notes)
    VALUES (p_scanner_id, v_contact_id, p_event_id, p_notes)
    ON CONFLICT (scanner_id, scanned_id) DO NOTHING;

    -- Obtener información de contacto para la UI
    SELECT json_build_object(
        'success', true,
        'message', '¡Contacto agregado!',
        'contact', (SELECT json_build_object('id', id, 'full_name', full_name, 'title', title, 'company_name', company_name, 'photo_url', photo_url, 'gallery_urls', gallery_urls) FROM profiles WHERE id = v_contact_id)
    ) INTO v_result;

    RETURN v_result;
END;
$$;

-- 2. Actualizar get_my_leads para usar "scanned_id" y "created_at"
DROP FUNCTION IF EXISTS get_my_leads(UUID, UUID);
DROP FUNCTION IF EXISTS get_my_leads(UUID);
CREATE OR REPLACE FUNCTION get_my_leads(
    p_user_id UUID,
    p_event_id UUID DEFAULT NULL
)
RETURNS TABLE (
    connection_id UUID,
    contact_id UUID,
    contact_name TEXT,
    contact_title TEXT,
    company_name TEXT,
    photo_url TEXT,
    interest_level INTEGER,
    scanned_at TIMESTAMP WITH TIME ZONE
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        c.id as connection_id,
        p.id as contact_id,
        p.full_name as contact_name,
        p.title as contact_title,
        p.company_name as company_name,
        p.photo_url as photo_url,
        c.interest_level,
        c.created_at as scanned_at
    FROM connections c
    -- Nota: Unir con scanned_id
    JOIN profiles p ON c.scanned_id = p.id
    WHERE c.scanner_id = p_user_id
    ORDER BY c.created_at DESC;
END;
$$;
