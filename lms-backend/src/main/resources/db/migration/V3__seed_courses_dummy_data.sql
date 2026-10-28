-- =========================================================================
-- V3__seed_courses_dummy_data.sql
-- Add comprehensive dummy curriculum (sections, lessons, and quizzes)
-- for all remaining seeded courses so every course is fully testable.
-- =========================================================================

-- 1. Update thumbnails and instructor avatars for courses
UPDATE courses
SET thumbnail_url = 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80',
    instructor_avatar = 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80'
WHERE slug = 'full-stack-web-development-bootcamp' AND (thumbnail_url IS NULL OR thumbnail_url = '');

UPDATE courses
SET thumbnail_url = 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
    instructor_avatar = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'
WHERE slug = 'data-science-with-python' AND (thumbnail_url IS NULL OR thumbnail_url = '');

UPDATE courses
SET thumbnail_url = 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
    instructor_avatar = 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&q=80'
WHERE slug = 'digital-marketing-masterclass' AND (thumbnail_url IS NULL OR thumbnail_url = '');

UPDATE courses
SET thumbnail_url = 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80',
    instructor_avatar = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80'
WHERE slug = 'cloud-architecture-with-aws' AND (thumbnail_url IS NULL OR thumbnail_url = '');

-- Update video URLs for Course 1 lessons if missing
UPDATE lessons
SET video_url = 'https://www.youtube.com/embed/nu_pCVPKzTk',
    content_text = 'Welcome to the Full-Stack Bootcamp! In this introductory lecture, we explore the modern web development ecosystem and outline our roadmap.'
WHERE course_id = 1 AND sort_order = 1 AND (video_url IS NULL OR video_url = '');

UPDATE lessons
SET video_url = 'https://www.youtube.com/embed/VqCgcpAypFQ',
    content_text = 'Learn how to install VS Code, Node.js, Git, and configure an efficient developer environment with formatting and linting.'
WHERE course_id = 1 AND sort_order = 2 AND (video_url IS NULL OR video_url = '');

UPDATE lessons
SET video_url = 'https://www.youtube.com/embed/kUMe1FH4CHE',
    content_text = 'Creating your first HTML page. We examine doctype declarations, HTML tags, headings, and paragraph elements.'
WHERE course_id = 1 AND sort_order = 3 AND (video_url IS NULL OR video_url = '');

UPDATE lessons
SET video_url = 'https://www.youtube.com/embed/1Rs2ND1ryYc',
    content_text = 'Semantic HTML: learn when to use header, nav, main, section, article, and footer to build accessible pages.'
WHERE course_id = 1 AND sort_order = 4 AND (video_url IS NULL OR video_url = '');

UPDATE lessons
SET video_url = 'https://www.youtube.com/embed/1Rs2ND1ryYc',
    content_text = 'CSS selectors, specificity, and cascading rules. Understanding the CSS Box Model with margins, padding, and borders.'
WHERE course_id = 1 AND sort_order = 5 AND (video_url IS NULL OR video_url = '');

UPDATE lessons
SET video_url = 'https://www.youtube.com/embed/fYq5PXgSsbE',
    content_text = 'Flexbox layout module deep dive. Master justify-content, align-items, flex-wrap, and build responsive navigation bars.'
WHERE course_id = 1 AND sort_order = 6 AND (video_url IS NULL OR video_url = '');

UPDATE lessons
SET video_url = 'https://www.youtube.com/embed/W6NZfCO5SIk',
    content_text = 'Core JavaScript variables (const, let), primitives, types, conditional branches, loops, and clean coding habits.'
WHERE course_id = 1 AND sort_order = 7 AND (video_url IS NULL OR video_url = '');

UPDATE lessons
SET video_url = 'https://www.youtube.com/embed/W6NZfCO5SIk',
    content_text = 'Arrow functions, higher-order functions (map, filter, reduce), closures, and JavaScript lexical scope.'
WHERE course_id = 1 AND sort_order = 8 AND (video_url IS NULL OR video_url = '');

UPDATE lessons
SET video_url = 'https://www.youtube.com/embed/PoRJizFvM7s',
    content_text = 'Asynchronous JavaScript: Event loop, Promises, async/await syntax, and error handling with try/catch.'
WHERE course_id = 1 AND sort_order = 9 AND (video_url IS NULL OR video_url = '');

UPDATE lessons
SET video_url = 'https://www.youtube.com/embed/bMknfKXIFA8',
    content_text = 'Introduction to React functional components, JSX syntax rules, and component composition.'
WHERE course_id = 1 AND sort_order = 10 AND (video_url IS NULL OR video_url = '');

UPDATE lessons
SET video_url = 'https://www.youtube.com/embed/O6P86uwfdR0',
    content_text = 'State and props in React. Using useState and useEffect to manage component lifecycles and side-effects.'
WHERE course_id = 1 AND sort_order = 11 AND (video_url IS NULL OR video_url = '');

UPDATE lessons
SET video_url = 'https://www.youtube.com/embed/bMknfKXIFA8',
    content_text = 'Building our full-stack capstone web application connecting the React frontend with our REST API backend.'
WHERE course_id = 1 AND sort_order = 12 AND (video_url IS NULL OR video_url = '');


-- =========================================================================
-- COURSE 2: Data Science with Python (slug: 'data-science-with-python')
-- =========================================================================
SET @c2_id = (SELECT id FROM courses WHERE slug = 'data-science-with-python' LIMIT 1);

-- Sections for Course 2
INSERT INTO course_sections (course_id, title, description, sort_order)
SELECT @c2_id, 'Python for Data Science Setup', 'Set up Anaconda, Jupyter Notebooks, and explore Python numerical computing.', 1
WHERE @c2_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM course_sections WHERE course_id = @c2_id AND sort_order = 1);

INSERT INTO course_sections (course_id, title, description, sort_order)
SELECT @c2_id, 'NumPy & High-Performance Arrays', 'Master N-dimensional arrays, vectorized operations, broadcasting, and indexing.', 2
WHERE @c2_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM course_sections WHERE course_id = @c2_id AND sort_order = 2);

INSERT INTO course_sections (course_id, title, description, sort_order)
SELECT @c2_id, 'Data Wrangling with Pandas', 'Work with Series, DataFrames, data cleaning, missing values, and aggregation.', 3
WHERE @c2_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM course_sections WHERE course_id = @c2_id AND sort_order = 3);

INSERT INTO course_sections (course_id, title, description, sort_order)
SELECT @c2_id, 'Visualization & Machine Learning', 'Exploratory data analysis with Matplotlib/Seaborn and introductory Scikit-Learn models.', 4
WHERE @c2_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM course_sections WHERE course_id = @c2_id AND sort_order = 4);

-- Capture Section IDs for Course 2
SET @c2_s1 = (SELECT id FROM course_sections WHERE course_id = @c2_id AND sort_order = 1 LIMIT 1);
SET @c2_s2 = (SELECT id FROM course_sections WHERE course_id = @c2_id AND sort_order = 2 LIMIT 1);
SET @c2_s3 = (SELECT id FROM course_sections WHERE course_id = @c2_id AND sort_order = 3 LIMIT 1);
SET @c2_s4 = (SELECT id FROM course_sections WHERE course_id = @c2_id AND sort_order = 4 LIMIT 1);

-- Lessons for Course 2
INSERT INTO lessons (section_id, course_id, title, description, content_type, video_url, video_duration_seconds, content_text, sort_order, is_preview, is_mandatory)
SELECT @c2_s1, @c2_id, 'Data Science Roadmap & Python Environment', 'Overview of the data science lifecycle, tools, and configuring Jupyter Notebooks.', 'VIDEO', 'https://www.youtube.com/embed/rfscVS0vtbw', 900, 'Welcome to Data Science with Python. We set up Anaconda, JupyterLab, and tour the data science ecosystem.', 1, true, false
WHERE @c2_id IS NOT NULL AND @c2_s1 IS NOT NULL AND NOT EXISTS (SELECT 1 FROM lessons WHERE course_id = @c2_id AND title = 'Data Science Roadmap & Python Environment');

INSERT INTO lessons (section_id, course_id, title, description, content_type, video_url, video_duration_seconds, content_text, sort_order, is_preview, is_mandatory)
SELECT @c2_s1, @c2_id, 'Jupyter Notebooks & Virtual Environments', 'Master keyboard shortcuts, markdown cells, kernel management, and pip/conda.', 'VIDEO', 'https://www.youtube.com/embed/HW29067qVWk', 1200, 'Learn how to utilize Jupyter Notebooks effectively for iterative exploratory research and reproducibility.', 2, true, true
WHERE @c2_id IS NOT NULL AND @c2_s1 IS NOT NULL AND NOT EXISTS (SELECT 1 FROM lessons WHERE course_id = @c2_id AND title = 'Jupyter Notebooks & Virtual Environments');

INSERT INTO lessons (section_id, course_id, title, description, content_type, video_url, video_duration_seconds, content_text, sort_order, is_preview, is_mandatory)
SELECT @c2_s2, @c2_id, 'NumPy Arrays & Vectorization', 'Learn array creation, indexing, slicing, and why vectorization is 100x faster than loops.', 'VIDEO', 'https://www.youtube.com/embed/QUT1VHiLmmI', 1800, 'In-depth tutorial on NumPy arrays, dtypes, shape manipulation, and mathematical matrix operations.', 3, false, true
WHERE @c2_id IS NOT NULL AND @c2_s2 IS NOT NULL AND NOT EXISTS (SELECT 1 FROM lessons WHERE course_id = @c2_id AND title = 'NumPy Arrays & Vectorization');

INSERT INTO lessons (section_id, course_id, title, description, content_type, video_url, video_duration_seconds, content_text, sort_order, is_preview, is_mandatory)
SELECT @c2_s2, @c2_id, 'Broadcasting & Mathematical Computations', 'Master NumPy broadcasting rules, universal functions (ufuncs), and linear algebra.', 'VIDEO', 'https://www.youtube.com/embed/QUT1VHiLmmI', 1500, 'Understand how NumPy handles arrays of differing shapes during arithmetic operations and elementwise transforms.', 4, false, true
WHERE @c2_id IS NOT NULL AND @c2_s2 IS NOT NULL AND NOT EXISTS (SELECT 1 FROM lessons WHERE course_id = @c2_id AND title = 'Broadcasting & Mathematical Computations');

INSERT INTO lessons (section_id, course_id, title, description, content_type, video_url, video_duration_seconds, content_text, sort_order, is_preview, is_mandatory)
SELECT @c2_s3, @c2_id, 'Pandas DataFrames & Series Essentials', 'Learn to load CSV/Excel files into DataFrames, inspect data, and slice rows/columns.', 'VIDEO', 'https://www.youtube.com/embed/vmEHCJofslg', 2100, 'Deep dive into Pandas structures: Series and DataFrames, loc vs iloc indexers, and summary statistics.', 5, false, true
WHERE @c2_id IS NOT NULL AND @c2_s3 IS NOT NULL AND NOT EXISTS (SELECT 1 FROM lessons WHERE course_id = @c2_id AND title = 'Pandas DataFrames & Series Essentials');

INSERT INTO lessons (section_id, course_id, title, description, content_type, video_url, video_duration_seconds, content_text, sort_order, is_preview, is_mandatory)
SELECT @c2_s3, @c2_id, 'Data Cleaning & Missing Value Imputation', 'Handle null values, deduplicate records, string transformations, and date parsing.', 'VIDEO', 'https://www.youtube.com/embed/bDhvCp3_lYw', 1800, 'Real-world data is messy. Learn dropna, fillna, interpolate, and data quality validation methods.', 6, false, true
WHERE @c2_id IS NOT NULL AND @c2_s3 IS NOT NULL AND NOT EXISTS (SELECT 1 FROM lessons WHERE course_id = @c2_id AND title = 'Data Cleaning & Missing Value Imputation');

INSERT INTO lessons (section_id, course_id, title, description, content_type, video_url, video_duration_seconds, content_text, sort_order, is_preview, is_mandatory)
SELECT @c2_s3, @c2_id, 'Advanced GroupBy & Aggregations', 'Split-Apply-Combine pattern, pivot tables, multi-indexing, and window functions.', 'VIDEO', 'https://www.youtube.com/embed/W9XjRYFkkyw', 2400, 'Master the GroupBy method for summarizing metrics, calculating rolling averages, and custom aggregations.', 7, false, true
WHERE @c2_id IS NOT NULL AND @c2_s3 IS NOT NULL AND NOT EXISTS (SELECT 1 FROM lessons WHERE course_id = @c2_id AND title = 'Advanced GroupBy & Aggregations');

INSERT INTO lessons (section_id, course_id, title, description, content_type, video_url, video_duration_seconds, content_text, sort_order, is_preview, is_mandatory)
SELECT @c2_s4, @c2_id, 'Visualizing Insights with Matplotlib & Seaborn', 'Create bar charts, histograms, heatmaps, scatter plots, and custom styling themes.', 'VIDEO', 'https://www.youtube.com/embed/UO98lJQ3QGI', 2100, 'Learn how to present actionable insights through clear, beautiful, and statistically informative visualizations.', 8, false, true
WHERE @c2_id IS NOT NULL AND @c2_s4 IS NOT NULL AND NOT EXISTS (SELECT 1 FROM lessons WHERE course_id = @c2_id AND title = 'Visualizing Insights with Matplotlib & Seaborn');

INSERT INTO lessons (section_id, course_id, title, description, content_type, video_url, video_duration_seconds, content_text, sort_order, is_preview, is_mandatory)
SELECT @c2_s4, @c2_id, 'Machine Learning: Scikit-Learn Pipelines', 'Train your first predictive model: train-test split, feature scaling, and evaluation.', 'VIDEO', 'https://www.youtube.com/embed/7eh4d6sabA0', 2700, 'Introduction to Scikit-Learn: building regression and classification pipelines, and calculating accuracy and RMSE.', 9, false, true
WHERE @c2_id IS NOT NULL AND @c2_s4 IS NOT NULL AND NOT EXISTS (SELECT 1 FROM lessons WHERE course_id = @c2_id AND title = 'Machine Learning: Scikit-Learn Pipelines');

-- Quiz for Course 2
INSERT INTO quizzes (course_id, title, description, passing_score, is_required, sort_order)
SELECT @c2_id, 'Data Science with Python Certification Exam', 'Test your understanding of NumPy arrays, Pandas operations, and Machine Learning fundamentals.', 70, true, 1
WHERE @c2_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM quizzes WHERE course_id = @c2_id);

SET @c2_q_id = (SELECT id FROM quizzes WHERE course_id = @c2_id LIMIT 1);

-- Quiz Questions for Course 2
INSERT INTO quiz_questions (quiz_id, question_text, question_type, explanation, points, sort_order)
SELECT @c2_q_id, 'Which NumPy function is used to create an array of evenly spaced values within a specified interval?', 'SINGLE_CHOICE', 'np.linspace creates evenly spaced numbers over a specified interval, while np.arange uses a step size.', 1, 1
WHERE @c2_q_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM quiz_questions WHERE quiz_id = @c2_q_id AND sort_order = 1);

INSERT INTO quiz_questions (quiz_id, question_text, question_type, explanation, points, sort_order)
SELECT @c2_q_id, 'In Pandas, what is the difference between .loc and .iloc?', 'SINGLE_CHOICE', '.loc accesses rows and columns by label/names, while .iloc accesses by integer position.', 1, 2
WHERE @c2_q_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM quiz_questions WHERE quiz_id = @c2_q_id AND sort_order = 2);

INSERT INTO quiz_questions (quiz_id, question_text, question_type, explanation, points, sort_order)
SELECT @c2_q_id, 'Which method is used in Pandas to impute or replace missing NaN values?', 'SINGLE_CHOICE', 'fillna() is specifically used to fill NA/NaN values using the specified method or value.', 1, 3
WHERE @c2_q_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM quiz_questions WHERE quiz_id = @c2_q_id AND sort_order = 3);

INSERT INTO quiz_questions (quiz_id, question_text, question_type, explanation, points, sort_order)
SELECT @c2_q_id, 'Which of the following are supervised machine learning algorithms available in Scikit-Learn?', 'MULTIPLE_CHOICE', 'LinearRegression and RandomForestClassifier are supervised models. K-Means and DBSCAN are unsupervised clustering algorithms.', 2, 4
WHERE @c2_q_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM quiz_questions WHERE quiz_id = @c2_q_id AND sort_order = 4);

INSERT INTO quiz_questions (quiz_id, question_text, question_type, explanation, points, sort_order)
SELECT @c2_q_id, 'What metric is best suited to evaluate a classification model on an imbalanced dataset?', 'SINGLE_CHOICE', 'F1-Score (or PR AUC) accounts for both precision and recall on imbalanced datasets, whereas raw accuracy can be misleading.', 1, 5
WHERE @c2_q_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM quiz_questions WHERE quiz_id = @c2_q_id AND sort_order = 5);

-- Answer Options for Course 2 Questions
SET @q2_1 = (SELECT id FROM quiz_questions WHERE quiz_id = @c2_q_id AND sort_order = 1 LIMIT 1);
SET @q2_2 = (SELECT id FROM quiz_questions WHERE quiz_id = @c2_q_id AND sort_order = 2 LIMIT 1);
SET @q2_3 = (SELECT id FROM quiz_questions WHERE quiz_id = @c2_q_id AND sort_order = 3 LIMIT 1);
SET @q2_4 = (SELECT id FROM quiz_questions WHERE quiz_id = @c2_q_id AND sort_order = 4 LIMIT 1);
SET @q2_5 = (SELECT id FROM quiz_questions WHERE quiz_id = @c2_q_id AND sort_order = 5 LIMIT 1);

INSERT INTO answer_options (question_id, option_text, is_correct, sort_order)
SELECT @q2_1, 'np.linspace', true, 1 WHERE @q2_1 IS NOT NULL AND NOT EXISTS (SELECT 1 FROM answer_options WHERE question_id = @q2_1);
INSERT INTO answer_options (question_id, option_text, is_correct, sort_order)
SELECT @q2_1, 'np.zeros', false, 2 WHERE @q2_1 IS NOT NULL AND NOT EXISTS (SELECT 1 FROM answer_options WHERE question_id = @q2_1 AND sort_order = 2);
INSERT INTO answer_options (question_id, option_text, is_correct, sort_order)
SELECT @q2_1, 'np.empty', false, 3 WHERE @q2_1 IS NOT NULL AND NOT EXISTS (SELECT 1 FROM answer_options WHERE question_id = @q2_1 AND sort_order = 3);
INSERT INTO answer_options (question_id, option_text, is_correct, sort_order)
SELECT @q2_1, 'np.shape', false, 4 WHERE @q2_1 IS NOT NULL AND NOT EXISTS (SELECT 1 FROM answer_options WHERE question_id = @q2_1 AND sort_order = 4);

INSERT INTO answer_options (question_id, option_text, is_correct, sort_order)
SELECT @q2_2, '.loc is label-based, whereas .iloc is integer position-based', true, 1 WHERE @q2_2 IS NOT NULL AND NOT EXISTS (SELECT 1 FROM answer_options WHERE question_id = @q2_2);
INSERT INTO answer_options (question_id, option_text, is_correct, sort_order)
SELECT @q2_2, '.loc is integer-based, whereas .iloc is label-based', false, 2 WHERE @q2_2 IS NOT NULL AND NOT EXISTS (SELECT 1 FROM answer_options WHERE question_id = @q2_2 AND sort_order = 2);
INSERT INTO answer_options (question_id, option_text, is_correct, sort_order)
SELECT @q2_2, 'Both .loc and .iloc behave identically in modern Pandas versions', false, 3 WHERE @q2_2 IS NOT NULL AND NOT EXISTS (SELECT 1 FROM answer_options WHERE question_id = @q2_2 AND sort_order = 3);
INSERT INTO answer_options (question_id, option_text, is_correct, sort_order)
SELECT @q2_2, '.loc only works on columns, while .iloc only works on rows', false, 4 WHERE @q2_2 IS NOT NULL AND NOT EXISTS (SELECT 1 FROM answer_options WHERE question_id = @q2_2 AND sort_order = 4);

INSERT INTO answer_options (question_id, option_text, is_correct, sort_order)
SELECT @q2_3, 'df.fillna()', true, 1 WHERE @q2_3 IS NOT NULL AND NOT EXISTS (SELECT 1 FROM answer_options WHERE question_id = @q2_3);
INSERT INTO answer_options (question_id, option_text, is_correct, sort_order)
SELECT @q2_3, 'df.replace_null()', false, 2 WHERE @q2_3 IS NOT NULL AND NOT EXISTS (SELECT 1 FROM answer_options WHERE question_id = @q2_3 AND sort_order = 2);
INSERT INTO answer_options (question_id, option_text, is_correct, sort_order)
SELECT @q2_3, 'df.clean()', false, 3 WHERE @q2_3 IS NOT NULL AND NOT EXISTS (SELECT 1 FROM answer_options WHERE question_id = @q2_3 AND sort_order = 3);
INSERT INTO answer_options (question_id, option_text, is_correct, sort_order)
SELECT @q2_3, 'df.dropna()', false, 4 WHERE @q2_3 IS NOT NULL AND NOT EXISTS (SELECT 1 FROM answer_options WHERE question_id = @q2_3 AND sort_order = 4);

INSERT INTO answer_options (question_id, option_text, is_correct, sort_order)
SELECT @q2_4, 'LinearRegression', true, 1 WHERE @q2_4 IS NOT NULL AND NOT EXISTS (SELECT 1 FROM answer_options WHERE question_id = @q2_4);
INSERT INTO answer_options (question_id, option_text, is_correct, sort_order)
SELECT @q2_4, 'RandomForestClassifier', true, 2 WHERE @q2_4 IS NOT NULL AND NOT EXISTS (SELECT 1 FROM answer_options WHERE question_id = @q2_4 AND sort_order = 2);
INSERT INTO answer_options (question_id, option_text, is_correct, sort_order)
SELECT @q2_4, 'KMeans', false, 3 WHERE @q2_4 IS NOT NULL AND NOT EXISTS (SELECT 1 FROM answer_options WHERE question_id = @q2_4 AND sort_order = 3);
INSERT INTO answer_options (question_id, option_text, is_correct, sort_order)
SELECT @q2_4, 'DBSCAN', false, 4 WHERE @q2_4 IS NOT NULL AND NOT EXISTS (SELECT 1 FROM answer_options WHERE question_id = @q2_4 AND sort_order = 4);

INSERT INTO answer_options (question_id, option_text, is_correct, sort_order)
SELECT @q2_5, 'F1-Score', true, 1 WHERE @q2_5 IS NOT NULL AND NOT EXISTS (SELECT 1 FROM answer_options WHERE question_id = @q2_5);
INSERT INTO answer_options (question_id, option_text, is_correct, sort_order)
SELECT @q2_5, 'Raw Accuracy', false, 2 WHERE @q2_5 IS NOT NULL AND NOT EXISTS (SELECT 1 FROM answer_options WHERE question_id = @q2_5 AND sort_order = 2);
INSERT INTO answer_options (question_id, option_text, is_correct, sort_order)
SELECT @q2_5, 'Mean Squared Error', false, 3 WHERE @q2_5 IS NOT NULL AND NOT EXISTS (SELECT 1 FROM answer_options WHERE question_id = @q2_5 AND sort_order = 3);
INSERT INTO answer_options (question_id, option_text, is_correct, sort_order)
SELECT @q2_5, 'R-squared (R2)', false, 4 WHERE @q2_5 IS NOT NULL AND NOT EXISTS (SELECT 1 FROM answer_options WHERE question_id = @q2_5 AND sort_order = 4);


-- =========================================================================
-- COURSE 3: Digital Marketing Masterclass (slug: 'digital-marketing-masterclass')
-- =========================================================================
SET @c3_id = (SELECT id FROM courses WHERE slug = 'digital-marketing-masterclass' LIMIT 1);

-- Sections for Course 3
INSERT INTO course_sections (course_id, title, description, sort_order)
SELECT @c3_id, 'Digital Marketing Strategy & Tracking', 'Learn modern marketing funnels, buyer personas, and Google Analytics 4 tracking.', 1
WHERE @c3_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM course_sections WHERE course_id = @c3_id AND sort_order = 1);

INSERT INTO course_sections (course_id, title, description, sort_order)
SELECT @c3_id, 'Search Engine Optimization (SEO)', 'Keyword research, on-page content architecture, technical audits, and link acquisition.', 2
WHERE @c3_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM course_sections WHERE course_id = @c3_id AND sort_order = 2);

INSERT INTO course_sections (course_id, title, description, sort_order)
SELECT @c3_id, 'Paid Advertising & Performance Marketing', 'Google Ads, Meta Advertising, bid strategies, and ROAS optimization.', 3
WHERE @c3_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM course_sections WHERE course_id = @c3_id AND sort_order = 3);

INSERT INTO course_sections (course_id, title, description, sort_order)
SELECT @c3_id, 'Content & Email Marketing Automation', 'Craft high-converting copy, viral social distribution, and automated email nurturing funnels.', 4
WHERE @c3_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM course_sections WHERE course_id = @c3_id AND sort_order = 4);

-- Capture Section IDs for Course 3
SET @c3_s1 = (SELECT id FROM course_sections WHERE course_id = @c3_id AND sort_order = 1 LIMIT 1);
SET @c3_s2 = (SELECT id FROM course_sections WHERE course_id = @c3_id AND sort_order = 2 LIMIT 1);
SET @c3_s3 = (SELECT id FROM course_sections WHERE course_id = @c3_id AND sort_order = 3 LIMIT 1);
SET @c3_s4 = (SELECT id FROM course_sections WHERE course_id = @c3_id AND sort_order = 4 LIMIT 1);

-- Lessons for Course 3
INSERT INTO lessons (section_id, course_id, title, description, content_type, video_url, video_duration_seconds, content_text, sort_order, is_preview, is_mandatory)
SELECT @c3_s1, @c3_id, 'Modern Marketing Landscape & Funnels', 'Understand TOFU, MOFU, BOFU funnels and how prospective customers discover brands.', 'VIDEO', 'https://www.youtube.com/embed/nU-IIXBWlS4', 900, 'Welcome to the Digital Marketing Masterclass. We break down omnichannel acquisition channels and customer journeys.', 1, true, false
WHERE @c3_id IS NOT NULL AND @c3_s1 IS NOT NULL AND NOT EXISTS (SELECT 1 FROM lessons WHERE course_id = @c3_id AND title = 'Modern Marketing Landscape & Funnels');

INSERT INTO lessons (section_id, course_id, title, description, content_type, video_url, video_duration_seconds, content_text, sort_order, is_preview, is_mandatory)
SELECT @c3_s1, @c3_id, 'Target Audience & Customer Persona Mapping', 'Build data-backed buyer personas, analyze demographics, intent, and pain points.', 'VIDEO', 'https://www.youtube.com/embed/1O_uKqR-n6w', 1200, 'Learn how to construct detailed buyer persona profiles to optimize ad targeting and copywriting resonance.', 2, true, true
WHERE @c3_id IS NOT NULL AND @c3_s1 IS NOT NULL AND NOT EXISTS (SELECT 1 FROM lessons WHERE course_id = @c3_id AND title = 'Target Audience & Customer Persona Mapping');

INSERT INTO lessons (section_id, course_id, title, description, content_type, video_url, video_duration_seconds, content_text, sort_order, is_preview, is_mandatory)
SELECT @c3_s2, @c3_id, 'Keyword Research & Search Intent', 'Find high-volume, low-competition keywords using Semrush, Ahrefs, and Google Keyword Planner.', 'VIDEO', 'https://www.youtube.com/embed/DvwS7cV9GmQ', 1800, 'Master keyword research: navigational, informational, commercial, and transactional search intents.', 3, false, true
WHERE @c3_id IS NOT NULL AND @c3_s2 IS NOT NULL AND NOT EXISTS (SELECT 1 FROM lessons WHERE course_id = @c3_id AND title = 'Keyword Research & Search Intent');

INSERT INTO lessons (section_id, course_id, title, description, content_type, video_url, video_duration_seconds, content_text, sort_order, is_preview, is_mandatory)
SELECT @c3_s2, @c3_id, 'On-Page SEO & Content Optimization', 'Optimize title tags, meta descriptions, heading tags (H1-H3), and internal linking structures.', 'VIDEO', 'https://www.youtube.com/embed/433XyI231o8', 2100, 'Step-by-step audit of on-page elements, image alt text, URL structure, and Core Web Vitals optimization.', 4, false, true
WHERE @c3_id IS NOT NULL AND @c3_s2 IS NOT NULL AND NOT EXISTS (SELECT 1 FROM lessons WHERE course_id = @c3_id AND title = 'On-Page SEO & Content Optimization');

INSERT INTO lessons (section_id, course_id, title, description, content_type, video_url, video_duration_seconds, content_text, sort_order, is_preview, is_mandatory)
SELECT @c3_s3, @c3_id, 'Google Search & Display Advertising', 'Create profitable Google Search campaigns, match types, ad extensions, and Quality Score.', 'VIDEO', 'https://www.youtube.com/embed/a9n_yL_B_i8', 2400, 'Comprehensive guide to building Google Ads campaigns, understanding CPC bidding, and negative keywords.', 5, false, true
WHERE @c3_id IS NOT NULL AND @c3_s3 IS NOT NULL AND NOT EXISTS (SELECT 1 FROM lessons WHERE course_id = @c3_id AND title = 'Google Search & Display Advertising');

INSERT INTO lessons (section_id, course_id, title, description, content_type, video_url, video_duration_seconds, content_text, sort_order, is_preview, is_mandatory)
SELECT @c3_s3, @c3_id, 'Meta Ads (Facebook & Instagram) Growth', 'Meta Business Suite, pixel setup, custom audiences, lookalike audiences, and ad creative.', 'VIDEO', 'https://www.youtube.com/embed/dF1A7wXyQ4I', 2700, 'Master paid social marketing on Instagram & Facebook. Understand Advantage+ campaigns and creative testing.', 6, false, true
WHERE @c3_id IS NOT NULL AND @c3_s3 IS NOT NULL AND NOT EXISTS (SELECT 1 FROM lessons WHERE course_id = @c3_id AND title = 'Meta Ads (Facebook & Instagram) Growth');

INSERT INTO lessons (section_id, course_id, title, description, content_type, video_url, video_duration_seconds, content_text, sort_order, is_preview, is_mandatory)
SELECT @c3_s4, @c3_id, 'Email Marketing Automation & Sequences', 'Welcome series, abandoned cart recovery, customer segmentation, and newsletter strategy.', 'VIDEO', 'https://www.youtube.com/embed/c0_J1Qp05xU', 2100, 'Email delivers the highest ROI of any digital channel. Learn automated workflow triggers and deliverability best practices.', 7, false, true
WHERE @c3_id IS NOT NULL AND @c3_s4 IS NOT NULL AND NOT EXISTS (SELECT 1 FROM lessons WHERE course_id = @c3_id AND title = 'Email Marketing Automation & Sequences');

INSERT INTO lessons (section_id, course_id, title, description, content_type, video_url, video_duration_seconds, content_text, sort_order, is_preview, is_mandatory)
SELECT @c3_s4, @c3_id, 'Analytics, CAC, LTV & Growth Capstone', 'Measure Customer Acquisition Cost (CAC), Lifetime Value (LTV), ROAS, and scale campaigns.', 'VIDEO', 'https://www.youtube.com/embed/oZ4P1q5c0gU', 3000, 'Unify metrics into an executive dashboard. Calculate blended marketing efficiency ratios (MER) and scale revenue.', 8, false, true
WHERE @c3_id IS NOT NULL AND @c3_s4 IS NOT NULL AND NOT EXISTS (SELECT 1 FROM lessons WHERE course_id = @c3_id AND title = 'Analytics, CAC, LTV & Growth Capstone');

-- Quiz for Course 3
INSERT INTO quizzes (course_id, title, description, passing_score, is_required, sort_order)
SELECT @c3_id, 'Digital Marketing Masterclass Certification Exam', 'Validate your expertise in SEO, PPC bidding, email marketing, and conversion optimization.', 70, true, 1
WHERE @c3_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM quizzes WHERE course_id = @c3_id);

SET @c3_q_id = (SELECT id FROM quizzes WHERE course_id = @c3_id LIMIT 1);

-- Quiz Questions for Course 3
INSERT INTO quiz_questions (quiz_id, question_text, question_type, explanation, points, sort_order)
SELECT @c3_q_id, 'What does ROAS stand for in performance marketing?', 'SINGLE_CHOICE', 'ROAS stands for Return On Ad Spend, calculated as Revenue divided by Ad Spend.', 1, 1
WHERE @c3_q_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM quiz_questions WHERE quiz_id = @c3_q_id AND sort_order = 1);

INSERT INTO quiz_questions (quiz_id, question_text, question_type, explanation, points, sort_order)
SELECT @c3_q_id, 'Which HTML tag has the highest SEO impact on organic search ranking for primary keywords?', 'SINGLE_CHOICE', 'The <title> tag in the HTML head is one of the most critical on-page ranking signals for search engines.', 1, 2
WHERE @c3_q_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM quiz_questions WHERE quiz_id = @c3_q_id AND sort_order = 2);

INSERT INTO quiz_questions (quiz_id, question_text, question_type, explanation, points, sort_order)
SELECT @c3_q_id, 'What is the primary objective of a lookalike audience in Meta Ads?', 'SINGLE_CHOICE', 'Lookalike audiences identify new prospective customers who share similar traits and behaviors to your best existing customers.', 1, 3
WHERE @c3_q_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM quiz_questions WHERE quiz_id = @c3_q_id AND sort_order = 3);

INSERT INTO quiz_questions (quiz_id, question_text, question_type, explanation, points, sort_order)
SELECT @c3_q_id, 'Which of the following are components of Google Ads Quality Score?', 'MULTIPLE_CHOICE', 'Quality Score is determined by Expected Click-Through Rate (CTR), Ad Relevance, and Landing Page Experience.', 2, 4
WHERE @c3_q_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM quiz_questions WHERE quiz_id = @c3_q_id AND sort_order = 4);

INSERT INTO quiz_questions (quiz_id, question_text, question_type, explanation, points, sort_order)
SELECT @c3_q_id, 'If you spend $1,000 on ads and generate $5,000 in attributed revenue, what is your ROAS?', 'SINGLE_CHOICE', 'ROAS = $5,000 / $1,000 = 5.0x (or 500%).', 1, 5
WHERE @c3_q_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM quiz_questions WHERE quiz_id = @c3_q_id AND sort_order = 5);

-- Answer Options for Course 3
SET @q3_1 = (SELECT id FROM quiz_questions WHERE quiz_id = @c3_q_id AND sort_order = 1 LIMIT 1);
SET @q3_2 = (SELECT id FROM quiz_questions WHERE quiz_id = @c3_q_id AND sort_order = 2 LIMIT 1);
SET @q3_3 = (SELECT id FROM quiz_questions WHERE quiz_id = @c3_q_id AND sort_order = 3 LIMIT 1);
SET @q3_4 = (SELECT id FROM quiz_questions WHERE quiz_id = @c3_q_id AND sort_order = 4 LIMIT 1);
SET @q3_5 = (SELECT id FROM quiz_questions WHERE quiz_id = @c3_q_id AND sort_order = 5 LIMIT 1);

INSERT INTO answer_options (question_id, option_text, is_correct, sort_order)
SELECT @q3_1, 'Return On Ad Spend', true, 1 WHERE @q3_1 IS NOT NULL AND NOT EXISTS (SELECT 1 FROM answer_options WHERE question_id = @q3_1);
INSERT INTO answer_options (question_id, option_text, is_correct, sort_order)
SELECT @q3_1, 'Rate Of Acquisition Speed', false, 2 WHERE @q3_1 IS NOT NULL AND NOT EXISTS (SELECT 1 FROM answer_options WHERE question_id = @q3_1 AND sort_order = 2);
INSERT INTO answer_options (question_id, option_text, is_correct, sort_order)
SELECT @q3_1, 'Reach Over Audience Segment', false, 3 WHERE @q3_1 IS NOT NULL AND NOT EXISTS (SELECT 1 FROM answer_options WHERE question_id = @q3_1 AND sort_order = 3);
INSERT INTO answer_options (question_id, option_text, is_correct, sort_order)
SELECT @q3_1, 'Revenue On Account Sales', false, 4 WHERE @q3_1 IS NOT NULL AND NOT EXISTS (SELECT 1 FROM answer_options WHERE question_id = @q3_1 AND sort_order = 4);

INSERT INTO answer_options (question_id, option_text, is_correct, sort_order)
SELECT @q3_2, '<title>', true, 1 WHERE @q3_2 IS NOT NULL AND NOT EXISTS (SELECT 1 FROM answer_options WHERE question_id = @q3_2);
INSERT INTO answer_options (question_id, option_text, is_correct, sort_order)
SELECT @q3_2, '<span>', false, 2 WHERE @q3_2 IS NOT NULL AND NOT EXISTS (SELECT 1 FROM answer_options WHERE question_id = @q3_2 AND sort_order = 2);
INSERT INTO answer_options (question_id, option_text, is_correct, sort_order)
SELECT @q3_2, '<aside>', false, 3 WHERE @q3_2 IS NOT NULL AND NOT EXISTS (SELECT 1 FROM answer_options WHERE question_id = @q3_2 AND sort_order = 3);
INSERT INTO answer_options (question_id, option_text, is_correct, sort_order)
SELECT @q3_2, '<footer>', false, 4 WHERE @q3_2 IS NOT NULL AND NOT EXISTS (SELECT 1 FROM answer_options WHERE question_id = @q3_2 AND sort_order = 4);

INSERT INTO answer_options (question_id, option_text, is_correct, sort_order)
SELECT @q3_3, 'Target new people with profiles similar to existing customers', true, 1 WHERE @q3_3 IS NOT NULL AND NOT EXISTS (SELECT 1 FROM answer_options WHERE question_id = @q3_3);
INSERT INTO answer_options (question_id, option_text, is_correct, sort_order)
SELECT @q3_3, 'Re-target people who already visited your website', false, 2 WHERE @q3_3 IS NOT NULL AND NOT EXISTS (SELECT 1 FROM answer_options WHERE question_id = @q3_3 AND sort_order = 2);
INSERT INTO answer_options (question_id, option_text, is_correct, sort_order)
SELECT @q3_3, 'Email previous buyers with a promotional coupon', false, 3 WHERE @q3_3 IS NOT NULL AND NOT EXISTS (SELECT 1 FROM answer_options WHERE question_id = @q3_3 AND sort_order = 3);
INSERT INTO answer_options (question_id, option_text, is_correct, sort_order)
SELECT @q3_3, 'Target search engine web crawlers', false, 4 WHERE @q3_3 IS NOT NULL AND NOT EXISTS (SELECT 1 FROM answer_options WHERE question_id = @q3_3 AND sort_order = 4);

INSERT INTO answer_options (question_id, option_text, is_correct, sort_order)
SELECT @q3_4, 'Expected Click-Through Rate (CTR)', true, 1 WHERE @q3_4 IS NOT NULL AND NOT EXISTS (SELECT 1 FROM answer_options WHERE question_id = @q3_4);
INSERT INTO answer_options (question_id, option_text, is_correct, sort_order)
SELECT @q3_4, 'Ad Relevance', true, 2 WHERE @q3_4 IS NOT NULL AND NOT EXISTS (SELECT 1 FROM answer_options WHERE question_id = @q3_4 AND sort_order = 2);
INSERT INTO answer_options (question_id, option_text, is_correct, sort_order)
SELECT @q3_4, 'Landing Page Experience', true, 3 WHERE @q3_4 IS NOT NULL AND NOT EXISTS (SELECT 1 FROM answer_options WHERE question_id = @q3_4 AND sort_order = 3);
INSERT INTO answer_options (question_id, option_text, is_correct, sort_order)
SELECT @q3_4, 'The physical address of the company', false, 4 WHERE @q3_4 IS NOT NULL AND NOT EXISTS (SELECT 1 FROM answer_options WHERE question_id = @q3_4 AND sort_order = 4);

INSERT INTO answer_options (question_id, option_text, is_correct, sort_order)
SELECT @q3_5, '5.0x (500%)', true, 1 WHERE @q3_5 IS NOT NULL AND NOT EXISTS (SELECT 1 FROM answer_options WHERE question_id = @q3_5);
INSERT INTO answer_options (question_id, option_text, is_correct, sort_order)
SELECT @q3_5, '1.5x (150%)', false, 2 WHERE @q3_5 IS NOT NULL AND NOT EXISTS (SELECT 1 FROM answer_options WHERE question_id = @q3_5 AND sort_order = 2);
INSERT INTO answer_options (question_id, option_text, is_correct, sort_order)
SELECT @q3_5, '0.2x (20%)', false, 3 WHERE @q3_5 IS NOT NULL AND NOT EXISTS (SELECT 1 FROM answer_options WHERE question_id = @q3_5 AND sort_order = 3);
INSERT INTO answer_options (question_id, option_text, is_correct, sort_order)
SELECT @q3_5, '10.0x (1000%)', false, 4 WHERE @q3_5 IS NOT NULL AND NOT EXISTS (SELECT 1 FROM answer_options WHERE question_id = @q3_5 AND sort_order = 4);


-- =========================================================================
-- COURSE 4: Cloud Architecture with AWS (slug: 'cloud-architecture-with-aws')
-- =========================================================================
SET @c4_id = (SELECT id FROM courses WHERE slug = 'cloud-architecture-with-aws' LIMIT 1);

-- Sections for Course 4
INSERT INTO course_sections (course_id, title, description, sort_order)
SELECT @c4_id, 'AWS Core Infrastructure & Security', 'Global Regions, Availability Zones, Identity and Access Management (IAM), and VPC.', 1
WHERE @c4_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM course_sections WHERE course_id = @c4_id AND sort_order = 1);

INSERT INTO course_sections (course_id, title, description, sort_order)
SELECT @c4_id, 'Compute, Storage & Managed Databases', 'Amazon EC2, Auto Scaling Groups, Amazon S3, RDS, and DynamoDB.', 2
WHERE @c4_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM course_sections WHERE course_id = @c4_id AND sort_order = 2);

INSERT INTO course_sections (course_id, title, description, sort_order)
SELECT @c4_id, 'Networking, Load Balancing & Serverless', 'Application Load Balancers (ALB), Route 53 DNS, AWS Lambda, and API Gateway.', 3
WHERE @c4_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM course_sections WHERE course_id = @c4_id AND sort_order = 3);

INSERT INTO course_sections (course_id, title, description, sort_order)
SELECT @c4_id, 'Observability & Well-Architected Framework', 'CloudWatch, CloudTrail, AWS Well-Architected 6 pillars, and production resilience.', 4
WHERE @c4_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM course_sections WHERE course_id = @c4_id AND sort_order = 4);

-- Capture Section IDs for Course 4
SET @c4_s1 = (SELECT id FROM course_sections WHERE course_id = @c4_id AND sort_order = 1 LIMIT 1);
SET @c4_s2 = (SELECT id FROM course_sections WHERE course_id = @c4_id AND sort_order = 2 LIMIT 1);
SET @c4_s3 = (SELECT id FROM course_sections WHERE course_id = @c4_id AND sort_order = 3 LIMIT 1);
SET @c4_s4 = (SELECT id FROM course_sections WHERE course_id = @c4_id AND sort_order = 4 LIMIT 1);

-- Lessons for Course 4
INSERT INTO lessons (section_id, course_id, title, description, content_type, video_url, video_duration_seconds, content_text, sort_order, is_preview, is_mandatory)
SELECT @c4_s1, @c4_id, 'AWS Global Infrastructure & Core Concepts', 'Regions, Availability Zones, Edge Locations, and the shared responsibility model.', 'VIDEO', 'https://www.youtube.com/embed/k1RI5locZE4', 900, 'Welcome to Cloud Architecture with AWS. We explore cloud fundamentals, economics, and AWS global footprint.', 1, true, false
WHERE @c4_id IS NOT NULL AND @c4_s1 IS NOT NULL AND NOT EXISTS (SELECT 1 FROM lessons WHERE course_id = @c4_id AND title = 'AWS Global Infrastructure & Core Concepts');

INSERT INTO lessons (section_id, course_id, title, description, content_type, video_url, video_duration_seconds, content_text, sort_order, is_preview, is_mandatory)
SELECT @c4_s1, @c4_id, 'IAM: Users, Policies, Roles & Principle of Least Privilege', 'Configure IAM groups, JSON policies, roles for EC2/Lambda, and multi-factor authentication (MFA).', 'VIDEO', 'https://www.youtube.com/embed/8Xw0d72xN0I', 1500, 'Security starts with IAM. Learn how to write secure policies, assume roles, and audit permissions with IAM Access Analyzer.', 2, true, true
WHERE @c4_id IS NOT NULL AND @c4_s1 IS NOT NULL AND NOT EXISTS (SELECT 1 FROM lessons WHERE course_id = @c4_id AND title = 'IAM: Users, Policies, Roles & Principle of Least Privilege');

INSERT INTO lessons (section_id, course_id, title, description, content_type, video_url, video_duration_seconds, content_text, sort_order, is_preview, is_mandatory)
SELECT @c4_s1, @c4_id, 'VPC Architecture: Subnets, Route Tables & Gateways', 'Build a production VPC with public and private subnets, NAT Gateways, and Security Groups.', 'VIDEO', 'https://www.youtube.com/embed/0X_p_qf1T04', 2400, 'Network topology in AWS: CIDR blocks, routing tables, Internet Gateways, NAT Gateways, and Network ACLs.', 3, false, true
WHERE @c4_id IS NOT NULL AND @c4_s1 IS NOT NULL AND NOT EXISTS (SELECT 1 FROM lessons WHERE course_id = @c4_id AND title = 'VPC Architecture: Subnets, Route Tables & Gateways');

INSERT INTO lessons (section_id, course_id, title, description, content_type, video_url, video_duration_seconds, content_text, sort_order, is_preview, is_mandatory)
SELECT @c4_s2, @c4_id, 'Amazon EC2 Instances & Auto Scaling Groups', 'Instance types, EBS volume types, AMIs, User Data scripts, and elastic horizontal scaling.', 'VIDEO', 'https://www.youtube.com/embed/iHX-rkTtzGg', 2100, 'Launch EC2 instances, attach EBS SSD volumes, configure Auto Scaling policies based on CPU and request count.', 4, false, true
WHERE @c4_id IS NOT NULL AND @c4_s2 IS NOT NULL AND NOT EXISTS (SELECT 1 FROM lessons WHERE course_id = @c4_id AND title = 'Amazon EC2 Instances & Auto Scaling Groups');

INSERT INTO lessons (section_id, course_id, title, description, content_type, video_url, video_duration_seconds, content_text, sort_order, is_preview, is_mandatory)
SELECT @c4_s2, @c4_id, 'Amazon S3 Object Storage & Lifecycle Management', 'Bucket policies, versioning, S3 Standard vs Glacier, cross-region replication, and KMS encryption.', 'VIDEO', 'https://www.youtube.com/embed/77lMCiiMvGs', 1800, 'Master object storage with 99.999999999% (11 9s) durability, lifecycle transition rules, and pre-signed URLs.', 5, false, true
WHERE @c4_id IS NOT NULL AND @c4_s2 IS NOT NULL AND NOT EXISTS (SELECT 1 FROM lessons WHERE course_id = @c4_id AND title = 'Amazon S3 Object Storage & Lifecycle Management');

INSERT INTO lessons (section_id, course_id, title, description, content_type, video_url, video_duration_seconds, content_text, sort_order, is_preview, is_mandatory)
SELECT @c4_s2, @c4_id, 'Databases: Amazon RDS, Aurora & DynamoDB', 'Multi-AZ deployments, read replicas, automated backups, and NoSQL design in DynamoDB.', 'VIDEO', 'https://www.youtube.com/embed/W2T54cKkU70', 2400, 'Choosing between relational SQL databases (Aurora/RDS MySQL) and single-digit millisecond latency DynamoDB tables.', 6, false, true
WHERE @c4_id IS NOT NULL AND @c4_s2 IS NOT NULL AND NOT EXISTS (SELECT 1 FROM lessons WHERE course_id = @c4_id AND title = 'Databases: Amazon RDS, Aurora & DynamoDB');

INSERT INTO lessons (section_id, course_id, title, description, content_type, video_url, video_duration_seconds, content_text, sort_order, is_preview, is_mandatory)
SELECT @c4_s3, @c4_id, 'Elastic Load Balancing (ALB) & Route 53 DNS', 'Application Load Balancers, path-based routing, target groups, and Route 53 routing policies.', 'VIDEO', 'https://www.youtube.com/embed/oQ3Q1s3A8xM', 2100, 'Distribute incoming traffic seamlessly across availability zones with health checks and SSL termination.', 7, false, true
WHERE @c4_id IS NOT NULL AND @c4_s3 IS NOT NULL AND NOT EXISTS (SELECT 1 FROM lessons WHERE course_id = @c4_id AND title = 'Elastic Load Balancing (ALB) & Route 53 DNS');

INSERT INTO lessons (section_id, course_id, title, description, content_type, video_url, video_duration_seconds, content_text, sort_order, is_preview, is_mandatory)
SELECT @c4_s3, @c4_id, 'Serverless Architecture with AWS Lambda & API Gateway', 'Event-driven serverless computing, cold starts, memory allocation, and REST API endpoints.', 'VIDEO', 'https://www.youtube.com/embed/eOBq__h4OJ4', 2400, 'Build highly scalable APIs without provisioning servers using AWS Lambda, API Gateway, and Step Functions.', 8, false, true
WHERE @c4_id IS NOT NULL AND @c4_s3 IS NOT NULL AND NOT EXISTS (SELECT 1 FROM lessons WHERE course_id = @c4_id AND title = 'Serverless Architecture with AWS Lambda & API Gateway');

INSERT INTO lessons (section_id, course_id, title, description, content_type, video_url, video_duration_seconds, content_text, sort_order, is_preview, is_mandatory)
SELECT @c4_s4, @c4_id, 'Observability, Security & Capstone Architecture', 'CloudWatch alarms, CloudTrail audit logs, and designing a multi-tier fault-tolerant system.', 'VIDEO', 'https://www.youtube.com/embed/6YkK8x-9h78', 3600, 'Capstone review: assembling compute, storage, security, and DNS into an AWS Well-Architected solution.', 9, false, true
WHERE @c4_id IS NOT NULL AND @c4_s4 IS NOT NULL AND NOT EXISTS (SELECT 1 FROM lessons WHERE course_id = @c4_id AND title = 'Observability, Security & Capstone Architecture');

-- Quiz for Course 4
INSERT INTO quizzes (course_id, title, description, passing_score, is_required, sort_order)
SELECT @c4_id, 'AWS Solutions Architecture Certification Exam', 'Test your knowledge on AWS global infrastructure, S3 durability, VPC networking, and high availability.', 70, true, 1
WHERE @c4_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM quizzes WHERE course_id = @c4_id);

SET @c4_q_id = (SELECT id FROM quizzes WHERE course_id = @c4_id LIMIT 1);

-- Quiz Questions for Course 4
INSERT INTO quiz_questions (quiz_id, question_text, question_type, explanation, points, sort_order)
SELECT @c4_q_id, 'What is the standard designed data durability of Amazon S3 Standard storage class?', 'SINGLE_CHOICE', 'Amazon S3 Standard is designed for 99.999999999% (11 9s) of durability over a given year.', 1, 1
WHERE @c4_q_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM quiz_questions WHERE quiz_id = @c4_q_id AND sort_order = 1);

INSERT INTO quiz_questions (quiz_id, question_text, question_type, explanation, points, sort_order)
SELECT @c4_q_id, 'Which AWS service allows an EC2 instance to access S3 buckets without hardcoding credentials?', 'SINGLE_CHOICE', 'IAM Roles attached to EC2 instances (instance profile) dynamically provide temporary credentials via STS.', 1, 2
WHERE @c4_q_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM quiz_questions WHERE quiz_id = @c4_q_id AND sort_order = 2);

INSERT INTO quiz_questions (quiz_id, question_text, question_type, explanation, points, sort_order)
SELECT @c4_q_id, 'Which component must be placed in a public subnet to allow private instances to access the internet for updates?', 'SINGLE_CHOICE', 'A NAT Gateway sits in a public subnet with an Elastic IP and translates requests from private subnets outbound.', 1, 3
WHERE @c4_q_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM quiz_questions WHERE quiz_id = @c4_q_id AND sort_order = 3);

INSERT INTO quiz_questions (quiz_id, question_text, question_type, explanation, points, sort_order)
SELECT @c4_q_id, 'Which of the following are pillars of the AWS Well-Architected Framework?', 'MULTIPLE_CHOICE', 'Operational Excellence, Security, Reliability, Performance Efficiency, Cost Optimization, and Sustainability are the official 6 pillars.', 2, 4
WHERE @c4_q_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM quiz_questions WHERE quiz_id = @c4_q_id AND sort_order = 4);

INSERT INTO quiz_questions (quiz_id, question_text, question_type, explanation, points, sort_order)
SELECT @c4_q_id, 'Which load balancer type operates at Layer 7 (HTTP/HTTPS) and supports path-based and host-based routing?', 'SINGLE_CHOICE', 'Application Load Balancer (ALB) operates at Layer 7 and is ideal for HTTP/HTTPS web application routing.', 1, 5
WHERE @c4_q_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM quiz_questions WHERE quiz_id = @c4_q_id AND sort_order = 5);

-- Answer Options for Course 4
SET @q4_1 = (SELECT id FROM quiz_questions WHERE quiz_id = @c4_q_id AND sort_order = 1 LIMIT 1);
SET @q4_2 = (SELECT id FROM quiz_questions WHERE quiz_id = @c4_q_id AND sort_order = 2 LIMIT 1);
SET @q4_3 = (SELECT id FROM quiz_questions WHERE quiz_id = @c4_q_id AND sort_order = 3 LIMIT 1);
SET @q4_4 = (SELECT id FROM quiz_questions WHERE quiz_id = @c4_q_id AND sort_order = 4 LIMIT 1);
SET @q4_5 = (SELECT id FROM quiz_questions WHERE quiz_id = @c4_q_id AND sort_order = 5 LIMIT 1);

INSERT INTO answer_options (question_id, option_text, is_correct, sort_order)
SELECT @q4_1, '99.999999999% (11 9s)', true, 1 WHERE @q4_1 IS NOT NULL AND NOT EXISTS (SELECT 1 FROM answer_options WHERE question_id = @q4_1);
INSERT INTO answer_options (question_id, option_text, is_correct, sort_order)
SELECT @q4_1, '99.9%', false, 2 WHERE @q4_1 IS NOT NULL AND NOT EXISTS (SELECT 1 FROM answer_options WHERE question_id = @q4_1 AND sort_order = 2);
INSERT INTO answer_options (question_id, option_text, is_correct, sort_order)
SELECT @q4_1, '95.0%', false, 3 WHERE @q4_1 IS NOT NULL AND NOT EXISTS (SELECT 1 FROM answer_options WHERE question_id = @q4_1 AND sort_order = 3);
INSERT INTO answer_options (question_id, option_text, is_correct, sort_order)
SELECT @q4_1, '99.0%', false, 4 WHERE @q4_1 IS NOT NULL AND NOT EXISTS (SELECT 1 FROM answer_options WHERE question_id = @q4_1 AND sort_order = 4);

INSERT INTO answer_options (question_id, option_text, is_correct, sort_order)
SELECT @q4_2, 'IAM Role (Instance Profile)', true, 1 WHERE @q4_2 IS NOT NULL AND NOT EXISTS (SELECT 1 FROM answer_options WHERE question_id = @q4_2);
INSERT INTO answer_options (question_id, option_text, is_correct, sort_order)
SELECT @q4_2, 'Hardcoded AWS Access Keys in application.properties', false, 2 WHERE @q4_2 IS NOT NULL AND NOT EXISTS (SELECT 1 FROM answer_options WHERE question_id = @q4_2 AND sort_order = 2);
INSERT INTO answer_options (question_id, option_text, is_correct, sort_order)
SELECT @q4_2, 'Root Account Credentials', false, 3 WHERE @q4_2 IS NOT NULL AND NOT EXISTS (SELECT 1 FROM answer_options WHERE question_id = @q4_2 AND sort_order = 3);
INSERT INTO answer_options (question_id, option_text, is_correct, sort_order)
SELECT @q4_2, 'AWS Shield', false, 4 WHERE @q4_2 IS NOT NULL AND NOT EXISTS (SELECT 1 FROM answer_options WHERE question_id = @q4_2 AND sort_order = 4);

INSERT INTO answer_options (question_id, option_text, is_correct, sort_order)
SELECT @q4_3, 'NAT Gateway', true, 1 WHERE @q4_3 IS NOT NULL AND NOT EXISTS (SELECT 1 FROM answer_options WHERE question_id = @q4_3);
INSERT INTO answer_options (question_id, option_text, is_correct, sort_order)
SELECT @q4_3, 'Direct Connect', false, 2 WHERE @q4_3 IS NOT NULL AND NOT EXISTS (SELECT 1 FROM answer_options WHERE question_id = @q4_3 AND sort_order = 2);
INSERT INTO answer_options (question_id, option_text, is_correct, sort_order)
SELECT @q4_3, 'VPC Peering', false, 3 WHERE @q4_3 IS NOT NULL AND NOT EXISTS (SELECT 1 FROM answer_options WHERE question_id = @q4_3 AND sort_order = 3);
INSERT INTO answer_options (question_id, option_text, is_correct, sort_order)
SELECT @q4_3, 'AWS Transit Gateway', false, 4 WHERE @q4_3 IS NOT NULL AND NOT EXISTS (SELECT 1 FROM answer_options WHERE question_id = @q4_3 AND sort_order = 4);

INSERT INTO answer_options (question_id, option_text, is_correct, sort_order)
SELECT @q4_4, 'Security', true, 1 WHERE @q4_4 IS NOT NULL AND NOT EXISTS (SELECT 1 FROM answer_options WHERE question_id = @q4_4);
INSERT INTO answer_options (question_id, option_text, is_correct, sort_order)
SELECT @q4_4, 'Reliability', true, 2 WHERE @q4_4 IS NOT NULL AND NOT EXISTS (SELECT 1 FROM answer_options WHERE question_id = @q4_4 AND sort_order = 2);
INSERT INTO answer_options (question_id, option_text, is_correct, sort_order)
SELECT @q4_4, 'Cost Optimization', true, 3 WHERE @q4_4 IS NOT NULL AND NOT EXISTS (SELECT 1 FROM answer_options WHERE question_id = @q4_4 AND sort_order = 3);
INSERT INTO answer_options (question_id, option_text, is_correct, sort_order)
SELECT @q4_4, 'Mandatory Free Tier', false, 4 WHERE @q4_4 IS NOT NULL AND NOT EXISTS (SELECT 1 FROM answer_options WHERE question_id = @q4_4 AND sort_order = 4);

INSERT INTO answer_options (question_id, option_text, is_correct, sort_order)
SELECT @q4_5, 'Application Load Balancer (ALB)', true, 1 WHERE @q4_5 IS NOT NULL AND NOT EXISTS (SELECT 1 FROM answer_options WHERE question_id = @q4_5);
INSERT INTO answer_options (question_id, option_text, is_correct, sort_order)
SELECT @q4_5, 'Network Load Balancer (NLB)', false, 2 WHERE @q4_5 IS NOT NULL AND NOT EXISTS (SELECT 1 FROM answer_options WHERE question_id = @q4_5 AND sort_order = 2);
INSERT INTO answer_options (question_id, option_text, is_correct, sort_order)
SELECT @q4_5, 'Gateway Load Balancer', false, 3 WHERE @q4_5 IS NOT NULL AND NOT EXISTS (SELECT 1 FROM answer_options WHERE question_id = @q4_5 AND sort_order = 3);
INSERT INTO answer_options (question_id, option_text, is_correct, sort_order)
SELECT @q4_5, 'Classic Load Balancer', false, 4 WHERE @q4_5 IS NOT NULL AND NOT EXISTS (SELECT 1 FROM answer_options WHERE question_id = @q4_5 AND sort_order = 4);

-- =========================================================================
-- COURSE 5: Spring Boot Production-ready Project
-- =========================================================================
SET @c5_id = (SELECT id FROM courses WHERE slug = 'spring-boot-production-ready-project' LIMIT 1);

UPDATE courses
SET description = 'Master production-ready software engineering with Spring Boot 3 and Java 21.\n\nIn this project-driven masterclass, you will build a scalable, high-concurrency URL Shortener system with Redis caching, Spring Data JPA, MySQL, Flyway migrations, and Docker containerization.',
    thumbnail_url = 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1200&q=80',
    instructor_avatar = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80'
WHERE id = @c5_id AND (@c5_id IS NOT NULL);

INSERT INTO course_sections (course_id, title, description, sort_order)
SELECT @c5_id, 'Spring Boot 3 Core Architecture & Setup', 'Project initializr, Maven dependencies, embedded Tomcat, and application properties.', 1
WHERE @c5_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM course_sections WHERE course_id = @c5_id AND sort_order = 1);

INSERT INTO course_sections (course_id, title, description, sort_order)
SELECT @c5_id, 'Domain Modeling, JPA & Database Integration', 'Entities, repositories, Flyway migrations, and MySQL integration.', 2
WHERE @c5_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM course_sections WHERE course_id = @c5_id AND sort_order = 2);

INSERT INTO course_sections (course_id, title, description, sort_order)
SELECT @c5_id, 'URL Shortener Core Engine & Redis Caching', 'Base62 hashing algorithm, collision handling, and ultra-fast Redis caching.', 3
WHERE @c5_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM course_sections WHERE course_id = @c5_id AND sort_order = 3);

INSERT INTO course_sections (course_id, title, description, sort_order)
SELECT @c5_id, 'Security, Rate Limiting & Docker Deployment', 'Spring Security, Bucket4j rate limiting, Actuator metrics, and Docker containerization.', 4
WHERE @c5_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM course_sections WHERE course_id = @c5_id AND sort_order = 4);

SET @c5_s1 = (SELECT id FROM course_sections WHERE course_id = @c5_id AND sort_order = 1 LIMIT 1);
SET @c5_s2 = (SELECT id FROM course_sections WHERE course_id = @c5_id AND sort_order = 2 LIMIT 1);
SET @c5_s3 = (SELECT id FROM course_sections WHERE course_id = @c5_id AND sort_order = 3 LIMIT 1);
SET @c5_s4 = (SELECT id FROM course_sections WHERE course_id = @c5_id AND sort_order = 4 LIMIT 1);

INSERT INTO lessons (section_id, course_id, title, description, content_type, video_url, video_duration_seconds, content_text, sort_order, is_preview, is_mandatory)
SELECT @c5_s1, @c5_id, 'Welcome to Spring Boot Production Project', 'Introduction to URL Shortener project goals, architecture diagram, and design patterns.', 'VIDEO', 'https://www.youtube.com/embed/9SGDpanrc8U', 900, 'Welcome to Spring Boot Production Project. We examine microservice boundaries and performance goals.', 1, true, false
WHERE @c5_id IS NOT NULL AND @c5_s1 IS NOT NULL AND NOT EXISTS (SELECT 1 FROM lessons WHERE course_id = @c5_id AND title = 'Welcome to Spring Boot Production Project');

INSERT INTO lessons (section_id, course_id, title, description, content_type, video_url, video_duration_seconds, content_text, sort_order, is_preview, is_mandatory)
SELECT @c5_s1, @c5_id, 'Spring Boot 3 Project Setup & Auto-Configuration', 'Understanding @SpringBootApplication, starter packs, and configuration properties.', 'VIDEO', 'https://www.youtube.com/embed/vtPkZShrvXQ', 1200, 'Configure application.yml, HikariCP pool properties, and devtools for live reloading.', 2, true, true
WHERE @c5_id IS NOT NULL AND @c5_s1 IS NOT NULL AND NOT EXISTS (SELECT 1 FROM lessons WHERE course_id = @c5_id AND title = 'Spring Boot 3 Project Setup & Auto-Configuration');

INSERT INTO lessons (section_id, course_id, title, description, content_type, video_url, video_duration_seconds, content_text, sort_order, is_preview, is_mandatory)
SELECT @c5_s2, @c5_id, 'Entity Modeling & Spring Data JPA', 'Designing UrlMapping entity, indexes, slugs, and Spring Data JpaRepository methods.', 'VIDEO', 'https://www.youtube.com/embed/8SGI_XS5OPw', 1800, 'Modeling entities with JPA annotations, database indexes, and custom repository queries.', 3, false, true
WHERE @c5_id IS NOT NULL AND @c5_s2 IS NOT NULL AND NOT EXISTS (SELECT 1 FROM lessons WHERE course_id = @c5_id AND title = 'Entity Modeling & Spring Data JPA');

INSERT INTO lessons (section_id, course_id, title, description, content_type, video_url, video_duration_seconds, content_text, sort_order, is_preview, is_mandatory)
SELECT @c5_s3, @c5_id, 'Building the Base62 URL Shortening Algorithm', 'Implementing mathematical Base62 encoding, custom aliases, and expiration mechanisms.', 'VIDEO', 'https://www.youtube.com/embed/JQDHz72OA3c', 2100, 'Transforming 64-bit numerical IDs into 7-character Base62 alphanumeric slugs without collisions.', 4, false, true
WHERE @c5_id IS NOT NULL AND @c5_s3 IS NOT NULL AND NOT EXISTS (SELECT 1 FROM lessons WHERE course_id = @c5_id AND title = 'Building the Base62 URL Shortening Algorithm');

INSERT INTO lessons (section_id, course_id, title, description, content_type, video_url, video_duration_seconds, content_text, sort_order, is_preview, is_mandatory)
SELECT @c5_s3, @c5_id, 'High-Performance Redis Caching Layer', 'Spring Cache with Redis to serve redirects in single-digit milliseconds.', 'VIDEO', 'https://www.youtube.com/embed/1v_4_JcK060', 2400, 'Using Spring Data Redis to cache redirect URLs with TTL to absorb massive traffic surges.', 5, false, true
WHERE @c5_id IS NOT NULL AND @c5_s3 IS NOT NULL AND NOT EXISTS (SELECT 1 FROM lessons WHERE course_id = @c5_id AND title = 'High-Performance Redis Caching Layer');

INSERT INTO lessons (section_id, course_id, title, description, content_type, video_url, video_duration_seconds, content_text, sort_order, is_preview, is_mandatory)
SELECT @c5_s4, @c5_id, 'Dockerizing & Production Deployment', 'Writing multi-stage Dockerfiles, Docker Compose, and deploying to cloud infrastructure.', 'VIDEO', 'https://www.youtube.com/embed/3c-iBn73dDE', 3000, 'Containerizing the Spring Boot app and running integration tests with Testcontainers.', 6, false, true
WHERE @c5_id IS NOT NULL AND @c5_s4 IS NOT NULL AND NOT EXISTS (SELECT 1 FROM lessons WHERE course_id = @c5_id AND title = 'Dockerizing & Production Deployment');

INSERT INTO quizzes (course_id, title, description, passing_score, is_required, sort_order)
SELECT @c5_id, 'Spring Boot Production Architecture Exam', 'Demonstrate your mastery of Spring Boot, Redis caching, Base62 hashing, and deployment.', 70, true, 1
WHERE @c5_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM quizzes WHERE course_id = @c5_id);

SET @c5_q_id = (SELECT id FROM quizzes WHERE course_id = @c5_id LIMIT 1);

INSERT INTO quiz_questions (quiz_id, question_text, question_type, explanation, points, sort_order)
SELECT @c5_q_id, 'Why is Base62 commonly preferred over Base64 for URL shortening?', 'SINGLE_CHOICE', 'Base62 consists solely of alphanumeric characters [0-9a-zA-Z] and omits +, /, and = which have special syntactic meaning in URLs.', 1, 1
WHERE @c5_q_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM quiz_questions WHERE quiz_id = @c5_q_id AND sort_order = 1);

INSERT INTO quiz_questions (quiz_id, question_text, question_type, explanation, points, sort_order)
SELECT @c5_q_id, 'Which HTTP redirect status code indicates that the browser should permanently cache the destination URL?', 'SINGLE_CHOICE', 'HTTP 301 is Moved Permanently, enabling aggressive browser and CDN edge caching.', 1, 2
WHERE @c5_q_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM quiz_questions WHERE quiz_id = @c5_q_id AND sort_order = 2);

INSERT INTO quiz_questions (quiz_id, question_text, question_type, explanation, points, sort_order)
SELECT @c5_q_id, 'Which annotations are bundled inside Spring Boot''s @SpringBootApplication?', 'MULTIPLE_CHOICE', '@SpringBootApplication encapsulates @Configuration, @EnableAutoConfiguration, and @ComponentScan.', 2, 3
WHERE @c5_q_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM quiz_questions WHERE quiz_id = @c5_q_id AND sort_order = 3);

SET @q5_1 = (SELECT id FROM quiz_questions WHERE quiz_id = @c5_q_id AND sort_order = 1 LIMIT 1);
SET @q5_2 = (SELECT id FROM quiz_questions WHERE quiz_id = @c5_q_id AND sort_order = 2 LIMIT 1);
SET @q5_3 = (SELECT id FROM quiz_questions WHERE quiz_id = @c5_q_id AND sort_order = 3 LIMIT 1);

INSERT INTO answer_options (question_id, option_text, is_correct, sort_order)
SELECT @q5_1, 'It omits reserved URL characters (+, /, =) that require percent-encoding', true, 1 WHERE @q5_1 IS NOT NULL AND NOT EXISTS (SELECT 1 FROM answer_options WHERE question_id = @q5_1);
INSERT INTO answer_options (question_id, option_text, is_correct, sort_order)
SELECT @q5_1, 'Base62 produces shorter strings than Base64 for the same number', false, 2 WHERE @q5_1 IS NOT NULL AND NOT EXISTS (SELECT 1 FROM answer_options WHERE question_id = @q5_1 AND sort_order = 2);
INSERT INTO answer_options (question_id, option_text, is_correct, sort_order)
SELECT @q5_1, 'Base62 encrypts the original URL using AES-256', false, 3 WHERE @q5_1 IS NOT NULL AND NOT EXISTS (SELECT 1 FROM answer_options WHERE question_id = @q5_1 AND sort_order = 3);
INSERT INTO answer_options (question_id, option_text, is_correct, sort_order)
SELECT @q5_1, 'Base62 is natively supported by MySQL primary keys', false, 4 WHERE @q5_1 IS NOT NULL AND NOT EXISTS (SELECT 1 FROM answer_options WHERE question_id = @q5_1 AND sort_order = 4);

INSERT INTO answer_options (question_id, option_text, is_correct, sort_order)
SELECT @q5_2, '301 Moved Permanently', true, 1 WHERE @q5_2 IS NOT NULL AND NOT EXISTS (SELECT 1 FROM answer_options WHERE question_id = @q5_2);
INSERT INTO answer_options (question_id, option_text, is_correct, sort_order)
SELECT @q5_2, '200 OK', false, 2 WHERE @q5_2 IS NOT NULL AND NOT EXISTS (SELECT 1 FROM answer_options WHERE question_id = @q5_2 AND sort_order = 2);
INSERT INTO answer_options (question_id, option_text, is_correct, sort_order)
SELECT @q5_2, '404 Not Found', false, 3 WHERE @q5_2 IS NOT NULL AND NOT EXISTS (SELECT 1 FROM answer_options WHERE question_id = @q5_2 AND sort_order = 3);
INSERT INTO answer_options (question_id, option_text, is_correct, sort_order)
SELECT @q5_2, '500 Server Error', false, 4 WHERE @q5_2 IS NOT NULL AND NOT EXISTS (SELECT 1 FROM answer_options WHERE question_id = @q5_2 AND sort_order = 4);

INSERT INTO answer_options (question_id, option_text, is_correct, sort_order)
SELECT @q5_3, '@Configuration', true, 1 WHERE @q5_3 IS NOT NULL AND NOT EXISTS (SELECT 1 FROM answer_options WHERE question_id = @q5_3);
INSERT INTO answer_options (question_id, option_text, is_correct, sort_order)
SELECT @q5_3, '@EnableAutoConfiguration', true, 2 WHERE @q5_3 IS NOT NULL AND NOT EXISTS (SELECT 1 FROM answer_options WHERE question_id = @q5_3 AND sort_order = 2);
INSERT INTO answer_options (question_id, option_text, is_correct, sort_order)
SELECT @q5_3, '@ComponentScan', true, 3 WHERE @q5_3 IS NOT NULL AND NOT EXISTS (SELECT 1 FROM answer_options WHERE question_id = @q5_3 AND sort_order = 3);
INSERT INTO answer_options (question_id, option_text, is_correct, sort_order)
SELECT @q5_3, '@Transactional', false, 4 WHERE @q5_3 IS NOT NULL AND NOT EXISTS (SELECT 1 FROM answer_options WHERE question_id = @q5_3 AND sort_order = 4);

-- =========================================================================
-- COURSE 6: Machine Learning & Deep Learning Foundations
-- =========================================================================
SET @c6_id = (SELECT id FROM courses WHERE slug = 'machine-learning-deep-learning-foundations' LIMIT 1);

UPDATE courses
SET description = 'Comprehensive foundation in modern artificial intelligence, machine learning, and deep learning neural architectures using Python and PyTorch.\n\nFrom vector spaces and loss surfaces to convolutional networks, attention mechanisms, and deep generative models.',
    thumbnail_url = 'https://images.unsplash.com/photo-1507146426996-ef05306b995a?auto=format&fit=crop&w=1200&q=80',
    instructor_avatar = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'
WHERE id = @c6_id AND (@c6_id IS NOT NULL);

INSERT INTO course_sections (course_id, title, description, sort_order)
SELECT @c6_id, 'Mathematical Foundations & Optimization', 'Linear algebra, matrix calculus, gradient descent, and loss optimization.', 1
WHERE @c6_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM course_sections WHERE course_id = @c6_id AND sort_order = 1);

INSERT INTO course_sections (course_id, title, description, sort_order)
SELECT @c6_id, 'Supervised Learning Algorithms', 'Regression, tree ensembles, gradient boosting, and support vector machines.', 2
WHERE @c6_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM course_sections WHERE course_id = @c6_id AND sort_order = 2);

INSERT INTO course_sections (course_id, title, description, sort_order)
SELECT @c6_id, 'Neural Networks & PyTorch Engineering', 'Building multi-layer perceptrons, backpropagation, and training loops.', 3
WHERE @c6_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM course_sections WHERE course_id = @c6_id AND sort_order = 3);

INSERT INTO course_sections (course_id, title, description, sort_order)
SELECT @c6_id, 'Deep Learning: Vision & Sequence Models', 'CNNs, transfer learning, RNNs, and model deployment.', 4
WHERE @c6_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM course_sections WHERE course_id = @c6_id AND sort_order = 4);

SET @c6_s1 = (SELECT id FROM course_sections WHERE course_id = @c6_id AND sort_order = 1 LIMIT 1);
SET @c6_s2 = (SELECT id FROM course_sections WHERE course_id = @c6_id AND sort_order = 2 LIMIT 1);
SET @c6_s3 = (SELECT id FROM course_sections WHERE course_id = @c6_id AND sort_order = 3 LIMIT 1);
SET @c6_s4 = (SELECT id FROM course_sections WHERE course_id = @c6_id AND sort_order = 4 LIMIT 1);

INSERT INTO lessons (section_id, course_id, title, description, content_type, video_url, video_duration_seconds, content_text, sort_order, is_preview, is_mandatory)
SELECT @c6_s1, @c6_id, 'Foundations of Modern Machine Learning', 'From data patterns to mathematical representations. Overview of the learning paradigm.', 'VIDEO', 'https://www.youtube.com/embed/Gv9_4yMHFhI', 900, 'Introduction to ML & Deep Learning paradigms.', 1, true, false
WHERE @c6_id IS NOT NULL AND @c6_s1 IS NOT NULL AND NOT EXISTS (SELECT 1 FROM lessons WHERE course_id = @c6_id AND title = 'Foundations of Modern Machine Learning');

INSERT INTO lessons (section_id, course_id, title, description, content_type, video_url, video_duration_seconds, content_text, sort_order, is_preview, is_mandatory)
SELECT @c6_s1, @c6_id, 'Gradient Descent & Convex Optimization', 'Understanding loss surfaces, learning rate schedules, momentum, and Adam.', 'VIDEO', 'https://www.youtube.com/embed/aircAruvnKk', 1500, 'Calculus and optimization routines in machine learning.', 2, true, true
WHERE @c6_id IS NOT NULL AND @c6_s1 IS NOT NULL AND NOT EXISTS (SELECT 1 FROM lessons WHERE course_id = @c6_id AND title = 'Gradient Descent & Convex Optimization');

INSERT INTO lessons (section_id, course_id, title, description, content_type, video_url, video_duration_seconds, content_text, sort_order, is_preview, is_mandatory)
SELECT @c6_s2, @c6_id, 'Ensemble Models: Random Forests & XGBoost', 'Decision trees, information gain, Gini impurity, bagging, and boosting.', 'VIDEO', 'https://www.youtube.com/embed/7eh4d6sabA0', 2100, 'Hands-on ensemble learning using Scikit-Learn and XGBoost.', 3, false, true
WHERE @c6_id IS NOT NULL AND @c6_s2 IS NOT NULL AND NOT EXISTS (SELECT 1 FROM lessons WHERE course_id = @c6_id AND title = 'Ensemble Models: Random Forests & XGBoost');

INSERT INTO lessons (section_id, course_id, title, description, content_type, video_url, video_duration_seconds, content_text, sort_order, is_preview, is_mandatory)
SELECT @c6_s3, @c6_id, 'Neural Networks from Scratch in PyTorch', 'Tensors, automatic differentiation (autograd), custom modules, and loss functions.', 'VIDEO', 'https://www.youtube.com/embed/ORMx45xqWkA', 2700, 'Deep dive into PyTorch tensors and training loops.', 4, false, true
WHERE @c6_id IS NOT NULL AND @c6_s3 IS NOT NULL AND NOT EXISTS (SELECT 1 FROM lessons WHERE course_id = @c6_id AND title = 'Neural Networks from Scratch in PyTorch');

INSERT INTO lessons (section_id, course_id, title, description, content_type, video_url, video_duration_seconds, content_text, sort_order, is_preview, is_mandatory)
SELECT @c6_s4, @c6_id, 'Convolutional Neural Networks & Computer Vision', 'Spatial feature extraction, kernels, pooling, and ResNet architectures.', 'VIDEO', 'https://www.youtube.com/embed/IA3WxTTPXqQ', 2700, 'Image recognition and vision transfer learning with PyTorch.', 5, false, true
WHERE @c6_id IS NOT NULL AND @c6_s4 IS NOT NULL AND NOT EXISTS (SELECT 1 FROM lessons WHERE course_id = @c6_id AND title = 'Convolutional Neural Networks & Computer Vision');

INSERT INTO quizzes (course_id, title, description, passing_score, is_required, sort_order)
SELECT @c6_id, 'Machine Learning & Deep Learning Certification Exam', 'Comprehensive evaluation of gradient descent, neural architectures, PyTorch, and evaluation metrics.', 70, true, 1
WHERE @c6_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM quizzes WHERE course_id = @c6_id);

SET @c6_q_id = (SELECT id FROM quizzes WHERE course_id = @c6_id LIMIT 1);

INSERT INTO quiz_questions (quiz_id, question_text, question_type, explanation, points, sort_order)
SELECT @c6_q_id, 'What is the primary function of an activation function in neural networks?', 'SINGLE_CHOICE', 'Activation functions introduce non-linearities, allowing networks to approximate complex non-linear functions.', 1, 1
WHERE @c6_q_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM quiz_questions WHERE quiz_id = @c6_q_id AND sort_order = 1);

INSERT INTO quiz_questions (quiz_id, question_text, question_type, explanation, points, sort_order)
SELECT @c6_q_id, 'Which optimizer combines momentum with adaptive per-parameter learning rates?', 'SINGLE_CHOICE', 'Adam (Adaptive Moment Estimation) tracks both first and second moments of the gradients.', 1, 2
WHERE @c6_q_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM quiz_questions WHERE quiz_id = @c6_q_id AND sort_order = 2);

SET @q6_1 = (SELECT id FROM quiz_questions WHERE quiz_id = @c6_q_id AND sort_order = 1 LIMIT 1);
SET @q6_2 = (SELECT id FROM quiz_questions WHERE quiz_id = @c6_q_id AND sort_order = 2 LIMIT 1);

INSERT INTO answer_options (question_id, option_text, is_correct, sort_order)
SELECT @q6_1, 'To introduce non-linearity into the network', true, 1 WHERE @q6_1 IS NOT NULL AND NOT EXISTS (SELECT 1 FROM answer_options WHERE question_id = @q6_1);
INSERT INTO answer_options (question_id, option_text, is_correct, sort_order)
SELECT @q6_1, 'To normalize input pixels to zero mean', false, 2 WHERE @q6_1 IS NOT NULL AND NOT EXISTS (SELECT 1 FROM answer_options WHERE question_id = @q6_1 AND sort_order = 2);
INSERT INTO answer_options (question_id, option_text, is_correct, sort_order)
SELECT @q6_1, 'To save memory during backpropagation', false, 3 WHERE @q6_1 IS NOT NULL AND NOT EXISTS (SELECT 1 FROM answer_options WHERE question_id = @q6_1 AND sort_order = 3);
INSERT INTO answer_options (question_id, option_text, is_correct, sort_order)
SELECT @q6_1, 'To convert models to JavaScript', false, 4 WHERE @q6_1 IS NOT NULL AND NOT EXISTS (SELECT 1 FROM answer_options WHERE question_id = @q6_1 AND sort_order = 4);

INSERT INTO answer_options (question_id, option_text, is_correct, sort_order)
SELECT @q6_2, 'Adam Optimizer', true, 1 WHERE @q6_2 IS NOT NULL AND NOT EXISTS (SELECT 1 FROM answer_options WHERE question_id = @q6_2);
INSERT INTO answer_options (question_id, option_text, is_correct, sort_order)
SELECT @q6_2, 'Standard Stochastic Gradient Descent (SGD) without momentum', false, 2 WHERE @q6_2 IS NOT NULL AND NOT EXISTS (SELECT 1 FROM answer_options WHERE question_id = @q6_2 AND sort_order = 2);
INSERT INTO answer_options (question_id, option_text, is_correct, sort_order)
SELECT @q6_2, 'Bubble Sort Optimizer', false, 3 WHERE @q6_2 IS NOT NULL AND NOT EXISTS (SELECT 1 FROM answer_options WHERE question_id = @q6_2 AND sort_order = 3);
INSERT INTO answer_options (question_id, option_text, is_correct, sort_order)
SELECT @q6_2, 'Sigmoid Optimizer', false, 4 WHERE @q6_2 IS NOT NULL AND NOT EXISTS (SELECT 1 FROM answer_options WHERE question_id = @q6_2 AND sort_order = 4);

-- =========================================================================
-- COURSE 7: Artificial Intelligence & Natural Language Processing
-- =========================================================================
SET @c7_id = (SELECT id FROM courses WHERE slug = 'artificial-intelligence-natural-language-processing' LIMIT 1);

UPDATE courses
SET description = 'Comprehensive masterclass on modern Natural Language Processing and Generative Artificial Intelligence.\n\nFrom text embeddings and semantic vector spaces to the Transformer revolution (Self-Attention, BERT, GPT-4, and Retrieval-Augmented Generation RAG pipelines).',
    thumbnail_url = 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=1200&q=80',
    instructor_avatar = 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&q=80'
WHERE id = @c7_id AND (@c7_id IS NOT NULL);

INSERT INTO course_sections (course_id, title, description, sort_order)
SELECT @c7_id, 'Foundations of NLP & Text Processing', 'Tokenization, regex pipelines, morphology, and syntax parsing.', 1
WHERE @c7_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM course_sections WHERE course_id = @c7_id AND sort_order = 1);

INSERT INTO course_sections (course_id, title, description, sort_order)
SELECT @c7_id, 'Embeddings & Semantic Representation', 'Dense representations from Word2Vec to modern sentence transformers.', 2
WHERE @c7_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM course_sections WHERE course_id = @c7_id AND sort_order = 2);

INSERT INTO course_sections (course_id, title, description, sort_order)
SELECT @c7_id, 'Transformers & Attention Mechanisms', 'Self-attention, multi-head attention, and encoder-decoder architectures.', 3
WHERE @c7_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM course_sections WHERE course_id = @c7_id AND sort_order = 3);

INSERT INTO course_sections (course_id, title, description, sort_order)
SELECT @c7_id, 'LLMs & Generative AI Systems', 'Causal decoder models, prompt engineering, fine-tuning, and RAG.', 4
WHERE @c7_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM course_sections WHERE course_id = @c7_id AND sort_order = 4);

SET @c7_s1 = (SELECT id FROM course_sections WHERE course_id = @c7_id AND sort_order = 1 LIMIT 1);
SET @c7_s2 = (SELECT id FROM course_sections WHERE course_id = @c7_id AND sort_order = 2 LIMIT 1);
SET @c7_s3 = (SELECT id FROM course_sections WHERE course_id = @c7_id AND sort_order = 3 LIMIT 1);
SET @c7_s4 = (SELECT id FROM course_sections WHERE course_id = @c7_id AND sort_order = 4 LIMIT 1);

INSERT INTO lessons (section_id, course_id, title, description, content_type, video_url, video_duration_seconds, content_text, sort_order, is_preview, is_mandatory)
SELECT @c7_s1, @c7_id, 'Introduction to AI & NLP Landscape', 'Evolution of natural language processing and modern capabilities.', 'VIDEO', 'https://www.youtube.com/embed/CMrHM8a3hqw', 900, 'Welcome to AI & NLP.', 1, true, false
WHERE @c7_id IS NOT NULL AND @c7_s1 IS NOT NULL AND NOT EXISTS (SELECT 1 FROM lessons WHERE course_id = @c7_id AND title = 'Introduction to AI & NLP Landscape');

INSERT INTO lessons (section_id, course_id, title, description, content_type, video_url, video_duration_seconds, content_text, sort_order, is_preview, is_mandatory)
SELECT @c7_s1, @c7_id, 'Text Preprocessing & Subword Tokenization', 'Byte-Pair Encoding (BPE), WordPiece, and tokenizer pipelines in HuggingFace.', 'VIDEO', 'https://www.youtube.com/embed/xvqsFTUsOmc', 1200, 'Tokenization techniques.', 2, true, true
WHERE @c7_id IS NOT NULL AND @c7_s1 IS NOT NULL AND NOT EXISTS (SELECT 1 FROM lessons WHERE course_id = @c7_id AND title = 'Text Preprocessing & Subword Tokenization');

INSERT INTO lessons (section_id, course_id, title, description, content_type, video_url, video_duration_seconds, content_text, sort_order, is_preview, is_mandatory)
SELECT @c7_s2, @c7_id, 'Dense Embeddings & Vector Search', 'Converting human text into vector spaces and querying with cosine similarity.', 'VIDEO', 'https://www.youtube.com/embed/viZrOnJclY0', 1800, 'Vector embeddings and high-dimensional search.', 3, false, true
WHERE @c7_id IS NOT NULL AND @c7_s2 IS NOT NULL AND NOT EXISTS (SELECT 1 FROM lessons WHERE course_id = @c7_id AND title = 'Dense Embeddings & Vector Search');

INSERT INTO lessons (section_id, course_id, title, description, content_type, video_url, video_duration_seconds, content_text, sort_order, is_preview, is_mandatory)
SELECT @c7_s3, @c7_id, 'The Transformer Architecture Explained', 'Multi-head self-attention, query/key/value tensors, and positional encodings.', 'VIDEO', 'https://www.youtube.com/embed/SZorAJ4I-sA', 2700, 'Mathematics of the Transformer.', 4, false, true
WHERE @c7_id IS NOT NULL AND @c7_s3 IS NOT NULL AND NOT EXISTS (SELECT 1 FROM lessons WHERE course_id = @c7_id AND title = 'The Transformer Architecture Explained');

INSERT INTO lessons (section_id, course_id, title, description, content_type, video_url, video_duration_seconds, content_text, sort_order, is_preview, is_mandatory)
SELECT @c7_s4, @c7_id, 'Retrieval-Augmented Generation (RAG) Architecture', 'Connecting LLMs to vector databases to generate grounded, fact-checked responses.', 'VIDEO', 'https://www.youtube.com/embed/tcqEUSNCn8I', 3600, 'Building RAG systems with LangChain and vector stores.', 5, false, true
WHERE @c7_id IS NOT NULL AND @c7_s4 IS NOT NULL AND NOT EXISTS (SELECT 1 FROM lessons WHERE course_id = @c7_id AND title = 'Retrieval-Augmented Generation (RAG) Architecture');

INSERT INTO quizzes (course_id, title, description, passing_score, is_required, sort_order)
SELECT @c7_id, 'Artificial Intelligence & NLP Certification Exam', 'Test your knowledge on tokenization, self-attention mechanisms, and RAG architectures.', 70, true, 1
WHERE @c7_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM quizzes WHERE course_id = @c7_id);

SET @c7_q_id = (SELECT id FROM quizzes WHERE course_id = @c7_id LIMIT 1);

INSERT INTO quiz_questions (quiz_id, question_text, question_type, explanation, points, sort_order)
SELECT @c7_q_id, 'What is the mathematical formulation of scaled dot-product attention in Transformers?', 'SINGLE_CHOICE', 'Attention(Q, K, V) = softmax(Q * K^T / sqrt(d_k)) * V.', 1, 1
WHERE @c7_q_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM quiz_questions WHERE quiz_id = @c7_q_id AND sort_order = 1);

INSERT INTO quiz_questions (quiz_id, question_text, question_type, explanation, points, sort_order)
SELECT @c7_q_id, 'What problem does Retrieval-Augmented Generation (RAG) directly solve for LLMs?', 'SINGLE_CHOICE', 'RAG grounds LLM generation in external authoritative factual context, reducing hallucinations.', 1, 2
WHERE @c7_q_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM quiz_questions WHERE quiz_id = @c7_q_id AND sort_order = 2);

SET @q7_1 = (SELECT id FROM quiz_questions WHERE quiz_id = @c7_q_id AND sort_order = 1 LIMIT 1);
SET @q7_2 = (SELECT id FROM quiz_questions WHERE quiz_id = @c7_q_id AND sort_order = 2 LIMIT 1);

INSERT INTO answer_options (question_id, option_text, is_correct, sort_order)
SELECT @q7_1, 'softmax((Q * K^T) / sqrt(d_k)) * V', true, 1 WHERE @q7_1 IS NOT NULL AND NOT EXISTS (SELECT 1 FROM answer_options WHERE question_id = @q7_1);
INSERT INTO answer_options (question_id, option_text, is_correct, sort_order)
SELECT @q7_1, 'sigmoid(Q + K + V)', false, 2 WHERE @q7_1 IS NOT NULL AND NOT EXISTS (SELECT 1 FROM answer_options WHERE question_id = @q7_1 AND sort_order = 2);
INSERT INTO answer_options (question_id, option_text, is_correct, sort_order)
SELECT @q7_1, 'Q * K * V', false, 3 WHERE @q7_1 IS NOT NULL AND NOT EXISTS (SELECT 1 FROM answer_options WHERE question_id = @q7_1 AND sort_order = 3);
INSERT INTO answer_options (question_id, option_text, is_correct, sort_order)
SELECT @q7_1, 'ReLU(Q * K) - V', false, 4 WHERE @q7_1 IS NOT NULL AND NOT EXISTS (SELECT 1 FROM answer_options WHERE question_id = @q7_1 AND sort_order = 4);

INSERT INTO answer_options (question_id, option_text, is_correct, sort_order)
SELECT @q7_2, 'It grounds responses in current external facts and reduces hallucinations', true, 1 WHERE @q7_2 IS NOT NULL AND NOT EXISTS (SELECT 1 FROM answer_options WHERE question_id = @q7_2);
INSERT INTO answer_options (question_id, option_text, is_correct, sort_order)
SELECT @q7_2, 'It eliminates the need for any GPU hardware', false, 2 WHERE @q7_2 IS NOT NULL AND NOT EXISTS (SELECT 1 FROM answer_options WHERE question_id = @q7_2 AND sort_order = 2);
INSERT INTO answer_options (question_id, option_text, is_correct, sort_order)
SELECT @q7_2, 'It compresses text files into zip archives', false, 3 WHERE @q7_2 IS NOT NULL AND NOT EXISTS (SELECT 1 FROM answer_options WHERE question_id = @q7_2 AND sort_order = 3);
INSERT INTO answer_options (question_id, option_text, is_correct, sort_order)
SELECT @q7_2, 'It converts English sentences to binary Morse code', false, 4 WHERE @q7_2 IS NOT NULL AND NOT EXISTS (SELECT 1 FROM answer_options WHERE question_id = @q7_2 AND sort_order = 4);

