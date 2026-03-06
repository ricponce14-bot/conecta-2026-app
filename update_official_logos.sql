-- SQL Update: Official Company Logos
-- This script updates the logo_url for the 5 initial companies.

UPDATE companies SET logo_url = '/sisay.png' WHERE trade_name = 'SISAY';
UPDATE companies SET logo_url = '/grupoalteno.png' WHERE trade_name = 'Grupo Alteño';
UPDATE companies SET logo_url = '/5.png' WHERE trade_name = 'UNID Tepatitlán';
UPDATE companies SET logo_url = '/1.png' WHERE trade_name = 'Universidad Nueva Ciencia';
UPDATE companies SET logo_url = '/trujillo.webp' WHERE trade_name = 'Tequila Trujillo';

-- Ensure they are published and verified
UPDATE companies SET is_published = true, is_verified = true 
WHERE trade_name IN ('Grupo Alteño', 'SISAY', 'Tequila Trujillo', 'UNID Tepatitlán', 'Universidad Nueva Ciencia');
