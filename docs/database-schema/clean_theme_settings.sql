-- Clean up theme settings that have quotes around color values
UPDATE site_settings 
SET setting_value = REPLACE(setting_value, '"', '') 
WHERE setting_key IN ('primary_color', 'accent_color', 'astro_blue', 'astro_gold', 'astro_white', 'astro_accent')
AND setting_value LIKE '"%';

-- Clean up theme mode setting
UPDATE site_settings 
SET setting_value = REPLACE(setting_value, '"', '') 
WHERE setting_key = 'theme_mode'
AND setting_value LIKE '"%';

-- Ensure all theme settings exist with proper default values
INSERT IGNORE INTO site_settings (setting_key, setting_type, setting_value) VALUES
('theme_mode', 'string', 'auto'),
('primary_color', 'string', '#3B82F6'),
('accent_color', 'string', '#F59E0B'),
('astro_blue', 'string', '#0066cc'),
('astro_gold', 'string', '#f0a500'),
('astro_white', 'string', '#ffffff'),
('astro_accent', 'string', '#007bff'); 