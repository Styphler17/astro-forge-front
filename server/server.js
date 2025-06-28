const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// MySQL Database Configuration
const dbConfig = {
  host: process.env.MYSQL_HOST || 'localhost',
  port: process.env.MYSQL_PORT || 3306,
  user: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || '', // Update this if you have a password
  database: process.env.MYSQL_DATABASE || 'astro_forge_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

// Create connection pool
const pool = mysql.createPool(dbConfig);

// Test database connection
const testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log('✅ MySQL database connected successfully');
    connection.release();
    return true;
  } catch (error) {
    console.error('❌ MySQL database connection failed:', error);
    return false;
  }
};

// Test connection on startup
testConnection();

// API Routes

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Database connection test
app.get('/api/db/test', async (req, res) => {
  try {
    const isConnected = await testConnection();
    res.json({ 
      status: isConnected ? 'success' : 'error',
      message: isConnected ? 'Database connected successfully' : 'Database connection failed'
    });
  } catch (error) {
    res.status(500).json({ 
      status: 'error',
      message: error.message 
    });
  }
});

// Services API
app.get('/api/services', async (req, res) => {
  try {
    const { publishedOnly = false } = req.query;
    const sql = publishedOnly === 'true' 
      ? 'SELECT * FROM services WHERE is_published = TRUE ORDER BY display_order ASC'
      : 'SELECT * FROM services ORDER BY display_order ASC';
    
    const [rows] = await pool.execute(sql);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/services/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.execute('SELECT * FROM services WHERE id = ?', [id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Service not found' });
    }
    
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/services', async (req, res) => {
  try {
    const { title, slug, description, content, icon, image_url, is_published, display_order } = req.body;
    
    const [result] = await pool.execute(
      'INSERT INTO services (title, slug, description, content, icon, image_url, is_published, display_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [title, slug, description, content, icon, image_url, is_published, display_order]
    );
    
    res.status(201).json({ id: result.insertId, message: 'Service created successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/services/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, slug, description, content, icon, image_url, is_published, display_order } = req.body;
    
    // Build dynamic update query based on provided fields
    const updateFields = [];
    const updateValues = [];
    
    if (title !== undefined) {
      updateFields.push('title = ?');
      updateValues.push(title);
    }
    if (slug !== undefined) {
      updateFields.push('slug = ?');
      updateValues.push(slug);
    }
    if (description !== undefined) {
      updateFields.push('description = ?');
      updateValues.push(description);
    }
    if (content !== undefined) {
      updateFields.push('content = ?');
      updateValues.push(content);
    }
    if (icon !== undefined) {
      updateFields.push('icon = ?');
      updateValues.push(icon);
    }
    if (image_url !== undefined) {
      updateFields.push('image_url = ?');
      updateValues.push(image_url);
    }
    if (is_published !== undefined) {
      updateFields.push('is_published = ?');
      updateValues.push(is_published);
    }
    if (display_order !== undefined) {
      updateFields.push('display_order = ?');
      updateValues.push(display_order);
    }
    
    if (updateFields.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }
    
    updateValues.push(id);
    
    const sql = `UPDATE services SET ${updateFields.join(', ')} WHERE id = ?`;
    await pool.execute(sql, updateValues);
    
    res.json({ message: 'Service updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/services/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.execute('DELETE FROM services WHERE id = ?', [id]);
    res.json({ message: 'Service deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/services/slug/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    const [rows] = await pool.execute(
      'SELECT * FROM services WHERE slug = ? AND is_published = TRUE', 
      [slug]
    );
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Service not found' });
    }
    
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Team Members API
app.get('/api/team-members', async (req, res) => {
  try {
    const { activeOnly = false } = req.query;
    const sql = activeOnly === 'true' 
      ? 'SELECT * FROM team_members WHERE is_active = TRUE ORDER BY display_order ASC'
      : 'SELECT * FROM team_members ORDER BY display_order ASC';
    
    const [rows] = await pool.execute(sql);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/team-members/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.execute('SELECT * FROM team_members WHERE id = ?', [id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Team member not found' });
    }
    
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/team-members', async (req, res) => {
  try {
    const { name, position, bio, image_url, email, linkedin_url, twitter_url, is_active, display_order } = req.body;
    
    const [result] = await pool.execute(
      'INSERT INTO team_members (name, position, bio, image_url, email, linkedin_url, twitter_url, is_active, display_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [name, position, bio, image_url, email, linkedin_url, twitter_url, is_active, display_order]
    );
    
    res.status(201).json({ id: result.insertId, message: 'Team member created successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/team-members/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, position, bio, image_url, email, linkedin_url, twitter_url, is_active, display_order } = req.body;
    
    await pool.execute(
      'UPDATE team_members SET name = ?, position = ?, bio = ?, image_url = ?, email = ?, linkedin_url = ?, twitter_url = ?, is_active = ?, display_order = ? WHERE id = ?',
      [name, position, bio, image_url, email, linkedin_url, twitter_url, is_active, display_order, id]
    );
    
    res.json({ message: 'Team member updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/team-members/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.execute('DELETE FROM team_members WHERE id = ?', [id]);
    res.json({ message: 'Team member deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Sponsors API
app.get('/api/sponsors', async (req, res) => {
  try {
    const { activeOnly = false } = req.query;
    const sql = activeOnly === 'true' 
      ? 'SELECT * FROM sponsors WHERE is_active = TRUE ORDER BY display_order ASC'
      : 'SELECT * FROM sponsors ORDER BY display_order ASC';
    const [rows] = await pool.execute(sql);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/sponsors/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.execute('SELECT * FROM sponsors WHERE id = ?', [id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Sponsor not found' });
    }
    
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/sponsors', async (req, res) => {
  try {
    const { name, logo_url, website_url, description, is_active, display_order } = req.body;
    
    const [result] = await pool.execute(
      'INSERT INTO sponsors (name, logo_url, website_url, description, is_active, display_order) VALUES (?, ?, ?, ?, ?, ?)',
      [name, logo_url, website_url, description, is_active, display_order]
    );
    
    res.status(201).json({ id: result.insertId, message: 'Sponsor created successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/sponsors/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, logo_url, website_url, description, is_active, display_order } = req.body;
    
    await pool.execute(
      'UPDATE sponsors SET name = ?, logo_url = ?, website_url = ?, description = ?, is_active = ?, display_order = ? WHERE id = ?',
      [name, logo_url, website_url, description, is_active, display_order, id]
    );
    
    res.json({ message: 'Sponsor updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/sponsors/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.execute('DELETE FROM sponsors WHERE id = ?', [id]);
    res.json({ message: 'Sponsor deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Users API
app.get('/api/users', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT id, email, name, role, is_active, created_at, updated_at FROM users');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.execute('SELECT id, email, name, role, is_active, created_at, updated_at FROM users WHERE id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/users', async (req, res) => {
  try {
    const { email, password_hash, name, role, is_active } = req.body;
    if (!email || !password_hash || !role) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password_hash, saltRounds);
    
    const [result] = await pool.execute(
      'INSERT INTO users (email, password_hash, name, role, is_active) VALUES (?, ?, ?, ?, ?)',
      [email, hashedPassword, name, role, is_active !== undefined ? is_active : true]
    );
    res.status(201).json({ id: result.insertId, message: 'User created successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { email, name, role, is_active } = req.body;
    
    // Get current user data
    const [userRows] = await pool.execute('SELECT role FROM users WHERE id = ?', [id]);
    if (userRows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    const currentUser = userRows[0];
    
    // Check if trying to deactivate the last admin
    if (is_active === false) {
      if (currentUser.role === 'admin') {
        const [adminCountRows] = await pool.execute('SELECT COUNT(*) as count FROM users WHERE role = "admin" AND is_active = 1');
        const adminCount = adminCountRows[0].count;
        
        if (adminCount <= 1) {
          return res.status(400).json({ 
            error: 'Cannot deactivate the last admin user. At least one admin must remain active.' 
          });
        }
      }
    }
    
    // Check if trying to change the last admin's role to non-admin
    if (currentUser.role === 'admin' && role !== 'admin') {
      const [adminCountRows] = await pool.execute('SELECT COUNT(*) as count FROM users WHERE role = "admin" AND is_active = 1');
      const adminCount = adminCountRows[0].count;
      
      if (adminCount <= 1) {
        return res.status(400).json({ 
          error: 'Cannot change the role of the last admin user. At least one admin must remain active.' 
        });
      }
    }
    
    await pool.execute(
      'UPDATE users SET email = ?, name = ?, role = ?, is_active = ? WHERE id = ?',
      [email, name, role, is_active, id]
    );
    res.json({ message: 'User updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Prevent self-deletion (in a real app, get current user from session)
    const currentUserId = '9766fe08-51c3-11f0-b8e2-345a60293f45'; // Default admin ID
    if (id === currentUserId) {
      return res.status(400).json({ 
        error: 'You cannot delete your own account. Please ask another admin to delete your account.' 
      });
    }
    
    // Check if this is the last admin user
    const [userRows] = await pool.execute('SELECT role FROM users WHERE id = ?', [id]);
    if (userRows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    const userToDelete = userRows[0];
    
    // If trying to delete an admin, check if it's the last one
    if (userToDelete.role === 'admin') {
      const [adminCountRows] = await pool.execute('SELECT COUNT(*) as count FROM users WHERE role = "admin" AND is_active = 1');
      const adminCount = adminCountRows[0].count;
      
      if (adminCount <= 1) {
        return res.status(400).json({ 
          error: 'Cannot delete the last admin user. At least one admin must remain active.' 
        });
      }
    }
    
    await pool.execute('DELETE FROM users WHERE id = ?', [id]);
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get current user info (for self-deletion prevention)
app.get('/api/users/current', async (req, res) => {
  try {
    // In a real app, this would come from the authenticated session
    // For now, we'll return a mock current user ID
    // You can modify this to return the actual authenticated user's ID
    res.json({ 
      id: '9766fe08-51c3-11f0-b8e2-345a60293f45', // Default admin ID
      message: 'Current user info retrieved successfully' 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Change user password
app.put('/api/users/:id/password', async (req, res) => {
  try {
    const { id } = req.params;
    const { newPassword } = req.body;
    
    if (!newPassword) {
      return res.status(400).json({ error: 'New password is required' });
    }
    
    // Hash the new password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
    
    await pool.execute(
      'UPDATE users SET password_hash = ? WHERE id = ?',
      [hashedPassword, id]
    );
    
    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Projects API
app.get('/api/projects', async (req, res) => {
  try {
    const [rows] = await pool.execute(
      'SELECT * FROM projects ORDER BY display_order ASC, created_at DESC'
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/projects/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.execute('SELECT * FROM projects WHERE id = ?', [id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }
    
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/projects', async (req, res) => {
  try {
    const { title, description, image_url, project_url, status, display_order } = req.body;
    
    const [result] = await pool.execute(
      'INSERT INTO projects (title, description, image_url, project_url, status, display_order) VALUES (?, ?, ?, ?, ?, ?)',
      [title, description, image_url, project_url, status, display_order]
    );
    
    res.status(201).json({ id: result.insertId, message: 'Project created successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/projects/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, image_url, project_url, status, display_order } = req.body;
    
    await pool.execute(
      'UPDATE projects SET title = ?, description = ?, image_url = ?, project_url = ?, status = ?, display_order = ? WHERE id = ?',
      [title, description, image_url, project_url, status, display_order, id]
    );
    
    res.json({ message: 'Project updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/projects/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.execute('DELETE FROM projects WHERE id = ?', [id]);
    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Blog Posts API
app.get('/api/blog-posts', async (req, res) => {
  try {
    const { publishedOnly = false } = req.query;
    const sql = publishedOnly === 'true' 
      ? 'SELECT id, title, slug, excerpt, content, featured_image, author_id as author, is_published, published_at, created_at, updated_at FROM blog_posts WHERE is_published = TRUE ORDER BY created_at DESC'
      : 'SELECT id, title, slug, excerpt, content, featured_image, author_id as author, is_published, published_at, created_at, updated_at FROM blog_posts ORDER BY created_at DESC';
    
    const [rows] = await pool.execute(sql);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/blog-posts/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.execute(
      'SELECT id, title, slug, excerpt, content, featured_image, author_id as author, is_published, published_at, created_at, updated_at FROM blog_posts WHERE id = ?', 
      [id]
    );
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Blog post not found' });
    }
    
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/blog-posts', async (req, res) => {
  try {
    const { title, slug, excerpt, content, featured_image, author, tags, is_published } = req.body;
    
    const [result] = await pool.execute(
      'INSERT INTO blog_posts (title, slug, excerpt, content, featured_image, author_id, is_published, published_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [title, slug, excerpt, content, featured_image, author || null, is_published, is_published ? new Date() : null]
    );
    
    res.status(201).json({ id: result.insertId, message: 'Blog post created successfully' });
  } catch (error) {
    console.error('Error creating blog post:', error);
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/blog-posts/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, slug, excerpt, content, featured_image, author, tags, is_published } = req.body;
    
    // Build dynamic update query based on provided fields
    const updateFields = [];
    const updateValues = [];
    
    if (title !== undefined) {
      updateFields.push('title = ?');
      updateValues.push(title);
    }
    if (slug !== undefined) {
      updateFields.push('slug = ?');
      updateValues.push(slug);
    }
    if (excerpt !== undefined) {
      updateFields.push('excerpt = ?');
      updateValues.push(excerpt);
    }
    if (content !== undefined) {
      updateFields.push('content = ?');
      updateValues.push(content);
    }
    if (featured_image !== undefined) {
      updateFields.push('featured_image = ?');
      updateValues.push(featured_image);
    }
    if (author !== undefined) {
      updateFields.push('author_id = ?');
      updateValues.push(author || null);
    }
    if (is_published !== undefined) {
      updateFields.push('is_published = ?');
      updateValues.push(is_published);
      if (is_published) {
        updateFields.push('published_at = ?');
        updateValues.push(new Date());
      }
    }
    
    if (updateFields.length === 0) {
      return res.status(400).json({ error: 'No valid fields to update' });
    }
    
    updateValues.push(id);
    const sql = `UPDATE blog_posts SET ${updateFields.join(', ')} WHERE id = ?`;
    
    await pool.execute(sql, updateValues);
    
    res.json({ message: 'Blog post updated successfully' });
  } catch (error) {
    console.error('Error updating blog post:', error);
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/blog-posts/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.execute('DELETE FROM blog_posts WHERE id = ?', [id]);
    res.json({ message: 'Blog post deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/blog-posts/slug/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    const [rows] = await pool.execute(
      'SELECT id, title, slug, excerpt, content, featured_image, author_id as author, is_published, published_at, created_at, updated_at FROM blog_posts WHERE slug = ? AND is_published = TRUE', 
      [slug]
    );
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Blog post not found' });
    }
    
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Related Blog Posts API
app.get('/api/blog-posts/:id/related', async (req, res) => {
  try {
    const { id } = req.params;
    const { limit = 3 } = req.query;
    
    // Get related posts excluding the current post, ordered by creation date
    const [rows] = await pool.execute(
      'SELECT id, title, slug, excerpt, content, featured_image, author_id as author, is_published, published_at, created_at, updated_at FROM blog_posts WHERE id != ? AND is_published = TRUE ORDER BY created_at DESC LIMIT ?',
      [id, parseInt(limit)]
    );
    
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Pages API
app.get('/api/pages', async (req, res) => {
  try {
    const { publishedOnly = false } = req.query;
    const sql = publishedOnly === 'true' 
      ? 'SELECT * FROM pages WHERE is_published = TRUE ORDER BY created_at DESC'
      : 'SELECT * FROM pages ORDER BY created_at DESC';
    
    const [rows] = await pool.execute(sql);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/pages/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.execute('SELECT * FROM pages WHERE id = ?', [id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Page not found' });
    }
    
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/pages', async (req, res) => {
  try {
    const { title, slug, content, meta_description, is_published } = req.body;
    
    const [result] = await pool.execute(
      'INSERT INTO pages (title, slug, content, meta_description, is_published) VALUES (?, ?, ?, ?, ?)',
      [title, slug, content, meta_description, is_published]
    );
    
    res.status(201).json({ id: result.insertId, message: 'Page created successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/pages/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, slug, content, meta_description, is_published } = req.body;
    
    await pool.execute(
      'UPDATE pages SET title = ?, slug = ?, content = ?, meta_description = ?, is_published = ? WHERE id = ?',
      [title, slug, content, meta_description, is_published, id]
    );
    
    res.json({ message: 'Page updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/pages/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.execute('DELETE FROM pages WHERE id = ?', [id]);
    res.json({ message: 'Page deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/pages/slug/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    const [rows] = await pool.execute(
      'SELECT * FROM pages WHERE slug = ? AND is_published = TRUE', 
      [slug]
    );
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Page not found' });
    }
    
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Site Settings API
app.get('/api/site-settings', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM site_settings');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/site-settings/:key', async (req, res) => {
  try {
    const { key } = req.params;
    const [rows] = await pool.execute(
      'SELECT * FROM site_settings WHERE setting_key = ?', 
      [key]
    );
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Setting not found' });
    }
    
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/site-settings/:key', async (req, res) => {
  try {
    const { key } = req.params;
    const { setting_value, setting_type } = req.body;
    
    await pool.execute(
      'UPDATE site_settings SET setting_value = ?, setting_type = ? WHERE setting_key = ?',
      [JSON.stringify(setting_value), setting_type, key]
    );
    
    res.json({ message: 'Setting updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/site-settings', async (req, res) => {
  try {
    const { setting_key, setting_value, setting_type } = req.body;
    
    const [result] = await pool.execute(
      'INSERT INTO site_settings (setting_key, setting_value, setting_type) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE setting_value = ?, setting_type = ?',
      [setting_key, JSON.stringify(setting_value), setting_type, JSON.stringify(setting_value), setting_type]
    );
    
    res.status(201).json({ id: result.insertId, message: 'Setting created/updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Dashboard Stats API
app.get('/api/dashboard/stats', async (req, res) => {
  try {
    // Get counts for all content types
    const [blogPostsResult] = await pool.execute('SELECT COUNT(*) as count FROM blog_posts');
    const [publishedBlogPostsResult] = await pool.execute('SELECT COUNT(*) as count FROM blog_posts WHERE is_published = TRUE');
    
    const [projectsResult] = await pool.execute('SELECT COUNT(*) as count FROM projects');
    const [activeProjectsResult] = await pool.execute('SELECT COUNT(*) as count FROM projects WHERE status = "active"');
    
    const [servicesResult] = await pool.execute('SELECT COUNT(*) as count FROM services');
    const [publishedServicesResult] = await pool.execute('SELECT COUNT(*) as count FROM services WHERE is_published = TRUE');
    
    const [teamMembersResult] = await pool.execute('SELECT COUNT(*) as count FROM team_members');
    const [activeTeamMembersResult] = await pool.execute('SELECT COUNT(*) as count FROM team_members WHERE is_active = TRUE');
    
    const [usersResult] = await pool.execute('SELECT COUNT(*) as count FROM users');
    const [activeUsersResult] = await pool.execute('SELECT COUNT(*) as count FROM users WHERE is_active = TRUE');

    // Get recent activity (last 7 days)
    const [recentBlogPostsResult] = await pool.execute(
      'SELECT COUNT(*) as count FROM blog_posts WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)'
    );
    
    const [recentProjectsResult] = await pool.execute(
      'SELECT COUNT(*) as count FROM projects WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)'
    );

    // Get project status breakdown
    const [projectStatusResult] = await pool.execute(
      'SELECT status, COUNT(*) as count FROM projects GROUP BY status'
    );

    const stats = {
      content: {
        blogPosts: {
          total: blogPostsResult[0].count,
          published: publishedBlogPostsResult[0].count,
          draft: blogPostsResult[0].count - publishedBlogPostsResult[0].count
        },
        projects: {
          total: projectsResult[0].count,
          active: activeProjectsResult[0].count,
          statusBreakdown: projectStatusResult.reduce((acc, row) => {
            acc[row.status] = row.count;
            return acc;
          }, {})
        },
        services: {
          total: servicesResult[0].count,
          published: publishedServicesResult[0].count,
          draft: servicesResult[0].count - publishedServicesResult[0].count
        }
      },
      team: {
        total: teamMembersResult[0].count,
        active: activeTeamMembersResult[0].count,
        inactive: teamMembersResult[0].count - activeTeamMembersResult[0].count
      },
      users: {
        total: usersResult[0].count,
        active: activeUsersResult[0].count,
        inactive: usersResult[0].count - activeUsersResult[0].count
      },
      recentActivity: {
        blogPosts: recentBlogPostsResult[0].count,
        projects: recentProjectsResult[0].count
      },
      summary: {
        totalContent: blogPostsResult[0].count + projectsResult[0].count + servicesResult[0].count,
        publishedContent: publishedBlogPostsResult[0].count + publishedServicesResult[0].count,
        totalTeam: teamMembersResult[0].count,
        totalUsers: usersResult[0].count
      }
    };

    res.json(stats);
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ error: error.message });
  }
});

// Admin Profile API
app.get('/api/admin/profile', async (req, res) => {
  try {
    // For now, return a default admin profile
    // In a real app, you'd get this from the authenticated user's session
    const adminProfile = {
      id: '1',
      name: 'Admin User',
      email: 'admin@astroforge.com',
      bio: 'System administrator and content manager',
      avatar: '',
      phone: '+1 (555) 123-4567',
      timezone: 'UTC-05:00 (Eastern Time)',
      language: 'English',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    res.json(adminProfile);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/admin/profile', async (req, res) => {
  try {
    const { name, email, bio, avatar, phone, timezone, language } = req.body;
    
    // In a real app, you'd update the authenticated user's profile in the database
    // For now, just return success
    console.log('Updating admin profile:', { name, email, bio, avatar, phone, timezone, language });
    
    res.json({ message: 'Admin profile updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/admin/change-password', async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    // In a real app, you'd verify the current password and update with the new one
    // For now, just return success
    console.log('Changing admin password:', { currentPassword: '***', newPassword: '***' });
    
    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Contact Messages Endpoints
app.post('/api/messages', async (req, res) => {
  const { name, email, subject, message } = req.body;
  try {
    await pool.execute(
      'INSERT INTO contact_messages (name, email, subject, message) VALUES (?, ?, ?, ?)',
      [name, email, subject, message]
    );
    res.status(201).json({ message: 'Message received' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/messages', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM contact_messages ORDER BY created_at DESC');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.patch('/api/messages/:id/read', async (req, res) => {
  try {
    await pool.execute('UPDATE contact_messages SET is_read = TRUE WHERE id = ?', [req.params.id]);
    res.json({ message: 'Marked as read' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/messages/:id', async (req, res) => {
  try {
    await pool.execute('DELETE FROM contact_messages WHERE id = ?', [req.params.id]);
    res.json({ message: 'Deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Privacy Policy API
app.get('/api/privacy-policy', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM privacy_policy ORDER BY id DESC LIMIT 1');
    res.json(rows[0] || { title: 'Privacy Policy', content: 'Content not available' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/privacy-policy', async (req, res) => {
  try {
    const { title, content } = req.body;
    await pool.execute(
      'UPDATE privacy_policy SET title = ?, content = ?, last_updated = CURRENT_TIMESTAMP WHERE id = (SELECT id FROM (SELECT id FROM privacy_policy ORDER BY id DESC LIMIT 1) as temp)',
      [title, content]
    );
    res.json({ message: 'Privacy policy updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Terms of Service API
app.get('/api/terms-of-service', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM terms_of_service ORDER BY id DESC LIMIT 1');
    res.json(rows[0] || { title: 'Terms of Service', content: 'Content not available' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/terms-of-service', async (req, res) => {
  try {
    const { title, content } = req.body;
    await pool.execute(
      'UPDATE terms_of_service SET title = ?, content = ?, last_updated = CURRENT_TIMESTAMP WHERE id = (SELECT id FROM (SELECT id FROM terms_of_service ORDER BY id DESC LIMIT 1) as temp)',
      [title, content]
    );
    res.json({ message: 'Terms of service updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// FAQ API
app.get('/api/faqs', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM faqs WHERE is_active = TRUE ORDER BY display_order, id');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/faqs/all', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM faqs ORDER BY display_order, id');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/faqs', async (req, res) => {
  try {
    const { question, answer, category, display_order, is_active } = req.body;
    const [result] = await pool.execute(
      'INSERT INTO faqs (question, answer, category, display_order, is_active) VALUES (?, ?, ?, ?, ?)',
      [question, answer, category || 'General', display_order || 0, is_active !== false]
    );
    res.status(201).json({ id: result.insertId, message: 'FAQ created successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/faqs/:id', async (req, res) => {
  try {
    const { question, answer, category, display_order, is_active } = req.body;
    await pool.execute(
      'UPDATE faqs SET question = ?, answer = ?, category = ?, display_order = ?, is_active = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [question, answer, category || 'General', display_order || 0, is_active !== false, req.params.id]
    );
    res.json({ message: 'FAQ updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/faqs/:id', async (req, res) => {
  try {
    await pool.execute('DELETE FROM faqs WHERE id = ?', [req.params.id]);
    res.json({ message: 'FAQ deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Job Positions API
app.get('/api/job-positions', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM job_positions WHERE is_active = TRUE ORDER BY display_order, id');
    // Parse JSON fields
    const parsedRows = rows.map(row => ({
      ...row,
      requirements: JSON.parse(row.requirements || '[]'),
      benefits: JSON.parse(row.benefits || '[]')
    }));
    res.json(parsedRows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/job-positions/all', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM job_positions ORDER BY display_order, id');
    // Parse JSON fields
    const parsedRows = rows.map(row => ({
      ...row,
      requirements: JSON.parse(row.requirements || '[]'),
      benefits: JSON.parse(row.benefits || '[]')
    }));
    res.json(parsedRows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/job-positions/:id', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM job_positions WHERE id = ?', [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Job position not found' });
    }
    // Parse JSON fields
    const row = rows[0];
    const parsedRow = {
      ...row,
      requirements: JSON.parse(row.requirements || '[]'),
      benefits: JSON.parse(row.benefits || '[]')
    };
    res.json(parsedRow);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/job-positions', async (req, res) => {
  try {
    const { 
      title, 
      department, 
      location, 
      employment_type, 
      experience_level, 
      description, 
      requirements, 
      benefits, 
      is_active, 
      display_order 
    } = req.body;
    
    const [result] = await pool.execute(
      'INSERT INTO job_positions (title, department, location, employment_type, experience_level, description, requirements, benefits, is_active, display_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [
        title, 
        department, 
        location, 
        employment_type || 'full-time', 
        experience_level, 
        description, 
        JSON.stringify(requirements || []), 
        JSON.stringify(benefits || []), 
        is_active !== false, 
        display_order || 0
      ]
    );
    res.status(201).json({ id: result.insertId, message: 'Job position created successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/job-positions/:id', async (req, res) => {
  try {
    const { 
      title, 
      department, 
      location, 
      employment_type, 
      experience_level, 
      description, 
      requirements, 
      benefits, 
      is_active, 
      display_order 
    } = req.body;
    
    await pool.execute(
      'UPDATE job_positions SET title = ?, department = ?, location = ?, employment_type = ?, experience_level = ?, description = ?, requirements = ?, benefits = ?, is_active = ?, display_order = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [
        title, 
        department, 
        location, 
        employment_type || 'full-time', 
        experience_level, 
        description, 
        JSON.stringify(requirements || []), 
        JSON.stringify(benefits || []), 
        is_active !== false, 
        display_order || 0, 
        req.params.id
      ]
    );
    res.json({ message: 'Job position updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/job-positions/:id', async (req, res) => {
  try {
    await pool.execute('DELETE FROM job_positions WHERE id = ?', [req.params.id]);
    res.json({ message: 'Job position deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Career Benefits API
app.get('/api/career-benefits', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM career_benefits WHERE is_active = TRUE ORDER BY display_order, id');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/career-benefits/all', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM career_benefits ORDER BY display_order, id');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/career-benefits/:id', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM career_benefits WHERE id = ?', [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Career benefit not found' });
    }
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/career-benefits', async (req, res) => {
  try {
    const { title, description, icon, category, display_order, is_active } = req.body;
    const [result] = await pool.execute(
      'INSERT INTO career_benefits (title, description, icon, category, display_order, is_active) VALUES (?, ?, ?, ?, ?, ?)',
      [title, description, icon, category || 'general', display_order || 0, is_active !== false]
    );
    res.status(201).json({ id: result.insertId, message: 'Career benefit created successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/career-benefits/:id', async (req, res) => {
  try {
    const { title, description, icon, category, display_order, is_active } = req.body;
    await pool.execute(
      'UPDATE career_benefits SET title = ?, description = ?, icon = ?, category = ?, display_order = ?, is_active = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [title, description, icon, category || 'general', display_order || 0, is_active !== false, req.params.id]
    );
    res.json({ message: 'Career benefit updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/career-benefits/:id', async (req, res) => {
  try {
    await pool.execute('DELETE FROM career_benefits WHERE id = ?', [req.params.id]);
    res.json({ message: 'Career benefit deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Career Culture API
app.get('/api/career-culture', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM career_culture WHERE is_active = TRUE ORDER BY display_order, id');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/career-culture/all', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM career_culture ORDER BY display_order, id');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/career-culture/:id', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM career_culture WHERE id = ?', [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Career culture item not found' });
    }
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/career-culture', async (req, res) => {
  try {
    const { title, description, image_url, display_order, is_active } = req.body;
    const [result] = await pool.execute(
      'INSERT INTO career_culture (title, description, image_url, display_order, is_active) VALUES (?, ?, ?, ?, ?)',
      [title, description, image_url, display_order || 0, is_active !== false]
    );
    res.status(201).json({ id: result.insertId, message: 'Career culture item created successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/career-culture/:id', async (req, res) => {
  try {
    const { title, description, image_url, display_order, is_active } = req.body;
    await pool.execute(
      'UPDATE career_culture SET title = ?, description = ?, image_url = ?, display_order = ?, is_active = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [title, description, image_url, display_order || 0, is_active !== false, req.params.id]
    );
    res.json({ message: 'Career culture item updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/career-culture/:id', async (req, res) => {
  try {
    await pool.execute('DELETE FROM career_culture WHERE id = ?', [req.params.id]);
    res.json({ message: 'Career culture item deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Career Application Process API
app.get('/api/career-application-process', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM career_application_process WHERE is_active = TRUE ORDER BY display_order, id');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/career-application-process/all', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM career_application_process ORDER BY display_order, id');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/career-application-process/:id', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM career_application_process WHERE id = ?', [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Application process step not found' });
    }
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/career-application-process', async (req, res) => {
  try {
    const { step_number, title, description, estimated_duration, display_order, is_active } = req.body;
    const [result] = await pool.execute(
      'INSERT INTO career_application_process (step_number, title, description, estimated_duration, display_order, is_active) VALUES (?, ?, ?, ?, ?, ?)',
      [step_number, title, description, estimated_duration, display_order || 0, is_active !== false]
    );
    res.status(201).json({ id: result.insertId, message: 'Application process step created successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/career-application-process/:id', async (req, res) => {
  try {
    const { step_number, title, description, estimated_duration, display_order, is_active } = req.body;
    await pool.execute(
      'UPDATE career_application_process SET step_number = ?, title = ?, description = ?, estimated_duration = ?, display_order = ?, is_active = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [step_number, title, description, estimated_duration, display_order || 0, is_active !== false, req.params.id]
    );
    res.json({ message: 'Application process step updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/career-application-process/:id', async (req, res) => {
  try {
    await pool.execute('DELETE FROM career_application_process WHERE id = ?', [req.params.id]);
    res.json({ message: 'Application process step deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Career Requirements API
app.get('/api/career-requirements', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM career_requirements WHERE is_active = TRUE ORDER BY display_order, id');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/career-requirements/all', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM career_requirements ORDER BY display_order, id');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/career-requirements/:id', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM career_requirements WHERE id = ?', [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Career requirement not found' });
    }
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/career-requirements', async (req, res) => {
  try {
    const { title, description, category, display_order, is_active } = req.body;
    const [result] = await pool.execute(
      'INSERT INTO career_requirements (title, description, category, display_order, is_active) VALUES (?, ?, ?, ?, ?)',
      [title, description, category || 'general', display_order || 0, is_active !== false]
    );
    res.status(201).json({ id: result.insertId, message: 'Career requirement created successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/career-requirements/:id', async (req, res) => {
  try {
    const { title, description, category, display_order, is_active } = req.body;
    await pool.execute(
      'UPDATE career_requirements SET title = ?, description = ?, category = ?, display_order = ?, is_active = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [title, description, category || 'general', display_order || 0, is_active !== false, req.params.id]
    );
    res.json({ message: 'Career requirement updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/career-requirements/:id', async (req, res) => {
  try {
    await pool.execute('DELETE FROM career_requirements WHERE id = ?', [req.params.id]);
    res.json({ message: 'Career requirement deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📊 API endpoints available at http://localhost:${PORT}/api`);
}); 