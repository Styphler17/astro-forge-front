import db from './config';

// Blog Posts Service
export const blogPostsService = {
  // Get all blog posts
  getAll: async (publishedOnly: boolean = false) => {
    const sql = publishedOnly 
      ? 'SELECT * FROM blog_posts WHERE is_published = TRUE ORDER BY created_at DESC'
      : 'SELECT * FROM blog_posts ORDER BY created_at DESC';
    return await db.query(sql);
  },

  // Get blog post by ID
  getById: async (id: string) => {
    const sql = 'SELECT * FROM blog_posts WHERE id = ?';
    return await db.queryOne(sql, [id]);
  },

  // Get blog post by slug
  getBySlug: async (slug: string) => {
    const sql = 'SELECT * FROM blog_posts WHERE slug = ? AND is_published = TRUE';
    return await db.queryOne(sql, [slug]);
  },

  // Create blog post
  create: async (data: Record<string, unknown>) => {
    const sql = `
      INSERT INTO blog_posts (title, slug, excerpt, content, featured_image, author_id, is_published, published_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const params = [
      data.title,
      data.slug,
      data.excerpt,
      data.content,
      data.featured_image,
      data.author_id,
      data.is_published,
      data.published_at
    ];
    return await db.insert(sql, params);
  },

  // Update blog post
  update: async (id: string, data: Record<string, unknown>) => {
    const sql = `
      UPDATE blog_posts 
      SET title = ?, slug = ?, excerpt = ?, content = ?, featured_image = ?, 
          author_id = ?, is_published = ?, published_at = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `;
    const params = [
      data.title,
      data.slug,
      data.excerpt,
      data.content,
      data.featured_image,
      data.author_id,
      data.is_published,
      data.published_at,
      id
    ];
    return await db.update(sql, params);
  },

  // Delete blog post
  delete: async (id: string) => {
    const sql = 'DELETE FROM blog_posts WHERE id = ?';
    return await db.delete(sql, [id]);
  }
};

// Pages Service
export const pagesService = {
  getAll: async (publishedOnly: boolean = false) => {
    const sql = publishedOnly 
      ? 'SELECT * FROM pages WHERE is_published = TRUE ORDER BY created_at DESC'
      : 'SELECT * FROM pages ORDER BY created_at DESC';
    return await db.query(sql);
  },

  getById: async (id: string) => {
    const sql = 'SELECT * FROM pages WHERE id = ?';
    return await db.queryOne(sql, [id]);
  },

  getBySlug: async (slug: string) => {
    const sql = 'SELECT * FROM pages WHERE slug = ? AND is_published = TRUE';
    return await db.queryOne(sql, [slug]);
  },

  create: async (data: Record<string, unknown>) => {
    const sql = `
      INSERT INTO pages (title, slug, content, meta_description, is_published)
      VALUES (?, ?, ?, ?, ?)
    `;
    const params = [data.title, data.slug, data.content, data.meta_description, data.is_published];
    return await db.insert(sql, params);
  },

  update: async (id: string, data: Record<string, unknown>) => {
    const sql = `
      UPDATE pages 
      SET title = ?, slug = ?, content = ?, meta_description = ?, is_published = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `;
    const params = [data.title, data.slug, data.content, data.meta_description, data.is_published, id];
    return await db.update(sql, params);
  },

  delete: async (id: string) => {
    const sql = 'DELETE FROM pages WHERE id = ?';
    return await db.delete(sql, [id]);
  }
};

// Projects Service
export const projectsService = {
  getAll: async () => {
    const sql = 'SELECT * FROM projects ORDER BY display_order ASC, created_at DESC';
    return await db.query(sql);
  },

  getById: async (id: string) => {
    const sql = 'SELECT * FROM projects WHERE id = ?';
    return await db.queryOne(sql, [id]);
  },

  create: async (data: Record<string, unknown>) => {
    const sql = `
      INSERT INTO projects (title, description, image_url, project_url, status, display_order)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    const params = [data.title, data.description, data.image_url, data.project_url, data.status, data.display_order];
    return await db.insert(sql, params);
  },

  update: async (id: string, data: Record<string, unknown>) => {
    const sql = `
      UPDATE projects 
      SET title = ?, description = ?, image_url = ?, project_url = ?, status = ?, display_order = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `;
    const params = [data.title, data.description, data.image_url, data.project_url, data.status, data.display_order, id];
    return await db.update(sql, params);
  },

  delete: async (id: string) => {
    const sql = 'DELETE FROM projects WHERE id = ?';
    return await db.delete(sql, [id]);
  }
};

// Services Service
export const servicesService = {
  getAll: async (publishedOnly: boolean = false) => {
    const sql = publishedOnly 
      ? 'SELECT * FROM services WHERE is_published = TRUE ORDER BY display_order ASC'
      : 'SELECT * FROM services ORDER BY display_order ASC';
    return await db.query(sql);
  },

  getById: async (id: string) => {
    const sql = 'SELECT * FROM services WHERE id = ?';
    return await db.queryOne(sql, [id]);
  },

  getBySlug: async (slug: string) => {
    const sql = 'SELECT * FROM services WHERE slug = ? AND is_published = TRUE';
    return await db.queryOne(sql, [slug]);
  },

  create: async (data: Record<string, unknown>) => {
    const sql = `
      INSERT INTO services (title, slug, description, content, icon, image_url, is_published, display_order)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const params = [data.title, data.slug, data.description, data.content, data.icon, data.image_url, data.is_published, data.display_order];
    return await db.insert(sql, params);
  },

  update: async (id: string, data: Record<string, unknown>) => {
    const sql = `
      UPDATE services 
      SET title = ?, slug = ?, description = ?, content = ?, icon = ?, image_url = ?, is_published = ?, display_order = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `;
    const params = [data.title, data.slug, data.description, data.content, data.icon, data.image_url, data.is_published, data.display_order, id];
    return await db.update(sql, params);
  },

  delete: async (id: string) => {
    const sql = 'DELETE FROM services WHERE id = ?';
    return await db.delete(sql, [id]);
  }
};

// Team Members Service
export const teamMembersService = {
  getAll: async (activeOnly: boolean = false) => {
    const sql = activeOnly 
      ? 'SELECT * FROM team_members WHERE is_active = TRUE ORDER BY display_order ASC'
      : 'SELECT * FROM team_members ORDER BY display_order ASC';
    return await db.query(sql);
  },

  getById: async (id: string) => {
    const sql = 'SELECT * FROM team_members WHERE id = ?';
    return await db.queryOne(sql, [id]);
  },

  create: async (data: Record<string, unknown>) => {
    const sql = `
      INSERT INTO team_members (name, position, bio, image_url, email, linkedin_url, twitter_url, is_active, display_order)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const params = [data.name, data.position, data.bio, data.image_url, data.email, data.linkedin_url, data.twitter_url, data.is_active, data.display_order];
    return await db.insert(sql, params);
  },

  update: async (id: string, data: Record<string, unknown>) => {
    const sql = `
      UPDATE team_members 
      SET name = ?, position = ?, bio = ?, image_url = ?, email = ?, linkedin_url = ?, twitter_url = ?, is_active = ?, display_order = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `;
    const params = [data.name, data.position, data.bio, data.image_url, data.email, data.linkedin_url, data.twitter_url, data.is_active, data.display_order, id];
    return await db.update(sql, params);
  },

  delete: async (id: string) => {
    const sql = 'DELETE FROM team_members WHERE id = ?';
    return await db.delete(sql, [id]);
  }
};

// Site Settings Service
export const siteSettingsService = {
  getAll: async () => {
    const sql = 'SELECT * FROM site_settings';
    return await db.query(sql);
  },

  getByKey: async (key: string) => {
    const sql = 'SELECT * FROM site_settings WHERE setting_key = ?';
    return await db.queryOne(sql, [key]);
  },

  update: async (key: string, value: unknown, type: string = 'string') => {
    const sql = `
      INSERT INTO site_settings (setting_key, setting_type, setting_value, updated_at)
      VALUES (?, ?, ?, CURRENT_TIMESTAMP)
      ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value), updated_at = CURRENT_TIMESTAMP
    `;
    const params = [key, type, JSON.stringify(value)];
    return await db.update(sql, params);
  }
};

// Users Service
export const usersService = {
  getAll: async () => {
    const sql = 'SELECT * FROM users ORDER BY created_at DESC';
    return await db.query(sql);
  },

  getById: async (id: string) => {
    const sql = 'SELECT * FROM users WHERE id = ?';
    return await db.queryOne(sql, [id]);
  },

  getByEmail: async (email: string) => {
    const sql = 'SELECT * FROM users WHERE email = ?';
    return await db.queryOne(sql, [email]);
  },

  create: async (data: Record<string, unknown>) => {
    const sql = `
      INSERT INTO users (email, password_hash, name, role)
      VALUES (?, ?, ?, ?)
    `;
    const params = [data.email, data.password_hash, data.name, data.role];
    return await db.insert(sql, params);
  },

  update: async (id: string, data: Record<string, unknown>) => {
    const sql = `
      UPDATE users 
      SET email = ?, name = ?, role = ?, is_active = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `;
    const params = [data.email, data.name, data.role, data.is_active, id];
    return await db.update(sql, params);
  },

  delete: async (id: string) => {
    const sql = 'DELETE FROM users WHERE id = ?';
    return await db.delete(sql, [id]);
  }
}; 