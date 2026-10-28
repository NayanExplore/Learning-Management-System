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
  ExternalLink,
  ShieldCheck,
  AlertCircle,
  Mail,
  KeyRound,
  X,
  Check,
} from 'lucide-react';

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
  const [otpSent, setOtpSent] = useState(false);
  const [verifyMsg, setVerifyMsg] = useState<string | null>(null);
  const [verifyError, setVerifyError] = useState<string | null>(null);

  const handleOpenVerifyModal = () => {
    setShowVerifyModal(true);
    setVerifyError(null);
    setVerifyMsg(null);
    setOtpCode('');
    setOtpSent(false);
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
      setOtpSent(true);
      const devOtp = res?.data?.data?.devOtp || res?.data?.devOtp;
      if (devOtp) {
        setOtpCode(devOtp);
        setVerifyMsg(`A 6-digit verification code has been dispatched. (Dev Mode: ${devOtp})`);
      } else {
        setVerifyMsg(`A 6-digit verification code has been sent to ${user.email}. Please check your inbox and spam folder.`);
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
      setOtpSent(false);
      alert('Congratulations! Your email address has been successfully verified.');
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

        if (enrRes.data?.success) {
          setEnrollments(enrRes.data.data);
        }
        if (certRes.data?.success) {
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
    } catch (err) {
      alert('Failed to download certificate PDF.');
    }
  };

  const completedCount = enrollments.filter((e) => e.status === 'COMPLETED').length;

  return (
    <div className="flex-1 bg-slate-50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome Header */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 text-indigo-600 font-bold text-xs uppercase tracking-widest mb-1.5 bg-indigo-50 border border-indigo-100 px-2.5 py-0.5 rounded-full">
              <span>Student Learning Cockpit</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-slate-900 tracking-tight">
              Welcome back, {user?.fullName}!
            </h1>
            <p className="text-slate-500 text-sm mt-1 leading-relaxed">
              Track your course progression, attend sequential lectures, pass server assessments, and unlock accredited certificates.
            </p>
          </div>
          {user?.emailVerified ? (
            <div className="inline-flex items-center space-x-2 bg-emerald-50 text-emerald-700 border border-emerald-200 px-3.5 py-1.5 rounded-full text-xs font-bold self-start md:self-auto shadow-2xs">
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              <span>Email Verified ({user.email})</span>
            </div>
          ) : (
            <button
              onClick={handleOpenVerifyModal}
              className="inline-flex items-center space-x-2 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300 px-4 py-2 rounded-full text-xs font-bold transition self-start md:self-auto shadow-xs"
            >
              <Mail className="w-3.5 h-3.5 text-amber-600" />
              <span>Verify Email Address</span>
            </button>
          )}
        </div>

        {/* Unverified Email Alert Banner */}
        {user && !user.emailVerified && (
          <div className="mb-8 bg-amber-50/80 border border-amber-200/90 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
            <div className="flex items-start space-x-3.5">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-amber-900">
                  Please verify your email address ({user.email})
                </h3>
                <p className="text-xs text-amber-700 mt-0.5 leading-relaxed">
                  A verification code can be dispatched to your inbox to authenticate your SkillForge student account.
                </p>
              </div>
            </div>
            <button
              onClick={handleOpenVerifyModal}
              className="bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-xs transition shrink-0"
            >
              Send Verification Email
            </button>
          </div>
        )}

        {/* Stats Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
          <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md transition-shadow flex items-center space-x-4">
            <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 shrink-0 border border-indigo-100">
              <BookOpen className="w-7 h-7" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Enrolled Courses</p>
              <p className="text-3xl font-display font-extrabold text-slate-900 mt-0.5">{enrollments.length}</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md transition-shadow flex items-center space-x-4">
            <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 shrink-0 border border-emerald-100">
              <CheckCircle className="w-7 h-7" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Completed Courses</p>
              <p className="text-3xl font-display font-extrabold text-slate-900 mt-0.5">{completedCount}</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md transition-shadow flex items-center space-x-4">
            <div className="w-14 h-14 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-600 shrink-0 border border-purple-100">
              <Award className="w-7 h-7" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Certificates Earned</p>
              <p className="text-3xl font-display font-extrabold text-slate-900 mt-0.5">{certificates.length}</p>
            </div>
          </div>
        </div>

        {/* Enrolled Courses Section */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-display font-bold text-slate-900 tracking-tight">My Active Courses</h2>
            <Link to="/courses" className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center space-x-1">
              <span>Browse Catalog</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2].map((i) => (
                <div key={i} className="h-48 bg-slate-200/70 rounded-2xl animate-pulse"></div>
              ))}
            </div>
          ) : enrollments.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {enrollments.map((item) => (
                <div
                  key={item.enrollmentId}
                  className="bg-white p-6 rounded-2xl border border-slate-200/90 hover:border-indigo-500/40 shadow-sm hover:shadow-card-hover transition-all duration-300 flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                        {item.course.level}
                      </span>
                      {item.status === 'COMPLETED' ? (
                        <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 flex items-center space-x-1">
                          <CheckCircle className="w-3.5 h-3.5" />
                          <span>Completed</span>
                        </span>
                      ) : (
                        <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-200">In Progress</span>
                      )}
                    </div>

                    <h3 className="font-display font-bold text-slate-900 text-lg mb-2 group-hover:text-indigo-600 transition-colors">{item.course.title}</h3>

                    {/* Gradient Progress Bar */}
                    <div className="space-y-1.5 my-4">
                      <div className="flex justify-between text-xs text-slate-500 font-semibold">
                        <span>Course Completion</span>
                        <span className="text-slate-900 font-bold">{item.progressPct}%</span>
                      </div>
                      <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-indigo-500 to-purple-600 h-full rounded-full transition-all duration-500"
                          style={{ width: `${item.progressPct}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2">
                    <Link
                      to={`/learn/${item.course.id}`}
                      className="inline-flex items-center space-x-2 text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-3 rounded-xl transition shadow-md shadow-indigo-600/20 hover:shadow-indigo-600/35 w-full justify-center transform hover:-translate-y-0.5"
                    >
                      <span>Continue Learning</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-slate-200/90 p-10 text-center max-w-md mx-auto shadow-sm">
              <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-800 font-bold text-base">You haven't enrolled in any courses yet</p>
              <p className="text-slate-500 text-xs mt-1 mb-5">
                Explore our industry-expert led programs to get started.
              </p>
              <Link
                to="/courses"
                className="inline-block bg-indigo-600 text-white font-bold text-xs px-5 py-2.5 rounded-xl hover:bg-indigo-700 transition shadow-sm"
              >
                Browse Catalog
              </Link>
            </div>
          )}
        </div>

        {/* Earned Certificates Section */}
        <div>
          <h2 className="text-xl font-bold text-slate-900 mb-6">Earned Certificates</h2>

          {certificates.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {certificates.map((cert) => (
                <div
                  key={cert.id}
                  className="bg-white p-6 rounded-2xl border border-indigo-100 shadow-sm relative overflow-hidden flex flex-col justify-between"
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-50 rounded-bl-full -mr-8 -mt-8 z-0"></div>

                  <div className="relative z-10">
                    <div className="w-10 h-10 bg-indigo-600 text-white rounded-xl flex items-center justify-center mb-4 shadow">
                      <Award className="w-5 h-5" />
                    </div>

                    <h3 className="font-bold text-slate-900 text-base mb-1">{cert.courseTitle}</h3>
                    <p className="text-xs text-slate-500 mb-2">Issued on {cert.issueDate}</p>

                    <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100 mb-4 font-mono text-xs text-slate-600">
                      ID: <span className="font-semibold text-indigo-700">{cert.certificateId}</span>
                    </div>
                  </div>

                  <div className="relative z-10 space-y-2 pt-2 border-t border-slate-100">
                    <button
                      onClick={() => downloadCertificate(cert.certificateId)}
                      className="w-full flex items-center justify-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs py-2 rounded-lg transition shadow-sm"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download PDF</span>
                    </button>
                    <Link
                      to={`/verify-certificate/${cert.certificateId}`}
                      className="w-full flex items-center justify-center space-x-1 text-slate-600 hover:text-indigo-600 font-semibold text-xs py-1 transition"
                    >
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Public Verification Link</span>
                      <ExternalLink className="w-3 h-3 ml-0.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center max-w-md mx-auto">
              <Award className="w-10 h-10 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-700 font-semibold text-sm">No certificates earned yet</p>
              <p className="text-slate-500 text-xs mt-1">
                Complete all mandatory lessons and score 70%+ on course quizzes to receive your verifiable certificate.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Email Verification Modal */}
      {showVerifyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 max-w-md w-full overflow-hidden p-6 sm:p-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Verify Your Email</h3>
                  <p className="text-xs text-slate-500">Confirm your SkillForge student account</p>
                </div>
              </div>
              <button
                onClick={() => setShowVerifyModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-sm text-slate-600 mb-4 leading-relaxed">
              We've dispatched a 6-digit verification code to <span className="font-semibold text-slate-900">{user?.email}</span>.
            </p>

            {verifyMsg && (
              <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-start space-x-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>{verifyMsg}</span>
              </div>
            )}

            {verifyError && (
              <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs flex items-start space-x-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span>{verifyError}</span>
              </div>
            )}

            <form onSubmit={handleConfirmVerifyCode} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  6-Digit Verification Code
                </label>
                <div className="relative">
                  <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    maxLength={6}
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                    placeholder="e.g. 123456"
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-mono text-center text-lg tracking-widest text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition"
                    autoFocus
                    required
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                <span>Didn't receive the email?</span>
                <button
                  type="button"
                  onClick={handleSendVerifyCode}
                  disabled={sendingOtp}
                  className="font-semibold text-indigo-600 hover:text-indigo-800 disabled:opacity-50 transition"
                >
                  {sendingOtp ? 'Sending...' : 'Resend Code'}
                </button>
              </div>

              <div className="flex items-center space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowVerifyModal(false)}
                  className="flex-1 py-2.5 px-4 rounded-xl border border-slate-200 text-slate-700 font-semibold text-sm hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={verifyingOtp || otpCode.length < 6}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-sm shadow-md transition flex items-center justify-center space-x-2"
                >
                  {verifyingOtp ? (
                    <span>Verifying...</span>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      <span>Confirm & Verify</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
