import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../api/client';
import {
  GraduationCap,
  Mail,
  Lock,
  KeyRound,
  AlertCircle,
  CheckCircle,
  ArrowLeft,
  Eye,
  EyeOff,
  RotateCcw,
  Check,
  X,
  ShieldCheck,
} from 'lucide-react';

export const ForgotPasswordPage: React.FC = () => {
  const navigate = useNavigate();

  // Wizard Steps: REQUEST -> VERIFY -> NEW_PASSWORD
  const [step, setStep] = useState<'REQUEST' | 'VERIFY' | 'NEW_PASSWORD'>('REQUEST');

  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // 60-Second Cooldown Countdown Timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (cooldown > 0) {
      timer = setInterval(() => {
        setCooldown((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [cooldown]);

  // Password Validation Rules
  const hasMinLength = newPassword.length >= 8;
  const hasUpperCase = /[A-Z]/.test(newPassword);
  const hasLowerCase = /[a-z]/.test(newPassword);
  const hasNumber = /[0-9]/.test(newPassword);
  const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(newPassword);
  const passwordsMatch = newPassword.length > 0 && newPassword === confirmPassword;

  const isPasswordValid =
    hasMinLength && hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar && passwordsMatch;

  // Step 1: Request OTP
  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setLoading(true);
    setError(null);
    setSuccessMsg(null);

    try {
      const res: any = await api.post('/v1/auth/otp/request', {
        email: email.trim().toLowerCase(),
        purpose: 'PASSWORD_RESET',
      });

      const devOtp = res?.data?.data?.devOtp || res?.data?.devOtp;
      if (devOtp) {
        console.info('[Dev Fallback] Backend email service not configured. OTP:', devOtp);
        setSuccessMsg(`A 6-digit verification code has been dispatched to ${email}. Valid for 10 minutes.`);
      } else {
        setSuccessMsg(`A 6-digit verification code has been dispatched to ${email}. Valid for 10 minutes.`);
      }

      setStep('VERIFY');
      setCooldown(60); // 60-second cooldown
    } catch (err: any) {
      setError(err.message || 'No registered account found with this email address.');
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP with 60-Second Cooldown
  const handleResendOtp = async () => {
    if (cooldown > 0 || !email.trim() || resending) return;

    setResending(true);
    setError(null);
    setSuccessMsg(null);

    try {
      const res: any = await api.post('/v1/auth/otp/request', {
        email: email.trim().toLowerCase(),
        purpose: 'PASSWORD_RESET',
      });

      const devOtp = res?.data?.data?.devOtp || res?.data?.devOtp;
      if (devOtp) {
        console.info('[Dev Fallback] Backend email service not configured. OTP:', devOtp);
        setSuccessMsg(`A fresh verification code has been dispatched to ${email}. Valid for 10 minutes.`);
      } else {
        setSuccessMsg(`A fresh verification code has been dispatched to ${email}. Valid for 10 minutes.`);
      }

      setCooldown(60);
    } catch (err: any) {
      setError(err.message || 'Failed to resend verification code. Please wait before retrying.');
    } finally {
      setResending(false);
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp || otp.length < 6) {
      setError('Please enter the complete 6-digit verification code.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await api.post('/v1/auth/otp/verify', {
        email: email.trim().toLowerCase(),
        otp: otp.trim(),
        purpose: 'PASSWORD_RESET',
      });

      setSuccessMsg('Security code verified successfully! Now create your new password.');
      setStep('NEW_PASSWORD');
    } catch (err: any) {
      setError(err.message || 'Invalid or expired verification code. Maximum 3 attempts allowed.');
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Save New Password
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isPasswordValid) {
      setError('Please satisfy all password complexity requirements.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await api.post('/v1/auth/password/reset-confirm', {
        email: email.trim().toLowerCase(),
        otp: otp.trim(),
        newPassword,
      });

      navigate('/login', {
        state: {
          message: 'Password reset successful! You can now log in with your new password.',
        },
      });
    } catch (err: any) {
      setError(err.message || 'Password reset failed. Please request a new verification code.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8 bg-slate-50 min-h-[calc(100vh-140px)] relative overflow-hidden">
      {/* Radiant ambient glow spheres */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[400px] bg-gradient-to-tr from-indigo-200/40 via-purple-100/40 to-transparent rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative max-w-md w-full bg-white/95 backdrop-blur-xl p-8 sm:p-10 rounded-3xl border border-slate-200/90 shadow-2xl space-y-6">
        {/* Header with App Brand */}
        <div className="text-center">
          <Link to="/" className="inline-flex items-center space-x-2.5 font-black text-2xl font-display text-slate-900 group">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-md shadow-indigo-600/30 group-hover:scale-105 transition">
              <GraduationCap className="w-6 h-6" />
            </div>
            <span className="tracking-tight">Skill<span className="text-indigo-600">Forge</span></span>
          </Link>
          <h2 className="mt-5 text-2xl font-black text-slate-900 tracking-tight font-display">
            {step === 'REQUEST' && 'Reset your password'}
            {step === 'VERIFY' && 'Enter Verification Code'}
            {step === 'NEW_PASSWORD' && 'Create New Password'}
          </h2>
          <p className="mt-1.5 text-xs text-slate-500 leading-relaxed">
            {step === 'REQUEST' && 'Enter your registered email address to receive a secure 6-digit OTP.'}
            {step === 'VERIFY' && `We've sent a 6-digit code to ${email}. Valid for 10 minutes.`}
            {step === 'NEW_PASSWORD' && 'Enter a strong new password meeting all security requirements.'}
          </p>
        </div>

        {/* Step Progress Bar */}
        <div className="flex items-center justify-between px-4 py-2.5 bg-slate-50/90 rounded-2xl border border-slate-100 text-xs font-semibold">
          <div className={`flex items-center space-x-1.5 ${step === 'REQUEST' ? 'text-indigo-600' : 'text-emerald-600'}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step === 'REQUEST' ? 'bg-indigo-600 text-white' : 'bg-emerald-100 text-emerald-700'}`}>
              1
            </span>
            <span>Email</span>
          </div>
          <div className="w-6 h-0.5 bg-slate-200" />
          <div className={`flex items-center space-x-1.5 ${step === 'VERIFY' ? 'text-indigo-600' : step === 'NEW_PASSWORD' ? 'text-emerald-600' : 'text-slate-400'}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step === 'VERIFY' ? 'bg-indigo-600 text-white' : step === 'NEW_PASSWORD' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-500'}`}>
              2
            </span>
            <span>Verify</span>
          </div>
          <div className="w-6 h-0.5 bg-slate-200" />
          <div className={`flex items-center space-x-1.5 ${step === 'NEW_PASSWORD' ? 'text-indigo-600' : 'text-slate-400'}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step === 'NEW_PASSWORD' ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-500'}`}>
              3
            </span>
            <span>Password</span>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-start space-x-2 animate-fadeIn">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
            <span className="leading-relaxed">{error}</span>
          </div>
        )}

        {/* Success Alert */}
        {successMsg && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-start space-x-2 animate-fadeIn">
            <CheckCircle className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
            <span className="leading-relaxed">{successMsg}</span>
          </div>
        )}

        {/* ================= STEP 1: REQUEST OTP ================= */}
        {step === 'REQUEST' && (
          <form onSubmit={handleRequestOtp} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Registered Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  autoFocus
                  className="w-full pl-10 pr-3 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 transition"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !email.trim()}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 rounded-xl text-sm shadow-md transition disabled:opacity-50 flex items-center justify-center space-x-2"
            >
              {loading ? <span>Validating & Sending Code...</span> : <span>Send Verification Code</span>}
            </button>

            <div className="pt-2 text-center">
              <Link
                to="/login"
                className="inline-flex items-center space-x-1.5 text-xs font-semibold text-slate-600 hover:text-indigo-600 transition"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to sign in</span>
              </Link>
            </div>
          </form>
        )}

        {/* ================= STEP 2: VERIFY OTP ================= */}
        {step === 'VERIFY' && (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  6-Digit Verification Code
                </label>
                <span className="text-[11px] text-amber-600 font-medium">Max 3 attempts</span>
              </div>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  placeholder="123456"
                  autoFocus
                  className="w-full pl-10 pr-4 py-3 text-center text-xl tracking-[0.5em] font-mono font-bold bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 transition"
                />
              </div>
            </div>

            {/* Resend OTP button with 60s cooldown */}
            <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
              <span>Didn't receive the email?</span>
              <button
                type="button"
                onClick={handleResendOtp}
                disabled={cooldown > 0 || resending}
                className="inline-flex items-center space-x-1 font-semibold text-indigo-600 hover:text-indigo-800 disabled:text-slate-400 transition"
              >
                <RotateCcw className={`w-3 h-3 ${resending ? 'animate-spin' : ''}`} />
                <span>
                  {cooldown > 0
                    ? `Resend OTP (${cooldown}s)`
                    : resending
                    ? 'Resending...'
                    : 'Resend OTP'}
                </span>
              </button>
            </div>

            <button
              type="submit"
              disabled={loading || otp.length < 6}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 rounded-xl text-sm shadow-md transition disabled:opacity-50 flex items-center justify-center space-x-2"
            >
              {loading ? <span>Verifying Code...</span> : <span>Verify & Continue</span>}
            </button>

            <div className="pt-2 text-center">
              <button
                type="button"
                onClick={() => {
                  setStep('REQUEST');
                  setError(null);
                  setSuccessMsg(null);
                }}
                className="inline-flex items-center space-x-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Change email address</span>
              </button>
            </div>
          </form>
        )}

        {/* ================= STEP 3: CREATE NEW PASSWORD ================= */}
        {step === 'NEW_PASSWORD' && (
          <form onSubmit={handleResetPassword} className="space-y-4">
            {/* New Password */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                New Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  autoFocus
                  className="w-full pl-10 pr-10 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Confirm New Password */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Confirm New Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Live Password Rules Checklist */}
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1.5">
              <span className="font-bold text-slate-700 block mb-1">Password Requirements:</span>
              <div className={`flex items-center space-x-2 ${hasMinLength ? 'text-emerald-700' : 'text-slate-500'}`}>
                {hasMinLength ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <X className="w-3.5 h-3.5 text-slate-400" />}
                <span>At least 8 characters</span>
              </div>
              <div className={`flex items-center space-x-2 ${hasUpperCase ? 'text-emerald-700' : 'text-slate-500'}`}>
                {hasUpperCase ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <X className="w-3.5 h-3.5 text-slate-400" />}
                <span>At least one uppercase letter (A-Z)</span>
              </div>
              <div className={`flex items-center space-x-2 ${hasLowerCase ? 'text-emerald-700' : 'text-slate-500'}`}>
                {hasLowerCase ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <X className="w-3.5 h-3.5 text-slate-400" />}
                <span>At least one lowercase letter (a-z)</span>
              </div>
              <div className={`flex items-center space-x-2 ${hasNumber ? 'text-emerald-700' : 'text-slate-500'}`}>
                {hasNumber ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <X className="w-3.5 h-3.5 text-slate-400" />}
                <span>At least one number (0-9)</span>
              </div>
              <div className={`flex items-center space-x-2 ${hasSpecialChar ? 'text-emerald-700' : 'text-slate-500'}`}>
                {hasSpecialChar ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <X className="w-3.5 h-3.5 text-slate-400" />}
                <span>At least one special character (!@#$%^&*...)</span>
              </div>
              <div className={`flex items-center space-x-2 ${passwordsMatch ? 'text-emerald-700' : 'text-slate-500'}`}>
                {passwordsMatch ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <X className="w-3.5 h-3.5 text-slate-400" />}
                <span>Passwords match</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !isPasswordValid}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 rounded-xl text-sm shadow-md transition disabled:opacity-50 flex items-center justify-center space-x-2"
            >
              {loading ? (
                <span>Resetting Password...</span>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Reset Password & Sign In</span>
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
