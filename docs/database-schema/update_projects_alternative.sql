-- Alternative Update Projects Table with Comprehensive Sample Data
-- This version works with MySQL safe update mode

USE astro_forge_db;

-- Option 1: Use TRUNCATE (faster and works with safe mode)
-- TRUNCATE TABLE projects;

-- Option 2: Delete specific records if you know their IDs
-- DELETE FROM projects WHERE id IN (SELECT id FROM (SELECT id FROM projects LIMIT 1000) AS temp);

-- Option 3: Delete by display_order (if you know the existing display_order values)
DELETE FROM projects WHERE display_order >= 0;

-- Option 4: If the above doesn't work, you can temporarily disable safe mode
-- SET SQL_SAFE_UPDATES = 0;
-- DELETE FROM projects;
-- SET SQL_SAFE_UPDATES = 1;

INSERT INTO projects (title, description, image_url, project_url, status, display_order) VALUES
('Sustainable Agriculture Initiative', 'Implementing advanced farming techniques and sustainable practices across 500+ acres of farmland in Ghana. This project focuses on precision agriculture, water conservation, and organic farming methods to increase crop yields while protecting the environment.', 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80', NULL, 'in_progress', 1),

('Mining Operations Expansion', 'Expanding mining operations with focus on environmental responsibility and community development in South Africa. This project includes modern mining technologies, safety improvements, and community development programs.', 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80', NULL, 'planning', 2),

('Urban Development Project', 'Creating sustainable urban communities with modern infrastructure and green spaces in Nigeria. This comprehensive development includes residential areas, commercial spaces, and public amenities designed for modern living.', 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80', NULL, 'in_progress', 3),

('Community Education Center', 'Building educational facilities to provide quality education and skills training to local communities in Kenya. The center includes classrooms, computer labs, and vocational training facilities.', 'https://images.unsplash.com/photo-1523050854058-8df90110c9a1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80', NULL, 'completed', 4),

('Renewable Energy Farm', 'Developing solar and wind energy projects to provide clean, sustainable power to rural communities in Tanzania. This project includes solar panel installations and wind turbine farms.', 'https://images.unsplash.com/photo-1509391366360-2e959784a276?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80', NULL, 'planning', 5),

('Digital Infrastructure Network', 'Establishing high-speed internet connectivity and digital services across underserved regions in Uganda. This project includes fiber optic networks and community Wi-Fi hotspots.', 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80', NULL, 'in_progress', 6),

('Smart City Development', 'Implementing smart city technologies including IoT sensors, traffic management systems, and digital governance platforms in major urban centers.', 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80', NULL, 'completed', 7),

('Agricultural IoT Platform', 'Developing an Internet of Things platform for precision agriculture, including soil monitoring, automated irrigation, and crop health tracking systems.', 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80', NULL, 'completed', 8);

-- Verify the data was inserted
SELECT * FROM projects ORDER BY display_order ASC; 