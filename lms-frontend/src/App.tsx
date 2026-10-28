import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ProtectedRoute } from './components/ProtectedRoute';

// Public & Marketing Pages
import { HomePage } from './pages/HomePage';
import { CourseCatalogPage } from './pages/CourseCatalogPage';
import { CourseDetailPage } from './pages/CourseDetailPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { CertificateVerificationPage } from './pages/CertificateVerificationPage';
import { PrivacyPolicyPage, TermsPage, RefundPolicyPage } from './pages/LegalPages';

// Auth Pages
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';

// Student Pages
import { StudentDashboardPage } from './pages/StudentDashboardPage';
import { CoursePlayerPage } from './pages/CoursePlayerPage';
import { QuizPlayerPage } from './pages/QuizPlayerPage';

// Admin Pages
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AdminCoursesPage } from './pages/admin/AdminCoursesPage';
import { AdminEnrollmentsPage } from './pages/admin/AdminEnrollmentsPage';
import { AdminStudentsPage } from './pages/admin/AdminStudentsPage';
import { AdminOrdersPage } from './pages/admin/AdminOrdersPage';
import { AdminLogsPage } from './pages/admin/AdminLogsPage';

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
          <Navbar />
          <main className="flex-1 flex flex-col">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/courses" element={<CourseCatalogPage />} />
              <Route path="/courses/:slug" element={<CourseDetailPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/verify-certificate" element={<CertificateVerificationPage />} />
              <Route path="/verify-certificate/:certificateId" element={<CertificateVerificationPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/privacy" element={<PrivacyPolicyPage />} />
              <Route path="/terms" element={<TermsPage />} />
              <Route path="/refund" element={<RefundPolicyPage />} />

              {/* Student Protected Routes */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <StudentDashboardPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/learn/:courseId"
                element={
                  <ProtectedRoute>
                    <CoursePlayerPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/quiz/:quizId"
                element={
                  <ProtectedRoute>
                    <QuizPlayerPage />
                  </ProtectedRoute>
                }
              />

              {/* Admin Protected Routes */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute requiredRole="ADMIN">
                    <AdminDashboardPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/courses"
                element={
                  <ProtectedRoute requiredRole="ADMIN">
                    <AdminCoursesPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/enrollments"
                element={
                  <ProtectedRoute requiredRole="ADMIN">
                    <AdminEnrollmentsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/students"
                element={
                  <ProtectedRoute requiredRole="ADMIN">
                    <AdminStudentsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/orders"
                element={
                  <ProtectedRoute requiredRole="ADMIN">
                    <AdminOrdersPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/logs"
                element={
                  <ProtectedRoute requiredRole="ADMIN">
                    <AdminLogsPage />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
