-- SQL Cleanup: Remove test data
-- This script deletes test profiles and non-official companies.

-- 1. Delete test companies (keep only the official 5)
DELETE FROM companies 
WHERE trade_name NOT IN (
    'Grupo Alteño', 
    'SISAY', 
    'Tequila Trujillo', 
    'UNID Tepatitlán', 
    'Universidad Nueva Ciencia'
);

-- 2. Delete test profiles (those created by the seeding scripts)
DELETE FROM profiles 
WHERE email LIKE 'test_%@test.com'
   OR full_name IN ('Ana López Creativos', 'Carlos Méndez Studio', 'Mariana Torres Design', 'Roberto Aguilar Marketing', 'Patricia Navarro Interiors');

-- 3. Optimization: Clear any orphaned connections if necessary
-- DELETE FROM connections WHERE user_id NOT IN (SELECT id FROM profiles);
