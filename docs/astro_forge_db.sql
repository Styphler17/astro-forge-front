-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jun 28, 2025 at 07:33 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `astro_forge_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `blog_posts`
--

CREATE TABLE `blog_posts` (
  `id` varchar(36) NOT NULL DEFAULT uuid(),
  `title` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `excerpt` text DEFAULT NULL,
  `content` longtext DEFAULT NULL,
  `featured_image` varchar(500) DEFAULT NULL,
  `author_id` varchar(36) DEFAULT NULL,
  `is_published` tinyint(1) DEFAULT 0,
  `published_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `blog_posts`
--

INSERT INTO `blog_posts` (`id`, `title`, `slug`, `excerpt`, `content`, `featured_image`, `author_id`, `is_published`, `published_at`, `created_at`, `updated_at`) VALUES
('5a08fe8b-51f7-11f0-b8e2-345a60293f45', 'Updated Sustainable Agriculture', 'sustainable-agriculture-future-farming', 'Exploring innovative farming techniques that promote environmental sustainability while maintaining high productivity.', '<h2>The Future of Sustainable Agriculture</h2>\n<p>As the global population continues to grow, the demand for food production increases exponentially. However, traditional farming methods often come at a significant environmental cost. At Astro Forge Holdings, we believe that sustainable agriculture is not just a trend—it is the future of farming.</p>\n\n<h3>Precision Agriculture Technologies</h3>\n<p>Modern farming is being revolutionized by precision agriculture technologies. These include IoT sensors for real-time monitoring, drone technology for crop assessment, automated irrigation systems, and AI-powered data analytics for better decision-making.</p>\n\n<h3>Environmental Benefits</h3>\n<p>Sustainable agriculture practices offer numerous environmental benefits, including reduced water consumption, lower carbon footprint, preservation of soil health and biodiversity, and minimized use of harmful pesticides and fertilizers.</p>\n\n<h3>Our Commitment</h3>\n<p>At Astro Forge Holdings, we are committed to implementing sustainable agriculture practices across all our agricultural projects. Our team of experts works closely with local farmers to introduce these technologies and ensure successful adoption.</p>', 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', 'Updated Author', 1, '2025-06-26 22:32:17', '2025-06-25 19:02:12', '2025-06-26 22:32:17'),
('5a097bbf-51f7-11f0-b8e2-345a60293f45', 'Responsible Mining Practices in Modern Industry', 'responsible-mining-practices-modern-industry', 'How modern mining operations can balance resource extraction with environmental conservation and community welfare.', '<h2>Responsible Mining in the Modern Era</h2><p>The mining industry has long been associated with environmental degradation and social disruption. However, modern mining companies are increasingly adopting responsible practices that balance resource extraction with environmental conservation and community welfare.</p><h3>Environmental Stewardship</h3><p>Modern responsible mining practices include comprehensive reclamation planning, advanced water management systems, air quality control technologies, and measures to protect local wildlife and ecosystems.</p><h3>Community Engagement</h3><p>Responsible mining goes beyond environmental protection to include meaningful consultation with local communities, fair compensation agreements, investment in local infrastructure, and employment opportunities for local residents.</p><h3>Our Approach</h3><p>At Astro Forge Holdings, we believe that responsible mining is not just a regulatory requirement—it is a fundamental business principle. Our mining operations are designed with sustainability at their core.</p>', 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', NULL, 1, '2024-03-10 13:30:00', '2025-06-25 19:02:12', '2025-06-25 19:02:12'),
('5a097c83-51f7-11f0-b8e2-345a60293f45', 'Smart Cities: Real Estate Development for Tomorrow', 'smart-cities-real-estate-development-tomorrow', 'The intersection of technology and urban planning in creating sustainable, livable communities for the future.', '<h2>Building the Cities of Tomorrow</h2>\n\n<p>As urbanization continues to accelerate globally, the need for smart, sustainable cities has never been more critical. Smart cities represent the intersection of technology and urban planning, creating communities that are not only livable but also efficient, sustainable, and responsive to the needs of their residents.</p>\n\n<h3>Key Components of Smart Cities</h3>\n<p>Smart cities integrate various technologies including intelligent transportation systems, smart energy management, digital infrastructure, and environmental monitoring systems.</p>\n\n<h3>Benefits for Residents</h3>\n<p>Smart cities offer improved quality of life, reduced environmental impact, enhanced public safety, and increased economic opportunities through digital innovation.</p>\n\n<h3>Our Vision</h3>\n<p>At Astro Forge Holdings, we are committed to developing smart city projects that prioritize sustainability, innovation, and community well-being. Our developments incorporate the latest technologies while maintaining a human-centered approach to urban design.</p>', 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', NULL, 1, '2025-06-26 22:36:54', '2025-06-25 19:02:12', '2025-06-26 22:36:54');

-- --------------------------------------------------------

--
-- Table structure for table `career_application_process`
--

CREATE TABLE `career_application_process` (
  `id` int(11) NOT NULL,
  `step_number` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `estimated_duration` varchar(100) DEFAULT NULL,
  `display_order` int(11) DEFAULT 0,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `career_application_process`
--

INSERT INTO `career_application_process` (`id`, `step_number`, `title`, `description`, `estimated_duration`, `display_order`, `is_active`, `created_at`, `updated_at`) VALUES
(1, 1, 'Application Review', 'We carefully review your resume, cover letter, and portfolio to understand your skills and experience.', '1-2 weeks', 1, 1, '2025-06-28 05:05:01', '2025-06-28 05:05:01'),
(2, 2, 'Initial Screening', 'A brief phone call to discuss your background, career goals, and the role requirements.', '30 minutes', 2, 1, '2025-06-28 05:05:01', '2025-06-28 05:05:01'),
(3, 3, 'Technical Assessment', 'Depending on the role, you may complete a technical test or case study to demonstrate your skills.', '1-2 hours', 3, 1, '2025-06-28 05:05:01', '2025-06-28 05:05:01'),
(4, 4, 'Team Interview', 'Meet with the team you\'ll be working with to discuss the role, company culture, and answer your questions.', '1 hour', 4, 1, '2025-06-28 05:05:01', '2025-06-28 05:05:01'),
(5, 5, 'Final Decision', 'We\'ll provide feedback and discuss next steps, including offer details and onboarding process.', '1 week', 5, 1, '2025-06-28 05:05:01', '2025-06-28 05:05:01');

-- --------------------------------------------------------

--
-- Table structure for table `career_benefits`
--

CREATE TABLE `career_benefits` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `icon` varchar(100) DEFAULT NULL,
  `category` varchar(100) DEFAULT 'general',
  `display_order` int(11) DEFAULT 0,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `career_benefits`
--

INSERT INTO `career_benefits` (`id`, `title`, `description`, `icon`, `category`, `display_order`, `is_active`, `created_at`, `updated_at`) VALUES
(1, 'Health & Wellness', 'Comprehensive health insurance coverage for you and your family, including dental and vision plans.', 'heart', 'health', 1, 1, '2025-06-28 05:05:01', '2025-06-28 05:05:01'),
(2, 'Professional Development', 'Continuous learning opportunities with training budgets, conference attendance, and skill development programs.', 'graduation-cap', 'development', 2, 1, '2025-06-28 05:05:01', '2025-06-28 05:05:01'),
(3, 'Flexible Work Arrangements', 'Remote work options, flexible hours, and work-life balance initiatives.', 'clock', 'work-life', 3, 1, '2025-06-28 05:05:01', '2025-06-28 05:05:01'),
(4, 'Competitive Compensation', 'Attractive salary packages with performance-based bonuses and equity options.', 'dollar-sign', 'compensation', 4, 1, '2025-06-28 05:05:01', '2025-06-28 05:05:01'),
(5, 'Travel Opportunities', 'Chance to work across different African countries and experience diverse cultures.', 'map-pin', 'travel', 5, 1, '2025-06-28 05:05:01', '2025-06-28 05:05:01'),
(6, 'Team Building', 'Regular team events, retreats, and social activities to build strong relationships.', 'users', 'culture', 6, 1, '2025-06-28 05:05:01', '2025-06-28 05:05:01');

-- --------------------------------------------------------

--
-- Table structure for table `career_culture`
--

CREATE TABLE `career_culture` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `image_url` varchar(500) DEFAULT NULL,
  `display_order` int(11) DEFAULT 0,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `career_culture`
--

INSERT INTO `career_culture` (`id`, `title`, `description`, `image_url`, `display_order`, `is_active`, `created_at`, `updated_at`) VALUES
(1, 'Innovation-Driven Environment', 'We foster a culture of innovation where new ideas are encouraged and creativity is celebrated. Our team members are empowered to think outside the box and bring fresh perspectives to every project.', '/images/culture/innovation.jpg', 1, 1, '2025-06-28 05:05:01', '2025-06-28 05:05:01'),
(2, 'Diversity & Inclusion', 'We believe in the power of diverse perspectives. Our team represents different backgrounds, experiences, and viewpoints, creating a rich and inclusive work environment.', '/images/culture/diversity.jpg', 2, 1, '2025-06-28 05:05:01', '2025-06-28 05:05:01'),
(3, 'Collaborative Spirit', 'Success is a team effort. We work together, share knowledge, and support each other to achieve our common goals.', '/images/culture/collaboration.jpg', 3, 1, '2025-06-28 05:05:01', '2025-06-28 05:05:01'),
(4, 'Impact-Focused', 'Every project we undertake has the potential to make a real difference in communities across Africa. We\'re driven by the impact we can create.', '/images/culture/impact.jpg', 4, 1, '2025-06-28 05:05:01', '2025-06-28 05:05:01');

-- --------------------------------------------------------

--
-- Table structure for table `career_requirements`
--

CREATE TABLE `career_requirements` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `category` varchar(100) DEFAULT 'general',
  `display_order` int(11) DEFAULT 0,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `career_requirements`
--

INSERT INTO `career_requirements` (`id`, `title`, `description`, `category`, `display_order`, `is_active`, `created_at`, `updated_at`) VALUES
(1, 'Education', 'Bachelor\'s degree or equivalent experience in relevant field. Advanced degrees are a plus.', 'education', 1, 1, '2025-06-28 05:05:01', '2025-06-28 05:05:01'),
(2, 'Experience', 'Minimum 2+ years of relevant professional experience. Specific requirements vary by role.', 'experience', 2, 1, '2025-06-28 05:05:01', '2025-06-28 05:05:01'),
(3, 'Technical Skills', 'Proficiency in relevant technologies and tools. We provide training for specific platforms.', 'technical', 3, 1, '2025-06-28 05:05:01', '2025-06-28 05:05:01'),
(4, 'Communication', 'Excellent written and verbal communication skills in English. Additional languages are beneficial.', 'soft-skills', 4, 1, '2025-06-28 05:05:01', '2025-06-28 05:05:01'),
(5, 'Problem Solving', 'Strong analytical and problem-solving abilities with a track record of innovative solutions.', 'soft-skills', 5, 1, '2025-06-28 05:05:01', '2025-06-28 05:05:01'),
(6, 'Team Collaboration', 'Ability to work effectively in cross-functional teams and adapt to changing priorities.', 'soft-skills', 6, 1, '2025-06-28 05:05:01', '2025-06-28 05:05:01');

-- --------------------------------------------------------

--
-- Table structure for table `contact_messages`
--

CREATE TABLE `contact_messages` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `subject` varchar(255) NOT NULL,
  `message` text NOT NULL,
  `is_read` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `contact_messages`
--

INSERT INTO `contact_messages` (`id`, `name`, `email`, `subject`, `message`, `is_read`, `created_at`) VALUES
(1, 'John Doe', 'john@example.com', 'General Inquiry', 'Hello, I would like to learn more about your services.', 0, '2025-06-27 21:49:12'),
(2, 'Jane Smith', 'jane@example.com', 'Project Discussion', 'We have a potential project we would like to discuss with your team.', 0, '2025-06-27 21:49:12'),
(3, 'Mike Johnson', 'mike@example.com', 'Partnership Opportunity', 'I am interested in exploring partnership opportunities with Astro Forge Holdings.', 0, '2025-06-27 21:49:12');

-- --------------------------------------------------------

--
-- Table structure for table `faqs`
--

CREATE TABLE `faqs` (
  `id` int(11) NOT NULL,
  `question` varchar(500) NOT NULL,
  `answer` longtext NOT NULL,
  `category` varchar(100) DEFAULT 'General',
  `display_order` int(11) DEFAULT 0,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `faqs`
--

INSERT INTO `faqs` (`id`, `question`, `answer`, `category`, `display_order`, `is_active`, `created_at`, `updated_at`) VALUES
(1, 'What services does Astro Forge offer?', 'We offer comprehensive solutions across multiple industries including mining operations, real estate development, agricultural technology, community development, and educational programs. Each service is tailored to meet the specific needs of our clients and communities.', 'Services', 1, 1, '2025-06-27 22:06:17', '2025-06-27 22:06:17'),
(2, 'How do I get started with a project?', 'Getting started is easy! Simply contact us through our website, email, or phone. Our team will schedule a consultation to discuss your project requirements, timeline, and budget. We\'ll then develop a customized proposal for your review.', 'Projects', 2, 1, '2025-06-27 22:06:17', '2025-06-27 22:06:17'),
(3, 'Do you work internationally?', 'Yes, we primarily focus on projects across Africa, working with local communities, governments, and international partners. Our expertise spans multiple countries and we have experience navigating various regulatory environments.', 'General', 3, 1, '2025-06-27 22:06:17', '2025-06-27 22:06:17'),
(4, 'What makes Astro Forge different?', 'We combine deep industry expertise with innovative technology and a strong commitment to sustainability and community impact. Our approach focuses on creating lasting positive change while delivering exceptional results for our clients.', 'General', 4, 1, '2025-06-27 22:06:17', '2025-06-27 22:06:17'),
(5, 'How can I contact the team?', 'You can reach us through multiple channels: Email at info@astroforge.com, phone at +1 (555) 123-4567, or through our contact form on the website. We typically respond within 24 hours during business days.', 'Contact', 5, 1, '2025-06-27 22:06:17', '2025-06-27 22:06:17'),
(6, 'What are your business hours?', 'Our team is available Monday through Friday, 9:00 AM to 6:00 PM local time. For urgent matters outside of business hours, please leave a message and we\'ll respond as soon as possible.', 'Contact', 6, 1, '2025-06-27 22:06:17', '2025-06-27 22:06:17');

-- --------------------------------------------------------

--
-- Table structure for table `job_positions`
--

CREATE TABLE `job_positions` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `department` varchar(100) NOT NULL,
  `location` varchar(100) NOT NULL,
  `employment_type` enum('full-time','part-time','contract','internship') DEFAULT 'full-time',
  `experience_level` varchar(100) NOT NULL,
  `description` text NOT NULL,
  `requirements` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`requirements`)),
  `benefits` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`benefits`)),
  `is_active` tinyint(1) DEFAULT 1,
  `display_order` int(11) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `job_positions`
--

INSERT INTO `job_positions` (`id`, `title`, `department`, `location`, `employment_type`, `experience_level`, `description`, `requirements`, `benefits`, `is_active`, `display_order`, `created_at`, `updated_at`) VALUES
(1, 'Senior Software Engineer', 'Engineering', 'Remote', 'full-time', '5+ years', 'Join our engineering team to build innovative solutions that transform industries across Africa. You will work on cutting-edge technologies and collaborate with a diverse team of professionals.', '[\"Strong experience with React, Node.js, and TypeScript\", \"Experience with cloud platforms (AWS, Azure, or GCP)\", \"Knowledge of database design and optimization\", \"Experience with microservices architecture\", \"Strong problem-solving and analytical skills\"]', '[\"Competitive salary and equity package\", \"Flexible remote work options\", \"Health insurance and wellness programs\", \"Professional development budget\", \"Annual team retreats\"]', 1, 1, '2025-06-27 22:35:40', '2025-06-27 22:35:40'),
(2, 'Project Manager', 'Operations', 'Lagos, Nigeria', 'full-time', '3+ years', 'Lead strategic projects that drive our mission of sustainable development across Africa. You will manage cross-functional teams and ensure successful project delivery.', '[\"PMP or PRINCE2 certification preferred\", \"Experience managing cross-functional teams\", \"Strong stakeholder management skills\", \"Background in infrastructure or development projects\", \"Excellent communication and leadership abilities\"]', '[\"Competitive salary package\", \"Performance-based bonuses\", \"Comprehensive health coverage\", \"Travel opportunities across Africa\", \"Professional development support\"]', 1, 2, '2025-06-27 22:35:40', '2025-06-27 22:35:40'),
(3, 'Marketing Specialist', 'Marketing', 'Nairobi, Kenya', 'full-time', '2+ years', 'Help us tell the story of Astro Forge Holdings and our impact across the continent. You will develop and execute marketing strategies that drive brand awareness.', '[\"Experience with digital marketing campaigns\", \"Proficiency in social media management\", \"Content creation and copywriting skills\", \"Analytics and reporting experience\", \"Creative thinking and strategic planning\"]', '[\"Creative work environment\", \"Professional development opportunities\", \"Health and wellness benefits\", \"Flexible work arrangements\", \"Performance bonuses\"]', 1, 3, '2025-06-27 22:35:40', '2025-06-27 22:35:40'),
(4, 'Data Analyst', 'Analytics', 'Remote', 'full-time', '2+ years', 'Transform data into insights that drive our strategic decisions and operational excellence. You will work with large datasets and create meaningful reports.', '[\"Proficiency in SQL and Python\", \"Experience with data visualization tools\", \"Statistical analysis skills\", \"Business intelligence experience\", \"Strong analytical and problem-solving abilities\"]', '[\"Competitive salary\", \"Remote work flexibility\", \"Learning and development budget\", \"Health insurance coverage\", \"Performance-based incentives\"]', 1, 4, '2025-06-27 22:35:40', '2025-06-27 22:35:40'),
(5, 'Business Development Manager', 'Business Development', 'Johannesburg, South Africa', 'full-time', '4+ years', 'Drive business growth and partnerships across Africa. You will identify new opportunities and build relationships with key stakeholders.', '[\"Proven track record in business development\", \"Experience in the African market\", \"Strong networking and relationship building skills\", \"Strategic thinking and market analysis\", \"Excellent presentation and negotiation skills\"]', '[\"Competitive salary with commission\", \"Travel opportunities\", \"Professional development support\", \"Health and wellness benefits\", \"Performance-based bonuses\"]', 1, 5, '2025-06-27 22:35:40', '2025-06-27 22:35:40');

-- --------------------------------------------------------

--
-- Table structure for table `privacy_policy`
--

CREATE TABLE `privacy_policy` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL DEFAULT 'Privacy Policy',
  `content` longtext NOT NULL,
  `last_updated` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `privacy_policy`
--

INSERT INTO `privacy_policy` (`id`, `title`, `content`, `last_updated`, `created_at`) VALUES
(1, 'Privacy Policy', '<h2>Privacy Policy</h2>\n<p>At Astro Forge Holdings, we are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, and safeguard your data when you visit our website or use our services.</p>\n\n<h3>Information We Collect</h3>\n<p>We may collect personal information such as your name, email address, phone number, and company details when you contact us, subscribe to our newsletter, or use our services. We also collect technical information about your device and browsing activity.</p>\n\n<h3>How We Use Your Information</h3>\n<p>We use the information we collect to:</p>\n<ul>\n<li>Provide and improve our services</li>\n<li>Communicate with you about projects and updates</li>\n<li>Send newsletters and marketing materials (with your consent)</li>\n<li>Comply with legal obligations</li>\n<li>Protect our rights and prevent fraud</li>\n</ul>\n\n<h3>Data Security</h3>\n<p>We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. Your data is stored securely and accessed only by authorized personnel.</p>', '2025-06-27 22:06:17', '2025-06-27 22:06:17');

-- --------------------------------------------------------

--
-- Table structure for table `projects`
--

CREATE TABLE `projects` (
  `id` varchar(36) NOT NULL DEFAULT uuid(),
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `image_url` varchar(500) DEFAULT NULL,
  `project_url` varchar(500) DEFAULT NULL,
  `status` varchar(50) DEFAULT 'active',
  `display_order` int(11) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `projects`
--

INSERT INTO `projects` (`id`, `title`, `description`, `image_url`, `project_url`, `status`, `display_order`, `created_at`, `updated_at`) VALUES
('40308c85-52d6-11f0-b8e2-345a60293f45', 'test', 'hgjdtdhrdh', 'https://picsum.photos/seed/picsum/300/200', '', 'planning', 0, '2025-06-26 21:37:38', '2025-06-26 21:37:38'),
('f9097a10-51c3-11f0-b8e2-345a60293f45', 'Sustainable Agriculture Initiative', 'Implementing advanced farming techniques and sustainable practices across 500+ acres of farmland in Ghana. This project focuses on precision agriculture, water conservation, and organic farming methods to increase crop yields while protecting the environment.', 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80', NULL, 'in_progress', 1, '2025-06-25 12:54:25', '2025-06-25 18:42:36');

-- --------------------------------------------------------

--
-- Table structure for table `services`
--

CREATE TABLE `services` (
  `id` varchar(36) NOT NULL DEFAULT uuid(),
  `title` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `content` longtext DEFAULT NULL,
  `icon` varchar(100) DEFAULT NULL,
  `image_url` varchar(500) DEFAULT NULL,
  `is_published` tinyint(1) DEFAULT 0,
  `display_order` int(11) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `services`
--

INSERT INTO `services` (`id`, `title`, `slug`, `description`, `content`, `icon`, `image_url`, `is_published`, `display_order`, `created_at`, `updated_at`) VALUES
('053a121c-52d5-11f0-b8e2-345a60293f45', 'Test Service', 'test-service', 'A test service', 'Test content', 'Building2', 'https://picsum.photos/seed/picsum/600/400', 1, 6, '2025-06-26 21:28:49', '2025-06-26 21:34:17'),
('97680a41-51c3-11f0-b8e2-345a60293f45', 'Updated Mining Solutions', 'mining', 'Updated mining description', NULL, 'Mountain', NULL, 1, 1, '2025-06-25 12:51:41', '2025-06-26 21:29:49'),
('97681bb2-51c3-11f0-b8e2-345a60293f45', 'Real Estate Development', 'real-estate', 'Innovative real estate development and investment services', NULL, 'Home', NULL, 1, 2, '2025-06-25 12:51:41', '2025-06-26 01:32:47'),
('97681c69-51c3-11f0-b8e2-345a60293f45', 'Agricultural Technology', 'agriculture', 'Advanced agricultural technology and sustainable farming solutions', NULL, 'Sprout', NULL, 1, 3, '2025-06-25 12:51:41', '2025-06-26 01:32:47'),
('97681cc0-51c3-11f0-b8e2-345a60293f45', 'Community Development', 'community', 'Community development and social impact initiatives', NULL, 'Users', NULL, 1, 4, '2025-06-25 12:51:41', '2025-06-26 01:32:47'),
('97681d0c-51c3-11f0-b8e2-345a60293f45', 'Educational Programs', 'education', 'Educational programs and training solutions', NULL, 'GraduationCap', NULL, 1, 5, '2025-06-25 12:51:41', '2025-06-26 01:32:47');

-- --------------------------------------------------------

--
-- Table structure for table `site_settings`
--

CREATE TABLE `site_settings` (
  `id` varchar(36) NOT NULL DEFAULT uuid(),
  `setting_key` varchar(100) NOT NULL,
  `setting_type` varchar(50) NOT NULL,
  `setting_value` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`setting_value`)),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `site_settings`
--

INSERT INTO `site_settings` (`id`, `setting_key`, `setting_type`, `setting_value`, `updated_at`) VALUES
('08e09a16-51fb-11f0-b8e2-345a60293f45', 'contact_address', 'string', '\"coming soon\"', '2025-06-26 22:14:28'),
('08e6219a-51fb-11f0-b8e2-345a60293f45', 'contact_hours', 'string', '\"Monday - Friday: 9:00 AM - 6:00 PM\"', '2025-06-25 19:40:00'),
('85b3c720-5327-11f0-abea-345a60293f45', 'hero_title', 'string', '\"ASTRO FORGE HOLDINGS\"', '2025-06-27 08:57:06'),
('85b40755-5327-11f0-abea-345a60293f45', 'hero_subtitle', 'string', '\"Building Tomorrow\'s Infrastructure Through Innovation, Sustainability, and Strategic Investment\"', '2025-06-27 08:57:06'),
('85b4084d-5327-11f0-abea-345a60293f45', 'hero_cta_text', 'string', '\"Discover More\"', '2025-06-27 08:57:06'),
('85b409b8-5327-11f0-abea-345a60293f45', 'hero_cta_link', 'string', '\"/about\"', '2025-06-27 08:57:06'),
('85b40a46-5327-11f0-abea-345a60293f45', 'hero_background_images', 'json', '[\"/placeholder.svg\",\"/placeholder.svg\",\"/placeholder.svg\"]', '2025-06-27 08:38:11'),
('97677ccd-51c3-11f0-b8e2-345a60293f45', 'site_title', 'string', '\"Astro Forge Holdings\"', '2025-06-25 12:51:41'),
('97677de6-51c3-11f0-b8e2-345a60293f45', 'site_description', 'string', '\"Leading provider of innovative solutions across multiple industries\"', '2025-06-25 12:51:41'),
('97677e74-51c3-11f0-b8e2-345a60293f45', 'contact_email', 'string', '\"contact@astroforge.com\"', '2025-06-25 12:51:41'),
('97677eab-51c3-11f0-b8e2-345a60293f45', 'contact_phone', 'string', '\"+233 000 000 000\"', '2025-06-26 22:14:28'),
('97677edd-51c3-11f0-b8e2-345a60293f45', 'social_links', 'json', '{\"facebook\":\"\",\"twitter\":\"\",\"linkedin\":\"\",\"instagram\":\"\"}', '2025-06-26 22:14:28'),
('97677fd5-51c3-11f0-b8e2-345a60293f45', 'theme_colors', 'json', '{\"primary\": \"#3B82F6\", \"secondary\": \"#1F2937\", \"accent\": \"#F59E0B\"}', '2025-06-25 12:51:41'),
('9767800d-51c3-11f0-b8e2-345a60293f45', 'logo_url', 'string', '\"\"', '2025-06-25 12:51:41'),
('9767803c-51c3-11f0-b8e2-345a60293f45', 'footer_text', 'string', '\"© 2024 Astro Forge Holdings. All rights reserved.\"', '2025-06-25 12:51:41'),
('ef405f1a-5328-11f0-abea-345a60293f45', 'hero_badge_text', 'string', '\"Innovation • Sustainability • Growth\"', '2025-06-27 08:57:06'),
('ef405fe2-5328-11f0-abea-345a60293f45', 'hero_stats_projects', 'string', '\"500+\"', '2025-06-27 08:57:06'),
('ef40607a-5328-11f0-abea-345a60293f45', 'hero_stats_countries', 'string', '\"50+\"', '2025-06-27 08:57:06'),
('ef4060f9-5328-11f0-abea-345a60293f45', 'hero_stats_years', 'string', '\"25+\"', '2025-06-27 08:57:06');

-- --------------------------------------------------------

--
-- Table structure for table `site_settings_backup`
--

CREATE TABLE `site_settings_backup` (
  `id` varchar(36) NOT NULL DEFAULT uuid(),
  `setting_key` varchar(100) NOT NULL,
  `setting_type` varchar(50) NOT NULL,
  `setting_value` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`setting_value`)),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `site_settings_backup`
--

INSERT INTO `site_settings_backup` (`id`, `setting_key`, `setting_type`, `setting_value`, `updated_at`) VALUES
('08e09a16-51fb-11f0-b8e2-345a60293f45', 'contact_address', 'string', '\"coming soon\"', '2025-06-26 22:14:28'),
('08e6219a-51fb-11f0-b8e2-345a60293f45', 'contact_hours', 'string', '\"Monday - Friday: 9:00 AM - 6:00 PM\"', '2025-06-25 19:40:00'),
('85b3c720-5327-11f0-abea-345a60293f45', 'hero_title', 'string', '\"\\\"\\\\\\\"\\\\\\\\\\\\\\\"ASTRO FORGE HOLDINGS\\\\\\\\\\\\\\\"\\\\\\\"\\\"\"', '2025-06-27 08:26:52'),
('85b40755-5327-11f0-abea-345a60293f45', 'hero_subtitle', 'string', '\"\\\"\\\\\\\"\\\\\\\\\\\\\\\"Building Tomorrow\'s Infrastructure Through Innovation, Sustainability, and Strategic Investment\\\\\\\\\\\\\\\"\\\\\\\"\\\"\"', '2025-06-27 08:26:52'),
('85b4084d-5327-11f0-abea-345a60293f45', 'hero_cta_text', 'string', '\"\\\"\\\\\\\"\\\\\\\\\\\\\\\"Discover More\\\\\\\\\\\\\\\"\\\\\\\"\\\"\"', '2025-06-27 08:26:52'),
('85b409b8-5327-11f0-abea-345a60293f45', 'hero_cta_link', 'string', '\"\\\"\\\\\\\"\\\\\\\\\\\\\\\"/about\\\\\\\\\\\\\\\"\\\\\\\"\\\"\"', '2025-06-27 08:26:52'),
('85b40a46-5327-11f0-abea-345a60293f45', 'hero_background_images', 'json', '\"[\\\"/placeholder.svg\\\",\\\"/placeholder.svg\\\",\\\"/placeholder.svg\\\"]\"', '2025-06-27 08:09:18'),
('97677ccd-51c3-11f0-b8e2-345a60293f45', 'site_title', 'string', '\"Astro Forge Holdings\"', '2025-06-25 12:51:41'),
('97677de6-51c3-11f0-b8e2-345a60293f45', 'site_description', 'string', '\"Leading provider of innovative solutions across multiple industries\"', '2025-06-25 12:51:41'),
('97677e74-51c3-11f0-b8e2-345a60293f45', 'contact_email', 'string', '\"contact@astroforge.com\"', '2025-06-25 12:51:41'),
('97677eab-51c3-11f0-b8e2-345a60293f45', 'contact_phone', 'string', '\"+233 000 000 000\"', '2025-06-26 22:14:28'),
('97677edd-51c3-11f0-b8e2-345a60293f45', 'social_links', 'json', '{\"facebook\":\"\",\"twitter\":\"\",\"linkedin\":\"\",\"instagram\":\"\"}', '2025-06-26 22:14:28'),
('97677fd5-51c3-11f0-b8e2-345a60293f45', 'theme_colors', 'json', '{\"primary\": \"#3B82F6\", \"secondary\": \"#1F2937\", \"accent\": \"#F59E0B\"}', '2025-06-25 12:51:41'),
('9767800d-51c3-11f0-b8e2-345a60293f45', 'logo_url', 'string', '\"\"', '2025-06-25 12:51:41'),
('9767803c-51c3-11f0-b8e2-345a60293f45', 'footer_text', 'string', '\"© 2024 Astro Forge Holdings. All rights reserved.\"', '2025-06-25 12:51:41'),
('ef405f1a-5328-11f0-abea-345a60293f45', 'hero_badge_text', 'string', '\"\\\"\\\\\\\"\\\\\\\\\\\\\\\"Innovation • Sustainability • Growth\\\\\\\\\\\\\\\"\\\\\\\"\\\"\"', '2025-06-27 08:26:52'),
('ef405fe2-5328-11f0-abea-345a60293f45', 'hero_stats_projects', 'string', '\"\\\"\\\\\\\"\\\\\\\\\\\\\\\"500+\\\\\\\\\\\\\\\"\\\\\\\"\\\"\"', '2025-06-27 08:26:52'),
('ef40607a-5328-11f0-abea-345a60293f45', 'hero_stats_countries', 'string', '\"\\\"\\\\\\\"\\\\\\\\\\\\\\\"50+\\\\\\\\\\\\\\\"\\\\\\\"\\\"\"', '2025-06-27 08:26:52'),
('ef4060f9-5328-11f0-abea-345a60293f45', 'hero_stats_years', 'string', '\"\\\"\\\\\\\"\\\\\\\\\\\\\\\"25+\\\\\\\\\\\\\\\"\\\\\\\"\\\"\"', '2025-06-27 08:26:52');

-- --------------------------------------------------------

--
-- Table structure for table `sponsors`
--

CREATE TABLE `sponsors` (
  `id` varchar(36) NOT NULL DEFAULT uuid(),
  `name` varchar(255) NOT NULL,
  `logo_url` varchar(500) NOT NULL,
  `website_url` varchar(500) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `display_order` int(11) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `sponsors`
--

INSERT INTO `sponsors` (`id`, `name`, `logo_url`, `website_url`, `description`, `is_active`, `display_order`, `created_at`, `updated_at`) VALUES
('2c564b32-522f-11f0-b8e2-345a60293f45', 'Microsoft', 'https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg', 'https://microsoft.com', 'Global technology leader and strategic partner', 1, 1, '2025-06-26 01:41:47', '2025-06-26 01:41:47'),
('2c56648f-522f-11f0-b8e2-345a60293f45', 'Google', 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg', 'https://google.com', 'Innovation partner in digital transformation', 1, 2, '2025-06-26 01:41:47', '2025-06-26 01:41:47'),
('2c56663d-522f-11f0-b8e2-345a60293f45', 'Amazon', 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg', 'https://amazon.com', 'Cloud infrastructure and e-commerce solutions partner', 1, 3, '2025-06-26 01:41:47', '2025-06-26 01:41:47'),
('2c566690-522f-11f0-b8e2-345a60293f45', 'IBM', 'https://upload.wikimedia.org/wikipedia/commons/5/51/IBM_logo.svg', 'https://ibm.com', 'Enterprise technology and consulting partner', 1, 4, '2025-06-26 01:41:47', '2025-06-26 01:41:47'),
('2c5666cb-522f-11f0-b8e2-345a60293f45', 'Oracle', 'https://logos-world.net/wp-content/uploads/2020/09/Oracle-Logo.png', 'https://oracle.com', 'Database and enterprise software solutions', 1, 5, '2025-06-26 01:41:47', '2025-06-26 01:41:47'),
('2c5666ff-522f-11f0-b8e2-345a60293f45', 'SAP', 'https://upload.wikimedia.org/wikipedia/commons/5/59/SAP_2011_logo.svg', 'https://sap.com', 'Business software and enterprise solutions partner', 1, 6, '2025-06-26 01:41:47', '2025-06-26 01:41:47');

-- --------------------------------------------------------

--
-- Table structure for table `team_members`
--

CREATE TABLE `team_members` (
  `id` varchar(36) NOT NULL DEFAULT uuid(),
  `name` varchar(255) NOT NULL,
  `position` varchar(255) NOT NULL,
  `bio` text DEFAULT NULL,
  `image_url` varchar(500) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `linkedin_url` varchar(500) DEFAULT NULL,
  `twitter_url` varchar(500) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `display_order` int(11) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `team_members`
--

INSERT INTO `team_members` (`id`, `name`, `position`, `bio`, `image_url`, `email`, `linkedin_url`, `twitter_url`, `is_active`, `display_order`, `created_at`, `updated_at`) VALUES
('97687146-51c3-11f0-b8e2-345a60293f45', 'Prince Marnu', 'CEO', 'Experienced leader with over 15 years in the industry', 'https://picsum.photos/id/237/200/300', NULL, NULL, NULL, 1, 1, '2025-06-25 12:51:41', '2025-06-26 20:53:03'),
('976882f8-51c3-11f0-b8e2-345a60293f45', 'John Collins', 'CTO', 'Technology expert specializing in innovative solutions', 'https://picsum.photos/seed/picsum/200/300', NULL, NULL, NULL, 1, 2, '2025-06-25 12:51:41', '2025-06-26 20:51:23'),
('97688386-51c3-11f0-b8e2-345a60293f45', 'test test', 'COO', 'Operations specialist with a focus on efficiency and growth', 'https://picsum.photos/200/300?grayscale', NULL, NULL, NULL, 1, 3, '2025-06-25 12:51:41', '2025-06-26 20:52:06');

-- --------------------------------------------------------

--
-- Table structure for table `terms_of_service`
--

CREATE TABLE `terms_of_service` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL DEFAULT 'Terms of Service',
  `content` longtext NOT NULL,
  `last_updated` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `terms_of_service`
--

INSERT INTO `terms_of_service` (`id`, `title`, `content`, `last_updated`, `created_at`) VALUES
(1, 'Terms of Service', '<h2>Terms of Service</h2>\n<p>These Terms of Service govern your use of Astro Forge Holdings website and services. By accessing or using our services, you agree to be bound by these terms and our Privacy Policy.</p>\n\n<h3>Acceptance of Terms</h3>\n<p>By using our website or services, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.</p>\n\n<h3>Use of Services</h3>\n<p>You may use our services for lawful purposes only. You agree not to:</p>\n<ul>\n<li>Use our services for any illegal or unauthorized purpose</li>\n<li>Interfere with or disrupt our services or servers</li>\n<li>Attempt to gain unauthorized access to our systems</li>\n<li>Use our services to transmit harmful or malicious content</li>\n</ul>\n\n<h3>Intellectual Property</h3>\n<p>All content on our website, including text, graphics, logos, and software, is the property of Astro Forge Holdings and is protected by copyright and other intellectual property laws. You may not reproduce, distribute, or create derivative works without our written permission.</p>', '2025-06-27 22:06:17', '2025-06-27 22:06:17');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` varchar(36) NOT NULL DEFAULT uuid(),
  `email` varchar(255) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `role` enum('admin','editor','viewer') DEFAULT 'viewer',
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `email`, `password_hash`, `name`, `role`, `is_active`, `created_at`, `updated_at`) VALUES
('a25e0009-52d1-11f0-b8e2-345a60293f45', 'test@example.com', 'testpass123', 'Test User', 'admin', 1, '2025-06-26 21:04:35', '2025-06-26 21:24:11');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `blog_posts`
--
ALTER TABLE `blog_posts`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `slug` (`slug`),
  ADD KEY `idx_slug` (`slug`),
  ADD KEY `idx_published` (`is_published`),
  ADD KEY `idx_created_at` (`created_at`);

--
-- Indexes for table `career_application_process`
--
ALTER TABLE `career_application_process`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_career_application_active` (`is_active`,`display_order`);

--
-- Indexes for table `career_benefits`
--
ALTER TABLE `career_benefits`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_career_benefits_active` (`is_active`,`display_order`);

--
-- Indexes for table `career_culture`
--
ALTER TABLE `career_culture`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_career_culture_active` (`is_active`,`display_order`);

--
-- Indexes for table `career_requirements`
--
ALTER TABLE `career_requirements`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_career_requirements_active` (`is_active`,`display_order`);

--
-- Indexes for table `contact_messages`
--
ALTER TABLE `contact_messages`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `faqs`
--
ALTER TABLE `faqs`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `job_positions`
--
ALTER TABLE `job_positions`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `privacy_policy`
--
ALTER TABLE `privacy_policy`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `projects`
--
ALTER TABLE `projects`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_display_order` (`display_order`),
  ADD KEY `idx_status` (`status`);

--
-- Indexes for table `services`
--
ALTER TABLE `services`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `slug` (`slug`),
  ADD KEY `idx_slug` (`slug`),
  ADD KEY `idx_published` (`is_published`),
  ADD KEY `idx_display_order` (`display_order`);

--
-- Indexes for table `site_settings`
--
ALTER TABLE `site_settings`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `setting_key` (`setting_key`),
  ADD KEY `idx_setting_key` (`setting_key`);

--
-- Indexes for table `sponsors`
--
ALTER TABLE `sponsors`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_display_order` (`display_order`),
  ADD KEY `idx_is_active` (`is_active`);

--
-- Indexes for table `team_members`
--
ALTER TABLE `team_members`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_display_order` (`display_order`),
  ADD KEY `idx_is_active` (`is_active`);

--
-- Indexes for table `terms_of_service`
--
ALTER TABLE `terms_of_service`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `idx_email` (`email`),
  ADD KEY `idx_role` (`role`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `career_application_process`
--
ALTER TABLE `career_application_process`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `career_benefits`
--
ALTER TABLE `career_benefits`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `career_culture`
--
ALTER TABLE `career_culture`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `career_requirements`
--
ALTER TABLE `career_requirements`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `contact_messages`
--
ALTER TABLE `contact_messages`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `faqs`
--
ALTER TABLE `faqs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `job_positions`
--
ALTER TABLE `job_positions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `privacy_policy`
--
ALTER TABLE `privacy_policy`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `terms_of_service`
--
ALTER TABLE `terms_of_service`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
