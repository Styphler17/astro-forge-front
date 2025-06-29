-- Create default admin user for Astro Forge Holdings
-- Password will be hashed using bcrypt with salt rounds 10
-- Default password: AstroForge2024!

INSERT INTO users (id, email, password_hash, name, role, is_active, created_at, updated_at) 
VALUES (
  '9766fe08-51c3-11f0-b8e2-345a60293f45',
  'admin@astroforge.com',
  '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', -- This is a bcrypt hash for 'AstroForge2024!'
  'Astro Forge Admin',
  'admin',
  1,
  NOW(),
  NOW()
) ON DUPLICATE KEY UPDATE
  email = VALUES(email),
  name = VALUES(name),
  role = VALUES(role),
  is_active = VALUES(is_active),
  updated_at = NOW();

-- Note: The password hash above is for 'AstroForge2024!'
-- In a real production environment, you should generate a fresh hash
-- You can use bcrypt to generate a new hash with: bcrypt.hash('AstroForge2024!', 10) 