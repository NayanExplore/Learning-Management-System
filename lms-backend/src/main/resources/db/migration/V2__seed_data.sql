-- =============================================
-- Seed Data for Development (MySQL)
-- =============================================

-- Default site settings
INSERT INTO site_settings (setting_key, setting_value) VALUES
('site_name', 'SkillForge Academy'),
('site_tagline', 'Master New Skills, Transform Your Career'),
('contact_email', 'hello@skillforge.com'),
('contact_phone', '+91 98765 43210'),
('contact_address', 'Koramangala, Bangalore, Karnataka 560034'),
('hero_title', 'Master New Skills, Transform Your Career'),
('hero_subtitle', 'Industry-expert led courses with hands-on projects, quizzes, and verified certificates to accelerate your professional growth.'),
('about_text', 'SkillForge Academy is a premier online learning platform dedicated to helping professionals and students acquire in-demand skills. Founded in 2024, we have trained over 10,000 learners across India.'),
('social_linkedin', 'https://linkedin.com/company/skillforge'),
('social_twitter', 'https://twitter.com/skillforge'),
('social_youtube', 'https://youtube.com/@skillforge'),
('primary_color', '#4F46E5'),
('company_logo_url', '');

-- Sample courses for development
INSERT INTO courses (title, slug, short_description, description, instructor_name, instructor_bio, duration_hours, price, original_price, status, featured, sort_order, learning_outcomes, prerequisites, level) VALUES
(
    'Full-Stack Web Development Bootcamp',
    'full-stack-web-development-bootcamp',
    'Build production-ready web applications from scratch using React, Node.js, and MySQL. Includes 12 real-world projects.',
    'This comprehensive bootcamp takes you from zero to a confident full-stack developer. You will learn:\n\n**Frontend Development**\n- HTML5, CSS3, and modern JavaScript (ES6+)\n- React with hooks, context, and routing\n- Responsive design with Tailwind CSS\n- State management and API integration\n\n**Backend Development**\n- Node.js and Express.js\n- RESTful API design and authentication\n- MySQL database design\n- Deployment and DevOps basics\n\n**Projects**\n- Portfolio website\n- E-commerce application\n- Social media dashboard\n- Real-time chat application\n\nBy the end of this course, you will have a portfolio of 12 projects and the skills to land your first developer role.',
    'Priya Sharma',
    'Senior Software Engineer at Google with 10+ years of experience in full-stack development. Previously led engineering teams at Flipkart and Razorpay. Passionate about making tech education accessible.',
    80,
    4999.00,
    9999.00,
    'PUBLISHED',
    true,
    1,
    '["Build complete web applications from scratch", "Master React, Node.js, and MySQL", "Design and consume RESTful APIs", "Deploy applications to production", "Write clean, maintainable code"]',
    '["Basic computer literacy", "No prior programming experience required"]',
    'BEGINNER'
),
(
    'Data Science with Python',
    'data-science-with-python',
    'Master data analysis, machine learning, and visualization with Python. From pandas to production ML models.',
    'Dive deep into the world of data science with this hands-on course.\n\n**Core Python**\n- Python fundamentals for data science\n- NumPy, Pandas, and data manipulation\n- Data cleaning and preprocessing\n\n**Visualization & Analysis**\n- Matplotlib and Seaborn\n- Statistical analysis\n- Exploratory data analysis techniques\n\n**Machine Learning**\n- Scikit-learn fundamentals\n- Supervised and unsupervised learning\n- Model evaluation and tuning\n- Real-world ML projects\n\nIncludes 8 capstone projects using real datasets from Kaggle.',
    'Dr. Arjun Mehta',
    'Data Science Lead at Microsoft Research India. PhD in Machine Learning from IIT Bombay. Published researcher with 15+ papers in top-tier conferences. Has trained 5,000+ students in data science.',
    60,
    3999.00,
    7999.00,
    'PUBLISHED',
    true,
    2,
    '["Perform end-to-end data analysis", "Build and deploy machine learning models", "Create compelling data visualizations", "Work with real-world datasets", "Understand statistical foundations"]',
    '["Basic programming knowledge helpful", "High school mathematics"]',
    'INTERMEDIATE'
),
(
    'Digital Marketing Masterclass',
    'digital-marketing-masterclass',
    'Learn SEO, social media marketing, Google Ads, content strategy, and analytics to grow any business online.',
    'Become a complete digital marketer with this industry-relevant masterclass.\n\n**Search Engine Optimization**\n- Technical SEO and site audits\n- Keyword research and content optimization\n- Link building strategies\n\n**Paid Advertising**\n- Google Ads (Search, Display, YouTube)\n- Facebook and Instagram advertising\n- Campaign optimization and A/B testing\n\n**Content & Social Media**\n- Content marketing strategy\n- Social media management\n- Email marketing automation\n\n**Analytics & Strategy**\n- Google Analytics 4\n- Marketing funnels and conversion optimization\n- Marketing strategy and budgeting',
    'Neha Kapoor',
    'CMO at a leading D2C brand. Previously ran digital marketing for Nykaa and Swiggy. Google and Meta certified trainer with a track record of scaling startups from 0 to 10M users.',
    45,
    2999.00,
    5999.00,
    'PUBLISHED',
    true,
    3,
    '["Create comprehensive digital marketing strategies", "Run profitable Google and Meta ad campaigns", "Optimize websites for search engines", "Build and grow social media presence", "Analyze marketing metrics and ROI"]',
    '["No prior marketing experience needed", "Access to a computer with internet"]',
    'BEGINNER'
),
(
    'Cloud Architecture with AWS',
    'cloud-architecture-with-aws',
    'Design, deploy, and manage scalable cloud infrastructure on AWS. Prepare for the AWS Solutions Architect certification.',
    'Master cloud computing with Amazon Web Services in this comprehensive course.\n\n**AWS Core Services**\n- EC2, S3, RDS, Lambda\n- VPC networking and security groups\n- IAM roles and policies\n\n**Architecture Patterns**\n- High availability and fault tolerance\n- Microservices and serverless\n- Cost optimization strategies\n\n**DevOps & Deployment**\n- CI/CD with CodePipeline\n- Infrastructure as Code with CloudFormation\n- Container orchestration with ECS/EKS\n\n**Security & Compliance**\n- AWS security best practices\n- Data encryption and key management\n- Compliance frameworks\n\nIncludes hands-on labs and a practice exam for AWS certification.',
    'Rahul Verma',
    'Principal Cloud Architect at Amazon Web Services. 12+ years in cloud infrastructure. AWS Hero and re:Invent speaker. Has designed cloud solutions processing 100M+ requests daily.',
    55,
    5999.00,
    11999.00,
    'PUBLISHED',
    false,
    4,
    '["Design scalable AWS architectures", "Implement security best practices", "Optimize cloud costs", "Deploy production workloads", "Prepare for AWS Solutions Architect exam"]',
    '["Basic understanding of networking", "Some Linux command-line experience"]',
    'ADVANCED'
);

-- Course Sections and Lessons for the first course
INSERT INTO course_sections (course_id, title, description, sort_order) VALUES
(1, 'Getting Started', 'Set up your development environment and write your first code.', 1),
(1, 'HTML & CSS Foundations', 'Master the building blocks of the web.', 2),
(1, 'JavaScript Deep Dive', 'Learn modern JavaScript from basics to advanced concepts.', 3),
(1, 'React Development', 'Build dynamic user interfaces with React.', 4);

INSERT INTO lessons (section_id, course_id, title, description, content_type, video_duration_seconds, sort_order, is_preview, is_mandatory) VALUES
(1, 1, 'Welcome to the Bootcamp', 'Course overview, what you will learn, and how to get the most out of this program.', 'VIDEO', 600, 1, true, false),
(1, 1, 'Setting Up Your Development Environment', 'Install VS Code, Node.js, Git, and essential extensions.', 'VIDEO', 1200, 2, true, true),
(1, 1, 'Your First HTML Page', 'Create and open your first webpage in a browser.', 'VIDEO', 900, 3, false, true),
(2, 1, 'HTML Document Structure', 'Understanding doctypes, heads, bodies, and semantic elements.', 'VIDEO', 1500, 1, false, true),
(2, 1, 'CSS Selectors and Properties', 'Master CSS selectors, the box model, and common properties.', 'VIDEO', 1800, 2, false, true),
(2, 1, 'Responsive Design with Flexbox', 'Create flexible layouts that work on any screen size.', 'VIDEO', 2100, 3, false, true),
(3, 1, 'JavaScript Basics', 'Variables, data types, operators, and control flow.', 'VIDEO', 2400, 1, false, true),
(3, 1, 'Functions and Scope', 'Arrow functions, closures, and scope chains.', 'VIDEO', 1800, 2, false, true),
(3, 1, 'Async JavaScript', 'Promises, async/await, and fetch API.', 'VIDEO', 2100, 3, false, true),
(4, 1, 'Introduction to React', 'Components, JSX, and the virtual DOM.', 'VIDEO', 1500, 1, false, true),
(4, 1, 'State and Props', 'Managing data flow in React applications.', 'VIDEO', 2100, 2, false, true),
(4, 1, 'Building a Complete Project', 'Put it all together with a full-stack capstone project.', 'VIDEO', 3600, 3, false, true);

-- Quiz for first course
INSERT INTO quizzes (course_id, title, description, passing_score, is_required, sort_order) VALUES
(1, 'Full-Stack Fundamentals Assessment', 'Test your knowledge of HTML, CSS, JavaScript, and React fundamentals.', 70, true, 1);

INSERT INTO quiz_questions (quiz_id, question_text, question_type, explanation, points, sort_order) VALUES
(1, 'What does HTML stand for?', 'SINGLE_CHOICE', 'HTML stands for HyperText Markup Language, the standard markup language for creating web pages.', 1, 1),
(1, 'Which CSS property is used to create space between the element''s border and inner content?', 'SINGLE_CHOICE', 'Padding creates space between the content and the border, while margin creates space outside the border.', 1, 2),
(1, 'What is the correct way to declare a constant in modern JavaScript?', 'SINGLE_CHOICE', 'The const keyword declares a block-scoped constant. Its value cannot be reassigned after initialization.', 1, 3),
(1, 'In React, what hook is used to manage component state?', 'SINGLE_CHOICE', 'useState is the built-in React hook for adding state to functional components.', 1, 4),
(1, 'Which of the following are valid HTTP methods?', 'MULTIPLE_CHOICE', 'GET, POST, PUT, PATCH, and DELETE are all valid HTTP methods used in RESTful APIs.', 2, 5);

-- Answer options
INSERT INTO answer_options (question_id, option_text, is_correct, sort_order) VALUES
-- Q1: HTML
(1, 'HyperText Markup Language', true, 1),
(1, 'High-Level Text Machine Language', false, 2),
(1, 'HyperTransfer Markup Language', false, 3),
(1, 'Home Tool Markup Language', false, 4),
-- Q2: CSS padding
(2, 'padding', true, 1),
(2, 'margin', false, 2),
(2, 'border-spacing', false, 3),
(2, 'gap', false, 4),
-- Q3: const
(3, 'const x = 10', true, 1),
(3, 'var x = 10', false, 2),
(3, 'constant x = 10', false, 3),
(3, 'define x = 10', false, 4),
-- Q4: useState
(4, 'useState', true, 1),
(4, 'useRef', false, 2),
(4, 'useEffect', false, 3),
(4, 'useMemo', false, 4),
-- Q5: HTTP methods (multiple correct)
(5, 'GET', true, 1),
(5, 'POST', true, 2),
(5, 'SEND', false, 3),
(5, 'DELETE', true, 4);
