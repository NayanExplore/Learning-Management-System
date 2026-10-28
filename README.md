# SkillForge LMS & Marketing Platform

A production-ready, full-stack Learning Management System (LMS) and marketing website engineered for modern training organizations. SkillForge enables visitors to explore curricula, register, verify identities via SMS/Email OTP, purchase courses securely via Razorpay, stream structured video lectures, complete server-evaluated assessments, and automatically receive verifiable, cryptographically authenticated PDF certificates.

---

## 🏛️ System Architecture

SkillForge is built as a **maintainable modular monolith** rather than distributed microservices to ensure strict transaction consistency, simple deployment, and zero inter-service network overhead.

```
                           +---------------------------+
                           |   Vite + React Frontend   |
                           |  (TypeScript, Tailwind)   |
                           +-------------+-------------+
                                         |
                            HTTP / REST  | HttpOnly Cookie / JWT
                                         v
+---------------------------------------------------------------------------------+
|                       SkillForge Backend (Spring Boot 3.2)                     |
|                                                                                 |
|  +----------------+  +----------------+  +----------------+  +---------------+  |
|  | Authentication |  |    Courses     |  |     Orders     |  |    Quizzes    |  |
|  |  & OTP (MSG91) |  |   & Lessons    |  |   & Payments   |  |  & Scoring    |  |
|  +----------------+  +----------------+  +----------------+  +---------------+  |
|                                                                                 |
|  +----------------+  +----------------+  +----------------+  +---------------+  |
|  |  Certificates  |  | Notifications  |  |  File Storage  |  | Administrator |  |
|  | (PDFBox 3.x)   |  | (Email/WA/SMS) |  |   (AWS S3)     |  |   Dashboard   |  |
|  +----------------+  +----------------+  +----------------+  +---------------+  |
+----------------------------------------+----------------------------------------+
                                         |
                             Flyway SQL  | HikariCP Pool
                                         v
                           +---------------------------+
                           |      MySQL Database       |
                           +---------------------------+
```

### Key Architectural Tenets
1. **Server-Authoritative Pricing**: Course fees are strictly read from the backend database at order initialization. The client price is never trusted.
2. **Cryptographic Payment Verification**: All Razorpay payment captures are verified using HMAC-SHA256 signature calculation over the order and payment references. Webhook payloads are verified against raw request bodies.
3. **Server-Evaluated Assessments**: Quiz answer keys and point values remain strictly on the server. The client receives only questions and options without correct answer indicators.
4. **Automated Verifiable Credentialing**: Upon fulfilling 100% of mandatory lessons and scoring $\ge 70\%$ on required assessments, Apache PDFBox compiles an official PDF certificate with a unique certificate ID and publishes it to private storage.
5. **PII-Guarded Public Registry**: The public verification endpoint permits validation by unique certificate ID while concealing student email, phone, and internal score logs.
6. **Stateless Security with HttpOnly Cookies**: Sensitive JWT tokens are transferred in `HttpOnly`, `SameSite=Lax` cookies, preventing cross-site scripting (XSS) extraction from `localStorage`.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 18, TypeScript, Vite, Tailwind CSS, React Router v6, React Hook Form, Zod, Lucide Icons |
| **Backend** | Java 21, Spring Boot 3.2.5, Spring Security 6, Spring Data JPA, Hibernate 6, Bean Validation |
| **Database** | MySQL 8+ with Flyway Database Migrations (`V1__initial_schema.sql`, `V2__seed_data.sql`) |
| **PDF Engine** | Apache PDFBox 3.0.2 |
| **External Providers** | Razorpay (Payments), WhatsApp Business Cloud API, MSG91 (SMS OTP), Resend/SES (Email), AWS S3 (Storage) |
| **Testing** | JUnit 5, Mockito, Spring Boot MockMvc Integration Tests, Vitest |
| **DevOps** | Docker, Docker Compose, Multi-stage Dockerfiles, Nginx |

---

## 🚀 Quick Start (Local Development)

### Prerequisites
- **Java 21 JDK** installed (`java -version`)
- **Node.js 20+** and npm (`node -v`, `npm -v`)
- **MySQL 8+** (or Docker for database container)

### 1. Database Setup
Start a local MySQL database or run MySQL via Docker:
```bash
docker run --name sf-mysql -e MYSQL_DATABASE=skillforge_lms -e MYSQL_ROOT_PASSWORD=rootpassword -p 3306:3306 -d mysql:8.4
```

### 2. Run the Backend
Navigate to `lms-backend` and run using the included Maven launcher:
```powershell
cd lms-backend
.\mvn.ps1 spring-boot:run
```
The backend initializes the database schema via Flyway, applies seed courses, and listens on `http://localhost:8080/api`.
- Swagger / OpenAPI UI: `http://localhost:8080/api/swagger-ui.html`
- Health Endpoint: `http://localhost:8080/api/actuator/health`

### 3. Run the Frontend
In a separate terminal, navigate to `lms-frontend`:
```powershell
cd lms-frontend
npm install
npm run dev
```
Open your browser at `http://localhost:5173`. The Vite development proxy forwards all `/api` requests to the Spring Boot backend on port 8080.

---

## 🐳 Docker Compose (Single-Command Launch)

To start the complete multi-tier system (MySQL + Spring Boot + Nginx React Frontend):

```bash
docker-compose up --build
```
- Web Application: `http://localhost:5173`
- Backend API: `http://localhost:8080/api`
- MySQL: Port `3306`

---

## 🔑 Administrator Account Bootstrap

SkillForge contains **zero hardcoded backdoors or default production passwords**.

To initialize the primary administrator, configure the bootstrap variables before launching:
```env
ADMIN_BOOTSTRAP_EMAIL=admin@skillforge.com
ADMIN_BOOTSTRAP_PASSWORD=YourStrongMasterPassword2026!
```
On application boot, `AdminBootstrapRunner` checks if an administrator exists. If none exists, it provisions the account with a BCrypt-hashed password. Once created, subsequent startups ignore these variables.

---

## 💳 External Provider Setup Guide

### 1. Razorpay Payment Gateway
1. Create an account at [dashboard.razorpay.com](https://dashboard.razorpay.com).
2. Generate API Keys in **Settings &rarr; API Keys** (Test Mode).
3. Set in `.env`:
   ```env
   RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxx
   RAZORPAY_KEY_SECRET=yyyyyyyyyyyyyyyyyyyy
   RAZORPAY_WEBHOOK_SECRET=zzzzzzzzzzzzzzzzzzzz
   ```
4. In the Razorpay dashboard, add a Webhook pointing to:
   `https://yourdomain.com/api/v1/payments/webhook`
   Enable events: `payment.captured` and `order.paid`.

### 2. WhatsApp Business Cloud API
1. Set up an App in [Meta for Developers](https://developers.facebook.com) with the WhatsApp product.
2. Obtain a **System User Access Token** and **Phone Number ID**.
3. Create and approve the following templates in WhatsApp Manager:
   - `order_confirmation_template` (parameters: `{{course}}`, `{{order}}`)
   - `certificate_issued_template` (parameters: `{{name}}`, `{{course}}`, `{{certId}}`)
4. Configure in `.env`:
   ```env
   WHATSAPP_ACCESS_TOKEN=EAAG...
   WHATSAPP_PHONE_NUMBER_ID=109876543210
   ```

### 3. MSG91 SMS OTP
1. Register at [msg91.com](https://msg91.com).
2. Obtain your AuthKey and create an OTP Template in the MSG91 portal.
3. Configure in `.env`:
   ```env
   MSG91_AUTH_KEY=YourMsg91AuthKey
   MSG91_TEMPLATE_ID=YourTemplateId
   MSG91_SENDER_ID=SKLFRG
   ```

### 4. Transactional Email (Google SMTP Protocol)
- Configure your Google Gmail account with a 16-character App Password (from Google Account Security > 2-Step Verification > App Passwords).
- Configure in `.env`:
   ```env
   EMAIL_PROVIDER=smtp
   MAIL_HOST=smtp.gmail.com
   MAIL_PORT=587
   MAIL_USERNAME=YourGmailAddress@gmail.com
   MAIL_PASSWORD="your 16 char app password"
   MAIL_SMTP_AUTH=true
   MAIL_SMTP_STARTTLS=true
   EMAIL_FROM=YourGmailAddress@gmail.com
   EMAIL_FROM_NAME=SkillForge Academy
   ```

### 5. AWS S3 File Storage
Create an S3 bucket with Block Public Access enabled (private). SkillForge generates secure presigned download URLs:
```env
AWS_ACCESS_KEY_ID=AKIA...
AWS_SECRET_ACCESS_KEY=secret...
AWS_REGION=ap-south-1
AWS_S3_BUCKET=skillforge-lms
```
*Note: If AWS credentials are left empty during local development, the system automatically falls back to secure local file storage in `data/uploads`.*

---

## 🧪 Automated Testing

### Backend Unit & Integration Tests (JUnit 5 + Mockito + MockMvc)
```powershell
cd lms-backend
.\mvn.ps1 test
```
**Results: 22 tests passing with 0 failures:**
- `AuthServiceTest`: 6 tests (Registration, Login, Duplicate email rejection, OTP rate limit & cooldown, Max attempt lockout)
- `PaymentServiceTest`: 4 tests (Authoritative server pricing, Valid HMAC verification, Forgery rejection, Idempotency)
- `QuizServiceTest`: 3 tests (Answer masking, Server-side score evaluation, Threshold validation)
- `CertificateServiceTest`: 4 tests (PDFBox compilation, Duplicate certificate prevention, Public verification without PII)
- `SecurityIntegrationTest`: 5 tests (Public route accessibility, Student vs Admin role-based authorization)

### Frontend Unit & Schema Tests (Vitest)
```powershell
cd lms-frontend
npm run test
```
**Results: 3 tests passing with 0 failures.**

---

## 🛡️ Application Security & Compliance

- **Password Hashing**: BCrypt with work factor 12.
- **Session Tokens**: JWT Signed with HMAC-SHA256 (minimum 256-bit key requirement enforced on boot).
- **Rate Limiting**: Cooldown thresholds and maximum attempt limits on OTP generation prevent SMS abuse.
- **Path Traversal Protection**: Local file storage normalizes paths and verifies root boundaries before saving or streaming files.
- **SQL Injection Prevention**: Spring Data JPA parameter binding across all queries.
- **CORS & CSRF**: Granular origin whitelisting with credentials support and SameSite cookie policies.

---

## 📄 License
Copyright &copy; 2026 SkillForge Academy Pvt Ltd. All rights reserved.
