-- Remove Old Careers Table
-- This file removes the obsolete 'careers' table since we now have separate tables for career sections

USE astro_forge_db;

-- Drop the old careers table
DROP TABLE IF EXISTS careers;

-- Verify the table has been removed
SELECT 'Old careers table has been successfully removed' as status; 