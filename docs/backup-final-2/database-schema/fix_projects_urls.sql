-- Fix broken project URLs in astro_forge_db
-- Run this to remove the example.com URLs that cause DNS errors

USE astro_forge_db;

-- Option 1: Update specific projects by ID (works with safe mode)
UPDATE projects SET project_url = NULL WHERE id = 'f9097a10-51c3-11f0-b8e2-345a60293f45' AND project_url LIKE '%example.com%';
UPDATE projects SET project_url = NULL WHERE id = 'f9097dbf-51c3-11f0-b8e2-345a60293f45' AND project_url LIKE '%example.com%';
UPDATE projects SET project_url = NULL WHERE id = 'f9097ec2-51c3-11f0-b8e2-345a60293f45' AND project_url LIKE '%example.com%';
UPDATE projects SET project_url = NULL WHERE id = 'f9097f1e-51c3-11f0-b8e2-345a60293f45' AND project_url LIKE '%example.com%';
UPDATE projects SET project_url = NULL WHERE id = 'f9097f7a-51c3-11f0-b8e2-345a60293f45' AND project_url LIKE '%example.com%';
UPDATE projects SET project_url = NULL WHERE id = 'f9097fc3-51c3-11f0-b8e2-345a60293f45' AND project_url LIKE '%example.com%';
UPDATE projects SET project_url = NULL WHERE id = 'f909801c-51c3-11f0-b8e2-345a60293f45' AND project_url LIKE '%example.com%';
UPDATE projects SET project_url = NULL WHERE id = 'f909807e-51c3-11f0-b8e2-345a60293f45' AND project_url LIKE '%example.com%';

-- Option 2: If the above doesn't work, temporarily disable safe mode
-- SET SQL_SAFE_UPDATES = 0;
-- UPDATE projects SET project_url = NULL WHERE project_url LIKE '%example.com%';
-- SET SQL_SAFE_UPDATES = 1;

-- Verify the changes
SELECT id, title, project_url FROM projects ORDER BY display_order ASC; 