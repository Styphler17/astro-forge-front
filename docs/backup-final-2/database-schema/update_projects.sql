-- Update Projects Table with Comprehensive Sample Data
-- Run this file to populate the projects table with sample data

USE astro_forge_db;

-- Clear existing projects using a safe DELETE with WHERE clause
DELETE FROM projects WHERE id IS NOT NULL;

INSERT INTO projects (title, description, image_url, project_url, status, display_order) VALUES
('Sustainable Agriculture Initiative', 'Implementing advanced farming techniques and sustainable practices across 500+ acres of farmland in Ghana. This project focuses on precision agriculture, water conservation, and organic farming methods to increase crop yields while protecting the environment.', 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80', 'https://example.com/agriculture-project', 'in_progress', 1),

('Mining Operations Expansion', 'Expanding mining operations with focus on environmental responsibility and community development in South Africa. This project includes modern mining technologies, safety improvements, and community development programs.', 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80', 'https://example.com/mining-project', 'planning', 2),

('Urban Development Project', 'Creating sustainable urban communities with modern infrastructure and green spaces in Nigeria. This comprehensive development includes residential areas, commercial spaces, and public amenities designed for modern living.', 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80', 'https://example.com/urban-project', 'in_progress', 3),

('Community Education Center', 'Building educational facilities to provide quality education and skills training to local communities in Kenya. The center includes classrooms, computer labs, and vocational training facilities.', 'https://images.unsplash.com/photo-1523050854058-8df90110c9a1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80', 'https://example.com/education-project', 'completed', 4),

('Renewable Energy Farm', 'Developing solar and wind energy projects to provide clean, sustainable power to rural communities in Tanzania. This project includes solar panel installations and wind turbine farms.', 'https://images.unsplash.com/photo-1509391366360-2e959784a276?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80', 'https://example.com/energy-project', 'planning', 5),

('Digital Infrastructure Network', 'Establishing high-speed internet connectivity and digital services across underserved regions in Uganda. This project includes fiber optic networks and community Wi-Fi hotspots.', 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80', 'https://example.com/digital-project', 'in_progress', 6),

('Smart City Development', 'Implementing smart city technologies including IoT sensors, traffic management systems, and digital governance platforms in major urban centers.', 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80', 'https://example.com/smart-city', 'completed', 7),

('Agricultural IoT Platform', 'Developing an Internet of Things platform for precision agriculture, including soil monitoring, automated irrigation, and crop health tracking systems.', 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80', 'https://example.com/iot-agriculture', 'completed', 8);

-- Verify the data was inserted
SELECT * FROM projects ORDER BY display_order ASC; 