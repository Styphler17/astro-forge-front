-- Create job_positions table
CREATE TABLE IF NOT EXISTS job_positions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  department VARCHAR(100) NOT NULL,
  location VARCHAR(100) NOT NULL,
  employment_type ENUM('full-time', 'part-time', 'contract', 'internship') DEFAULT 'full-time',
  experience_level VARCHAR(100) NOT NULL,
  description TEXT NOT NULL,
  requirements JSON,
  benefits JSON,
  is_active BOOLEAN DEFAULT TRUE,
  display_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert sample job positions
INSERT INTO job_positions (title, department, location, employment_type, experience_level, description, requirements, benefits, is_active, display_order) VALUES
(
  'Senior Software Engineer',
  'Engineering',
  'Remote',
  'full-time',
  '5+ years',
  'Join our engineering team to build innovative solutions that transform industries across Africa. You will work on cutting-edge technologies and collaborate with a diverse team of professionals.',
  JSON_ARRAY(
    'Strong experience with React, Node.js, and TypeScript',
    'Experience with cloud platforms (AWS, Azure, or GCP)',
    'Knowledge of database design and optimization',
    'Experience with microservices architecture',
    'Strong problem-solving and analytical skills'
  ),
  JSON_ARRAY(
    'Competitive salary and equity package',
    'Flexible remote work options',
    'Health insurance and wellness programs',
    'Professional development budget',
    'Annual team retreats'
  ),
  TRUE,
  1
),
(
  'Project Manager',
  'Operations',
  'Lagos, Nigeria',
  'full-time',
  '3+ years',
  'Lead strategic projects that drive our mission of sustainable development across Africa. You will manage cross-functional teams and ensure successful project delivery.',
  JSON_ARRAY(
    'PMP or PRINCE2 certification preferred',
    'Experience managing cross-functional teams',
    'Strong stakeholder management skills',
    'Background in infrastructure or development projects',
    'Excellent communication and leadership abilities'
  ),
  JSON_ARRAY(
    'Competitive salary package',
    'Performance-based bonuses',
    'Comprehensive health coverage',
    'Travel opportunities across Africa',
    'Professional development support'
  ),
  TRUE,
  2
),
(
  'Marketing Specialist',
  'Marketing',
  'Nairobi, Kenya',
  'full-time',
  '2+ years',
  'Help us tell the story of Astro Forge Holdings and our impact across the continent. You will develop and execute marketing strategies that drive brand awareness.',
  JSON_ARRAY(
    'Experience with digital marketing campaigns',
    'Proficiency in social media management',
    'Content creation and copywriting skills',
    'Analytics and reporting experience',
    'Creative thinking and strategic planning'
  ),
  JSON_ARRAY(
    'Creative work environment',
    'Professional development opportunities',
    'Health and wellness benefits',
    'Flexible work arrangements',
    'Performance bonuses'
  ),
  TRUE,
  3
),
(
  'Data Analyst',
  'Analytics',
  'Remote',
  'full-time',
  '2+ years',
  'Transform data into insights that drive our strategic decisions and operational excellence. You will work with large datasets and create meaningful reports.',
  JSON_ARRAY(
    'Proficiency in SQL and Python',
    'Experience with data visualization tools',
    'Statistical analysis skills',
    'Business intelligence experience',
    'Strong analytical and problem-solving abilities'
  ),
  JSON_ARRAY(
    'Competitive salary',
    'Remote work flexibility',
    'Learning and development budget',
    'Health insurance coverage',
    'Performance-based incentives'
  ),
  TRUE,
  4
),
(
  'Business Development Manager',
  'Business Development',
  'Johannesburg, South Africa',
  'full-time',
  '4+ years',
  'Drive business growth and partnerships across Africa. You will identify new opportunities and build relationships with key stakeholders.',
  JSON_ARRAY(
    'Proven track record in business development',
    'Experience in the African market',
    'Strong networking and relationship building skills',
    'Strategic thinking and market analysis',
    'Excellent presentation and negotiation skills'
  ),
  JSON_ARRAY(
    'Competitive salary with commission',
    'Travel opportunities',
    'Professional development support',
    'Health and wellness benefits',
    'Performance-based bonuses'
  ),
  TRUE,
  5
); 