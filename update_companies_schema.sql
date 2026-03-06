-- SQL Migration: Add extended business fields to 'companies' table
-- This script adds the columns needed for the new directory features.

ALTER TABLE companies 
ADD COLUMN IF NOT EXISTS address TEXT,
ADD COLUMN IF NOT EXISTS phone TEXT,
ADD COLUMN IF NOT EXISTS email TEXT,
ADD COLUMN IF NOT EXISTS website TEXT,
ADD COLUMN IF NOT EXISTS hours TEXT,
ADD COLUMN IF NOT EXISTS municipality TEXT,
ADD COLUMN IF NOT EXISTS owner_id UUID REFERENCES auth.users(id),
ADD COLUMN IF NOT EXISTS is_published BOOLEAN DEFAULT TRUE;

-- UNIQUE constraint required for upserting by trade_name
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'companies_trade_name_key') THEN
        ALTER TABLE companies ADD CONSTRAINT companies_trade_name_key UNIQUE (trade_name);
    END IF;
END $$;

-- Ensure owner_id is unique if one user manages exactly one company
-- ALTER TABLE companies ADD CONSTRAINT unique_owner UNIQUE (owner_id);

-- Add comment for clarity
COMMENT ON TABLE companies IS 'Stores business directory listings with contact and location details.';

-- Enable RLS
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;

-- Policy: Everyone can view published companies
DROP POLICY IF EXISTS "Public can view published companies" ON companies;
CREATE POLICY "Public can view published companies" ON companies
    FOR SELECT USING (is_published = true);

-- Policy: Owners can manage their own company data
DROP POLICY IF EXISTS "Owners can manage their own company" ON companies;
CREATE POLICY "Owners can manage their own company" ON companies
    FOR ALL USING (auth.uid() = owner_id);

-- Policy: Service Role / Admin bypass (This allows the seeding script to work)
-- Note: Service role usually bypasses RLS, but if the app is using the anon key, 
-- we need to ensure the policy allows the operation.

-- Seed initial company data directly via SQL
INSERT INTO companies (trade_name, sector, address, phone, email, website, hours, municipality, offer_description, search_description, is_verified, is_published)
VALUES 
('Grupo Alteño', 'Fabricación de dulces, paletas, gomitas y productos de confitería', 'Av. Manuel Ávila Camacho #1389, Col. Las Colonias, C.P. 47620, Tepatitlán de Morelos, Jalisco, México', '+52 378 781 5530 / 378 781 5830 / 378 781 5820 / 378 781 2090', 'alteno@tepa.com.mx', 'http://www.alteno.com.mx', 'Lun-Vie 9:00 - 18:00', 'Tepatitlán de Morelos', 'Fabricación y distribución de dulces de alta calidad, paletas, gomitas y una amplia gama de productos de confitería con tradición alteña.', 'Nuevos canales de distribución, proveedores de materias primas para confitería, alianzas comerciales nacionales e internacionales.', true, true),

('SISAY', 'Productos de salud, suplementos y bienestar', 'Blvd. Anacleto González Flores Sur 1960, Col. Los Adobes, Tepatitlán de Morelos, Jalisco, México', '378 701 6119 / 378 108 8107', 'sisaygemma@gmail.com', 'https://sisay.mx', 'Lun–Vie 9:00 - 18:00', 'Tepatitlán de Morelos', 'Suplementos alimenticios premium, productos de bienestar integral y soluciones de salud natural respaldadas por calidad.', 'Distribuidores autorizados, alianzas con gimnasios y centros de salud, clientes interesados en bienestar integral.', true, true),

('Tequila Trujillo', 'Producción y comercialización de Tequila Premium', 'Tepatitlán de Morelos, Jalisco, México', '+52 33 3615 1515', 'contacto@tequilatrujillo.com', 'https://tequilatrujillo.com', 'Lun-Vie 9:00 - 17:00', 'Tepatitlán de Morelos', 'Tequila 100% de agave de calidad premium, producido con procesos tradicionales y selección rigurosa de agaves de los Altos de Jalisco.', 'Exportadores, distribuidores de bebidas espirituosas, sector restaurantero de alta gama y hotelería.', true, true),

('UNID Tepatitlán', 'Educación Superior, Licenciaturas y Posgrados', 'Av. Anacleto González Flores 875, Col. El Tablón, Tepatitlán de Morelos, Jalisco, México', '378 781 8300', 'infottepa@unid.mx', 'https://unid.edu.mx', 'Lun-Vie 8:00 - 20:00, Sab 9:00 - 14:00', 'Tepatitlán de Morelos', 'Oferta educativa de vanguardia con licenciaturas, posgrados y diplomados enfocados en la empleabilidad y el desarrollo profesional.', 'Empresas para convenios de prácticas profesionales, egresados interesados en actualización, vinculación empresarial.', true, true),

('Universidad Nueva Ciencia', 'Educación, Investigación y Desarrollo Humano', 'Av. Matamoros 330, Centro, Tepatitlán de Morelos, Jalisco, México', '378 782 5500', 'admisiones@nuevaciencia.edu.mx', 'https://nuevaciencia.edu.mx', 'Lun-Vie 9:00 - 19:00', 'Tepatitlán de Morelos', 'Institución educativa comprometida con la excelencia académica, la investigación científica y el desarrollo humano integral de sus estudiantes.', 'Investigadores, convenios académicos, prospectos para bachillerato y licenciaturas, alianzas estratégicas.', true, true)
ON CONFLICT (trade_name) 
DO UPDATE SET 
    sector = EXCLUDED.sector,
    address = EXCLUDED.address,
    phone = EXCLUDED.phone,
    email = EXCLUDED.email,
    website = EXCLUDED.website,
    hours = EXCLUDED.hours,
    municipality = EXCLUDED.municipality,
    offer_description = EXCLUDED.offer_description,
    search_description = EXCLUDED.search_description,
    is_verified = EXCLUDED.is_verified,
    is_published = EXCLUDED.is_published;
