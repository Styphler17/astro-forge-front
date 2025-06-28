-- Populate team_members table with comprehensive sample data
-- This file contains sample team members for the About page

-- Clear existing team members (optional - comment out if you want to keep existing data)
-- DELETE FROM team_members;

-- Insert comprehensive team member data
INSERT INTO team_members (name, position, bio, image_url, email, linkedin_url, twitter_url, is_active, display_order) VALUES
(
    'Dr. Sarah Mitchell',
    'Chief Executive Officer & Co-Founder',
    'With over 20 years of experience in strategic business development, Dr. Mitchell leads our vision for sustainable growth across all sectors. She holds a PhD in Business Administration and has successfully led multiple international expansion initiatives.',
    'https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    'sarah.mitchell@astroforge.com',
    'https://linkedin.com/in/sarah-mitchell',
    'https://twitter.com/sarahmitchell',
    TRUE,
    1
),
(
    'Michael Chen',
    'Chief Technology Officer & Co-Founder',
    'A visionary technologist with expertise in emerging technologies and innovation management across multiple industries. Michael has led digital transformation initiatives for Fortune 500 companies and holds multiple patents in sustainable technology.',
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    'michael.chen@astroforge.com',
    'https://linkedin.com/in/michaelchen',
    'https://twitter.com/michaelchen',
    TRUE,
    2
),
(
    'Emily Rodriguez',
    'Head of Agriculture Division',
    'Leading sustainable farming initiatives with 15+ years in agricultural innovation. Emily specializes in precision agriculture, organic farming methods, and community-based agricultural development programs across Africa.',
    'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    'emily.rodriguez@astroforge.com',
    'https://linkedin.com/in/emilyrodriguez',
    'https://twitter.com/emilyrodriguez',
    TRUE,
    3
),
(
    'David Thompson',
    'Head of Mining Operations',
    'Experienced mining engineer with expertise in sustainable mining practices and community development. David has successfully managed mining operations across multiple African countries while maintaining the highest environmental standards.',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    'david.thompson@astroforge.com',
    'https://linkedin.com/in/davidthompson',
    'https://twitter.com/davidthompson',
    TRUE,
    4
),
(
    'Lisa Wang',
    'Head of Real Estate Development',
    'Leading urban development projects with a focus on sustainable communities and smart city technologies. Lisa has overseen the development of over 50 residential and commercial projects across Africa.',
    'https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    'lisa.wang@astroforge.com',
    'https://linkedin.com/in/lisawang',
    'https://twitter.com/lisawang',
    TRUE,
    5
),
(
    'James Okafor',
    'Head of Community Development',
    'Dedicated to creating positive social impact through community development initiatives. James has successfully implemented education, healthcare, and infrastructure projects benefiting over 100,000 people across multiple communities.',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    'james.okafor@astroforge.com',
    'https://linkedin.com/in/jamesokafor',
    'https://twitter.com/jamesokafor',
    TRUE,
    6
),
(
    'Dr. Amina Hassan',
    'Head of Education Programs',
    'Educational specialist with a PhD in Educational Leadership. Dr. Hassan has developed innovative educational programs that have improved literacy rates and skills development across multiple African countries.',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    'amina.hassan@astroforge.com',
    'https://linkedin.com/in/aminahassan',
    'https://twitter.com/aminahassan',
    TRUE,
    7
),
(
    'Robert Kimani',
    'Chief Financial Officer',
    'Experienced financial executive with expertise in international finance and investment management. Robert has successfully managed financial operations across multiple countries and industries.',
    'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    'robert.kimani@astroforge.com',
    'https://linkedin.com/in/robertkimani',
    'https://twitter.com/robertkimani',
    TRUE,
    8
),
(
    'Fatima Al-Zahra',
    'Head of Sustainability',
    'Environmental scientist and sustainability expert with a focus on green technologies and circular economy principles. Fatima has developed sustainability frameworks that have been adopted by multiple industries.',
    'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    'fatima.alzahra@astroforge.com',
    'https://linkedin.com/in/fatimaalzahra',
    'https://twitter.com/fatimaalzahra',
    TRUE,
    9
),
(
    'Kwame Asante',
    'Head of Digital Innovation',
    'Technology leader specializing in digital transformation and emerging technologies. Kwame has led the implementation of cutting-edge digital solutions across multiple business divisions.',
    'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    'kwame.asante@astroforge.com',
    'https://linkedin.com/in/kwameasante',
    'https://twitter.com/kwameasante',
    TRUE,
    10
)
ON DUPLICATE KEY UPDATE 
    name = VALUES(name),
    position = VALUES(position),
    bio = VALUES(bio),
    image_url = VALUES(image_url),
    email = VALUES(email),
    linkedin_url = VALUES(linkedin_url),
    twitter_url = VALUES(twitter_url),
    is_active = VALUES(is_active),
    display_order = VALUES(display_order),
    updated_at = CURRENT_TIMESTAMP;

-- Show the inserted team members
SELECT id, name, position, is_active, display_order FROM team_members ORDER BY display_order; 