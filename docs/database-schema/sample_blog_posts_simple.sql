-- Sample Blog Posts for Astro Forge Holdings (Simple Safe Update Mode Solution)
-- This file contains sample blog posts to populate the blog_posts table

-- Temporarily disable safe update mode
SET SQL_SAFE_UPDATES = 0;

-- Clear existing blog posts
DELETE FROM blog_posts;

-- Re-enable safe update mode
SET SQL_SAFE_UPDATES = 1;

-- Insert sample blog posts
INSERT INTO blog_posts (title, slug, excerpt, content, featured_image, is_published, published_at) VALUES
(
  'Sustainable Agriculture: The Future of Farming',
  'sustainable-agriculture-future-farming',
  'Exploring innovative farming techniques that promote environmental sustainability while maintaining high productivity.',
  '<h2>The Future of Sustainable Agriculture</h2><p>As the global population continues to grow, the demand for food production increases exponentially. However, traditional farming methods often come at a significant environmental cost. At Astro Forge Holdings, we believe that sustainable agriculture is not just a trend—it is the future of farming.</p><h3>Precision Agriculture Technologies</h3><p>Modern farming is being revolutionized by precision agriculture technologies. These include IoT sensors for real-time monitoring, drone technology for crop assessment, automated irrigation systems, and AI-powered data analytics for better decision-making.</p><h3>Environmental Benefits</h3><p>Sustainable agriculture practices offer numerous environmental benefits including reduced water consumption, lower carbon footprint, preservation of soil health and biodiversity, and minimized use of harmful pesticides and fertilizers.</p><h3>Our Commitment</h3><p>At Astro Forge Holdings, we are committed to implementing sustainable agriculture practices across all our agricultural projects. Our team of experts works closely with local farmers to introduce these technologies and ensure successful adoption.</p>',
  'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  TRUE,
  '2024-03-15 10:00:00'
),
(
  'Responsible Mining Practices in Modern Industry',
  'responsible-mining-practices-modern-industry',
  'How modern mining operations can balance resource extraction with environmental conservation and community welfare.',
  '<h2>Responsible Mining in the Modern Era</h2><p>The mining industry has long been associated with environmental degradation and social disruption. However, modern mining companies are increasingly adopting responsible practices that balance resource extraction with environmental conservation and community welfare.</p><h3>Environmental Stewardship</h3><p>Modern responsible mining practices include comprehensive reclamation planning, advanced water management systems, air quality control technologies, and measures to protect local wildlife and ecosystems.</p><h3>Community Engagement</h3><p>Responsible mining goes beyond environmental protection to include meaningful consultation with local communities, fair compensation agreements, investment in local infrastructure, and employment opportunities for local residents.</p><h3>Our Approach</h3><p>At Astro Forge Holdings, we believe that responsible mining is not just a regulatory requirement—it is a fundamental business principle. Our mining operations are designed with sustainability at their core.</p>',
  'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  TRUE,
  '2024-03-10 14:30:00'
),
(
  'Smart Cities: Real Estate Development for Tomorrow',
  'smart-cities-real-estate-development-tomorrow',
  'The intersection of technology and urban planning in creating sustainable, livable communities for the future.',
  '<h2>Building the Cities of Tomorrow</h2><p>As urbanization continues to accelerate globally, the need for smart, sustainable cities has never been more critical. Smart cities represent the intersection of technology and urban planning, creating communities that are not only livable but also efficient, sustainable, and responsive to the needs of their residents.</p><h3>Key Components of Smart Cities</h3><p>Smart cities integrate various technologies including intelligent transportation systems, smart energy management, digital infrastructure, and environmental monitoring systems.</p><h3>Benefits for Residents</h3><p>Smart cities offer improved quality of life, reduced environmental impact, enhanced public safety, and increased economic opportunities through digital innovation.</p><h3>Our Vision</h3><p>At Astro Forge Holdings, we are committed to developing smart city projects that prioritize sustainability, innovation, and community well-being. Our developments incorporate the latest technologies while maintaining a human-centered approach to urban design.</p>',
  'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  TRUE,
  '2024-03-05 09:15:00'
),
(
  'Community-Centered Development: Building Stronger Neighborhoods',
  'community-centered-development-building-stronger-neighborhoods',
  'How community services and local engagement drive successful development projects and lasting positive impact.',
  '<h2>The Power of Community-Centered Development</h2><p>Successful development projects are not just about buildings and infrastructure—they are about people and communities. Community-centered development approaches prioritize local needs, engage residents in the planning process, and create lasting positive impact.</p><h3>Principles of Community-Centered Development</h3><p>Effective community development is built on local engagement, cultural sensitivity, sustainable impact, and capacity building for ongoing community development.</p><h3>Key Components</h3><p>Community-centered development includes comprehensive needs assessments, partnerships with local organizations, investment in community facilities, and programs that address social, economic, and environmental needs.</p><h3>Our Approach</h3><p>At Astro Forge Holdings, we believe that the most successful development projects are those that are truly community-centered. Our approach involves deep engagement with local communities and working collaboratively to create solutions that benefit everyone.</p>',
  'https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  TRUE,
  '2024-02-28 16:45:00'
),
(
  'Educational Innovation: Preparing Students for Tomorrow\'s Workforce',
  'educational-innovation-preparing-students-tomorrow-workforce',
  'Transforming education through technology integration and industry partnerships to create future-ready graduates.',
  '<h2>Transforming Education for the Future</h2><p>The rapid pace of technological change and the evolving nature of work require a fundamental transformation in how we educate and prepare students for the workforce. Educational innovation is about reimagining the entire learning experience.</p><h3>Technology Integration in Education</h3><p>Modern educational innovation includes digital learning platforms, virtual and augmented reality, artificial intelligence for adaptive learning, and collaborative tools for global project-based learning.</p><h3>Industry Partnerships</h3><p>Successful educational innovation requires strong partnerships with industry leaders, internship programs, mentorship opportunities, and research collaborations that advance both education and industry.</p><h3>Our Commitment</h3><p>At Astro Forge Holdings, we are committed to supporting educational innovation through our various programs and partnerships. We believe that investing in education is investing in the future.</p>',
  'https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  TRUE,
  '2024-02-20 11:20:00'
),
(
  'Digital Transformation Across Industries',
  'digital-transformation-across-industries',
  'How emerging technologies are reshaping traditional business models and creating new opportunities for growth.',
  '<h2>The Digital Revolution in Industry</h2><p>Digital transformation is not just a buzzword—it is a fundamental shift that is reshaping every industry and business model. From manufacturing to healthcare, emerging technologies are creating new opportunities and driving innovation.</p><h3>Key Technologies Driving Transformation</h3><p>The digital transformation is powered by artificial intelligence, Internet of Things, cloud computing, big data analytics, and blockchain technologies.</p><h3>Industry-Specific Applications</h3><p>Digital transformation manifests differently across industries, from smart factories in manufacturing to telemedicine in healthcare, precision farming in agriculture, and digital banking in finance.</p><h3>Our Role</h3><p>At Astro Forge Holdings, we are at the forefront of digital transformation across multiple industries. Our expertise helps organizations navigate the complexities of digital transformation and emerge stronger and more competitive.</p>',
  'https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  TRUE,
  '2024-02-15 13:10:00'
); 