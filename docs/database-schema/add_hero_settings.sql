-- Add hero settings to the site_settings table
INSERT INTO site_settings (setting_key, setting_type, setting_value, updated_at) VALUES
('hero_title', 'string', '"ASTRO FORGE HOLDINGS"', NOW()),
('hero_subtitle', 'string', '"Building Tomorrow\'s Infrastructure Through Innovation, Sustainability, and Strategic Investment"', NOW()),
('hero_cta_text', 'string', '"Discover More"', NOW()),
('hero_cta_link', 'string', '"/about"', NOW()),
('hero_background_images', 'json', '["/placeholder.svg", "/placeholder.svg", "/placeholder.svg"]', NOW()),
('hero_badge_text', 'string', '"Innovation • Sustainability • Growth"', NOW()),
('hero_stats_projects', 'string', '"500+"', NOW()),
('hero_stats_countries', 'string', '"50+"', NOW()),
('hero_stats_years', 'string', '"25+"', NOW())
ON DUPLICATE KEY UPDATE
setting_value = VALUES(setting_value),
updated_at = NOW(); 