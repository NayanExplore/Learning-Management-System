export interface User {
  id: number;
  email: string;
  fullName: string;
  phone?: string;
  role: 'STUDENT' | 'ADMIN';
  emailVerified: boolean;
  phoneVerified: boolean;
  enabled?: boolean;
}

export interface AuthResponse {
  id: number;
  email: string;
  fullName: string;
  phone?: string;
  role: 'STUDENT' | 'ADMIN';
  emailVerified: boolean;
  phoneVerified: boolean;
  token?: string;
}

export interface CourseSummary {
  id: number;
  title: string;
  slug: string;
  shortDescription?: string;
  thumbnailUrl?: string;
  instructorName?: string;
  durationHours?: number;
  price: number;
  originalPrice?: number;
  currency: string;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  featured: boolean;
  level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  enrollmentCount: number;
}

export interface Lesson {
  id: number;
  sectionId?: number;
  courseId?: number;
  title: string;
  description?: string;
  contentType: 'VIDEO' | 'TEXT' | 'PDF' | 'RESOURCE';
  videoUrl?: string;
  videoDurationSeconds?: number;
  contentText?: string;
  sortOrder: number;
  preview: boolean;
  mandatory: boolean;
  completed?: boolean;
}

export interface CourseSection {
  id: number;
  courseId: number;
  title: string;
  description?: string;
  sortOrder: number;
  lessons: Lesson[];
}

export interface CourseDetail {
  id: number;
  title: string;
  slug: string;
  shortDescription?: string;
  description?: string;
  thumbnailUrl?: string;
  instructorName?: string;
  instructorBio?: string;
  instructorAvatar?: string;
  durationHours?: number;
  price: number;
  originalPrice?: number;
  currency: string;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  featured: boolean;
  learningOutcomes?: string[];
  prerequisites?: string[];
  language?: string;
  level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  enrollmentCount: number;
  isEnrolled: boolean;
  progressPct?: number;
  sections: CourseSection[];
}

export interface EnrollmentItem {
  enrollmentId: number;
  course: CourseSummary;
  status: 'ACTIVE' | 'COMPLETED' | 'SUSPENDED';
  progressPct: number;
  enrolledAt: string;
}

export interface OrderResponse {
  id: number;
  orderNumber: string;
  courseId: number;
  courseTitle: string;
  amount: number;
  currency: string;
  status: 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';
  razorpayOrderId: string;
  razorpayKeyId?: string;
  createdAt: string;
}

export interface QuizOption {
  id: number;
  optionText: string;
}

export interface QuizQuestion {
  id: number;
  questionText: string;
  questionType: 'SINGLE_CHOICE' | 'MULTIPLE_CHOICE' | 'TRUE_FALSE';
  points: number;
  options: QuizOption[];
}

export interface Quiz {
  id: number;
  courseId: number;
  lessonId?: number;
  title: string;
  description?: string;
  passingScore: number;
  timeLimitMinutes?: number;
  required: boolean;
  questions: QuizQuestion[];
}

export interface QuizResult {
  attemptId: number;
  quizId: number;
  score: number;
  totalPoints: number;
  earnedPoints: number;
  passingScore: number;
  passed: boolean;
  courseCompleted: boolean;
  certificateId?: string;
  feedback: {
    questionId: number;
    correct: boolean;
    pointsEarned: number;
    explanation?: string;
    correctOptionIds: number[];
  }[];
}

export interface Certificate {
  id: number;
  certificateId: string;
  courseId: number;
  studentName: string;
  courseTitle: string;
  issueDate: string;
  fileUrl?: string;
}

export interface CertificateVerifyResult {
  valid: boolean;
  certificateId: string;
  studentName?: string;
  courseTitle?: string;
  issueDate?: string;
  issuer?: string;
}

export interface DashboardStats {
  totalStudents: number;
  publishedCourses: number;
  totalEnrollments: number;
  totalOrders: number;
  totalRevenue: number;
  totalCertificatesIssued: number;
}

export interface AdminEnrollment {
  id: number;
  student: {
    id: number;
    fullName: string;
    email: string;
    phone?: string;
    avatarUrl?: string;
    enabled: boolean;
    createdAt: string;
  };
  course: {
    id: number;
    title: string;
    slug: string;
    price: number;
    originalPrice?: number;
    currency: string;
    level: string;
    durationHours?: number;
    thumbnailUrl?: string;
    instructorName?: string;
  };
  status: 'ACTIVE' | 'COMPLETED' | 'SUSPENDED';
  progressPct: number;
  enrolledAt: string;
  completedAt?: string;
}
