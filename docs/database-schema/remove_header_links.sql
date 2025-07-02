-- Remove header navigation links from database
DELETE FROM site_settings WHERE setting_key = 'header_navigation_links';

-- Remove other header settings to make them static
DELETE FROM site_settings WHERE setting_key = 'header_logo_url';
DELETE FROM site_settings WHERE setting_key = 'header_company_name';
DELETE FROM site_settings WHERE setting_key = 'header_tagline';
DELETE FROM site_settings WHERE setting_key = 'header_show_services_dropdown';

-- Keep only essential settings
-- The header will now use static values instead of database values 