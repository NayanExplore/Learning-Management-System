package com.skillforge.lms.config;

import com.skillforge.lms.entity.*;
import com.skillforge.lms.repository.*;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.ArrayList;
import java.util.List;

/**
 * Ensures all courses in the system have complete dummy data (sections, lessons,
 * video embeds, descriptions, learning outcomes, and assessment quizzes)
 * so every course can be thoroughly tested across player, progress, and quizzes.
 */
@Component
@Order(20)
@Slf4j
public class CourseDataBootstrapRunner implements CommandLineRunner {

    private final CourseRepository courseRepository;
    private final CourseSectionRepository sectionRepository;
    private final LessonRepository lessonRepository;
    private final QuizRepository quizRepository;
    private final QuizQuestionRepository questionRepository;
    private final AnswerOptionRepository answerOptionRepository;

    public CourseDataBootstrapRunner(
            CourseRepository courseRepository,
            CourseSectionRepository sectionRepository,
            LessonRepository lessonRepository,
            QuizRepository quizRepository,
            QuizQuestionRepository questionRepository,
            AnswerOptionRepository answerOptionRepository) {
        this.courseRepository = courseRepository;
        this.sectionRepository = sectionRepository;
        this.lessonRepository = lessonRepository;
        this.quizRepository = quizRepository;
        this.questionRepository = questionRepository;
        this.answerOptionRepository = answerOptionRepository;
    }

    @Override
    @Transactional
    public void run(String... args) {
        List<Course> allCourses = courseRepository.findAll();
        if (allCourses.isEmpty()) {
            return;
        }

        log.info("Verifying dummy curriculum and assessment data for {} courses...", allCourses.size());

        for (Course course : allCourses) {
            boolean courseUpdated = false;

            // 1. Ensure course has valid thumbnail and avatar
            if (!StringUtils.hasText(course.getThumbnailUrl())) {
                course.setThumbnailUrl(resolveDefaultThumbnail(course.getSlug(), course.getTitle()));
                courseUpdated = true;
            }
            if (!StringUtils.hasText(course.getInstructorAvatar())) {
                course.setInstructorAvatar(resolveDefaultAvatar(course.getInstructorName()));
                courseUpdated = true;
            }
            if (!StringUtils.hasText(course.getDescription())) {
                course.setDescription(resolveDefaultDescription(course.getTitle()));
                courseUpdated = true;
            }
            if (course.getLearningOutcomes() == null || course.getLearningOutcomes().length == 0) {
                course.setLearningOutcomes(new String[]{
                        "Master core industry-standard methodologies and architectural paradigms",
                        "Design and build end-to-end production-grade applications",
                        "Troubleshoot real-world edge cases with clean, maintainable code",
                        "Pass final assessment quizzes and earn verified completion credentials"
                });
                courseUpdated = true;
            }
            if (course.getPrerequisites() == null || course.getPrerequisites().length == 0) {
                course.setPrerequisites(new String[]{
                        "Basic computer literacy and problem-solving mindset",
                        "Familiarity with foundational computing concepts"
                });
                courseUpdated = true;
            }

            if (courseUpdated) {
                courseRepository.save(course);
            }

            // 2. Ensure course has sections and lessons
            long sectionCount = sectionRepository.countByCourseId(course.getId());
            if (sectionCount == 0) {
                seedSectionsAndLessons(course);
            } else {
                // Ensure existing video lessons have working video URLs
                ensureLessonsHaveVideoUrls(course);
            }

            // 3. Ensure course has at least one required assessment quiz
            List<Quiz> quizzes = quizRepository.findByCourseIdOrderBySortOrderAsc(course.getId());
            if (quizzes.isEmpty()) {
                seedQuizForCourse(course);
            }
        }

        log.info("Finished verifying course dummy data. All {} courses are fully testable.", allCourses.size());
    }

    private void ensureLessonsHaveVideoUrls(Course course) {
        List<Lesson> lessons = lessonRepository.findByCourseIdOrderBySortOrderAsc(course.getId());
        for (Lesson lesson : lessons) {
            if (lesson.getContentType() == Lesson.ContentType.VIDEO && !StringUtils.hasText(lesson.getVideoUrl())) {
                lesson.setVideoUrl(resolveFallbackVideoUrl(course.getTitle(), lesson.getSortOrder()));
                if (!StringUtils.hasText(lesson.getContentText())) {
                    lesson.setContentText("## " + lesson.getTitle() + "\n\nPractical code walkthrough and detailed implementation notes.");
                }
                lessonRepository.save(lesson);
            }
        }
    }

    private void seedSectionsAndLessons(Course course) {
        String slug = course.getSlug() != null ? course.getSlug().toLowerCase() : "";
        String title = course.getTitle() != null ? course.getTitle().toLowerCase() : "";

        log.info("Populating dummy sections and lessons for course '{}' (id: {})", course.getTitle(), course.getId());

        if (slug.contains("spring") || title.contains("spring") || slug.contains("url-shortner") || title.contains("shortner") || title.contains("shortener")) {
            seedSpringBootCurriculum(course);
        } else if (slug.contains("deep-learning") || title.contains("deep learning")) {
            seedDeepLearningCurriculum(course);
        } else if (slug.contains("artificial-intelligence") || slug.contains("nlp") || title.contains("natural language") || title.contains("artificial intelligence")) {
            seedAInlpCurriculum(course);
        } else if (slug.contains("data-science") || slug.contains("python") || title.contains("data science")) {
            seedDataScienceCurriculum(course);
        } else if (slug.contains("digital-marketing") || slug.contains("marketing") || title.contains("marketing")) {
            seedMarketingCurriculum(course);
        } else if (slug.contains("cloud") || slug.contains("aws") || slug.contains("devops") || title.contains("aws")) {
            seedCloudCurriculum(course);
        } else {
            seedGenericCurriculum(course);
        }
    }

    private void seedSpringBootCurriculum(Course course) {
        CourseSection s1 = sectionRepository.save(CourseSection.builder()
                .course(course)
                .title("Spring Boot 3 Core Architecture & Setup")
                .description("Project initializr, Maven dependencies, embedded Tomcat, and application properties.")
                .sortOrder(1)
                .build());

        CourseSection s2 = sectionRepository.save(CourseSection.builder()
                .course(course)
                .title("Domain Modeling, JPA & Database Integration")
                .description("Entities, repositories, Flyway migrations, and MySQL integration.")
                .sortOrder(2)
                .build());

        CourseSection s3 = sectionRepository.save(CourseSection.builder()
                .course(course)
                .title("URL Shortener Core Engine & Redis Caching")
                .description("Base62 hashing algorithm, collision handling, and ultra-fast Redis caching.")
                .sortOrder(3)
                .build());

        CourseSection s4 = sectionRepository.save(CourseSection.builder()
                .course(course)
                .title("Security, Rate Limiting & Docker Deployment")
                .description("Spring Security, Bucket4j rate limiting, Actuator metrics, and Docker containerization.")
                .sortOrder(4)
                .build());

        createLesson(s1, course, "Welcome to Spring Boot Production Project", "Introduction to URL Shortener project goals, architecture diagram, and design patterns.", "https://www.youtube.com/embed/9SGDpanrc8U", 900, 1, true, false);
        createLesson(s1, course, "Spring Boot 3 Project Setup & Auto-Configuration", "Understanding @SpringBootApplication, starter packs, and configuration properties.", "https://www.youtube.com/embed/vtPkZShrvXQ", 1200, 2, true, true);
        createLesson(s2, course, "Entity Modeling & Spring Data JPA", "Designing UrlMapping entity, indexes, slugs, and Spring Data JpaRepository methods.", "https://www.youtube.com/embed/8SGI_XS5OPw", 1800, 3, false, true);
        createLesson(s2, course, "Database Migrations with Flyway", "Version-controlled database migrations with Flyway for production safety.", "https://www.youtube.com/embed/8SGI_XS5OPw", 1500, 4, false, true);
        createLesson(s3, course, "Building the Base62 URL Shortening Algorithm", "Implementing mathematical Base62 encoding, custom aliases, and expiration mechanisms.", "https://www.youtube.com/embed/JQDHz72OA3c", 2100, 5, false, true);
        createLesson(s3, course, "High-Performance Redis Caching Layer", "Spring Cache with Redis to serve redirects in single-digit milliseconds.", "https://www.youtube.com/embed/1v_4_JcK060", 2400, 6, false, true);
        createLesson(s4, course, "API Rate Limiting with Bucket4j", "Protecting URL redirection and creation endpoints against DoS abuse.", "https://www.youtube.com/embed/b0n_23689uU", 1800, 7, false, true);
        createLesson(s4, course, "Dockerizing & Production Deployment", "Writing multi-stage Dockerfiles, Docker Compose, and deploying to cloud infrastructure.", "https://www.youtube.com/embed/3c-iBn73dDE", 3000, 8, false, true);
    }

    private void seedDeepLearningCurriculum(Course course) {
        CourseSection s1 = sectionRepository.save(CourseSection.builder()
                .course(course)
                .title("Machine Learning Foundations & Mathematics")
                .description("Linear algebra, gradient descent, cost functions, and bias-variance tradeoff.")
                .sortOrder(1)
                .build());

        CourseSection s2 = sectionRepository.save(CourseSection.builder()
                .course(course)
                .title("Supervised & Unsupervised Machine Learning")
                .description("Regression, decision trees, random forests, SVMs, and clustering.")
                .sortOrder(2)
                .build());

        CourseSection s3 = sectionRepository.save(CourseSection.builder()
                .course(course)
                .title("Neural Networks & PyTorch Fundamentals")
                .description("Perceptrons, backpropagation, activation functions, and building models in PyTorch.")
                .sortOrder(3)
                .build());

        CourseSection s4 = sectionRepository.save(CourseSection.builder()
                .course(course)
                .title("Convolutional & Recurrent Deep Networks")
                .description("CNNs for computer vision, RNNs/LSTMs for sequence data, and transfer learning.")
                .sortOrder(4)
                .build());

        createLesson(s1, course, "Introduction to Machine Learning & Deep Learning", "Roadmap: from classical statistical models to modern deep artificial neural networks.", "https://www.youtube.com/embed/Gv9_4yMHFhI", 900, 1, true, false);
        createLesson(s1, course, "Mathematics for ML: Vectors, Matrices & Calculus", "Essential linear algebra, dot products, matrix multiplication, and partial derivatives.", "https://www.youtube.com/embed/aircAruvnKk", 1500, 2, true, true);
        createLesson(s2, course, "Classical ML: Decision Trees & Random Forests", "Ensemble learning, bagging, boosting, and feature importance analysis.", "https://www.youtube.com/embed/7eh4d6sabA0", 2100, 3, false, true);
        createLesson(s2, course, "Unsupervised Learning & PCA Dimensionality Reduction", "K-Means clustering, silhouette scores, and Principal Component Analysis.", "https://www.youtube.com/embed/rng04VJxUt4", 1800, 4, false, true);
        createLesson(s3, course, "Building Artificial Neural Networks with PyTorch", "Tensors, autograd, loss functions, optimizers (Adam/SGD), and the training loop.", "https://www.youtube.com/embed/ORMx45xqWkA", 2700, 5, false, true);
        createLesson(s3, course, "Combatting Overfitting: Dropout & Regularization", "L1/L2 weight decay, dropout layers, early stopping, and batch normalization.", "https://www.youtube.com/embed/6g4O5UOH304", 1800, 6, false, true);
        createLesson(s4, course, "Computer Vision with Convolutional Networks (CNNs)", "Convolutions, pooling, feature maps, and image classification on benchmark datasets.", "https://www.youtube.com/embed/IA3WxTTPXqQ", 2400, 7, false, true);
        createLesson(s4, course, "Transfer Learning with ResNet & Vision Models", "Fine-tuning pre-trained models on custom datasets for state-of-the-art accuracy.", "https://www.youtube.com/embed/K0lhHF66I0s", 3000, 8, false, true);
    }

    private void seedAInlpCurriculum(Course course) {
        CourseSection s1 = sectionRepository.save(CourseSection.builder()
                .course(course)
                .title("Foundations of Natural Language Processing")
                .description("Linguistics, tokenization, regular expressions, and text preprocessing pipelines.")
                .sortOrder(1)
                .build());

        CourseSection s2 = sectionRepository.save(CourseSection.builder()
                .course(course)
                .title("Word Embeddings & Semantic Representation")
                .description("Bag of words, TF-IDF, Word2Vec, GloVe, and cosine similarity.")
                .sortOrder(2)
                .build());

        CourseSection s3 = sectionRepository.save(CourseSection.builder()
                .course(course)
                .title("Transformer Architecture & Attention Mechanisms")
                .description("Self-attention, multi-head attention, positional encoding, and BERT.")
                .sortOrder(3)
                .build());

        CourseSection s4 = sectionRepository.save(CourseSection.builder()
                .course(course)
                .title("Large Language Models & Generative AI")
                .description("Decoder models (GPT), prompt engineering, retrieval-augmented generation (RAG), and fine-tuning.")
                .sortOrder(4)
                .build());

        createLesson(s1, course, "AI & NLP Landscape: From N-grams to LLMs", "Overview of text processing, speech recognition, and generative AI breakthroughs.", "https://www.youtube.com/embed/CMrHM8a3hqw", 900, 1, true, false);
        createLesson(s1, course, "Text Preprocessing, Stemming & Lemmatization", "Cleaning raw text, stopword removal, NLTK/spaCy tokenizers, and regex extraction.", "https://www.youtube.com/embed/xvqsFTUsOmc", 1200, 2, true, true);
        createLesson(s2, course, "Vectorizing Text: TF-IDF to Word2Vec", "Converting words into dense numerical vectors that capture semantic relationships.", "https://www.youtube.com/embed/viZrOnJclY0", 1800, 3, false, true);
        createLesson(s2, course, "Sentiment Analysis & Text Classification", "Building sentiment classifiers using semantic embeddings and logistic regression.", "https://www.youtube.com/embed/M7SWr5xObvw", 2100, 4, false, true);
        createLesson(s3, course, "Attention Is All You Need: The Transformer", "Deep dive into self-attention mathematics and transformer encoder-decoder blocks.", "https://www.youtube.com/embed/SZorAJ4I-sA", 2700, 5, false, true);
        createLesson(s3, course, "Masked Language Modeling with BERT", "Bidirectional representations, fine-tuning BERT for classification and NER.", "https://www.youtube.com/embed/xI0HHN5XKDo", 2400, 6, false, true);
        createLesson(s4, course, "Generative AI & Autoregressive Models (GPT)", "Next-token prediction, temperature, top-k/top-p sampling, and causal masking.", "https://www.youtube.com/embed/zjkBMFhNj_g", 2700, 7, false, true);
        createLesson(s4, course, "Building a RAG Pipeline with LangChain & Vector DBs", "Connecting LLMs to private documents using embeddings and vector search.", "https://www.youtube.com/embed/tcqEUSNCn8I", 3600, 8, false, true);
    }

    private void seedDataScienceCurriculum(Course course) {
        CourseSection s1 = sectionRepository.save(CourseSection.builder()
                .course(course)
                .title("Python for Data Science Setup")
                .description("Set up Anaconda, Jupyter Notebooks, and explore Python numerical computing.")
                .sortOrder(1)
                .build());

        CourseSection s2 = sectionRepository.save(CourseSection.builder()
                .course(course)
                .title("NumPy & High-Performance Arrays")
                .description("Master N-dimensional arrays, vectorized operations, broadcasting, and indexing.")
                .sortOrder(2)
                .build());

        CourseSection s3 = sectionRepository.save(CourseSection.builder()
                .course(course)
                .title("Data Wrangling with Pandas")
                .description("Work with Series, DataFrames, data cleaning, missing values, and aggregation.")
                .sortOrder(3)
                .build());

        CourseSection s4 = sectionRepository.save(CourseSection.builder()
                .course(course)
                .title("Visualization & Machine Learning")
                .description("Exploratory data analysis with Matplotlib/Seaborn and introductory Scikit-Learn models.")
                .sortOrder(4)
                .build());

        createLesson(s1, course, "Data Science Roadmap & Python Environment", "Overview of the data science lifecycle, tools, and configuring Jupyter Notebooks.", "https://www.youtube.com/embed/rfscVS0vtbw", 900, 1, true, false);
        createLesson(s1, course, "Jupyter Notebooks & Virtual Environments", "Master keyboard shortcuts, markdown cells, kernel management, and pip/conda.", "https://www.youtube.com/embed/HW29067qVWk", 1200, 2, true, true);
        createLesson(s2, course, "NumPy Arrays & Vectorization", "Learn array creation, indexing, slicing, and why vectorization is 100x faster than loops.", "https://www.youtube.com/embed/QUT1VHiLmmI", 1800, 3, false, true);
        createLesson(s2, course, "Broadcasting & Mathematical Computations", "Master NumPy broadcasting rules, universal functions (ufuncs), and linear algebra.", "https://www.youtube.com/embed/QUT1VHiLmmI", 1500, 4, false, true);
        createLesson(s3, course, "Pandas DataFrames & Series Essentials", "Learn to load CSV/Excel files into DataFrames, inspect data, and slice rows/columns.", "https://www.youtube.com/embed/vmEHCJofslg", 2100, 5, false, true);
        createLesson(s3, course, "Data Cleaning & Missing Value Imputation", "Handle null values, deduplicate records, string transformations, and date parsing.", "https://www.youtube.com/embed/bDhvCp3_lYw", 1800, 6, false, true);
        createLesson(s3, course, "Advanced GroupBy & Aggregations", "Split-Apply-Combine pattern, pivot tables, multi-indexing, and window functions.", "https://www.youtube.com/embed/W9XjRYFkkyw", 2400, 7, false, true);
        createLesson(s4, course, "Visualizing Insights with Matplotlib & Seaborn", "Create bar charts, histograms, heatmaps, scatter plots, and custom styling themes.", "https://www.youtube.com/embed/UO98lJQ3QGI", 2100, 8, false, true);
        createLesson(s4, course, "Machine Learning: Scikit-Learn Pipelines", "Train your first predictive model: train-test split, feature scaling, and evaluation.", "https://www.youtube.com/embed/7eh4d6sabA0", 2700, 9, false, true);
    }

    private void seedMarketingCurriculum(Course course) {
        CourseSection s1 = sectionRepository.save(CourseSection.builder()
                .course(course)
                .title("Digital Marketing Strategy & Tracking")
                .description("Learn modern marketing funnels, buyer personas, and Google Analytics 4 tracking.")
                .sortOrder(1)
                .build());

        CourseSection s2 = sectionRepository.save(CourseSection.builder()
                .course(course)
                .title("Search Engine Optimization (SEO)")
                .description("Keyword research, on-page content architecture, technical audits, and link acquisition.")
                .sortOrder(2)
                .build());

        CourseSection s3 = sectionRepository.save(CourseSection.builder()
                .course(course)
                .title("Paid Advertising & Performance Marketing")
                .description("Google Ads, Meta Advertising, bid strategies, and ROAS optimization.")
                .sortOrder(3)
                .build());

        CourseSection s4 = sectionRepository.save(CourseSection.builder()
                .course(course)
                .title("Content & Email Marketing Automation")
                .description("Craft high-converting copy, viral social distribution, and automated email nurturing funnels.")
                .sortOrder(4)
                .build());

        createLesson(s1, course, "Modern Marketing Landscape & Funnels", "Understand TOFU, MOFU, BOFU funnels and how prospective customers discover brands.", "https://www.youtube.com/embed/nU-IIXBWlS4", 900, 1, true, false);
        createLesson(s1, course, "Target Audience & Customer Persona Mapping", "Build data-backed buyer personas, analyze demographics, intent, and pain points.", "https://www.youtube.com/embed/1O_uKqR-n6w", 1200, 2, true, true);
        createLesson(s2, course, "Keyword Research & Search Intent", "Find high-volume, low-competition keywords using Semrush, Ahrefs, and Google Keyword Planner.", "https://www.youtube.com/embed/DvwS7cV9GmQ", 1800, 3, false, true);
        createLesson(s2, course, "On-Page SEO & Content Optimization", "Optimize title tags, meta descriptions, heading tags (H1-H3), and internal linking structures.", "https://www.youtube.com/embed/433XyI231o8", 2100, 4, false, true);
        createLesson(s3, course, "Google Search & Display Advertising", "Create profitable Google Search campaigns, match types, ad extensions, and Quality Score.", "https://www.youtube.com/embed/a9n_yL_B_i8", 2400, 5, false, true);
        createLesson(s3, course, "Meta Ads (Facebook & Instagram) Growth", "Meta Business Suite, pixel setup, custom audiences, lookalike audiences, and ad creative.", "https://www.youtube.com/embed/dF1A7wXyQ4I", 2700, 6, false, true);
        createLesson(s4, course, "Email Marketing Automation & Sequences", "Welcome series, abandoned cart recovery, customer segmentation, and newsletter strategy.", "https://www.youtube.com/embed/c0_J1Qp05xU", 2100, 7, false, true);
        createLesson(s4, course, "Analytics, CAC, LTV & Growth Capstone", "Measure Customer Acquisition Cost (CAC), Lifetime Value (LTV), ROAS, and scale campaigns.", "https://www.youtube.com/embed/oZ4P1q5c0gU", 3000, 8, false, true);
    }

    private void seedCloudCurriculum(Course course) {
        CourseSection s1 = sectionRepository.save(CourseSection.builder()
                .course(course)
                .title("AWS Core Infrastructure & Security")
                .description("Global Regions, Availability Zones, Identity and Access Management (IAM), and VPC.")
                .sortOrder(1)
                .build());

        CourseSection s2 = sectionRepository.save(CourseSection.builder()
                .course(course)
                .title("Compute, Storage & Managed Databases")
                .description("Amazon EC2, Auto Scaling Groups, Amazon S3, RDS, and DynamoDB.")
                .sortOrder(2)
                .build());

        CourseSection s3 = sectionRepository.save(CourseSection.builder()
                .course(course)
                .title("Networking, Load Balancing & Serverless")
                .description("Application Load Balancers (ALB), Route 53 DNS, AWS Lambda, and API Gateway.")
                .sortOrder(3)
                .build());

        CourseSection s4 = sectionRepository.save(CourseSection.builder()
                .course(course)
                .title("Observability & Well-Architected Framework")
                .description("CloudWatch, CloudTrail, AWS Well-Architected 6 pillars, and production resilience.")
                .sortOrder(4)
                .build());

        createLesson(s1, course, "AWS Global Infrastructure & Core Concepts", "Regions, Availability Zones, Edge Locations, and the shared responsibility model.", "https://www.youtube.com/embed/k1RI5locZE4", 900, 1, true, false);
        createLesson(s1, course, "IAM: Users, Policies, Roles & Principle of Least Privilege", "Configure IAM groups, JSON policies, roles for EC2/Lambda, and multi-factor authentication (MFA).", "https://www.youtube.com/embed/8Xw0d72xN0I", 1500, 2, true, true);
        createLesson(s1, course, "VPC Architecture: Subnets, Route Tables & Gateways", "Build a production VPC with public and private subnets, NAT Gateways, and Security Groups.", "https://www.youtube.com/embed/0X_p_qf1T04", 2400, 3, false, true);
        createLesson(s2, course, "Amazon EC2 Instances & Auto Scaling Groups", "Instance types, EBS volume types, AMIs, User Data scripts, and elastic horizontal scaling.", "https://www.youtube.com/embed/iHX-rkTtzGg", 2100, 4, false, true);
        createLesson(s2, course, "Amazon S3 Object Storage & Lifecycle Management", "Bucket policies, versioning, S3 Standard vs Glacier, cross-region replication, and KMS encryption.", "https://www.youtube.com/embed/77lMCiiMvGs", 1800, 5, false, true);
        createLesson(s2, course, "Databases: Amazon RDS, Aurora & DynamoDB", "Multi-AZ deployments, read replicas, automated backups, and NoSQL design in DynamoDB.", "https://www.youtube.com/embed/W2T54cKkU70", 2400, 6, false, true);
        createLesson(s3, course, "Elastic Load Balancing (ALB) & Route 53 DNS", "Application Load Balancers, path-based routing, target groups, and Route 53 routing policies.", "https://www.youtube.com/embed/oQ3Q1s3A8xM", 2100, 7, false, true);
        createLesson(s3, course, "Serverless Architecture with AWS Lambda & API Gateway", "Event-driven serverless computing, cold starts, memory allocation, and REST API endpoints.", "https://www.youtube.com/embed/eOBq__h4OJ4", 2400, 8, false, true);
        createLesson(s4, course, "Observability, Security & Capstone Architecture", "CloudWatch alarms, CloudTrail audit logs, and designing a multi-tier fault-tolerant system.", "https://www.youtube.com/embed/6YkK8x-9h78", 3600, 9, false, true);
    }

    private void seedGenericCurriculum(Course course) {
        CourseSection s1 = sectionRepository.save(CourseSection.builder()
                .course(course)
                .title("1. Foundations & Fundamentals")
                .description("Core concepts, ecosystem setup, and introductory methodologies.")
                .sortOrder(1)
                .build());

        CourseSection s2 = sectionRepository.save(CourseSection.builder()
                .course(course)
                .title("2. In-Depth Techniques & Practical Implementation")
                .description("Hands-on implementation, workflows, and industry standard best practices.")
                .sortOrder(2)
                .build());

        CourseSection s3 = sectionRepository.save(CourseSection.builder()
                .course(course)
                .title("3. Advanced Mastery & Capstone Project")
                .description("Complex problem solving, performance optimization, and project deployment.")
                .sortOrder(3)
                .build());

        createLesson(s1, course, "Course Introduction & Strategic Overview", "Introduction to key learning outcomes and course roadmap.", "https://www.youtube.com/embed/nu_pCVPKzTk", 900, 1, true, false);
        createLesson(s1, course, "Essential Concepts & Tooling Setup", "Installing tools, configuring environments, and setting up workflows.", "https://www.youtube.com/embed/VqCgcpAypFQ", 1200, 2, true, true);
        createLesson(s2, course, "Core Methodologies in Practice", "Applying fundamental techniques with hands-on exercises.", "https://www.youtube.com/embed/W6NZfCO5SIk", 1800, 3, false, true);
        createLesson(s2, course, "Deep Dive & Case Study Analysis", "Examining industry scenarios and overcoming common challenges.", "https://www.youtube.com/embed/bMknfKXIFA8", 2100, 4, false, true);
        createLesson(s3, course, "Advanced Patterns & Optimization", "Tuning performance, avoiding bottlenecks, and ensuring high quality.", "https://www.youtube.com/embed/PoRJizFvM7s", 2400, 5, false, true);
        createLesson(s3, course, "Capstone Project & Final Assessment Preparation", "Building the comprehensive project and preparing for final certification.", "https://www.youtube.com/embed/oZ4P1q5c0gU", 3000, 6, false, true);
    }

    private void createLesson(
            CourseSection section,
            Course course,
            String title,
            String description,
            String videoUrl,
            int durationSeconds,
            int sortOrder,
            boolean preview,
            boolean mandatory) {
        lessonRepository.save(Lesson.builder()
                .section(section)
                .course(course)
                .title(title)
                .description(description)
                .contentType(Lesson.ContentType.VIDEO)
                .videoUrl(videoUrl)
                .videoDurationSeconds(durationSeconds)
                .contentText("## " + title + "\n\n" + description + "\n\nFollow the lecture walkthrough attentively and practice along.")
                .sortOrder(sortOrder)
                .preview(preview)
                .mandatory(mandatory)
                .build());
    }

    private void seedQuizForCourse(Course course) {
        String slug = course.getSlug() != null ? course.getSlug().toLowerCase() : "";
        String title = course.getTitle() != null ? course.getTitle().toLowerCase() : "";
        String courseTitle = course.getTitle();

        log.info("Creating assessment quiz for course '{}' (id: {})", courseTitle, course.getId());

        Quiz quiz = quizRepository.save(Quiz.builder()
                .course(course)
                .title(courseTitle + " Certification Assessment")
                .description("Demonstrate your mastery of " + courseTitle + " with this final comprehensive exam. Score at least 70% to earn your verified certificate.")
                .passingScore(70)
                .required(true)
                .sortOrder(1)
                .timeLimitMinutes(30)
                .build());

        if (slug.contains("spring") || title.contains("spring") || slug.contains("url-shortner") || title.contains("shortner") || title.contains("shortener")) {
            seedSpringBootQuestions(quiz);
        } else if (slug.contains("deep-learning") || title.contains("deep learning")) {
            seedDeepLearningQuestions(quiz);
        } else if (slug.contains("artificial-intelligence") || slug.contains("nlp") || title.contains("natural language") || title.contains("artificial intelligence")) {
            seedAInlpQuestions(quiz);
        } else if (slug.contains("data-science") || slug.contains("python") || title.contains("data science")) {
            seedDataScienceQuestions(quiz);
        } else if (slug.contains("digital-marketing") || slug.contains("marketing") || title.contains("marketing")) {
            seedMarketingQuestions(quiz);
        } else if (slug.contains("cloud") || slug.contains("aws") || slug.contains("devops") || title.contains("aws")) {
            seedCloudQuestions(quiz);
        } else {
            seedGenericQuestions(quiz, courseTitle);
        }
    }

    private void seedSpringBootQuestions(Quiz quiz) {
        addQuestion(quiz,
                "What is the primary benefit of Spring Boot's @SpringBootApplication annotation?",
                QuizQuestion.QuestionType.SINGLE_CHOICE,
                "@SpringBootApplication combines @Configuration, @EnableAutoConfiguration, and @ComponentScan.",
                1, 1,
                List.of(
                        new Option("It combines @Configuration, @EnableAutoConfiguration, and @ComponentScan", true),
                        new Option("It connects directly to MySQL without a datasource configuration", false),
                        new Option("It compiles Java byte-code into machine code", false),
                        new Option("It automatically replaces Tomcat with Jetty", false)
                ));

        addQuestion(quiz,
                "Why is Base62 commonly used in URL shortener hash encoding over Base64?",
                QuizQuestion.QuestionType.SINGLE_CHOICE,
                "Base62 uses [0-9a-zA-Z] and excludes '+' and '/' which have special meaning in URLs.",
                1, 2,
                List.of(
                        new Option("It omits '+' and '/' characters that need percent-encoding in URLs", true),
                        new Option("Base62 provides 256-bit encryption for short URLs", false),
                        new Option("Base62 generates shorter strings than Base64", false),
                        new Option("It requires less memory than binary encoding", false)
                ));

        addQuestion(quiz,
                "Which HTTP status code should a URL shortener return for a permanent redirect?",
                QuizQuestion.QuestionType.SINGLE_CHOICE,
                "HTTP 301 is Moved Permanently, while 302/307 are temporary redirects.",
                1, 3,
                List.of(
                        new Option("301 Moved Permanently", true),
                        new Option("200 OK", false),
                        new Option("404 Not Found", false),
                        new Option("500 Internal Server Error", false)
                ));

        addQuestion(quiz,
                "Which caching strategies are recommended for high-volume URL redirection?",
                QuizQuestion.QuestionType.MULTIPLE_CHOICE,
                "Redis in-memory caching and Cache-Aside pattern prevent database bottlenecks during redirect lookups.",
                2, 4,
                List.of(
                        new Option("Redis in-memory key-value caching", true),
                        new Option("Cache-Aside pattern with TTL expiration", true),
                        new Option("Querying MySQL directly on every single HTTP request", false),
                        new Option("Storing short URLs in volatile browser localStorage only", false)
                ));

        addQuestion(quiz,
                "How does Spring Data JPA simplify database access in Spring Boot?",
                QuizQuestion.QuestionType.SINGLE_CHOICE,
                "By auto-generating SQL implementations from repository interface method signatures.",
                1, 5,
                List.of(
                        new Option("By generating SQL queries automatically from method signatures", true),
                        new Option("By removing the requirement for any relational database", false),
                        new Option("By converting all SQL tables to CSV files", false),
                        new Option("By running separate compiler threads for each table", false)
                ));
    }

    private void seedDeepLearningQuestions(Quiz quiz) {
        addQuestion(quiz,
                "What is the role of backpropagation in training artificial neural networks?",
                QuizQuestion.QuestionType.SINGLE_CHOICE,
                "Backpropagation calculates the gradient of the loss function with respect to weights using the chain rule.",
                1, 1,
                List.of(
                        new Option("Computing gradients of the loss with respect to model weights using the chain rule", true),
                        new Option("Initializing network weights to random numbers", false),
                        new Option("Normalizing input image pixels between 0 and 1", false),
                        new Option("Selecting hyperparameters such as learning rate automatically", false)
                ));

        addQuestion(quiz,
                "Which activation function is most widely used in hidden layers to mitigate the vanishing gradient problem?",
                QuizQuestion.QuestionType.SINGLE_CHOICE,
                "ReLU (Rectified Linear Unit) has a constant gradient of 1 for positive inputs, avoiding vanishing gradients.",
                1, 2,
                List.of(
                        new Option("ReLU (Rectified Linear Unit)", true),
                        new Option("Sigmoid", false),
                        new Option("Softmax", false),
                        new Option("Step Function", false)
                ));

        addQuestion(quiz,
                "Which of the following techniques prevent overfitting in deep neural networks?",
                QuizQuestion.QuestionType.MULTIPLE_CHOICE,
                "Dropout, L2 Weight Decay, and Early Stopping are standard regularization techniques.",
                2, 3,
                List.of(
                        new Option("Dropout regularization", true),
                        new Option("L2 Weight Decay (Ridge Regularization)", true),
                        new Option("Early Stopping based on validation loss", true),
                        new Option("Increasing model parameters infinitely without additional data", false)
                ));

        addQuestion(quiz,
                "What layer in a CNN is responsible for reducing spatial dimensions while retaining essential features?",
                QuizQuestion.QuestionType.SINGLE_CHOICE,
                "Pooling layers (such as MaxPooling) downsample feature map height and width.",
                1, 4,
                List.of(
                        new Option("MaxPooling Layer", true),
                        new Option("Dense Fully-Connected Layer", false),
                        new Option("Softmax Output Layer", false),
                        new Option("Embedding Layer", false)
                ));

        addQuestion(quiz,
                "What is transfer learning in deep learning?",
                QuizQuestion.QuestionType.SINGLE_CHOICE,
                "Transfer learning reuses weights from a pre-trained model on a large dataset for a specialized task.",
                1, 5,
                List.of(
                        new Option("Fine-tuning a model trained on a large dataset for a new related task", true),
                        new Option("Transferring data between hard drives during training", false),
                        new Option("Converting PyTorch models to JavaScript", false),
                        new Option("Translating code comments between programming languages", false)
                ));
    }

    private void seedAInlpQuestions(Quiz quiz) {
        addQuestion(quiz,
                "What key mechanism allows Transformer models to process sequences in parallel?",
                QuizQuestion.QuestionType.SINGLE_CHOICE,
                "Self-attention allows tokens to attend to all other tokens simultaneously without recurrent step loops.",
                1, 1,
                List.of(
                        new Option("Self-Attention mechanism with positional encoding", true),
                        new Option("Recurrent hidden state loops", false),
                        new Option("Markov Decision Processes", false),
                        new Option("Fourier transforms", false)
                ));

        addQuestion(quiz,
                "What is the difference between BERT and GPT architectures?",
                QuizQuestion.QuestionType.SINGLE_CHOICE,
                "BERT is a bidirectional encoder for comprehension; GPT is an autoregressive decoder for text generation.",
                1, 2,
                List.of(
                        new Option("BERT is a bidirectional encoder; GPT is an autoregressive causal decoder", true),
                        new Option("BERT generates text; GPT only classifies documents", false),
                        new Option("BERT requires no neural network layers", false),
                        new Option("GPT cannot process English sentences", false)
                ));

        addQuestion(quiz,
                "Which metric measures semantic similarity between two dense word or document embeddings?",
                QuizQuestion.QuestionType.SINGLE_CHOICE,
                "Cosine similarity measures the cosine of the angle between two embedding vectors.",
                1, 3,
                List.of(
                        new Option("Cosine Similarity", true),
                        new Option("Hamming Distance", false),
                        new Option("Levenshtein Distance", false),
                        new Option("Jaccard Index", false)
                ));

        addQuestion(quiz,
                "What are the core components of a Retrieval-Augmented Generation (RAG) system?",
                QuizQuestion.QuestionType.MULTIPLE_CHOICE,
                "RAG combines vector retrieval, document embeddings, and generation with an LLM prompt.",
                2, 4,
                List.of(
                        new Option("Document chunking and dense vector embeddings", true),
                        new Option("Vector database semantic similarity search", true),
                        new Option("LLM generation conditioned on retrieved context", true),
                        new Option("Training a new base LLM from scratch every query", false)
                ));

        addQuestion(quiz,
                "What is tokenization in Natural Language Processing?",
                QuizQuestion.QuestionType.SINGLE_CHOICE,
                "Breaking raw text into discrete units (words, subwords, or characters) that can be mapped to IDs.",
                1, 5,
                List.of(
                        new Option("Segmenting text into discrete units (subwords or words) for model input", true),
                        new Option("Encrypting passwords with a hash function", false),
                        new Option("Translating text into spoken audio", false),
                        new Option("Generating cryptocurrency coins from text data", false)
                ));
    }

    private void seedDataScienceQuestions(Quiz quiz) {
        addQuestion(quiz,
                "Which NumPy function creates an array of evenly spaced numbers over a specified interval?",
                QuizQuestion.QuestionType.SINGLE_CHOICE,
                "np.linspace creates evenly spaced values over an interval, whereas np.arange increments by step.",
                1, 1,
                List.of(
                        new Option("np.linspace", true),
                        new Option("np.zeros", false),
                        new Option("np.empty", false),
                        new Option("np.shape", false)
                ));

        addQuestion(quiz,
                "In Pandas, what is the key difference between .loc and .iloc?",
                QuizQuestion.QuestionType.SINGLE_CHOICE,
                ".loc accesses rows and columns by label/index name, while .iloc accesses by integer position.",
                1, 2,
                List.of(
                        new Option(".loc is label-based, while .iloc is integer position-based", true),
                        new Option(".loc is integer-based, while .iloc is label-based", false),
                        new Option("Both methods behave identically in modern Pandas versions", false),
                        new Option(".loc is exclusively for columns, .iloc exclusively for rows", false)
                ));

        addQuestion(quiz,
                "Which method is used in Pandas to impute or replace missing NaN values?",
                QuizQuestion.QuestionType.SINGLE_CHOICE,
                "fillna() fills missing values with a designated constant or calculated metric.",
                1, 3,
                List.of(
                        new Option("df.fillna()", true),
                        new Option("df.replace_null()", false),
                        new Option("df.clean()", false),
                        new Option("df.dropna()", false)
                ));

        addQuestion(quiz,
                "Which of the following are supervised machine learning models?",
                QuizQuestion.QuestionType.MULTIPLE_CHOICE,
                "Linear Regression and Random Forest are supervised models with labeled targets.",
                2, 4,
                List.of(
                        new Option("LinearRegression", true),
                        new Option("RandomForestClassifier", true),
                        new Option("KMeans Clustering", false),
                        new Option("DBSCAN", false)
                ));

        addQuestion(quiz,
                "What metric is best suited to evaluate a classification model on an imbalanced dataset?",
                QuizQuestion.QuestionType.SINGLE_CHOICE,
                "F1-Score harmonizes precision and recall, providing an accurate evaluation on imbalanced classes.",
                1, 5,
                List.of(
                        new Option("F1-Score", true),
                        new Option("Raw Accuracy", false),
                        new Option("Mean Squared Error", false),
                        new Option("R-squared (R2)", false)
                ));
    }

    private void seedMarketingQuestions(Quiz quiz) {
        addQuestion(quiz,
                "What does ROAS stand for in performance advertising?",
                QuizQuestion.QuestionType.SINGLE_CHOICE,
                "ROAS stands for Return On Ad Spend (Revenue divided by Ad Spend).",
                1, 1,
                List.of(
                        new Option("Return On Ad Spend", true),
                        new Option("Rate Of Acquisition Speed", false),
                        new Option("Reach Over Audience Segment", false),
                        new Option("Revenue On Account Sales", false)
                ));

        addQuestion(quiz,
                "Which HTML tag provides the strongest on-page SEO ranking signal for primary keywords?",
                QuizQuestion.QuestionType.SINGLE_CHOICE,
                "The <title> tag in the HTML head is one of the most critical on-page ranking signals.",
                1, 2,
                List.of(
                        new Option("<title>", true),
                        new Option("<span>", false),
                        new Option("<aside>", false),
                        new Option("<footer>", false)
                ));

        addQuestion(quiz,
                "What is the primary objective of a lookalike audience in Meta Ads?",
                QuizQuestion.QuestionType.SINGLE_CHOICE,
                "Lookalike audiences identify new people who share traits with your high-value customers.",
                1, 3,
                List.of(
                        new Option("Target new people who resemble existing high-value customers", true),
                        new Option("Re-target people who previously bounced from the checkout page", false),
                        new Option("Send promotional SMS messages to existing subscribers", false),
                        new Option("Block web scrapers and competitors from viewing ads", false)
                ));

        addQuestion(quiz,
                "Which factors directly impact Google Ads Quality Score?",
                QuizQuestion.QuestionType.MULTIPLE_CHOICE,
                "Expected Click-Through Rate, Ad Relevance, and Landing Page Experience determine Quality Score.",
                2, 4,
                List.of(
                        new Option("Expected Click-Through Rate (CTR)", true),
                        new Option("Ad Relevance", true),
                        new Option("Landing Page Experience", true),
                        new Option("Physical headquarters location", false)
                ));

        addQuestion(quiz,
                "If an ad campaign spends $1,000 and yields $5,000 in tracked sales, what is the ROAS?",
                QuizQuestion.QuestionType.SINGLE_CHOICE,
                "$5,000 / $1,000 = 5.0x (or 500%).",
                1, 5,
                List.of(
                        new Option("5.0x (500%)", true),
                        new Option("1.5x (150%)", false),
                        new Option("0.2x (20%)", false),
                        new Option("10.0x (1000%)", false)
                ));
    }

    private void seedCloudQuestions(Quiz quiz) {
        addQuestion(quiz,
                "What is the standard designed data durability of Amazon S3 Standard storage?",
                QuizQuestion.QuestionType.SINGLE_CHOICE,
                "Amazon S3 Standard is designed for 99.999999999% (11 9s) of data durability.",
                1, 1,
                List.of(
                        new Option("99.999999999% (11 9s)", true),
                        new Option("99.9%", false),
                        new Option("95.0%", false),
                        new Option("99.0%", false)
                ));

        addQuestion(quiz,
                "Which AWS service allows an EC2 instance to access S3 buckets without hardcoding credentials?",
                QuizQuestion.QuestionType.SINGLE_CHOICE,
                "IAM Roles attached to EC2 instances deliver temporary STS security tokens automatically.",
                1, 2,
                List.of(
                        new Option("IAM Role (Instance Profile)", true),
                        new Option("Hardcoded AWS Access Keys in source code", false),
                        new Option("Root Account Credentials", false),
                        new Option("AWS Shield", false)
                ));

        addQuestion(quiz,
                "Which component in a public subnet enables private EC2 instances to communicate outbound to the internet?",
                QuizQuestion.QuestionType.SINGLE_CHOICE,
                "A NAT Gateway provides outbound IPv4 internet connectivity for instances in private subnets.",
                1, 3,
                List.of(
                        new Option("NAT Gateway", true),
                        new Option("Direct Connect", false),
                        new Option("VPC Peering", false),
                        new Option("AWS Transit Gateway", false)
                ));

        addQuestion(quiz,
                "Which of the following are pillars of the AWS Well-Architected Framework?",
                QuizQuestion.QuestionType.MULTIPLE_CHOICE,
                "Security, Reliability, and Cost Optimization are official Well-Architected pillars.",
                2, 4,
                List.of(
                        new Option("Security", true),
                        new Option("Reliability", true),
                        new Option("Cost Optimization", true),
                        new Option("Mandatory Free Tier", false)
                ));

        addQuestion(quiz,
                "Which AWS load balancer operates at Layer 7 and supports HTTP host and path-based routing?",
                QuizQuestion.QuestionType.SINGLE_CHOICE,
                "Application Load Balancer (ALB) operates at Layer 7 for HTTP/HTTPS web application traffic.",
                1, 5,
                List.of(
                        new Option("Application Load Balancer (ALB)", true),
                        new Option("Network Load Balancer (NLB)", false),
                        new Option("Gateway Load Balancer", false),
                        new Option("Classic Load Balancer", false)
                ));
    }

    private void seedGenericQuestions(Quiz quiz, String courseTitle) {
        addQuestion(quiz,
                "What is the recommended approach when starting a project in " + courseTitle + "?",
                QuizQuestion.QuestionType.SINGLE_CHOICE,
                "Understanding fundamental architectural principles before writing code ensures high quality and maintainability.",
                1, 1,
                List.of(
                        new Option("Review requirements, establish architecture, and follow clean code standards", true),
                        new Option("Skip architecture and build without modularity", false),
                        new Option("Ignore documentation and test coverage", false),
                        new Option("Deploy immediately to production without staging", false)
                ));

        addQuestion(quiz,
                "Which practices lead to robust and scalable outcomes in " + courseTitle + "?",
                QuizQuestion.QuestionType.MULTIPLE_CHOICE,
                "Continuous testing, modular design, and observability are core best practices.",
                2, 2,
                List.of(
                        new Option("Modular and decoupled component design", true),
                        new Option("Continuous integration and comprehensive automated tests", true),
                        new Option("Proactive monitoring and error logging", true),
                        new Option("Hardcoding secrets directly into repository files", false)
                ));

        addQuestion(quiz,
                "How should errors and edge cases be handled in production systems?",
                QuizQuestion.QuestionType.SINGLE_CHOICE,
                "Graceful degradation with informative error boundaries and structured logs prevents catastrophic failures.",
                1, 3,
                List.of(
                        new Option("Graceful degradation with structured logging and user-friendly error messages", true),
                        new Option("Silently swallowing exceptions without logging", false),
                        new Option("Crashing the entire process upon unexpected input", false),
                        new Option("Exposing raw database stack traces directly to end users", false)
                ));

        addQuestion(quiz,
                "What role does performance profiling and optimization play during development?",
                QuizQuestion.QuestionType.SINGLE_CHOICE,
                "Profiling identifies real bottlenecks so optimizations provide maximum impact without premature complexity.",
                1, 4,
                List.of(
                        new Option("Measuring bottlenecks with real data before applying targeted optimizations", true),
                        new Option("Prematurely optimizing micro-details before verifying functionality", false),
                        new Option("Ignoring response times and resource utilization completely", false),
                        new Option("Relying solely on faster hardware rather than efficient algorithms", false)
                ));

        addQuestion(quiz,
                "What is the ultimate benefit of completing the capstone project in " + courseTitle + "?",
                QuizQuestion.QuestionType.SINGLE_CHOICE,
                "Building hands-on capstone projects demonstrates verified real-world competence.",
                1, 5,
                List.of(
                        new Option("Gaining production-grade practical experience and verified portfolio proof", true),
                        new Option("Memorizing syntax without practical understanding", false),
                        new Option("Accumulating certificates without applicable skills", false),
                        new Option("Avoiding modern industry standards", false)
                ));
    }

    private static class Option {
        final String text;
        final boolean correct;

        Option(String text, boolean correct) {
            this.text = text;
            this.correct = correct;
        }
    }

    private void addQuestion(
            Quiz quiz,
            String text,
            QuizQuestion.QuestionType type,
            String explanation,
            int points,
            int sortOrder,
            List<Option> options) {
        QuizQuestion question = questionRepository.save(QuizQuestion.builder()
                .quiz(quiz)
                .questionText(text)
                .questionType(type)
                .explanation(explanation)
                .points(points)
                .sortOrder(sortOrder)
                .build());

        int optOrder = 1;
        for (Option opt : options) {
            answerOptionRepository.save(AnswerOption.builder()
                    .question(question)
                    .optionText(opt.text)
                    .correct(opt.correct)
                    .sortOrder(optOrder++)
                    .build());
        }
    }

    private String resolveDefaultDescription(String title) {
        return "Comprehensive industry-focused masterclass in " + title + ".\n\n"
                + "Designed for professionals and ambitious learners looking to build real-world proficiency. "
                + "Features structured hands-on projects, interactive preview lectures, comprehensive knowledge check assessments, "
                + "and an official verified certificate of completion upon graduation.\n\n"
                + "### What this course covers:\n"
                + "- Complete foundational theory and modern industry workflows\n"
                + "- Step-by-step hands-on implementation and architecture design\n"
                + "- Real-world production edge cases, performance tuning, and best practices\n"
                + "- Capstone project and final certification exam";
    }

    private String resolveDefaultThumbnail(String slug, String title) {
        if (slug == null) slug = "";
        slug = slug.toLowerCase();
        if (title == null) title = "";
        title = title.toLowerCase();

        if (slug.contains("full-stack") || slug.contains("web") || slug.contains("react")) {
            return "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80";
        }
        if (slug.contains("spring") || title.contains("spring")) {
            return "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1200&q=80";
        }
        if (slug.contains("deep-learning") || title.contains("deep learning")) {
            return "https://images.unsplash.com/photo-1507146426996-ef05306b995a?auto=format&fit=crop&w=1200&q=80";
        }
        if (slug.contains("artificial-intelligence") || slug.contains("nlp") || title.contains("artificial")) {
            return "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=1200&q=80";
        }
        if (slug.contains("data-science") || slug.contains("python") || slug.contains("machine-learning")) {
            return "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80";
        }
        if (slug.contains("digital-marketing") || slug.contains("marketing") || slug.contains("seo")) {
            return "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80";
        }
        if (slug.contains("cloud") || slug.contains("aws") || slug.contains("devops")) {
            return "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80";
        }
        return "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80";
    }

    private String resolveDefaultAvatar(String instructorName) {
        if (instructorName == null) instructorName = "";
        String name = instructorName.toLowerCase();
        if (name.contains("priya")) {
            return "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80";
        }
        if (name.contains("arjun")) {
            return "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80";
        }
        if (name.contains("neha")) {
            return "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&q=80";
        }
        if (name.contains("rahul")) {
            return "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80";
        }
        return "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&q=80";
    }

    private String resolveFallbackVideoUrl(String courseTitle, int sortOrder) {
        String[] fallbackVideos = new String[]{
                "https://www.youtube.com/embed/nu_pCVPKzTk",
                "https://www.youtube.com/embed/VqCgcpAypFQ",
                "https://www.youtube.com/embed/kUMe1FH4CHE",
                "https://www.youtube.com/embed/1Rs2ND1ryYc",
                "https://www.youtube.com/embed/W6NZfCO5SIk",
                "https://www.youtube.com/embed/bMknfKXIFA8"
        };
        return fallbackVideos[Math.abs(sortOrder - 1) % fallbackVideos.length];
    }
}
