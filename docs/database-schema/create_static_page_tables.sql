-- Create tables for static pages content management
USE astro_forge_db;

-- Privacy Policy table
CREATE TABLE IF NOT EXISTS privacy_policy (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL DEFAULT 'Privacy Policy',
  content LONGTEXT NOT NULL,
  last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Terms of Service table
CREATE TABLE IF NOT EXISTS terms_of_service (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL DEFAULT 'Terms of Service',
  content LONGTEXT NOT NULL,
  last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Careers table
CREATE TABLE IF NOT EXISTS careers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL DEFAULT 'Careers',
  content LONGTEXT NOT NULL,
  last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- FAQ table
CREATE TABLE IF NOT EXISTS faqs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  question VARCHAR(500) NOT NULL,
  answer LONGTEXT NOT NULL,
  category VARCHAR(100) DEFAULT 'General',
  display_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert default content for privacy policy
INSERT INTO privacy_policy (title, content) VALUES (
  'Privacy Policy',
  '<h2>Privacy Policy</h2>
<p>At Astro Forge Holdings, we are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, and safeguard your data when you visit our website or use our services.</p>

<h3>Information We Collect</h3>
<p>We may collect personal information such as your name, email address, phone number, and company details when you contact us, subscribe to our newsletter, or use our services. We also collect technical information about your device and browsing activity.</p>

<h3>How We Use Your Information</h3>
<p>We use the information we collect to:</p>
<ul>
<li>Provide and improve our services</li>
<li>Communicate with you about projects and updates</li>
<li>Send newsletters and marketing materials (with your consent)</li>
<li>Comply with legal obligations</li>
<li>Protect our rights and prevent fraud</li>
</ul>

<h3>Data Security</h3>
<p>We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. Your data is stored securely and accessed only by authorized personnel.</p>'
);

-- Insert default content for terms of service
INSERT INTO terms_of_service (title, content) VALUES (
  'Terms of Service',
  '<h2>Terms of Service</h2>
<p>These Terms of Service govern your use of Astro Forge Holdings website and services. By accessing or using our services, you agree to be bound by these terms and our Privacy Policy.</p>

<h3>Acceptance of Terms</h3>
<p>By using our website or services, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.</p>

<h3>Use of Services</h3>
<p>You may use our services for lawful purposes only. You agree not to:</p>
<ul>
<li>Use our services for any illegal or unauthorized purpose</li>
<li>Interfere with or disrupt our services or servers</li>
<li>Attempt to gain unauthorized access to our systems</li>
<li>Use our services to transmit harmful or malicious content</li>
</ul>

<h3>Intellectual Property</h3>
<p>All content on our website, including text, graphics, logos, and software, is the property of Astro Forge Holdings and is protected by copyright and other intellectual property laws. You may not reproduce, distribute, or create derivative works without our written permission.</p>'
);

-- Insert default content for careers
INSERT INTO careers (title, content) VALUES (
  'Careers',
  '<h2>Join Our Team</h2>
<p>At Astro Forge Holdings, we\'re always looking for talented individuals who share our passion for innovation and sustainable development. Join our team and help us build a better future across Africa.</p>

<h3>Current Openings</h3>
<p>We currently have opportunities in the following areas:</p>
<ul>
<li>Project Management</li>
<li>Engineering (Mining, Civil, Agricultural)</li>
<li>Technology Development</li>
<li>Business Development</li>
<li>Community Relations</li>
<li>Environmental Science</li>
</ul>

<h3>Benefits</h3>
<p>We offer competitive benefits including:</p>
<ul>
<li>Health and wellness programs</li>
<li>Professional development opportunities</li>
<li>Flexible work arrangements</li>
<li>Competitive compensation</li>
<li>Travel opportunities across Africa</li>
<li>Impact-driven work environment</li>
</ul>

<h3>How to Apply</h3>
<p>To apply for a position, please send your resume and cover letter to careers@astroforge.com. Include the position title in your subject line and tell us why you\'d be a great fit for our team.</p>'
);

-- Insert sample FAQs
INSERT INTO faqs (question, answer, category, display_order) VALUES
('What services does Astro Forge offer?', 'We offer comprehensive solutions across multiple industries including mining operations, real estate development, agricultural technology, community development, and educational programs. Each service is tailored to meet the specific needs of our clients and communities.', 'Services', 1),
('How do I get started with a project?', 'Getting started is easy! Simply contact us through our website, email, or phone. Our team will schedule a consultation to discuss your project requirements, timeline, and budget. We\'ll then develop a customized proposal for your review.', 'Projects', 2),
('Do you work internationally?', 'Yes, we primarily focus on projects across Africa, working with local communities, governments, and international partners. Our expertise spans multiple countries and we have experience navigating various regulatory environments.', 'General', 3),
('What makes Astro Forge different?', 'We combine deep industry expertise with innovative technology and a strong commitment to sustainability and community impact. Our approach focuses on creating lasting positive change while delivering exceptional results for our clients.', 'General', 4),
('How can I contact the team?', 'You can reach us through multiple channels: Email at info@astroforge.com, phone at +1 (555) 123-4567, or through our contact form on the website. We typically respond within 24 hours during business days.', 'Contact', 5),
('What are your business hours?', 'Our team is available Monday through Friday, 9:00 AM to 6:00 PM local time. For urgent matters outside of business hours, please leave a message and we\'ll respond as soon as possible.', 'Contact', 6);

-- Remove the old pages table since we're not using it anymore
-- DROP TABLE IF EXISTS pages; 