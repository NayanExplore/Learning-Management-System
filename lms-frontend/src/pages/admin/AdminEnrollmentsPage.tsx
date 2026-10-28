import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api } from '../../api/client';
import { AdminEnrollment, CourseSummary, User } from '../../types';
import { AdminNav } from '../../components/AdminNav';
import {
  GraduationCap,
  Search,
  Filter,
  UserPlus,
  Download,
  CheckCircle2,
  Clock,
  AlertCircle,
  MoreVertical,
  Trash2,
  BookOpen,
  IndianRupee,
  RefreshCw,
  X,
  Mail,
  Phone,
  Calendar,
  Percent,
  Check,
} from 'lucide-react';

export const AdminEnrollmentsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCourseId = searchParams.get('courseId') || '';

  const [enrollments, setEnrollments] = useState<AdminEnrollment[]>([]);
  const [courses, setCourses] = useState<CourseSummary[]>([]);
  const [students, setStudents] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [selectedCourseId, setSelectedCourseId] = useState<string>(initialCourseId);
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Modals & Drawers
  const [showEnrollModal, setShowEnrollModal] = useState(false);
  const [enrollStudentEmail, setEnrollStudentEmail] = useState('');
  const [enrollCourseId, setEnrollCourseId] = useState('');
  const [enrolling, setEnrolling] = useState(false);
  const [selectedEnrollment, setSelectedEnrollment] = useState<AdminEnrollment | null>(null);

  // Stats calculation
  const totalEnrollments = enrollments.length;
  const activeEnrollments = enrollments.filter((e) => e.status === 'ACTIVE').length;
  const completedEnrollments = enrollments.filter((e) => e.status === 'COMPLETED').length;
  const avgProgress =
    totalEnrollments > 0
      ? Math.round(
          enrollments.reduce((sum, e) => sum + (Number(e.progressPct) || 0), 0) /
            totalEnrollments
        )
      : 0;

  const fetchCoursesList = async () => {
    try {
      const res = await api.get('/v1/admin/courses', { params: { size: 100 } });
      if (res.data?.success) {
        setCourses(res.data.data.content);
      }
    } catch (err) {
      console.error('Failed to load courses for filter', err);
    }
  };

  const fetchStudentsList = async () => {
    try {
      const res = await api.get('/v1/admin/students', { params: { size: 100 } });
      if (res.data?.success) {
        setStudents(res.data.data.content);
      }
    } catch (err) {
      console.error('Failed to load students for manual enrollment', err);
    }
  };

  const fetchEnrollments = async () => {
    setLoading(true);
    try {
      const params: any = { size: 100 };
      if (selectedCourseId) params.courseId = selectedCourseId;
      if (selectedStatus) params.status = selectedStatus;
      if (searchTerm) params.q = searchTerm;

      const res = await api.get('/v1/admin/enrollments', { params });
      if (res.data?.success) {
        setEnrollments(res.data.data?.content || []);
      }
    } catch (err) {
      console.error('Failed to load enrollments', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoursesList();
    fetchStudentsList();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchEnrollments();
    }, 250);
    return () => clearTimeout(timer);
  }, [selectedCourseId, selectedStatus, searchTerm]);

  // Handle course filter change and sync URL
  const handleCourseFilterChange = (cId: string) => {
    setSelectedCourseId(cId);
    if (cId) {
      setSearchParams({ courseId: cId });
    } else {
      setSearchParams({});
    }
  };

  const handleManualEnroll = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!enrollCourseId || !enrollStudentEmail) {
      alert('Please select both a course and a student.');
      return;
    }
    setEnrolling(true);
    try {
      await api.post('/v1/admin/enrollments', {
        courseId: Number(enrollCourseId),
        email: enrollStudentEmail,
      });
      setShowEnrollModal(false);
      setEnrollStudentEmail('');
      setEnrollCourseId('');
      fetchEnrollments();
    } catch (err: any) {
      alert(err.response?.data?.message || err.message || 'Failed to enroll student');
    } finally {
      setEnrolling(false);
    }
  };

  const handleUpdateStatus = async (
    enrollmentId: number,
    status: 'ACTIVE' | 'COMPLETED' | 'SUSPENDED'
  ) => {
    try {
      await api.patch(`/v1/admin/enrollments/${enrollmentId}/status?status=${status}`);
      setEnrollments((prev) =>
        prev.map((item) =>
          item.id === enrollmentId
            ? {
                ...item,
                status,
                progressPct: status === 'COMPLETED' ? 100 : item.progressPct,
                completedAt: status === 'COMPLETED' ? new Date().toISOString() : item.completedAt,
              }
            : item
        )
      );
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to update enrollment status');
    }
  };

  const handleDeleteEnrollment = async (enrollmentId: number, studentName: string, courseTitle: string) => {
    if (
      !window.confirm(
        `Are you sure you want to unenroll ${studentName} from "${courseTitle}"? They will lose access to this course.`
      )
    ) {
      return;
    }
    try {
      await api.delete(`/v1/admin/enrollments/${enrollmentId}`);
      setEnrollments((prev) => prev.filter((item) => item.id !== enrollmentId));
      if (selectedEnrollment?.id === enrollmentId) {
        setSelectedEnrollment(null);
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to remove enrollment');
    }
  };

  const handleExportCSV = () => {
    if (enrollments.length === 0) {
      alert('No enrollments to export.');
      return;
    }
    const headers = [
      'Enrollment ID',
      'Student Name',
      'Student Email',
      'Student Phone',
      'Course Title',
      'Course Level',
      'Course Fee (INR)',
      'Status',
      'Progress %',
      'Enrolled Date',
      'Completed Date',
    ];
    const rows = enrollments.map((e) => [
      e.id,
      `"${e.student?.fullName || ''}"`,
      `"${e.student?.email || ''}"`,
      `"${e.student?.phone || ''}"`,
      `"${e.course?.title || ''}"`,
      e.course?.level || '',
      e.course?.price || 0,
      e.status,
      `${e.progressPct}%`,
      e.enrolledAt ? new Date(e.enrolledAt).toLocaleDateString() : '',
      e.completedAt ? new Date(e.completedAt).toLocaleDateString() : '',
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `skillforge-enrollments-${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex-1 bg-slate-50 pb-16">
      <AdminNav />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Title and Actions */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-md">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  Student Enrollments Matrix
                </h1>
                <p className="text-slate-500 text-sm mt-0.5">
                  Track which student is enrolled in each course, monitor their progress, and manage course access.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={handleExportCSV}
              className="inline-flex items-center space-x-2 bg-white hover:bg-slate-100 text-slate-700 font-semibold text-sm px-4 py-2.5 rounded-xl border border-slate-200 shadow-xs transition"
            >
              <Download className="w-4 h-4 text-slate-500" />
              <span>Export CSV</span>
            </button>
            <button
              onClick={() => setShowEnrollModal(true)}
              className="inline-flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm px-4 py-2.5 rounded-xl shadow-md transition"
            >
              <UserPlus className="w-4 h-4" />
              <span>Enroll Student</span>
            </button>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Total Enrollments
              </span>
              <GraduationCap className="w-4 h-4 text-indigo-600" />
            </div>
            <p className="text-2xl font-black text-slate-900">{totalEnrollments}</p>
            <p className="text-xs text-slate-500 mt-1">Course admissions recorded</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Active Learners
              </span>
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
            <p className="text-2xl font-black text-emerald-600">{activeEnrollments}</p>
            <p className="text-xs text-slate-500 mt-1">Currently progressing</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Completed Courses
              </span>
              <Check className="w-4 h-4 text-blue-600" />
            </div>
            <p className="text-2xl font-black text-blue-600">{completedEnrollments}</p>
            <p className="text-xs text-slate-500 mt-1">100% curriculum fulfilled</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Avg. Completion
              </span>
              <Percent className="w-4 h-4 text-purple-600" />
            </div>
            <p className="text-2xl font-black text-purple-600">{avgProgress}%</p>
            <p className="text-xs text-slate-500 mt-1">Across enrolled cohort</p>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs mb-6">
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
            <div className="flex flex-1 flex-col sm:flex-row items-center gap-3">
              {/* Search */}
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search student name, email, course..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition"
                />
              </div>

              {/* Course Dropdown Filter */}
              <div className="relative w-full sm:w-72">
                <BookOpen className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <select
                  value={selectedCourseId}
                  onChange={(e) => handleCourseFilterChange(e.target.value)}
                  className="w-full pl-10 pr-8 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white appearance-none transition cursor-pointer"
                >
                  <option value="">All Courses ({courses.length})</option>
                  {courses.map((course) => (
                    <option key={course.id} value={course.id}>
                      {course.title} (₹{course.price.toLocaleString('en-IN')})
                    </option>
                  ))}
                </select>
              </div>

              {/* Status Filter */}
              <div className="relative w-full sm:w-44">
                <Filter className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full pl-10 pr-8 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white appearance-none transition cursor-pointer"
                >
                  <option value="">All Statuses</option>
                  <option value="ACTIVE">Active</option>
                  <option value="COMPLETED">Completed</option>
                  <option value="SUSPENDED">Suspended</option>
                </select>
              </div>
            </div>

            <div className="flex items-center space-x-2 text-xs text-slate-500 font-medium">
              <span>Showing {enrollments.length} records</span>
              <button
                onClick={fetchEnrollments}
                className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-600 transition"
                title="Refresh list"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>
        </div>

        {/* Enrollments Data Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center text-slate-400">
              <RefreshCw className="w-8 h-8 animate-spin mb-3 text-indigo-600" />
              <p className="text-sm font-semibold">Loading student course enrollments...</p>
            </div>
          ) : enrollments.length === 0 ? (
            <div className="py-20 text-center px-4">
              <div className="w-16 h-16 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-4">
                <GraduationCap className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">No student enrollments found</h3>
              <p className="text-sm text-slate-500 max-w-md mx-auto mt-1 mb-6">
                {selectedCourseId || selectedStatus || searchTerm
                  ? 'No records match your selected filters. Try resetting the search or filter options.'
                  : 'Start enrolling students into your courses or publish courses so students can enroll directly.'}
              </p>
              <button
                onClick={() => setShowEnrollModal(true)}
                className="inline-flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm px-5 py-2.5 rounded-xl transition shadow"
              >
                <UserPlus className="w-4 h-4" />
                <span>Manually Enroll a Student</span>
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-700">
                <thead className="bg-slate-50 text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-4">Student Details</th>
                    <th className="px-6 py-4">Course & Fees</th>
                    <th className="px-6 py-4">Learning Progress</th>
                    <th className="px-6 py-4">Enrolled On</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {enrollments.map((item) => {
                    const progress = Number(item.progressPct) || 0;
                    return (
                      <tr
                        key={item.id}
                        className="hover:bg-indigo-50/30 transition group"
                      >
                        {/* Student Details */}
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-600 to-violet-500 text-white font-bold flex items-center justify-center text-sm shadow-xs flex-shrink-0">
                              {item.student?.avatarUrl ? (
                                <img
                                  src={item.student.avatarUrl}
                                  alt={item.student.fullName}
                                  className="w-full h-full rounded-full object-cover"
                                />
                              ) : (
                                item.student?.fullName?.charAt(0) || 'S'
                              )}
                            </div>
                            <div className="min-w-0">
                              <p className="font-bold text-slate-900 truncate">
                                {item.student?.fullName}
                              </p>
                              <p className="text-xs text-slate-500 font-mono truncate">
                                {item.student?.email}
                              </p>
                              {item.student?.phone && (
                                <p className="text-[11px] text-slate-400 mt-0.5">
                                  {item.student.phone}
                                </p>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* Course & Fees */}
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-bold text-slate-900 group-hover:text-indigo-600 transition">
                              {item.course?.title}
                            </p>
                            <div className="flex items-center space-x-2 mt-1">
                              <span className="px-2 py-0.5 text-[11px] font-bold rounded bg-indigo-50 text-indigo-700">
                                {item.course?.level || 'ALL LEVELS'}
                              </span>
                              <span className="text-xs font-extrabold text-emerald-600 flex items-center">
                                ₹{item.course?.price?.toLocaleString('en-IN') || 0}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Learning Progress */}
                        <td className="px-6 py-4">
                          <div className="w-40">
                            <div className="flex justify-between items-center text-xs font-bold mb-1.5">
                              <span className="text-slate-700">{progress}%</span>
                              <span className="text-[10px] text-slate-400">
                                {progress === 100 ? 'Completed' : 'In Progress'}
                              </span>
                            </div>
                            <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                              <div
                                className={`h-full rounded-full transition-all duration-500 ${
                                  progress === 100
                                    ? 'bg-emerald-500'
                                    : progress > 50
                                    ? 'bg-indigo-600'
                                    : 'bg-amber-500'
                                }`}
                                style={{ width: `${progress}%` }}
                              />
                            </div>
                          </div>
                        </td>

                        {/* Enrolled On */}
                        <td className="px-6 py-4 text-xs text-slate-500 whitespace-nowrap">
                          <div className="flex items-center space-x-1.5 font-medium">
                            <Calendar className="w-3.5 h-3.5 text-slate-400" />
                            <span>
                              {item.enrolledAt
                                ? new Date(item.enrolledAt).toLocaleDateString('en-IN', {
                                    day: 'numeric',
                                    month: 'short',
                                    year: 'numeric',
                                  })
                                : '—'}
                            </span>
                          </div>
                          {item.completedAt && (
                            <p className="text-[11px] text-emerald-600 font-semibold mt-1">
                              Done:{' '}
                              {new Date(item.completedAt).toLocaleDateString('en-IN', {
                                day: 'numeric',
                                month: 'short',
                              })}
                            </p>
                          )}
                        </td>

                        {/* Status */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <select
                            value={item.status}
                            onChange={(e) =>
                              handleUpdateStatus(
                                item.id,
                                e.target.value as 'ACTIVE' | 'COMPLETED' | 'SUSPENDED'
                              )
                            }
                            className={`text-xs font-bold px-2.5 py-1 rounded-full border cursor-pointer focus:outline-none transition ${
                              item.status === 'ACTIVE'
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                : item.status === 'COMPLETED'
                                ? 'bg-blue-50 text-blue-700 border-blue-200'
                                : 'bg-rose-50 text-rose-700 border-rose-200'
                            }`}
                          >
                            <option value="ACTIVE">ACTIVE</option>
                            <option value="COMPLETED">COMPLETED</option>
                            <option value="SUSPENDED">SUSPENDED</option>
                          </select>
                        </td>

                        {/* Actions */}
                        <td className="px-6 py-4 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end space-x-2">
                            <button
                              onClick={() => setSelectedEnrollment(item)}
                              className="text-xs font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-2.5 py-1.5 rounded-lg transition"
                            >
                              Details
                            </button>
                            <button
                              onClick={() =>
                                handleDeleteEnrollment(
                                  item.id,
                                  item.student?.fullName || 'Student',
                                  item.course?.title || 'Course'
                                )
                              }
                              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                              title="Unenroll student"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Manual Student Enrollment Modal */}
      {showEnrollModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center">
                  <UserPlus className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">Enroll Student into Course</h3>
              </div>
              <button
                onClick={() => setShowEnrollModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleManualEnroll} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Select Course *
                </label>
                <select
                  required
                  value={enrollCourseId}
                  onChange={(e) => setEnrollCourseId(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                >
                  <option value="">-- Choose a course to grant access --</option>
                  {courses.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.title} — ₹{c.price.toLocaleString('en-IN')} ({c.status})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Select Registered Student *
                </label>
                <select
                  value={enrollStudentEmail}
                  onChange={(e) => setEnrollStudentEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white mb-2"
                >
                  <option value="">-- Select student from directory --</option>
                  {students.map((s) => (
                    <option key={s.id} value={s.email}>
                      {s.fullName} ({s.email})
                    </option>
                  ))}
                </select>

                <div className="relative">
                  <span className="block text-xs text-slate-400 mb-1">
                    Or enter student's registered email directly:
                  </span>
                  <input
                    type="email"
                    placeholder="student@example.com"
                    value={enrollStudentEmail}
                    onChange={(e) => setEnrollStudentEmail(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                  />
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-indigo-50/70 border border-indigo-100 text-xs text-indigo-800 leading-relaxed">
                <strong>Instant Access:</strong> Enrolling the student gives them immediate full access to all video lessons, assessments, quizzes, and certificates for this course in their Student Dashboard.
              </div>

              <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowEnrollModal(false)}
                  className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={enrolling}
                  className="px-5 py-2 text-sm font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow transition flex items-center space-x-2 disabled:opacity-50"
                >
                  {enrolling && <RefreshCw className="w-4 h-4 animate-spin" />}
                  <span>{enrolling ? 'Enrolling...' : 'Confirm Enrollment'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Enrollment Details Slide-Over / Modal */}
      {selectedEnrollment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">Enrollment Record #{selectedEnrollment.id}</h3>
              </div>
              <button
                onClick={() => setSelectedEnrollment(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-sm">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Student Profile
                </p>
                <p className="font-extrabold text-slate-900 text-base">{selectedEnrollment.student?.fullName}</p>
                <p className="text-xs text-slate-500 font-mono mt-0.5">{selectedEnrollment.student?.email}</p>
                <p className="text-xs text-slate-500 mt-0.5">Phone: {selectedEnrollment.student?.phone || 'Not provided'}</p>
                <div className="mt-2 flex items-center space-x-2">
                  <span
                    className={`px-2 py-0.5 text-[10px] font-bold rounded ${
                      selectedEnrollment.student?.enabled !== false
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    Account: {selectedEnrollment.student?.enabled !== false ? 'Active' : 'Disabled'}
                  </span>
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Course & Pricing Info
                </p>
                <p className="font-extrabold text-slate-900 text-base">{selectedEnrollment.course?.title}</p>
                <div className="flex items-center space-x-3 text-xs mt-1">
                  <span className="font-bold text-emerald-600">
                    Fee: ₹{selectedEnrollment.course?.price?.toLocaleString('en-IN')}
                  </span>
                  <span className="text-slate-400">•</span>
                  <span className="text-slate-600">Level: {selectedEnrollment.course?.level}</span>
                  <span className="text-slate-400">•</span>
                  <span className="text-slate-600">Duration: {selectedEnrollment.course?.durationHours || 0} hrs</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Progress</span>
                  <p className="text-xl font-black text-indigo-600 mt-0.5">
                    {selectedEnrollment.progressPct}%
                  </p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Status</span>
                  <p className="text-sm font-extrabold text-slate-900 mt-1">
                    {selectedEnrollment.status}
                  </p>
                </div>
              </div>

              <div className="text-xs text-slate-500 space-y-1">
                <p>
                  <strong>Enrolled At:</strong>{' '}
                  {selectedEnrollment.enrolledAt ? new Date(selectedEnrollment.enrolledAt).toLocaleString() : '—'}
                </p>
                {selectedEnrollment.completedAt && (
                  <p>
                    <strong>Completed At:</strong> {new Date(selectedEnrollment.completedAt).toLocaleString()}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center justify-end space-x-2 pt-4 border-t border-slate-100 mt-5">
              <button
                onClick={() => setSelectedEnrollment(null)}
                className="px-4 py-2 text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
