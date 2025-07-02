-- Add missing contact information settings to site_settings table
-- This file adds contact_address and contact_hours settings

USE astro_forge_db;

-- Add contact_address setting
INSERT INTO site_settings (setting_key, setting_type, setting_value) VALUES
('contact_address', 'string', '"123 Business Plaza, Innovation District, Tech City, TC 12345"')
ON DUPLICATE KEY UPDATE 
    setting_value = '"123 Business Plaza, Innovation District, Tech City, TC 12345"',
    updated_at = CURRENT_TIMESTAMP;

-- Add contact_hours setting
INSERT INTO site_settings (setting_key, setting_type, setting_value) VALUES
('contact_hours', 'string', '"Monday - Friday: 9:00 AM - 6:00 PM"')
ON DUPLICATE KEY UPDATE 
    setting_value = '"Monday - Friday: 9:00 AM - 6:00 PM"',
    updated_at = CURRENT_TIMESTAMP;

-- Verify the settings were added
SELECT setting_key, setting_value FROM site_settings WHERE setting_key IN ('contact_email', 'contact_phone', 'contact_address', 'contact_hours'); 