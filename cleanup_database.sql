-- Cleanup script to remove header-related settings
-- Run this to clean up the database after header simplification

-- Remove header theme toggle setting
DELETE FROM site_settings WHERE setting_key = 'header_show_theme_toggle';

-- Remove header navigation links setting (if it exists)
DELETE FROM site_settings WHERE setting_key = 'header_navigation_links';

-- Remove any other header-related settings
DELETE FROM site_settings WHERE setting_key LIKE 'header_%';

-- Verify cleanup
SELECT setting_key, setting_value FROM site_settings WHERE setting_key LIKE 'header_%'; 