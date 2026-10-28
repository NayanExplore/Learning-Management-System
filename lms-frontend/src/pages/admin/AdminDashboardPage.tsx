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
  IndianRupee,
  ArrowRight,
  TrendingUp,
  Plus,
  UserPlus,
  Upload,
  Calendar,
  CheckCircle,
  Eye,
} from 'lucide-react';

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
        console.error('Failed to fetch admin stats or enrollments', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="flex-1 bg-slate-50 pb-16">
      <AdminNav />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Header & Fast Actions */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Company Administration Console
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              Oversee course catalog & fees, inspect student enrollments, track learning progress, and monitor platform revenue.
            </p>
          </div>

          <div className="flex items-center space-x-2.5">
            <Link
              to="/admin/enrollments"
              className="inline-flex items-center space-x-2 bg-white hover:bg-slate-100 text-slate-700 font-bold text-sm px-4 py-2.5 rounded-xl border border-slate-200 shadow-xs transition"
            >
              <UserPlus className="w-4 h-4 text-indigo-600" />
              <span>Enroll Student</span>
            </Link>
            <Link
              to="/admin/courses"
              className="inline-flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm px-4 py-2.5 rounded-xl shadow-md transition"
            >
              <Plus className="w-4 h-4" />
              <span>List New Course</span>
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Total Verified Revenue
              </span>
              <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
                <IndianRupee className="w-5 h-5" />
              </div>
            </div>
            <p className="text-3xl font-black text-slate-900">
              ₹{(stats?.totalRevenue || 0).toLocaleString('en-IN')}
            </p>
            <p className="text-xs text-emerald-600 font-semibold mt-1 flex items-center">
              <TrendingUp className="w-3.5 h-3.5 mr-1" /> From completed course checkouts
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Active Enrollments
              </span>
              <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                <GraduationCap className="w-5 h-5" />
              </div>
            </div>
            <p className="text-3xl font-black text-slate-900">{stats?.totalEnrollments || 0}</p>
            <p className="text-xs text-slate-500 mt-1">Students enrolled in courses</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Total Registered Students
              </span>
              <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
                <Users className="w-5 h-5" />
              </div>
            </div>
            <p className="text-3xl font-black text-slate-900">{stats?.totalStudents || 0}</p>
            <p className="text-xs text-slate-500 mt-1">Verified student accounts</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Published Courses
              </span>
              <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600">
                <BookOpen className="w-5 h-5" />
              </div>
            </div>
            <p className="text-3xl font-black text-slate-900">{stats?.publishedCourses || 0}</p>
            <p className="text-xs text-slate-500 mt-1">Live in student catalog</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Total Orders Placed
              </span>
              <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600">
                <CreditCard className="w-5 h-5" />
              </div>
            </div>
            <p className="text-3xl font-black text-slate-900">{stats?.totalOrders || 0}</p>
            <p className="text-xs text-slate-500 mt-1">Course order transactions</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Certificates Awarded
              </span>
              <div className="w-10 h-10 bg-teal-50 rounded-xl flex items-center justify-center text-teal-600">
                <Award className="w-5 h-5" />
              </div>
            </div>
            <p className="text-3xl font-black text-slate-900">{stats?.totalCertificatesIssued || 0}</p>
            <p className="text-xs text-slate-500 mt-1">Verified credentials issued</p>
          </div>
        </div>

        {/* Live Student Enrollments Section */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden mb-10">
          <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center space-x-2">
                <GraduationCap className="w-5 h-5 text-indigo-600" />
                <h2 className="text-lg font-bold text-slate-900">
                  Recent Student Course Enrollments
                </h2>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Real-time view of students admitted to courses and their ongoing completion progress.
              </p>
            </div>
            <Link
              to="/admin/enrollments"
              className="inline-flex items-center space-x-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-3.5 py-2 rounded-xl transition"
            >
              <span>View Full Enrollments Matrix</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {recentEnrollments.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-sm text-slate-500">No student enrollments recorded yet.</p>
              <Link
                to="/admin/enrollments"
                className="mt-3 inline-block text-xs font-bold text-indigo-600 hover:underline"
              >
                Enroll a student now
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-700">
                <thead className="bg-slate-50/70 text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-3.5">Student</th>
                    <th className="px-6 py-3.5">Course & Fee</th>
                    <th className="px-6 py-3.5">Learning Progress</th>
                    <th className="px-6 py-3.5">Status</th>
                    <th className="px-6 py-3.5">Enrolled Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {recentEnrollments.map((e) => (
                    <tr key={e.id} className="hover:bg-slate-50/50 transition">
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-xs">
                            {e.student?.fullName?.charAt(0) || 'S'}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900">{e.student?.fullName}</p>
                            <p className="text-xs text-slate-400 font-mono">{e.student?.email}</p>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <p className="font-bold text-slate-900">{e.course?.title}</p>
                        <p className="text-xs font-extrabold text-emerald-600 mt-0.5">
                          Fee: ₹{e.course?.price?.toLocaleString('en-IN') || 0}
                        </p>
                      </td>

                      <td className="px-6 py-4">
                        <div className="w-36">
                          <div className="flex justify-between text-xs font-bold mb-1">
                            <span>{e.progressPct}%</span>
                            <span className="text-[10px] text-slate-400">
                              {Number(e.progressPct) === 100 ? 'Completed' : 'Active'}
                            </span>
                          </div>
                          <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden">
                            <div
                              className="h-full rounded-full bg-indigo-600 transition-all duration-300"
                              style={{ width: `${e.progressPct}%` }}
                            />
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold ${
                            e.status === 'ACTIVE'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : e.status === 'COMPLETED'
                              ? 'bg-blue-50 text-blue-700 border border-blue-200'
                              : 'bg-rose-50 text-rose-700 border border-rose-200'
                          }`}
                        >
                          {e.status}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-xs text-slate-500 whitespace-nowrap">
                        {e.enrolledAt
                          ? new Date(e.enrolledAt).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            })
                          : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Management Quick Actions */}
        <h2 className="text-lg font-bold text-slate-900 mb-4">Management Modules</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link
            to="/admin/courses"
            className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:border-indigo-500 hover:shadow-md transition group"
          >
            <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4 group-hover:bg-indigo-600 group-hover:text-white transition">
              <BookOpen className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-slate-900 text-base mb-1">
              Courses & Fees Manager
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              List courses, configure fees, set pricing discounts, upload thumbnails, and bulk import.
            </p>
            <span className="text-xs font-bold text-indigo-600 flex items-center space-x-1">
              <span>Manage Courses & Fees</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </Link>

          <Link
            to="/admin/enrollments"
            className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:border-indigo-500 hover:shadow-md transition group"
          >
            <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4 group-hover:bg-indigo-600 group-hover:text-white transition">
              <GraduationCap className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-slate-900 text-base mb-1">
              Student Enrollments Matrix
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Detailed tracking of which student is enrolled in which course with progress and manual admission.
            </p>
            <span className="text-xs font-bold text-indigo-600 flex items-center space-x-1">
              <span>View Enrolled Students</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </Link>

          <Link
            to="/admin/students"
            className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:border-indigo-500 hover:shadow-md transition group"
          >
            <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4 group-hover:bg-indigo-600 group-hover:text-white transition">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-slate-900 text-base mb-1">
              Student Directory
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Inspect user registrations, phone & email verifications, and account enable/disable controls.
            </p>
            <span className="text-xs font-bold text-indigo-600 flex items-center space-x-1">
              <span>Inspect Accounts</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </Link>

          <Link
            to="/admin/orders"
            className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:border-indigo-500 hover:shadow-md transition group"
          >
            <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4 group-hover:bg-indigo-600 group-hover:text-white transition">
              <CreditCard className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-slate-900 text-base mb-1">
              Orders & Payments
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Audit checkout transactions, payment statuses, and Razorpay HMAC-SHA256 references.
            </p>
            <span className="text-xs font-bold text-indigo-600 flex items-center space-x-1">
              <span>Audit Orders</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </Link>

          <Link
            to="/admin/logs"
            className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:border-indigo-500 hover:shadow-md transition group"
          >
            <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4 group-hover:bg-indigo-600 group-hover:text-white transition">
              <BellRing className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-slate-900 text-base mb-1">
              Notifications & Audits
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Review multi-channel notification logs and administrative action histories.
            </p>
            <span className="text-xs font-bold text-indigo-600 flex items-center space-x-1">
              <span>Review Logs</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
};
