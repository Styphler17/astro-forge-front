-- Insert initial theme settings
INSERT INTO site_settings (setting_key, setting_type, setting_value) VALUES 
('theme_mode', 'string', '"auto"'),
('primary_color', 'string', '"#3B82F6"'),
('accent_color', 'string', '"#F59E0B"')
ON DUPLICATE KEY UPDATE 
setting_value = VALUES(setting_value),
updated_at = CURRENT_TIMESTAMP; 