-- Astro Forge Holdings MySQL Database Schema
-- Created for the Astro Forge project

-- Create the database
CREATE DATABASE IF NOT EXISTS astro_forge_db;
USE astro_forge_db;

-- Create blog_posts table
CREATE TABLE IF NOT EXISTS blog_posts (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    excerpt TEXT,
    content LONGTEXT,
    featured_image VARCHAR(500),
    author_id VARCHAR(36),
    is_published BOOLEAN DEFAULT FALSE,
    published_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_slug (slug),
    INDEX idx_published (is_published),
    INDEX idx_created_at (created_at)
);

-- Create pages table
CREATE TABLE IF NOT EXISTS pages (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    content LONGTEXT,
    meta_description TEXT,
    is_published BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_slug (slug),
    INDEX idx_published (is_published)
);

-- Create projects table
CREATE TABLE IF NOT EXISTS projects (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    image_url VARCHAR(500),
    project_url VARCHAR(500),
    status VARCHAR(50) DEFAULT 'active',
    display_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_display_order (display_order),
    INDEX idx_status (status)
);

-- Create services table
CREATE TABLE IF NOT EXISTS services (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    content LONGTEXT,
    icon VARCHAR(100),
    image_url VARCHAR(500),
    is_published BOOLEAN DEFAULT FALSE,
    display_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_slug (slug),
    INDEX idx_published (is_published),
    INDEX idx_display_order (display_order)
);

-- Create site_settings table
CREATE TABLE IF NOT EXISTS site_settings (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    setting_key VARCHAR(100) NOT NULL UNIQUE,
    setting_type VARCHAR(50) NOT NULL,
    setting_value JSON,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_setting_key (setting_key)
);

-- Create team_members table
CREATE TABLE IF NOT EXISTS team_members (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    name VARCHAR(255) NOT NULL,
    position VARCHAR(255) NOT NULL,
    bio TEXT,
    image_url VARCHAR(500),
    email VARCHAR(255),
    linkedin_url VARCHAR(500),
    twitter_url VARCHAR(500),
    is_active BOOLEAN DEFAULT TRUE,
    display_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_display_order (display_order),
    INDEX idx_is_active (is_active)
);

-- Create users table for admin authentication
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255),
    role ENUM('admin', 'editor', 'viewer') DEFAULT 'viewer',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_role (role)
);

-- Insert default admin user (password: admin123)
INSERT INTO users (email, password_hash, name, role) VALUES 
('admin@astroforge.com', '$2b$10$rQZ8K9mN2pL1vX3yU6wA7eR4tY5uI8oP9qJ0kL1mN2oP3qR4sT5uV6wX7yZ8', 'Admin User', 'admin')
ON DUPLICATE KEY UPDATE updated_at = CURRENT_TIMESTAMP;

-- Insert default site settings
INSERT INTO site_settings (setting_key, setting_type, setting_value) VALUES
('site_title', 'string', '"Astro Forge Holdings"'),
('site_description', 'string', '"Leading provider of innovative solutions across multiple industries"'),
('contact_email', 'string', '"contact@astroforge.com"'),
('contact_phone', 'string', '"+1 (555) 123-4567"'),
('social_links', 'json', '{"facebook": "", "twitter": "", "linkedin": "", "instagram": ""}'),
('theme_colors', 'json', '{"primary": "#3B82F6", "secondary": "#1F2937", "accent": "#F59E0B"}'),
('logo_url', 'string', '""'),
('footer_text', 'string', '"© 2024 Astro Forge Holdings. All rights reserved."')
ON DUPLICATE KEY UPDATE updated_at = CURRENT_TIMESTAMP;

-- Insert sample data for testing
INSERT INTO services (title, slug, description, is_published, display_order) VALUES
('Mining Solutions', 'mining', 'Comprehensive mining solutions and consulting services', TRUE, 1),
('Real Estate Development', 'real-estate', 'Innovative real estate development and investment services', TRUE, 2),
('Agricultural Technology', 'agriculture', 'Advanced agricultural technology and sustainable farming solutions', TRUE, 3),
('Community Development', 'community', 'Community development and social impact initiatives', TRUE, 4),
('Educational Programs', 'education', 'Educational programs and training solutions', TRUE, 5)
ON DUPLICATE KEY UPDATE updated_at = CURRENT_TIMESTAMP;

INSERT INTO team_members (name, position, bio, is_active, display_order) VALUES
('John Smith', 'CEO', 'Experienced leader with over 15 years in the industry', TRUE, 1),
('Sarah Johnson', 'CTO', 'Technology expert specializing in innovative solutions', TRUE, 2),
('Michael Brown', 'COO', 'Operations specialist with a focus on efficiency and growth', TRUE, 3)
ON DUPLICATE KEY UPDATE updated_at = CURRENT_TIMESTAMP;

-- Clear existing projects and insert comprehensive sample data
DELETE FROM projects;

INSERT INTO projects (title, description, image_url, project_url, status, display_order) VALUES
('Sustainable Agriculture Initiative', 'Implementing advanced farming techniques and sustainable practices across 500+ acres of farmland in Ghana. This project focuses on precision agriculture, water conservation, and organic farming methods to increase crop yields while protecting the environment.', 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80', 'https://example.com/agriculture-project', 'in_progress', 1),

('Mining Operations Expansion', 'Expanding mining operations with focus on environmental responsibility and community development in South Africa. This project includes modern mining technologies, safety improvements, and community development programs.', 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80', 'https://example.com/mining-project', 'planning', 2),

('Urban Development Project', 'Creating sustainable urban communities with modern infrastructure and green spaces in Nigeria. This comprehensive development includes residential areas, commercial spaces, and public amenities designed for modern living.', 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80', 'https://example.com/urban-project', 'in_progress', 3),

('Community Education Center', 'Building educational facilities to provide quality education and skills training to local communities in Kenya. The center includes classrooms, computer labs, and vocational training facilities.', 'https://images.unsplash.com/photo-1523050854058-8df90110c9a1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80', 'https://example.com/education-project', 'completed', 4),

('Renewable Energy Farm', 'Developing solar and wind energy projects to provide clean, sustainable power to rural communities in Tanzania. This project includes solar panel installations and wind turbine farms.', 'https://images.unsplash.com/photo-1509391366360-2e959784a276?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80', 'https://example.com/energy-project', 'planning', 5),

('Digital Infrastructure Network', 'Establishing high-speed internet connectivity and digital services across underserved regions in Uganda. This project includes fiber optic networks and community Wi-Fi hotspots.', 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80', 'https://example.com/digital-project', 'in_progress', 6),

('Smart City Development', 'Implementing smart city technologies including IoT sensors, traffic management systems, and digital governance platforms in major urban centers.', 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80', 'https://example.com/smart-city', 'completed', 7),

('Agricultural IoT Platform', 'Developing an Internet of Things platform for precision agriculture, including soil monitoring, automated irrigation, and crop health tracking systems.', 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80', 'https://example.com/iot-agriculture', 'completed', 8)
ON DUPLICATE KEY UPDATE updated_at = CURRENT_TIMESTAMP;

-- Create indexes for better performance
CREATE INDEX idx_blog_posts_author ON blog_posts(author_id);
CREATE INDEX idx_blog_posts_published_at ON blog_posts(published_at);
CREATE INDEX idx_projects_created_at ON projects(created_at);
CREATE INDEX idx_services_created_at ON services(created_at);
CREATE INDEX idx_team_members_created_at ON team_members(created_at);

-- Show created tables
SHOW TABLES;

-- Show table structures
DESCRIBE blog_posts;
DESCRIBE pages;
DESCRIBE projects;
DESCRIBE services;
DESCRIBE site_settings;
DESCRIBE team_members;
DESCRIBE users; 