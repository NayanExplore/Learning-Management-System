import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '../context/AuthContext';
import { GraduationCap, Lock, Mail, User, Phone, AlertCircle } from 'lucide-react';

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
    <div className="flex-1 flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8 relative bg-slate-50/80 overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-500/10 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="max-w-md w-full bg-white p-8 sm:p-10 rounded-3xl border border-slate-200/90 shadow-card-elevated space-y-6 relative z-10 backdrop-blur-md">
        <div className="text-center">
          <Link to="/" className="inline-flex items-center space-x-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/25 group-hover:scale-105 transition-transform">
              <GraduationCap className="w-6 h-6" />
            </div>
            <span className="font-display font-extrabold text-2xl tracking-tight text-slate-900">
              SkillForge<span className="text-indigo-600">.</span>
            </span>
          </Link>
          <h2 className="mt-5 text-2xl sm:text-3xl font-display font-extrabold text-slate-900 tracking-tight">Create your account</h2>
          <p className="mt-1.5 text-xs sm:text-sm text-slate-500">
            Already have an account?{' '}
            <Link to="/login" className="font-bold text-indigo-600 hover:text-indigo-700 underline">
              Sign in here
            </Link>
          </p>
        </div>

        {serverError && (
          <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-start space-x-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
            <span>{serverError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Full Name
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                {...register('fullName')}
                placeholder="Priya Sharma"
                className="w-full pl-10 pr-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white text-slate-900 transition-all"
              />
            </div>
            {errors.fullName && <p className="text-xs text-rose-600 mt-1 font-medium">{errors.fullName.message}</p>}
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                {...register('email')}
                placeholder="priya@example.com"
                className="w-full pl-10 pr-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white text-slate-900 transition-all"
              />
            </div>
            {errors.email && <p className="text-xs text-rose-600 mt-1 font-medium">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Phone Number (For SMS & WhatsApp updates)
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="tel"
                {...register('phone')}
                placeholder="+91 98765 43210"
                className="w-full pl-10 pr-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white text-slate-900 transition-all"
              />
            </div>
            {errors.phone && <p className="text-xs text-rose-600 mt-1 font-medium">{errors.phone.message}</p>}
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Password (Minimum 8 characters)
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                {...register('password')}
                placeholder="••••••••"
                className="w-full pl-10 pr-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white text-slate-900 transition-all"
              />
            </div>
            {errors.password && <p className="text-xs text-rose-600 mt-1 font-medium">{errors.password.message}</p>}
          </div>

          <p className="text-xs text-slate-500 leading-relaxed pt-1">
            By creating an account, you agree to SkillForge's{' '}
            <Link to="/terms" className="text-indigo-600 font-semibold underline">Terms of Service</Link> and{' '}
            <Link to="/privacy" className="text-indigo-600 font-semibold underline">Privacy Policy</Link>.
          </p>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-bold py-3 rounded-xl text-sm shadow-md shadow-indigo-600/25 hover:shadow-lg transition-all duration-200 disabled:opacity-50 transform hover:-translate-y-0.5"
          >
            {loading ? 'Creating Account...' : 'Complete Free Registration'}
          </button>
        </form>

        <div className="pt-2 text-center text-xs text-slate-400 border-t border-slate-100">
          <span>Protected with 256-Bit SSL encryption & verifiable certificates</span>
        </div>
      </div>
    </div>
  );
};
