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
  Check,
} from 'lucide-react';
import { Button } from '../components/ui/Button';

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
    let timer: any;
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
  const passwordsMatch = newPassword.length > 0 && newPassword === confirmPassword;

  const isPasswordValid = hasMinLength && hasUpperCase && hasLowerCase && hasNumber && passwordsMatch;

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
        setOtp(devOtp);
        setSuccessMsg(`A 6-digit verification code has been dispatched. (Dev Mode: ${devOtp})`);
      } else {
        setSuccessMsg(`A 6-digit verification code has been dispatched to ${email.trim()}.`);
      }

      setCooldown(60);
      setStep('VERIFY');
    } catch (err: any) {
      setError(err.message || 'Failed to request password reset code.');
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Resend OTP
  const handleResendOtp = async () => {
    if (cooldown > 0 || !email.trim()) return;
    setResending(true);
    setError(null);

    try {
      const res: any = await api.post('/v1/auth/otp/request', {
        email: email.trim().toLowerCase(),
        purpose: 'PASSWORD_RESET',
      });

      const devOtp = res?.data?.data?.devOtp || res?.data?.devOtp;
      if (devOtp) {
        setOtp(devOtp);
        setSuccessMsg(`New code dispatched. (Dev Mode: ${devOtp})`);
      } else {
        setSuccessMsg(`A new verification code has been dispatched to ${email.trim()}.`);
      }
      setCooldown(60);
    } catch (err: any) {
      setError(err.message || 'Failed to resend code.');
    } finally {
      setResending(false);
    }
  };

  // Step 3: Verify OTP Code
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length < 6) {
      setError('Please enter the full 6-digit code.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await api.post('/v1/auth/verify-otp', {
        email: email.trim().toLowerCase(),
        otp: otp.trim(),
        purpose: 'PASSWORD_RESET',
      });

      setSuccessMsg('Code verified. Set your new password below.');
      setStep('NEW_PASSWORD');
    } catch (err: any) {
      setError(err.message || 'Invalid or expired verification code.');
    } finally {
      setLoading(false);
    }
  };

  // Step 4: Reset Password Confirmation
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isPasswordValid) {
      setError('Please satisfy all password security requirements.');
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
        state: { message: 'Your password has been updated. Please log in with your new credentials.' },
        replace: true,
      });
    } catch (err: any) {
      setError(err.message || 'Failed to reset password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center py-16 px-4 sm:px-6 bg-[#FAFAF8]">
      <div className="max-w-md w-full bg-white p-8 rounded-xl border border-[#E5E7EB] shadow-xs space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#172B4D] flex items-center justify-center text-white">
              <GraduationCap className="w-5 h-5" />
            </div>
            <span className="text-lg font-bold text-[#20252B]">SkillForge</span>
          </Link>
          <h2 className="text-xl font-bold text-[#20252B] tracking-tight">
            {step === 'REQUEST' && 'Reset your password'}
            {step === 'VERIFY' && 'Enter verification code'}
            {step === 'NEW_PASSWORD' && 'Choose a new password'}
          </h2>
          <p className="text-xs text-[#697386]">
            {step === 'REQUEST' && 'Enter your verified account email to receive a recovery code.'}
            {step === 'VERIFY' && `We sent a 6-digit code to ${email}`}
            {step === 'NEW_PASSWORD' && 'Create a strong password with at least 8 characters.'}
          </p>
        </div>

        {/* Step indicator */}
        <div className="flex items-center justify-center gap-2 text-xs">
          <span className={`w-2 h-2 rounded-full ${step === 'REQUEST' ? 'bg-[#172B4D]' : 'bg-[#287C78]'}`} />
          <span className={`w-6 h-0.5 ${step === 'REQUEST' ? 'bg-slate-200' : 'bg-[#287C78]'}`} />
          <span className={`w-2 h-2 rounded-full ${step === 'VERIFY' ? 'bg-[#172B4D]' : step === 'NEW_PASSWORD' ? 'bg-[#287C78]' : 'bg-slate-200'}`} />
          <span className={`w-6 h-0.5 ${step === 'NEW_PASSWORD' ? 'bg-[#287C78]' : 'bg-slate-200'}`} />
          <span className={`w-2 h-2 rounded-full ${step === 'NEW_PASSWORD' ? 'bg-[#172B4D]' : 'bg-slate-200'}`} />
        </div>

        {successMsg && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-800 flex items-start gap-2">
            <CheckCircle className="w-4 h-4 shrink-0 text-emerald-600 mt-0.5" />
            <span>{successMsg}</span>
          </div>
        )}

        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-700 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* STEP 1: Request code */}
        {step === 'REQUEST' && (
          <form onSubmit={handleRequestOtp} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-[#20252B] mb-1.5">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  className="w-full pl-9 pr-3.5 py-2 text-sm bg-slate-50 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#172B4D]/15 focus:bg-white text-[#20252B]"
                />
              </div>
            </div>

            <Button type="submit" variant="primary" size="md" className="w-full mt-2" loading={loading}>
              Send Verification Code
            </Button>
          </form>
        )}

        {/* STEP 2: Verify code */}
        {step === 'VERIFY' && (
          <form onSubmit={handleVerifyOtp} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-[#20252B] mb-1.5">6-Digit Code</label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  maxLength={6}
                  required
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  placeholder="123456"
                  className="w-full pl-9 pr-3.5 py-2 text-center font-mono text-lg tracking-widest bg-slate-50 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#172B4D]/15 focus:bg-white text-[#20252B]"
                  autoFocus
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-[#697386]">
              <button
                type="button"
                onClick={() => setStep('REQUEST')}
                className="hover:underline flex items-center gap-1"
              >
                <ArrowLeft className="w-3 h-3" /> Change email
              </button>
              <button
                type="button"
                onClick={handleResendOtp}
                disabled={cooldown > 0 || resending}
                className="font-medium text-[#172B4D] hover:underline disabled:opacity-50"
              >
                {cooldown > 0 ? `Resend in ${cooldown}s` : 'Resend code'}
              </button>
            </div>

            <Button type="submit" variant="primary" size="md" className="w-full mt-2" loading={loading}>
              Verify Code
            </Button>
          </form>
        )}

        {/* STEP 3: New password */}
        {step === 'NEW_PASSWORD' && (
          <form onSubmit={handleResetPassword} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-[#20252B] mb-1.5">New Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-10 py-2 text-sm bg-slate-50 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#172B4D]/15 focus:bg-white text-[#20252B]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block font-semibold text-[#20252B] mb-1.5">Confirm Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-10 py-2 text-sm bg-slate-50 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#172B4D]/15 focus:bg-white text-[#20252B]"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Checklist */}
            <div className="p-3 bg-slate-50 rounded-lg border border-[#E5E7EB] space-y-1.5 text-[11px] text-[#697386]">
              <div className="flex items-center gap-2">
                <span className={`w-3 h-3 rounded-full flex items-center justify-center ${hasMinLength ? 'text-emerald-600' : 'text-slate-300'}`}>
                  ✓
                </span>
                <span>At least 8 characters</span>
              </div>
              <div className="flex items-center gap-2">
                <span className={`w-3 h-3 rounded-full flex items-center justify-center ${hasUpperCase && hasLowerCase ? 'text-emerald-600' : 'text-slate-300'}`}>
                  ✓
                </span>
                <span>Upper and lowercase letters</span>
              </div>
              <div className="flex items-center gap-2">
                <span className={`w-3 h-3 rounded-full flex items-center justify-center ${hasNumber ? 'text-emerald-600' : 'text-slate-300'}`}>
                  ✓
                </span>
                <span>At least one number</span>
              </div>
              <div className="flex items-center gap-2">
                <span className={`w-3 h-3 rounded-full flex items-center justify-center ${passwordsMatch ? 'text-emerald-600' : 'text-slate-300'}`}>
                  ✓
                </span>
                <span>Passwords match</span>
              </div>
            </div>

            <Button type="submit" variant="primary" size="md" className="w-full mt-2" loading={loading} disabled={!isPasswordValid}>
              Update Password
            </Button>
          </form>
        )}

        <div className="pt-2 text-center text-xs text-[#697386] border-t border-[#E5E7EB]">
          <Link to="/login" className="font-medium text-[#172B4D] hover:underline inline-flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" /> Return to login
          </Link>
        </div>
      </div>
    </div>
  );
};
