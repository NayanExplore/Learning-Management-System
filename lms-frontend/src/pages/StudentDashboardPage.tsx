import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/client';
import { EnrollmentItem, Certificate } from '../types';
import { useAuth } from '../context/AuthContext';
import {
  BookOpen,
  Award,
  CheckCircle,
  Clock,
  ArrowRight,
  Download,
  ShieldCheck,
  AlertCircle,
  Mail,
  KeyRound,
  X,
  Check,
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { EmptyState } from '../components/ui/EmptyState';
import { Modal } from '../components/ui/Modal';
import { Input } from '../components/ui/Input';

export const StudentDashboardPage: React.FC = () => {
  const { user, refreshUser } = useAuth();
  const [enrollments, setEnrollments] = useState<EnrollmentItem[]>([]);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);

  // Email verification state
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [sendingOtp, setSendingOtp] = useState(false);
  const [verifyingOtp, setVerifyingOtp] = useState(false);
  const [verifyMsg, setVerifyMsg] = useState<string | null>(null);
  const [verifyError, setVerifyError] = useState<string | null>(null);

  const handleOpenVerifyModal = () => {
    setShowVerifyModal(true);
    setVerifyError(null);
    setVerifyMsg(null);
    setOtpCode('');
    handleSendVerifyCode();
  };

  const handleSendVerifyCode = async () => {
    if (!user?.email) return;
    setSendingOtp(true);
    setVerifyError(null);
    try {
      const res: any = await api.post('/v1/auth/otp/request', {
        email: user.email,
        purpose: 'EMAIL_VERIFY',
      });
      const devOtp = res?.data?.data?.devOtp || res?.data?.devOtp;
      if (devOtp) {
        setOtpCode(devOtp);
        setVerifyMsg(`Verification code sent. (Dev mode: ${devOtp})`);
      } else {
        setVerifyMsg(`A 6-digit verification code has been dispatched to ${user.email}.`);
      }
    } catch (err: any) {
      setVerifyError(err.message || 'Failed to dispatch verification code');
    } finally {
      setSendingOtp(false);
    }
  };

  const handleConfirmVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpCode || !user?.email) return;
    setVerifyingOtp(true);
    setVerifyError(null);
    try {
      await api.post('/v1/auth/otp/verify', {
        email: user.email,
        otp: otpCode,
        purpose: 'EMAIL_VERIFY',
      });
      await refreshUser();
      setShowVerifyModal(false);
      setOtpCode('');
    } catch (err: any) {
      setVerifyError(err.message || 'Invalid or expired verification code');
    } finally {
      setVerifyingOtp(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [enrRes, certRes] = await Promise.all([
          api.get('/v1/student/enrollments'),
          api.get('/v1/student/certificates'),
        ]);

        if (enrRes.data?.success && Array.isArray(enrRes.data.data)) {
          setEnrollments(enrRes.data.data);
        }
        if (certRes.data?.success && Array.isArray(certRes.data.data)) {
          setCertificates(certRes.data.data);
        }
      } catch (err) {
        console.error('Failed to fetch student dashboard data', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const downloadCertificate = async (certificateId: string) => {
    try {
      const response = await api.get(`/v1/certificates/${certificateId}/download`, {
        responseType: 'blob',
      });
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${certificateId}.pdf`;
      link.click();
      window.URL.revokeObjectURL(url);
    } catch {
      alert('Failed to download certificate PDF.');
    }
  };

  const completedCount = enrollments.filter((e) => e.status === 'COMPLETED').length;
  const inProgressEnrollments = enrollments.filter((e) => e.status !== 'COMPLETED');

  return (
    <div className="flex-1 bg-[#FAFAF8] dark:bg-slate-950 py-8 lg:py-12 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Welcome Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#E5E7EB] dark:border-slate-800">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#20252B] dark:text-white tracking-tight">
              Welcome back, {user?.fullName || 'Student'}
            </h1>
            <p className="text-sm text-[#697386] dark:text-slate-400 mt-1">
              Track your course progress, resume active lectures, and manage your certificates.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link to="/courses">
              <Button variant="outline" size="sm" iconRight={<ArrowRight className="w-4 h-4" />}>
                Browse Catalog
              </Button>
            </Link>
          </div>
        </div>

        {/* Email verification reminder banner (if not verified) */}
        {user && !user.emailVerified && (
          <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/60 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-start gap-3">
              <Mail className="w-5 h-5 text-amber-700 dark:text-amber-400 shrink-0 mt-0.5" />
              <div className="text-xs text-amber-900 dark:text-amber-200 leading-relaxed">
                <span className="font-semibold">Verify your email address: </span>
                <span>
                  Please verify <strong>{user.email}</strong> to ensure access to password resets and certificate issuance notices.
                </span>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleOpenVerifyModal}
              className="bg-white dark:bg-slate-900 border-amber-300 dark:border-amber-700 text-amber-900 dark:text-amber-300 hover:bg-amber-100/60 shrink-0 self-start sm:self-auto"
            >
              Verify Email Now
            </Button>
          </div>
        )}

        {/* Continue Learning Section (Active courses) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-[#20252B] dark:text-white">Continue Learning</h2>
            <span className="text-xs text-[#697386] dark:text-slate-400">
              {inProgressEnrollments.length} active {inProgressEnrollments.length === 1 ? 'course' : 'courses'}
            </span>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2].map((i) => (
                <div key={i} className="h-32 bg-white dark:bg-slate-900 rounded-xl border border-[#E5E7EB] dark:border-slate-800 animate-pulse" />
              ))}
            </div>
          ) : inProgressEnrollments.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {inProgressEnrollments.map((item) => (
                <div
                  key={item.enrollmentId}
                  className="bg-white dark:bg-slate-900 rounded-xl border border-[#E5E7EB] dark:border-slate-800 p-5 shadow-xs flex flex-col justify-between space-y-4 hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-12 bg-slate-100 dark:bg-slate-800 rounded-lg overflow-hidden shrink-0 border border-[#E5E7EB] dark:border-slate-800">
                      {item.course?.thumbnailUrl ? (
                        <img
                          src={item.course.thumbnailUrl}
                          alt={item.course.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-400 dark:text-slate-500">
                          <BookOpen className="w-5 h-5" />
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-semibold text-[#20252B] dark:text-white truncate">
                        {item.course?.title}
                      </h3>
                      <p className="text-xs text-[#697386] dark:text-slate-400 mt-0.5">
                        {item.course?.instructorName || 'SkillForge Faculty'}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[#697386] dark:text-slate-400">Overall Progress</span>
                      <span className="font-semibold text-[#172B4D] dark:text-teal-400">{item.progressPct || 0}%</span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-[#287C78] dark:bg-teal-500 h-full rounded-full transition-all duration-300"
                        style={{ width: `${item.progressPct || 0}%` }}
                      />
                    </div>
                  </div>

                  <div className="pt-2 border-t border-[#E5E7EB] dark:border-slate-800 flex items-center justify-between">
                    <span className="text-[11px] text-[#697386] dark:text-slate-400">
                      Enrolled: {new Date(item.enrolledAt).toLocaleDateString()}
                    </span>
                    <Link to={`/learn/${item.course?.id}`}>
                      <Button variant="primary" size="sm" iconRight={<ArrowRight className="w-3.5 h-3.5" />}>
                        Resume Course
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : enrollments.length === 0 ? (
            <EmptyState
              icon={<BookOpen className="w-6 h-6" />}
              title="You haven't enrolled in any courses yet"
              description="Explore our curriculum catalog to find programs matching your engineering goals."
              actionLabel="Explore Courses"
              actionHref="/courses"
            />
          ) : (
            <p className="text-xs text-[#697386] dark:text-slate-400">You have completed all your active enrolled courses!</p>
          )}
        </div>

        {/* Certificates & Achievements */}
        <div className="space-y-4 pt-4 border-t border-[#E5E7EB] dark:border-slate-800">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-[#20252B] dark:text-white">Earned Certificates</h2>
            <span className="text-xs text-[#697386] dark:text-slate-400">
              {certificates.length} {certificates.length === 1 ? 'credential' : 'credentials'}
            </span>
          </div>

          {certificates.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {certificates.map((cert) => (
                <div
                  key={cert.id}
                  className="bg-white dark:bg-slate-900 rounded-xl border border-[#E5E7EB] dark:border-slate-800 p-5 shadow-xs space-y-3"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-[#287C78] dark:text-emerald-400 flex items-center justify-center border border-emerald-100 dark:border-emerald-900/50">
                      <Award className="w-4 h-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs text-[#697386] dark:text-slate-400">Verified Credential</p>
                      <h4 className="text-xs font-mono font-semibold text-[#172B4D] dark:text-teal-400 truncate">
                        {cert.certificateId}
                      </h4>
                    </div>
                  </div>

                  <p className="text-sm font-semibold text-[#20252B] dark:text-slate-100 line-clamp-2">
                    {cert.courseTitle}
                  </p>

                  <div className="pt-2 border-t border-[#E5E7EB] dark:border-slate-800 flex items-center justify-between gap-2">
                    <Link
                      to={`/verify-certificate/${cert.certificateId}`}
                      className="text-xs font-medium text-[#172B4D] dark:text-teal-400 hover:underline"
                    >
                      View on Registry
                    </Link>
                    <button
                      type="button"
                      onClick={() => downloadCertificate(cert.certificateId)}
                      className="inline-flex items-center gap-1 text-xs text-[#697386] dark:text-slate-400 hover:text-[#20252B] dark:hover:text-slate-200"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download PDF</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-[#E5E7EB] dark:border-slate-800 text-center text-xs text-[#697386] dark:text-slate-400">
              Complete all lessons in an enrolled course to receive a verifiable completion certificate.
            </div>
          )}
        </div>
      </div>

      {/* Email Verification Modal */}
      <Modal
        isOpen={showVerifyModal}
        onClose={() => setShowVerifyModal(false)}
        title="Verify your email address"
        description={`We've dispatched a 6-digit verification code to ${user?.email}.`}
      >
        <form onSubmit={handleConfirmVerifyCode} className="space-y-4">
          {verifyMsg && (
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 text-emerald-800 dark:text-emerald-300 rounded-lg text-xs flex items-start gap-2">
              <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
              <span>{verifyMsg}</span>
            </div>
          )}

          {verifyError && (
            <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-800 dark:text-rose-300 rounded-lg text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
              <span>{verifyError}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-[#20252B] dark:text-slate-200 mb-1.5">
              6-Digit Code
            </label>
            <input
              type="text"
              maxLength={6}
              value={otpCode}
              onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
              placeholder="123456"
              className="w-full text-center font-mono text-xl tracking-widest px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-[#E5E7EB] dark:border-slate-700 text-[#20252B] dark:text-slate-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#172B4D]/20 focus:border-[#172B4D]"
              autoFocus
              required
            />
          </div>

          <div className="flex items-center justify-between text-xs text-[#697386] dark:text-slate-400">
            <span>Didn't receive it?</span>
            <button
              type="button"
              onClick={handleSendVerifyCode}
              disabled={sendingOtp}
              className="text-[#172B4D] dark:text-teal-400 font-medium hover:underline disabled:opacity-50"
            >
              {sendingOtp ? 'Sending...' : 'Resend code'}
            </button>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#E5E7EB] dark:border-slate-800">
            <Button variant="ghost" size="sm" onClick={() => setShowVerifyModal(false)}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              loading={verifyingOtp}
              disabled={otpCode.length < 6}
            >
              Confirm Verification
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
