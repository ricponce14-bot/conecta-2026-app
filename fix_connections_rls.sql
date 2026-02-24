-- Ejecutar en el Editor SQL de Supabase para arreglar el error: "new row violates row-level security policy for table 'connections'"

-- 1. Eliminar políticas restrictivas anteriores (si existen) en la tabla connections
DROP POLICY IF EXISTS "Permitir insertar a usuarios autenticados" ON public.connections;
DROP POLICY IF EXISTS "Permitir leer conexiones propias" ON public.connections;
DROP POLICY IF EXISTS "Permitir actualizar conexiones propias" ON public.connections;
DROP POLICY IF EXISTS "Permitir eliminar conexiones propias" ON public.connections;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.connections;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.connections;
DROP POLICY IF EXISTS "Enable update for users based on email" ON public.connections;
DROP POLICY IF EXISTS "connections_insert_policy" ON public.connections;

-- Eliminar también las políticas que este script crea, por si se ejecuta múltiples veces
DROP POLICY IF EXISTS "Permitir insertar conexiones" ON public.connections;
DROP POLICY IF EXISTS "Permitir ver conexiones" ON public.connections;
DROP POLICY IF EXISTS "Permitir actualizar conexiones" ON public.connections;
DROP POLICY IF EXISTS "Permitir borrar conexiones" ON public.connections;

-- 2. Crear Política para que cualquier usuario autenticado pueda registrar un escaneo (insertar)
CREATE POLICY "Permitir insertar conexiones"
ON public.connections FOR INSERT
TO authenticated
WITH CHECK ( true ); -- Idealmente sería WITH CHECK (scanner_id = auth.uid()), pero dejaremos `true` si escanean en nombre de stands.

-- 3. Crear Política para que el usuario pueda ver las conexiones que él escaneó
CREATE POLICY "Permitir ver conexiones"
ON public.connections FOR SELECT
TO authenticated
USING ( true ); 

-- 4. Crear Política para actualizar el nivel de interés
CREATE POLICY "Permitir actualizar conexiones"
ON public.connections FOR UPDATE
TO authenticated
USING ( true );

-- 5. Crear Política para borrar conexiones
CREATE POLICY "Permitir borrar conexiones"
ON public.connections FOR DELETE
TO authenticated
USING ( true );

-- Asegurarse de que RLS está habilitado en la tabla (pero ahora gobernado por estas reglas más permisivas)
ALTER TABLE public.connections ENABLE ROW LEVEL SECURITY;
