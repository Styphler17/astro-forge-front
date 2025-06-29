const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '', // Add your MySQL password here if needed
  database: 'astro_forge_db'
};

async function createAdminUser() {
  try {
    const connection = await mysql.createConnection(dbConfig);
    console.log('✅ Connected to MySQL database');

    // Generate password hash
    const password = 'AstroForge2024!';
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Create admin user
    const adminUser = {
      id: '9766fe08-51c3-11f0-b8e2-345a60293f45',
      email: 'admin@astroforge.com',
      password_hash: passwordHash,
      name: 'Astro Forge Admin',
      role: 'admin',
      is_active: 1
    };

    // Insert admin user
    const [result] = await connection.execute(
      `INSERT INTO users (id, email, password_hash, name, role, is_active, created_at, updated_at) 
       VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())
       ON DUPLICATE KEY UPDATE 
       email = VALUES(email),
       name = VALUES(name),
       role = VALUES(role),
       is_active = VALUES(is_active),
       updated_at = NOW()`,
      [adminUser.id, adminUser.email, adminUser.password_hash, adminUser.name, adminUser.role, adminUser.is_active]
    );

    console.log('✅ Admin user created/updated successfully');
    console.log('📧 Email:', adminUser.email);
    console.log('🔑 Password:', password);
    console.log('🆔 User ID:', adminUser.id);

    await connection.end();
  } catch (error) {
    console.error('❌ Error creating admin user:', error);
  }
}

createAdminUser(); 