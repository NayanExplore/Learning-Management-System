import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '../context/AuthContext';
import { GraduationCap, Lock, Mail, AlertCircle, CheckCircle, Eye, EyeOff } from 'lucide-react';
import { Button } from '../components/ui/Button';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [serverError, setServerError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const from = (location.state as any)?.from?.pathname || '/dashboard';
  const successMessage = (location.state as any)?.message;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setLoading(true);
    setServerError(null);
    try {
      const auth = await login(data.email, data.password);
      if (auth.role === 'ADMIN') {
        navigate('/admin');
      } else {
        navigate(from, { replace: true });
      }
    } catch (err: any) {
      setServerError(err.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center py-16 px-4 sm:px-6 bg-[#FAFAF8] dark:bg-slate-950 transition-colors duration-150">
      <div className="max-w-md w-full bg-white dark:bg-slate-900 p-8 rounded-xl border border-[#E5E7EB] dark:border-slate-800 shadow-xs space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#172B4D] dark:bg-[#287C78] flex items-center justify-center text-white">
              <GraduationCap className="w-5 h-5" />
            </div>
            <span className="text-lg font-bold text-[#20252B] dark:text-white">SkillForge</span>
          </Link>
          <h2 className="text-xl font-bold text-[#20252B] dark:text-white tracking-tight">Log in to your account</h2>
          <p className="text-xs text-[#697386] dark:text-slate-400">
            Don't have an account?{' '}
            <Link to="/register" className="font-semibold text-[#172B4D] dark:text-[#287C78] hover:underline">
              Create an account
            </Link>
          </p>
        </div>

        {successMessage && (
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-lg text-xs text-emerald-800 dark:text-emerald-300 flex items-start gap-2">
            <CheckCircle className="w-4 h-4 shrink-0 text-emerald-600 dark:text-emerald-400 mt-0.5" />
            <span>{successMessage}</span>
          </div>
        )}

        {serverError && (
          <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 rounded-lg text-xs text-rose-700 dark:text-rose-300 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 dark:text-rose-400 mt-0.5" />
            <span>{serverError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-[#20252B] dark:text-slate-200 mb-1.5">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                {...register('email')}
                placeholder="you@company.com"
                className="w-full pl-9 pr-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-[#E5E7EB] dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#172B4D]/15 dark:focus:ring-[#287C78]/25 focus:bg-white dark:focus:bg-slate-900 text-[#20252B] dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-colors"
              />
            </div>
            {errors.email && <p className="text-xs text-rose-600 dark:text-rose-400 mt-1 font-medium">{errors.email.message}</p>}
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="font-semibold text-[#20252B] dark:text-slate-200">Password</label>
              <Link to="/forgot-password" className="text-xs font-medium text-[#172B4D] dark:text-[#287C78] hover:underline">
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                {...register('password')}
                placeholder="••••••••"
                className="w-full pl-9 pr-10 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-[#E5E7EB] dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#172B4D]/15 dark:focus:ring-[#287C78]/25 focus:bg-white dark:focus:bg-slate-900 text-[#20252B] dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 transition-colors p-1"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.password && <p className="text-xs text-rose-600 dark:text-rose-400 mt-1 font-medium">{errors.password.message}</p>}
          </div>

          <Button type="submit" variant="primary" size="md" className="w-full mt-2 dark:bg-[#287C78] dark:hover:bg-[#1E615E]" loading={loading}>
            Sign In
          </Button>
        </form>

        <div className="pt-2 text-center text-[11px] text-[#697386] dark:text-slate-500 border-t border-[#E5E7EB] dark:border-slate-800">
          Protected with 256-bit SSL encryption
        </div>
      </div>
    </div>
  );
};
