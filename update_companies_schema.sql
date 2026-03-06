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

-- Ensure owner_id is unique if one user manages exactly one company
-- ALTER TABLE companies ADD CONSTRAINT unique_owner UNIQUE (owner_id);

-- Add comment for clarity
COMMENT ON TABLE companies IS 'Stores business directory listings with contact and location details.';
