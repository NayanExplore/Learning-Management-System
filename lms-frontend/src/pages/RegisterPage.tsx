import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '../context/AuthContext';
import { GraduationCap, Lock, Mail, User, Phone, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { Button } from '../components/ui/Button';

const registerSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  phone: z.string().optional(),
});

type RegisterFormData = z.infer<typeof registerSchema>;

export const RegisterPage: React.FC = () => {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    setLoading(true);
    setServerError(null);
    try {
      await registerUser(data.fullName, data.email, data.password, data.phone);
      navigate('/dashboard');
    } catch (err: any) {
      setServerError(err.message || 'Registration failed');
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
          <h2 className="text-xl font-bold text-[#20252B] tracking-tight">Create your account</h2>
          <p className="text-xs text-[#697386]">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-[#172B4D] hover:underline">
              Sign in
            </Link>
          </p>
        </div>

        {serverError && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-700 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
            <span>{serverError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-[#20252B] mb-1.5">Full Name</label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                {...register('fullName')}
                placeholder="Jane Doe"
                className="w-full pl-9 pr-3.5 py-2 text-sm bg-slate-50 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#172B4D]/15 focus:bg-white text-[#20252B]"
              />
            </div>
            {errors.fullName && <p className="text-xs text-rose-600 mt-1 font-medium">{errors.fullName.message}</p>}
          </div>

          <div>
            <label className="block font-semibold text-[#20252B] mb-1.5">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                {...register('email')}
                placeholder="you@company.com"
                className="w-full pl-9 pr-3.5 py-2 text-sm bg-slate-50 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#172B4D]/15 focus:bg-white text-[#20252B]"
              />
            </div>
            {errors.email && <p className="text-xs text-rose-600 mt-1 font-medium">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block font-semibold text-[#20252B] mb-1.5">Phone Number (Optional)</label>
            <div className="relative">
              <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="tel"
                {...register('phone')}
                placeholder="+91 98765 43210"
                className="w-full pl-9 pr-3.5 py-2 text-sm bg-slate-50 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#172B4D]/15 focus:bg-white text-[#20252B]"
              />
            </div>
            {errors.phone && <p className="text-xs text-rose-600 mt-1 font-medium">{errors.phone.message}</p>}
          </div>

          <div>
            <label className="block font-semibold text-[#20252B] mb-1.5">Password (Minimum 8 characters)</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                {...register('password')}
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
            {errors.password && <p className="text-xs text-rose-600 mt-1 font-medium">{errors.password.message}</p>}
          </div>

          <p className="text-[11px] text-[#697386] leading-relaxed pt-1">
            By creating an account, you agree to SkillForge's{' '}
            <Link to="/terms" className="text-[#172B4D] font-medium hover:underline">Terms</Link> and{' '}
            <Link to="/privacy" className="text-[#172B4D] font-medium hover:underline">Privacy Policy</Link>.
          </p>

          <Button type="submit" variant="primary" size="md" className="w-full mt-2" loading={loading}>
            Create Account
          </Button>
        </form>

        <div className="pt-2 text-center text-[11px] text-[#697386] border-t border-[#E5E7EB]">
          Protected with 256-bit SSL encryption
        </div>
      </div>
    </div>
  );
};
