-- OPTIMIZACIÓN DE RENDIMIENTO PARA ALTO TRÁFICO
-- Ejecuta esto en el Editor SQL de Supabase antes del evento.

-- 1. Índices para la tabla 'profiles'
-- Acelera la búsqueda de usuarios mediante el código QR (crucial para el escáner)
CREATE INDEX IF NOT EXISTS idx_profiles_qr_code_id ON public.profiles(qr_code_id);

-- 2. Índices para la tabla 'connections'
-- Acelera la carga de la lista de "Mis Intereses"
CREATE INDEX IF NOT EXISTS idx_connections_scanner_id ON public.connections(scanner_id);
-- Acelera las uniones (joins) para mostrar la información del contacto escaneado
CREATE INDEX IF NOT EXISTS idx_connections_scanned_id ON public.connections(scanned_id);

-- 3. Índice para el evento (Mantiene la rapidez si decides usar IDs de evento en el futuro)
CREATE INDEX IF NOT EXISTS idx_connections_event_id ON public.connections(event_id);
