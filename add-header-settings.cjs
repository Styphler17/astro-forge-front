const mysql = require('mysql2/promise');

async function addHeaderSettings() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'astro_forge_db'
  });

  try {
    const headerSettings = [
      {
        setting_key: 'header_logo_url',
        setting_type: 'string',
        setting_value: '"/astroforge-uploads/AstroForgeHoldings-Logo.png"'
      },
      {
        setting_key: 'header_company_name',
        setting_type: 'string',
        setting_value: '"Astro Forge Holdings"'
      },
      {
        setting_key: 'header_tagline',
        setting_type: 'string',
        setting_value: '"Building tomorrow\'s infrastructure"'
      },
      {
        setting_key: 'header_show_services_dropdown',
        setting_type: 'string',
        setting_value: '"true"'
      },
      {
        setting_key: 'header_show_theme_toggle',
        setting_type: 'string',
        setting_value: '"true"'
      },
      {
        setting_key: 'header_navigation_links',
        setting_type: 'json',
        setting_value: JSON.stringify([
          { id: "1", label: "Home", url: "/", order: 1, is_active: true },
          { id: "2", label: "About Us", url: "/about", order: 2, is_active: true },
          { id: "3", label: "Projects", url: "/projects", order: 3, is_active: true },
          { id: "4", label: "Pages", url: "/pages", order: 4, is_active: true },
          { id: "5", label: "Careers", url: "/careers", order: 5, is_active: true },
          { id: "6", label: "Blog", url: "/blog", order: 6, is_active: true },
          { id: "7", label: "Contact", url: "/contact", order: 7, is_active: true }
        ])
      }
    ];

    for (const setting of headerSettings) {
      await connection.execute(
        'INSERT INTO site_settings (id, setting_key, setting_type, setting_value, updated_at) VALUES (uuid(), ?, ?, ?, NOW()) ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value), updated_at = NOW()',
        [setting.setting_key, setting.setting_type, setting.setting_value]
      );
      console.log(`Updated ${setting.setting_key}`);
    }

    console.log('Header settings updated successfully!');
  } catch (error) {
    console.error('Error updating header settings:', error);
  } finally {
    await connection.end();
  }
}

addHeaderSettings(); 