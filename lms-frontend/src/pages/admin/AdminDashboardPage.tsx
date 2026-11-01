import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../api/client';
import { AdminEnrollment, DashboardStats } from '../../types';
import { AdminNav } from '../../components/AdminNav';
import {
  Users,
  BookOpen,
  GraduationCap,
  CreditCard,
  Award,
  BellRing,
  ArrowRight,
  Plus,
  UserPlus,
  TrendingUp,
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { formatCurrency } from '../../utils/format';

export const AdminDashboardPage: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentEnrollments, setRecentEnrollments] = useState<AdminEnrollment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [statsRes, enrollRes] = await Promise.allSettled([
          api.get('/v1/admin/dashboard'),
          api.get('/v1/admin/enrollments', { params: { size: 6 } }),
        ]);

        if (statsRes.status === 'fulfilled' && statsRes.value.data?.success) {
          setStats(statsRes.value.data.data);
        }
        if (enrollRes.status === 'fulfilled' && enrollRes.value.data?.success) {
          setRecentEnrollments(enrollRes.value.data.data?.content || []);
        }
      } catch (err) {
        console.error('Failed to fetch admin dashboard data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="flex-1 bg-slate-950 text-slate-100 pb-16">
      <AdminNav />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Top Header & Fast Actions */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Administration Console
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Oversee course catalog and fees, monitor student progress, and inspect platform transactions.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <Link to="/admin/enrollments">
              <Button variant="outline" size="sm" icon={<UserPlus className="w-4 h-4 text-teal-400" />} className="border-slate-700 text-slate-200">
                Enroll Student
              </Button>
            </Link>
            <Link to="/admin/courses">
              <Button variant="teal" size="sm" icon={<Plus className="w-4 h-4" />}>
                Create Course
              </Button>
            </Link>
          </div>
        </div>

        {/* Real Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 shadow-xs space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-semibold uppercase tracking-wider text-[11px]">Verified Revenue</span>
              <CreditCard className="w-4 h-4 text-teal-400" />
            </div>
            <p className="text-2xl font-bold text-white">
              {formatCurrency(stats?.totalRevenue || 0, 'INR')}
            </p>
            <p className="text-[11px] text-slate-400">From completed orders</p>
          </div>

          <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 shadow-xs space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-semibold uppercase tracking-wider text-[11px]">Total Students</span>
              <Users className="w-4 h-4 text-teal-400" />
            </div>
            <p className="text-2xl font-bold text-white">
              {stats?.totalStudents || 0}
            </p>
            <p className="text-[11px] text-slate-400">Registered learner accounts</p>
          </div>

          <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 shadow-xs space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-semibold uppercase tracking-wider text-[11px]">Active Enrollments</span>
              <GraduationCap className="w-4 h-4 text-teal-400" />
            </div>
            <p className="text-2xl font-bold text-white">
              {stats?.totalEnrollments || 0}
            </p>
            <p className="text-[11px] text-slate-400">Course enrollment seats</p>
          </div>

          <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 shadow-xs space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-semibold uppercase tracking-wider text-[11px]">Published Courses</span>
              <BookOpen className="w-4 h-4 text-teal-400" />
            </div>
            <p className="text-2xl font-bold text-white">
              {stats?.publishedCourses || 0}
            </p>
            <p className="text-[11px] text-slate-400">Active catalog programs</p>
          </div>
        </div>

        {/* Recent Enrollments Table */}
        <div className="bg-slate-900 rounded-xl border border-slate-800 shadow-xs overflow-hidden">
          <div className="p-5 border-b border-slate-800 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-white">Recent Student Enrollments</h2>
              <p className="text-xs text-slate-400 mt-0.5">Real-time enrollments and current completion progress.</p>
            </div>
            <Link to="/admin/enrollments" className="text-xs font-medium text-teal-400 hover:underline flex items-center gap-1">
              <span>View all enrollments</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-850 border-b border-slate-800 text-slate-400">
                <tr>
                  <th className="px-5 py-3 font-semibold">Student</th>
                  <th className="px-5 py-3 font-semibold">Course</th>
                  <th className="px-5 py-3 font-semibold">Progress</th>
                  <th className="px-5 py-3 font-semibold">Status</th>
                  <th className="px-5 py-3 font-semibold">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {recentEnrollments.length > 0 ? (
                  recentEnrollments.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-800/40">
                      <td className="px-5 py-3.5">
                        <div className="font-semibold text-white">{item.student?.fullName}</div>
                        <div className="text-[11px] text-slate-400">{item.student?.email}</div>
                      </td>
                      <td className="px-5 py-3.5 font-medium text-slate-200 max-w-xs truncate">
                        {item.course?.title}
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2">
                          <div className="w-20 bg-slate-800 h-1.5 rounded-full overflow-hidden">
                            <div
                              className="bg-teal-500 h-full rounded-full"
                              style={{ width: `${item.progressPct || 0}%` }}
                            />
                          </div>
                          <span className="font-mono text-[11px] text-slate-400">{item.progressPct || 0}%</span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <Badge
                          variant={item.status === 'COMPLETED' ? 'success' : 'teal'}
                          size="sm"
                        >
                          {item.status}
                        </Badge>
                      </td>
                      <td className="px-5 py-3.5 text-slate-400 text-[11px]">
                        {item.enrolledAt ? new Date(item.enrolledAt).toLocaleDateString() : '—'}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-5 py-8 text-center text-xs text-slate-400">
                      No enrollments found yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Management Hub Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Link
            to="/admin/courses"
            className="p-5 rounded-xl border border-slate-800 bg-slate-900 hover:border-slate-700 hover:shadow-xs transition-all group"
          >
            <div className="w-9 h-9 rounded-lg bg-slate-800 text-teal-400 flex items-center justify-center mb-3 group-hover:bg-teal-600 group-hover:text-white transition-colors">
              <BookOpen className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-semibold text-white mb-1">Courses & Fees</h3>
            <p className="text-xs text-slate-400 mb-3">Create and edit courses, adjust pricing, and manage publishing state.</p>
            <span className="text-xs font-semibold text-teal-400 flex items-center gap-1 group-hover:underline">
              Manage courses →
            </span>
          </Link>

          <Link
            to="/admin/enrollments"
            className="p-5 rounded-xl border border-slate-800 bg-slate-900 hover:border-slate-700 hover:shadow-xs transition-all group"
          >
            <div className="w-9 h-9 rounded-lg bg-slate-800 text-teal-400 flex items-center justify-center mb-3 group-hover:bg-teal-600 group-hover:text-white transition-colors">
              <GraduationCap className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-semibold text-white mb-1">Enrollment Matrix</h3>
            <p className="text-xs text-slate-400 mb-3">Inspect all student enrollments, progress, and issue manual admissions.</p>
            <span className="text-xs font-semibold text-teal-400 flex items-center gap-1 group-hover:underline">
              View enrollments →
            </span>
          </Link>

          <Link
            to="/admin/students"
            className="p-5 rounded-xl border border-slate-800 bg-slate-900 hover:border-slate-700 hover:shadow-xs transition-all group"
          >
            <div className="w-9 h-9 rounded-lg bg-slate-800 text-teal-400 flex items-center justify-center mb-3 group-hover:bg-teal-600 group-hover:text-white transition-colors">
              <Users className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-semibold text-white mb-1">Student Accounts</h3>
            <p className="text-xs text-slate-400 mb-3">Manage user registrations, verification statuses, and account controls.</p>
            <span className="text-xs font-semibold text-teal-400 flex items-center gap-1 group-hover:underline">
              Inspect directory →
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
};
