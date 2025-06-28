-- Career Sections Tables
-- This file creates separate tables for different career page sections

USE astro_forge_db;

-- Career Benefits & Perks Table
CREATE TABLE IF NOT EXISTS career_benefits (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  icon VARCHAR(100),
  category VARCHAR(100) DEFAULT 'general',
  display_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Career Culture Table
CREATE TABLE IF NOT EXISTS career_culture (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  image_url VARCHAR(500),
  display_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Career Application Process Table
CREATE TABLE IF NOT EXISTS career_application_process (
  id INT AUTO_INCREMENT PRIMARY KEY,
  step_number INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  estimated_duration VARCHAR(100),
  display_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Career General Requirements Table
CREATE TABLE IF NOT EXISTS career_requirements (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(100) DEFAULT 'general',
  display_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert sample data for Career Benefits
INSERT INTO career_benefits (title, description, icon, category, display_order) VALUES
('Health & Wellness', 'Comprehensive health insurance coverage for you and your family, including dental and vision plans.', 'heart', 'health', 1),
('Professional Development', 'Continuous learning opportunities with training budgets, conference attendance, and skill development programs.', 'graduation-cap', 'development', 2),
('Flexible Work Arrangements', 'Remote work options, flexible hours, and work-life balance initiatives.', 'clock', 'work-life', 3),
('Competitive Compensation', 'Attractive salary packages with performance-based bonuses and equity options.', 'dollar-sign', 'compensation', 4),
('Travel Opportunities', 'Chance to work across different African countries and experience diverse cultures.', 'map-pin', 'travel', 5),
('Team Building', 'Regular team events, retreats, and social activities to build strong relationships.', 'users', 'culture', 6);

-- Insert sample data for Career Culture
INSERT INTO career_culture (title, description, image_url, display_order) VALUES
('Innovation-Driven Environment', 'We foster a culture of innovation where new ideas are encouraged and creativity is celebrated. Our team members are empowered to think outside the box and bring fresh perspectives to every project.', '/images/culture/innovation.jpg', 1),
('Diversity & Inclusion', 'We believe in the power of diverse perspectives. Our team represents different backgrounds, experiences, and viewpoints, creating a rich and inclusive work environment.', '/images/culture/diversity.jpg', 2),
('Collaborative Spirit', 'Success is a team effort. We work together, share knowledge, and support each other to achieve our common goals.', '/images/culture/collaboration.jpg', 3),
('Impact-Focused', 'Every project we undertake has the potential to make a real difference in communities across Africa. We''re driven by the impact we can create.', '/images/culture/impact.jpg', 4);

-- Insert sample data for Career Application Process
INSERT INTO career_application_process (step_number, title, description, estimated_duration, display_order) VALUES
(1, 'Application Review', 'We carefully review your resume, cover letter, and portfolio to understand your skills and experience.', '1-2 weeks', 1),
(2, 'Initial Screening', 'A brief phone call to discuss your background, career goals, and the role requirements.', '30 minutes', 2),
(3, 'Technical Assessment', 'Depending on the role, you may complete a technical test or case study to demonstrate your skills.', '1-2 hours', 3),
(4, 'Team Interview', 'Meet with the team you''ll be working with to discuss the role, company culture, and answer your questions.', '1 hour', 4),
(5, 'Final Decision', 'We''ll provide feedback and discuss next steps, including offer details and onboarding process.', '1 week', 5);

-- Insert sample data for Career Requirements
INSERT INTO career_requirements (title, description, category, display_order) VALUES
('Education', 'Bachelor''s degree or equivalent experience in relevant field. Advanced degrees are a plus.', 'education', 1),
('Experience', 'Minimum 2+ years of relevant professional experience. Specific requirements vary by role.', 'experience', 2),
('Technical Skills', 'Proficiency in relevant technologies and tools. We provide training for specific platforms.', 'technical', 3),
('Communication', 'Excellent written and verbal communication skills in English. Additional languages are beneficial.', 'soft-skills', 4),
('Problem Solving', 'Strong analytical and problem-solving abilities with a track record of innovative solutions.', 'soft-skills', 5),
('Team Collaboration', 'Ability to work effectively in cross-functional teams and adapt to changing priorities.', 'soft-skills', 6);

-- Add indexes for better performance
CREATE INDEX idx_career_benefits_active ON career_benefits(is_active, display_order);
CREATE INDEX idx_career_culture_active ON career_culture(is_active, display_order);
CREATE INDEX idx_career_application_active ON career_application_process(is_active, display_order);
CREATE INDEX idx_career_requirements_active ON career_requirements(is_active, display_order); 