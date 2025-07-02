-- Add header settings to the site_settings table
INSERT INTO `site_settings` (`id`, `setting_key`, `setting_type`, `setting_value`, `updated_at`) VALUES
(uuid(), 'header_logo_url', 'string', '"/astroforge-uploads/AstroForgeHoldings-Logo.png"', NOW()),
(uuid(), 'header_company_name', 'string', '"Astro Forge Holdings"', NOW()),
(uuid(), 'header_tagline', 'string', '"Building tomorrow\'s infrastructure"', NOW()),
(uuid(), 'header_show_services_dropdown', 'string', '"true"', NOW()),
(uuid(), 'header_show_theme_toggle', 'string', '"true"', NOW()),
(uuid(), 'header_navigation_links', 'json', '[
  {"id": "1", "label": "Home", "url": "/", "order": 1, "is_active": true},
  {"id": "2", "label": "About Us", "url": "/about", "order": 2, "is_active": true},
  {"id": "3", "label": "Projects", "url": "/projects", "order": 3, "is_active": true},
  {"id": "4", "label": "Pages", "url": "/pages", "order": 4, "is_active": true},
  {"id": "5", "label": "Careers", "url": "/careers", "order": 5, "is_active": true},
  {"id": "6", "label": "Blog", "url": "/blog", "order": 6, "is_active": true},
  {"id": "7", "label": "Contact", "url": "/contact", "order": 7, "is_active": true}
]', NOW()); 