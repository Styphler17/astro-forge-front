-- Add pages table for dynamic page management
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
  INDEX idx_published (is_published),
  INDEX idx_created_at (created_at)
);

-- Insert a sample page
INSERT INTO pages (title, slug, content, meta_description, is_published) VALUES (
  'About Our Company',
  'about-company',
  '<h2>Welcome to Our Company</h2>
<p>We are a leading provider of innovative solutions across multiple industries. Our mission is to deliver exceptional value to our clients through cutting-edge technology and dedicated service.</p>

<h3>Our Vision</h3>
<p>To be the most trusted partner in digital transformation, helping businesses thrive in the modern world.</p>

<h3>Our Values</h3>
<ul>
  <li><strong>Innovation</strong> - We constantly push boundaries and explore new possibilities</li>
  <li><strong>Integrity</strong> - We do what''s right, even when no one is watching</li>
  <li><strong>Excellence</strong> - We strive for perfection in everything we do</li>
  <li><strong>Collaboration</strong> - We work together to achieve common goals</li>
</ul>

<h3>Our Services</h3>
<p>We offer a comprehensive range of services designed to meet the diverse needs of modern businesses:</p>
<ul>
  <li>Web Development & Design</li>
  <li>Mobile Application Development</li>
  <li>Cloud Infrastructure Solutions</li>
  <li>Digital Marketing & SEO</li>
  <li>Consulting & Strategy</li>
</ul>

<h3>Why Choose Us?</h3>
<p>With years of experience and a proven track record of success, we have helped countless businesses achieve their digital transformation goals. Our team of experts is committed to delivering results that exceed expectations.</p>',
  'Learn more about our company, mission, vision, and values. Discover how we can help your business grow and succeed in the digital age.',
  1
);

-- Insert another sample page
INSERT INTO pages (title, slug, content, meta_description, is_published) VALUES (
  'Our Services',
  'services-overview',
  '<h2>Comprehensive Service Solutions</h2>
<p>We provide a wide range of professional services to help your business succeed in today''s competitive market.</p>

<h3>Web Development</h3>
<p>Custom web applications and websites built with the latest technologies and best practices. We create responsive, user-friendly solutions that drive results.</p>

<h3>Mobile Development</h3>
<p>Native and cross-platform mobile applications for iOS and Android. We focus on creating intuitive user experiences and robust functionality.</p>

<h3>Cloud Solutions</h3>
<p>Scalable cloud infrastructure and migration services. We help businesses leverage the power of cloud computing to improve efficiency and reduce costs.</p>

<h3>Digital Marketing</h3>
<p>Comprehensive digital marketing strategies including SEO, PPC, social media, and content marketing to increase your online presence and drive growth.</p>

<h3>Consulting Services</h3>
<p>Strategic consulting to help you make informed decisions about technology investments and digital transformation initiatives.</p>',
  'Explore our comprehensive range of professional services including web development, mobile apps, cloud solutions, and digital marketing.',
  1
);

-- Insert a third sample page
INSERT INTO pages (title, slug, content, meta_description, is_published) VALUES (
  'Contact Information',
  'contact-info',
  '<h2>Get in Touch</h2>
<p>We''re here to help you succeed. Reach out to us for any questions, inquiries, or to discuss your project requirements.</p>

<h3>Contact Details</h3>
<div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
  <p><strong>Email:</strong> <a href="mailto:contact@astroforge.com">contact@astroforge.com</a></p>
  <p><strong>Phone:</strong> +1 (555) 123-4567</p>
  <p><strong>Address:</strong> 123 Business Plaza, Innovation District, Tech City, TC 12345</p>
  <p><strong>Business Hours:</strong> Monday - Friday, 9:00 AM - 6:00 PM EST</p>
</div>

<h3>Send Us a Message</h3>
<p>Use our contact form to send us a detailed message about your project or inquiry. We typically respond within 24 hours during business days.</p>

<h3>Schedule a Consultation</h3>
<p>Ready to discuss your project? Schedule a free consultation call with our team to explore how we can help you achieve your goals.</p>

<h3>Emergency Support</h3>
<p>For urgent technical issues or support requests, please call our support line at +1 (555) 987-6543.</p>',
  'Contact us for questions, project inquiries, or to schedule a consultation. Find our contact details and business hours.',
  1
); 