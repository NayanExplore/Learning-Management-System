-- =============================================
-- SkillForge LMS - Initial Schema Migration (MySQL)
-- =============================================

-- Users & Authentication
CREATE TABLE users (
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    email           VARCHAR(255) NOT NULL UNIQUE,
    password_hash   VARCHAR(255) NOT NULL,
    full_name       VARCHAR(255) NOT NULL,
    phone           VARCHAR(20),
    avatar_url      VARCHAR(512),
    role            VARCHAR(20) NOT NULL DEFAULT 'STUDENT',
    email_verified  BOOLEAN NOT NULL DEFAULT FALSE,
    phone_verified  BOOLEAN NOT NULL DEFAULT FALSE,
    enabled         BOOLEAN NOT NULL DEFAULT TRUE,
    created_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT chk_user_role CHECK (role IN ('STUDENT', 'ADMIN'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX idx_users_role ON users(role);

-- OTP Verification
CREATE TABLE otp_records (
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id         BIGINT,
    phone           VARCHAR(20),
    email           VARCHAR(255),
    otp_hash        VARCHAR(255) NOT NULL,
    purpose         VARCHAR(30) NOT NULL,
    attempts        INT NOT NULL DEFAULT 0,
    verified        BOOLEAN NOT NULL DEFAULT FALSE,
    expires_at      DATETIME NOT NULL,
    created_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_otp_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT chk_otp_purpose CHECK (purpose IN ('PHONE_VERIFY', 'EMAIL_VERIFY', 'PASSWORD_RESET', 'LOGIN'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX idx_otp_user ON otp_records(user_id);
CREATE INDEX idx_otp_expires ON otp_records(expires_at);

-- Refresh Tokens
CREATE TABLE refresh_tokens (
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id         BIGINT NOT NULL,
    token_hash      VARCHAR(255) NOT NULL UNIQUE,
    expires_at      DATETIME NOT NULL,
    revoked         BOOLEAN NOT NULL DEFAULT FALSE,
    created_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_refresh_token_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX idx_refresh_token_user ON refresh_tokens(user_id);

-- Courses
CREATE TABLE courses (
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    title           VARCHAR(255) NOT NULL,
    slug            VARCHAR(255) NOT NULL UNIQUE,
    short_description VARCHAR(500),
    description     TEXT,
    thumbnail_url   VARCHAR(512),
    instructor_name VARCHAR(255),
    instructor_bio  TEXT,
    instructor_avatar VARCHAR(512),
    duration_hours  INT,
    price           DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    original_price  DECIMAL(10,2),
    currency        VARCHAR(3) NOT NULL DEFAULT 'INR',
    status          VARCHAR(20) NOT NULL DEFAULT 'DRAFT',
    featured        BOOLEAN NOT NULL DEFAULT FALSE,
    sort_order      INT NOT NULL DEFAULT 0,
    learning_outcomes JSON,
    prerequisites   JSON,
    language        VARCHAR(50) DEFAULT 'English',
    level           VARCHAR(20) DEFAULT 'BEGINNER',
    enrollment_count INT NOT NULL DEFAULT 0,
    created_by      BIGINT,
    created_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    published_at    DATETIME,
    CONSTRAINT fk_courses_created_by FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
    CONSTRAINT chk_course_status CHECK (status IN ('DRAFT', 'PUBLISHED', 'ARCHIVED')),
    CONSTRAINT chk_course_level CHECK (level IN ('BEGINNER', 'INTERMEDIATE', 'ADVANCED'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX idx_courses_status ON courses(status);
CREATE INDEX idx_courses_featured ON courses(featured);

-- Course Sections
CREATE TABLE course_sections (
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    course_id       BIGINT NOT NULL,
    title           VARCHAR(255) NOT NULL,
    description     TEXT,
    sort_order      INT NOT NULL DEFAULT 0,
    created_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_sections_course FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX idx_sections_course ON course_sections(course_id);

-- Lessons
CREATE TABLE lessons (
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    section_id      BIGINT NOT NULL,
    course_id       BIGINT NOT NULL,
    title           VARCHAR(255) NOT NULL,
    description     TEXT,
    content_type    VARCHAR(20) NOT NULL DEFAULT 'VIDEO',
    video_url       VARCHAR(512),
    video_duration_seconds INT,
    content_text    TEXT,
    sort_order      INT NOT NULL DEFAULT 0,
    is_preview      BOOLEAN NOT NULL DEFAULT FALSE,
    is_mandatory    BOOLEAN NOT NULL DEFAULT TRUE,
    created_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_lessons_section FOREIGN KEY (section_id) REFERENCES course_sections(id) ON DELETE CASCADE,
    CONSTRAINT fk_lessons_course FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
    CONSTRAINT chk_lesson_type CHECK (content_type IN ('VIDEO', 'TEXT', 'PDF', 'RESOURCE'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX idx_lessons_section ON lessons(section_id);
CREATE INDEX idx_lessons_course ON lessons(course_id);

-- Lesson Resources (downloadable files)
CREATE TABLE lesson_resources (
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    lesson_id       BIGINT NOT NULL,
    title           VARCHAR(255) NOT NULL,
    file_key        VARCHAR(512) NOT NULL,
    file_size       BIGINT,
    file_type       VARCHAR(100),
    created_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_resources_lesson FOREIGN KEY (lesson_id) REFERENCES lessons(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX idx_resources_lesson ON lesson_resources(lesson_id);

-- Enrollments
CREATE TABLE enrollments (
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id         BIGINT NOT NULL,
    course_id       BIGINT NOT NULL,
    status          VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    enrolled_at     DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    completed_at    DATETIME,
    progress_pct    DECIMAL(5,2) NOT NULL DEFAULT 0.00,
    CONSTRAINT uq_enrollment UNIQUE (user_id, course_id),
    CONSTRAINT fk_enrollments_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_enrollments_course FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
    CONSTRAINT chk_enrollment_status CHECK (status IN ('ACTIVE', 'COMPLETED', 'SUSPENDED'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX idx_enrollments_user ON enrollments(user_id);
CREATE INDEX idx_enrollments_course ON enrollments(course_id);

-- Orders
CREATE TABLE orders (
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_number    VARCHAR(50) NOT NULL UNIQUE,
    user_id         BIGINT NOT NULL,
    course_id       BIGINT NOT NULL,
    amount          DECIMAL(10,2) NOT NULL,
    currency        VARCHAR(3) NOT NULL DEFAULT 'INR',
    status          VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    razorpay_order_id VARCHAR(100),
    notes           TEXT,
    created_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_orders_user FOREIGN KEY (user_id) REFERENCES users(id),
    CONSTRAINT fk_orders_course FOREIGN KEY (course_id) REFERENCES courses(id),
    CONSTRAINT chk_order_status CHECK (status IN ('PENDING', 'PAID', 'FAILED', 'REFUNDED', 'CANCELLED'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_orders_course ON orders(course_id);
CREATE INDEX idx_orders_rz_order ON orders(razorpay_order_id);

-- Payments
CREATE TABLE payments (
    id                  BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_id            BIGINT NOT NULL,
    razorpay_payment_id VARCHAR(100) UNIQUE,
    razorpay_order_id   VARCHAR(100),
    razorpay_signature  VARCHAR(255),
    amount              DECIMAL(10,2) NOT NULL,
    currency            VARCHAR(3) NOT NULL DEFAULT 'INR',
    status              VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    method              VARCHAR(50),
    error_code          VARCHAR(100),
    error_description   TEXT,
    webhook_verified    BOOLEAN NOT NULL DEFAULT FALSE,
    created_at          DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at          DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_payments_order FOREIGN KEY (order_id) REFERENCES orders(id),
    CONSTRAINT chk_payment_status CHECK (status IN ('PENDING', 'AUTHORIZED', 'CAPTURED', 'FAILED', 'REFUNDED'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX idx_payments_order ON payments(order_id);

-- Quizzes
CREATE TABLE quizzes (
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    course_id       BIGINT NOT NULL,
    lesson_id       BIGINT,
    title           VARCHAR(255) NOT NULL,
    description     TEXT,
    passing_score   INT NOT NULL DEFAULT 70,
    max_attempts    INT DEFAULT NULL,
    time_limit_minutes INT,
    is_required     BOOLEAN NOT NULL DEFAULT FALSE,
    sort_order      INT NOT NULL DEFAULT 0,
    created_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_quizzes_course FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
    CONSTRAINT fk_quizzes_lesson FOREIGN KEY (lesson_id) REFERENCES lessons(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX idx_quizzes_course ON quizzes(course_id);
CREATE INDEX idx_quizzes_lesson ON quizzes(lesson_id);

-- Quiz Questions
CREATE TABLE quiz_questions (
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    quiz_id         BIGINT NOT NULL,
    question_text   TEXT NOT NULL,
    question_type   VARCHAR(20) NOT NULL DEFAULT 'SINGLE_CHOICE',
    explanation     TEXT,
    points          INT NOT NULL DEFAULT 1,
    sort_order      INT NOT NULL DEFAULT 0,
    created_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_questions_quiz FOREIGN KEY (quiz_id) REFERENCES quizzes(id) ON DELETE CASCADE,
    CONSTRAINT chk_question_type CHECK (question_type IN ('SINGLE_CHOICE', 'MULTIPLE_CHOICE', 'TRUE_FALSE'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX idx_questions_quiz ON quiz_questions(quiz_id);

-- Answer Options
CREATE TABLE answer_options (
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    question_id     BIGINT NOT NULL,
    option_text     TEXT NOT NULL,
    is_correct      BOOLEAN NOT NULL DEFAULT FALSE,
    sort_order      INT NOT NULL DEFAULT 0,
    CONSTRAINT fk_options_question FOREIGN KEY (question_id) REFERENCES quiz_questions(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX idx_options_question ON answer_options(question_id);

-- Quiz Attempts
CREATE TABLE quiz_attempts (
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    quiz_id         BIGINT NOT NULL,
    user_id         BIGINT NOT NULL,
    score           DECIMAL(5,2),
    total_points    INT,
    earned_points   INT,
    passed          BOOLEAN,
    started_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    submitted_at    DATETIME,
    status          VARCHAR(20) NOT NULL DEFAULT 'IN_PROGRESS',
    CONSTRAINT fk_attempts_quiz FOREIGN KEY (quiz_id) REFERENCES quizzes(id) ON DELETE CASCADE,
    CONSTRAINT fk_attempts_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT chk_attempt_status CHECK (status IN ('IN_PROGRESS', 'SUBMITTED', 'GRADED'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX idx_attempts_quiz ON quiz_attempts(quiz_id);
CREATE INDEX idx_attempts_user ON quiz_attempts(user_id);

-- Quiz Responses
CREATE TABLE quiz_responses (
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    attempt_id      BIGINT NOT NULL,
    question_id     BIGINT NOT NULL,
    selected_option_ids JSON,
    is_correct      BOOLEAN,
    points_earned   INT DEFAULT 0,
    CONSTRAINT fk_responses_attempt FOREIGN KEY (attempt_id) REFERENCES quiz_attempts(id) ON DELETE CASCADE,
    CONSTRAINT fk_responses_question FOREIGN KEY (question_id) REFERENCES quiz_questions(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX idx_responses_attempt ON quiz_responses(attempt_id);

-- Lesson Progress
CREATE TABLE lesson_progress (
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id         BIGINT NOT NULL,
    lesson_id       BIGINT NOT NULL,
    course_id       BIGINT NOT NULL,
    completed       BOOLEAN NOT NULL DEFAULT FALSE,
    progress_pct    DECIMAL(5,2) NOT NULL DEFAULT 0.00,
    last_position   INT DEFAULT 0,
    completed_at    DATETIME,
    updated_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT uq_lesson_progress UNIQUE (user_id, lesson_id),
    CONSTRAINT fk_lprogress_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_lprogress_lesson FOREIGN KEY (lesson_id) REFERENCES lessons(id) ON DELETE CASCADE,
    CONSTRAINT fk_lprogress_course FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX idx_lprogress_user ON lesson_progress(user_id);
CREATE INDEX idx_lprogress_course ON lesson_progress(course_id);

-- Certificates
CREATE TABLE certificates (
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    certificate_id  VARCHAR(50) NOT NULL UNIQUE,
    user_id         BIGINT NOT NULL,
    course_id       BIGINT NOT NULL,
    enrollment_id   BIGINT,
    student_name    VARCHAR(255) NOT NULL,
    course_title    VARCHAR(255) NOT NULL,
    issue_date      DATE NOT NULL,
    file_key        VARCHAR(512),
    file_url        VARCHAR(512),
    created_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_certificate UNIQUE (user_id, course_id),
    CONSTRAINT fk_certificates_user FOREIGN KEY (user_id) REFERENCES users(id),
    CONSTRAINT fk_certificates_course FOREIGN KEY (course_id) REFERENCES courses(id),
    CONSTRAINT fk_certificates_enrollment FOREIGN KEY (enrollment_id) REFERENCES enrollments(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX idx_certificates_user ON certificates(user_id);
CREATE INDEX idx_certificates_course ON certificates(course_id);

-- Notification Logs
CREATE TABLE notification_logs (
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id         BIGINT,
    channel         VARCHAR(20) NOT NULL,
    recipient       VARCHAR(255) NOT NULL,
    template_name   VARCHAR(100),
    subject         VARCHAR(500),
    status          VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    provider_message_id VARCHAR(255),
    error_message   TEXT,
    retry_count     INT NOT NULL DEFAULT 0,
    payload         JSON,
    created_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_notif_user FOREIGN KEY (user_id) REFERENCES users(id),
    CONSTRAINT chk_notif_channel CHECK (channel IN ('EMAIL', 'SMS', 'WHATSAPP')),
    CONSTRAINT chk_notif_status CHECK (status IN ('PENDING', 'SENT', 'DELIVERED', 'FAILED', 'BOUNCED'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX idx_notif_user ON notification_logs(user_id);
CREATE INDEX idx_notif_channel ON notification_logs(channel);
CREATE INDEX idx_notif_status ON notification_logs(status);

-- Audit Logs
CREATE TABLE audit_logs (
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id         BIGINT,
    action          VARCHAR(100) NOT NULL,
    entity_type     VARCHAR(50),
    entity_id       BIGINT,
    details         JSON,
    ip_address      VARCHAR(45),
    created_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_audit_user FOREIGN KEY (user_id) REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX idx_audit_user ON audit_logs(user_id);
CREATE INDEX idx_audit_action ON audit_logs(action);
CREATE INDEX idx_audit_entity ON audit_logs(entity_type, entity_id);
CREATE INDEX idx_audit_created ON audit_logs(created_at);

-- Site Settings (key-value)
CREATE TABLE site_settings (
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    setting_key     VARCHAR(100) NOT NULL UNIQUE,
    setting_value   TEXT,
    updated_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
