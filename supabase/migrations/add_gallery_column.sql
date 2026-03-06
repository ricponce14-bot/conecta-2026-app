-- Añadir columna de galería para expositores (stands) en la tabla profiles
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS gallery_urls TEXT[] DEFAULT '{}';
