-- Create contact_messages table
CREATE TABLE IF NOT EXISTS contact_messages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  subject VARCHAR(500) NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Add some sample messages for testing
INSERT INTO contact_messages (name, email, subject, message) VALUES
('John Doe', 'john@example.com', 'General Inquiry', 'Hello, I would like to learn more about your services.'),
('Jane Smith', 'jane@example.com', 'Project Discussion', 'We have a potential project we would like to discuss with your team.'),
('Mike Johnson', 'mike@example.com', 'Partnership Opportunity', 'I am interested in exploring partnership opportunities with Astro Forge Holdings.'); 