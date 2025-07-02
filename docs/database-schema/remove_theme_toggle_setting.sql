-- Remove show_theme_toggle setting from site_settings table
-- This setting is now a constant element in the header and no longer needs to be stored in the database

DELETE FROM site_settings WHERE setting_key = 'show_theme_toggle';

-- Verify the setting has been removed
SELECT * FROM site_settings WHERE setting_key = 'show_theme_toggle'; 