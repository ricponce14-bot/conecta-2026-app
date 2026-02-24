-- Ejecutar en el Editor SQL de Supabase para arreglar el error: "new row violates row-level security policy"
-- Esto asegurará que los usuarios autenticados puedan subir avatares y galerías al bucket 'public-assets'

-- 1. Asegurar que el bucket "public-assets" existe y es público
INSERT INTO storage.buckets (id, name, public) 
VALUES ('public-assets', 'public-assets', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- 2. Eliminar políticas restrictivas anteriores en storage.objects para evitar conflictos
DROP POLICY IF EXISTS "Permitir a usuarios públicos ver assets" ON storage.objects;
DROP POLICY IF EXISTS "Permitir a usuarios logueados subir assets" ON storage.objects;
DROP POLICY IF EXISTS "Permitir a usuarios modificar sus propios assets" ON storage.objects;
DROP POLICY IF EXISTS "Permitir a usuarios borrar sus propios assets" ON storage.objects;

DROP POLICY IF EXISTS "Public access" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload" ON storage.objects;

-- 3. Crear Políticas correctas para storage.objects relacionadas al bucket 'public-assets'

-- 3.1. Cualquiera puede ver los archivos (ya que los avatares y galerías son públicos)
CREATE POLICY "Permitir acceso publico de lectura"
ON storage.objects FOR SELECT
USING ( bucket_id = 'public-assets' );

-- 3.2. Cualquier usuario logueado en la app puede subir imágenes nuevas
CREATE POLICY "Permitir subida a usuarios autenticados"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK ( bucket_id = 'public-assets' );

-- 3.3. Cualquier usuario autenticado puede actualizar imágenes
CREATE POLICY "Permitir actualizacion a usuarios autenticados"
ON storage.objects FOR UPDATE
TO authenticated
USING ( bucket_id = 'public-assets' );

-- 3.4. Cualquier usuario autenticado puede borrar imágenes
CREATE POLICY "Permitir borrado a usuarios autenticados"
ON storage.objects FOR DELETE
TO authenticated
USING ( bucket_id = 'public-assets' );

-- (La sentencia ALTER TABLE ha sido removida ya que el usuario 'postgres' u otro propietario gestiona la tabla base de storage)
