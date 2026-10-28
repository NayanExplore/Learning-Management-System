import React, { useEffect, useState } from 'react';
import { api } from '../../api/client';
import { CourseSummary } from '../../types';
import { AdminNav } from '../../components/AdminNav';
import {
  BookOpen,
  Plus,
  Eye,
  EyeOff,
  Edit3,
  X,
  IndianRupee,
  Layers,
  Search,
  Filter,
  Upload,
  FileText,
  Trash2,
  Users,
  CheckCircle,
  Clock,
  Sparkles,
  ArrowUpRight,
  RefreshCw,
  Image as ImageIcon,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export const AdminCoursesPage: React.FC = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState<CourseSummary[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [levelFilter, setLevelFilter] = useState('');

  // Modals
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingCourseId, setEditingCourseId] = useState<number | null>(null);

  // Form state
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [shortDesc, setShortDesc] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('2999');
  const [originalPrice, setOriginalPrice] = useState('5999');
  const [currency, setCurrency] = useState('INR');
  const [instructor, setInstructor] = useState('SkillForge Faculty');
  const [instructorBio, setInstructorBio] = useState('Industry Expert and Senior Technical Lead');
  const [duration, setDuration] = useState('40');
  const [level, setLevel] = useState('BEGINNER');
  const [status, setStatus] = useState('PUBLISHED');
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [learningOutcomes, setLearningOutcomes] = useState('Master core fundamentals, Build end-to-end projects, Pass industry certification');
  const [prerequisites, setPrerequisites] = useState('Basic computer literacy');
  const [submitting, setSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Bulk Upload state
  const [bulkJsonText, setBulkJsonText] = useState('');
  const [bulkUploading, setBulkUploading] = useState(false);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const params: any = { size: 100 };
      if (searchTerm) params.q = searchTerm;
      if (statusFilter) params.status = statusFilter;
      if (levelFilter) params.level = levelFilter;

      const res = await api.get('/v1/admin/courses', { params });
      if (res.data?.success) {
        setCourses(res.data.data.content);
      }
    } catch (err) {
      console.error('Failed to load courses', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchCourses();
    }, 250);
    return () => clearTimeout(timer);
  }, [searchTerm, statusFilter, levelFilter]);

  const handleToggleStatus = async (courseId: number, currentStatus: string) => {
    const nextStatus = currentStatus === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED';
    try {
      await api.patch(`/v1/admin/courses/${courseId}/status?status=${nextStatus}`);
      fetchCourses();
    } catch {
      alert('Failed to update course status.');
    }
  };

  const handleDeleteCourse = async (courseId: number, courseTitle: string) => {
    if (!window.confirm(`Are you sure you want to delete or archive "${courseTitle}"?`)) {
      return;
    }
    try {
      await api.delete(`/v1/admin/courses/${courseId}`);
      fetchCourses();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to delete course');
    }
  };

  const handleImageFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', 'thumbnails');

    setUploadingImage(true);
    try {
      const res = await api.post('/v1/admin/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (res.data?.success && res.data.data?.url) {
        setThumbnailUrl(res.data.data.url);
      }
    } catch (err: any) {
      alert('Failed to upload course image: ' + (err.response?.data?.message || err.message));
    } finally {
      setUploadingImage(false);
    }
  };

  const resetForm = () => {
    setTitle('');
    setSlug('');
    setShortDesc('');
    setDescription('');
    setPrice('2999');
    setOriginalPrice('5999');
    setCurrency('INR');
    setInstructor('SkillForge Faculty');
    setInstructorBio('Industry Expert and Senior Technical Lead');
    setDuration('40');
    setLevel('BEGINNER');
    setStatus('PUBLISHED');
    setThumbnailUrl('');
    setLearningOutcomes('Master core fundamentals, Build end-to-end projects, Pass industry certification');
    setPrerequisites('Basic computer literacy');
    setEditingCourseId(null);
  };

  const handleOpenCreateModal = () => {
    resetForm();
    setShowCreateModal(true);
  };

  const handleOpenEditModal = async (courseId: number) => {
    try {
      const res = await api.get(`/v1/courses/${courseId}`);
      if (res.data?.success) {
        const c = res.data.data;
        setEditingCourseId(c.id);
        setTitle(c.title || '');
        setSlug(c.slug || '');
        setShortDesc(c.shortDescription || '');
        setDescription(c.description || '');
        setPrice(String(c.price || 0));
        setOriginalPrice(String(c.originalPrice || 0));
        setCurrency(c.currency || 'INR');
        setInstructor(c.instructorName || '');
        setInstructorBio(c.instructorBio || '');
        setDuration(String(c.durationHours || 40));
        setLevel(c.level || 'BEGINNER');
        setStatus(c.status || 'PUBLISHED');
        setThumbnailUrl(c.thumbnailUrl || '');
        setLearningOutcomes(
          Array.isArray(c.learningOutcomes) ? c.learningOutcomes.join(', ') : ''
        );
        setPrerequisites(
          Array.isArray(c.prerequisites) ? c.prerequisites.join(', ') : ''
        );
        setShowEditModal(true);
      }
    } catch (err) {
      alert('Failed to load course details for editing.');
    }
  };

  const handleSaveCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setSubmitting(true);
    const outcomesArray = learningOutcomes
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    const prereqArray = prerequisites
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const payload = {
      title: title.trim(),
      slug: slug.trim() || undefined,
      shortDescription: shortDesc.trim(),
      description: description.trim(),
      price: parseFloat(price) || 0,
      originalPrice: parseFloat(originalPrice) || 0,
      currency,
      instructorName: instructor.trim(),
      instructorBio: instructorBio.trim(),
      durationHours: parseInt(duration, 10) || 10,
      level,
      status,
      thumbnailUrl: thumbnailUrl.trim() || undefined,
      learningOutcomes: outcomesArray,
      prerequisites: prereqArray,
    };

    try {
      if (editingCourseId) {
        await api.put(`/v1/admin/courses/${editingCourseId}`, payload);
        setShowEditModal(false);
      } else {
        await api.post('/v1/admin/courses', payload);
        setShowCreateModal(false);
      }
      resetForm();
      fetchCourses();
    } catch (err: any) {
      alert(err.response?.data?.message || err.message || 'Failed to save course');
    } finally {
      setSubmitting(false);
    }
  };

  const handleBulkUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bulkJsonText.trim()) return;

    let parsed: any[];
    try {
      parsed = JSON.parse(bulkJsonText);
      if (!Array.isArray(parsed)) {
        throw new Error('JSON must be an array of course objects');
      }
    } catch (err: any) {
      alert('Invalid JSON: ' + err.message);
      return;
    }

    setBulkUploading(true);
    try {
      await api.post('/v1/admin/courses/bulk-upload', parsed);
      setShowBulkModal(false);
      setBulkJsonText('');
      fetchCourses();
      alert(`Successfully imported ${parsed.length} courses!`);
    } catch (err: any) {
      alert(err.response?.data?.message || err.message || 'Bulk upload failed');
    } finally {
      setBulkUploading(false);
    }
  };

  const loadSampleBulkTemplate = () => {
    const sample = [
      {
        title: 'Full-Stack React & Spring Boot Mastery',
        shortDescription: 'Master enterprise full-stack development with React 18 and Java Spring Boot 3.',
        description: 'Comprehensive curriculum covering REST APIs, JWT authentication, MySQL, Docker, and AWS deployment.',
        price: 3499,
        originalPrice: 6999,
        currency: 'INR',
        instructorName: 'SkillForge Senior Architects',
        durationHours: 65,
        level: 'INTERMEDIATE',
        status: 'PUBLISHED',
        learningOutcomes: ['Build reactive frontends', 'Design robust Spring Boot microservices', 'Deploy containerized web apps'],
        prerequisites: ['Basic Java and JavaScript knowledge']
      },
      {
        title: 'Cybersecurity Analyst & Threat Hunting',
        shortDescription: 'Learn ethical hacking, network defense, penetration testing, and incident response.',
        description: 'Hands-on security labs, vulnerability scanning, SIEM tool analysis, and SOC operations.',
        price: 4999,
        originalPrice: 9999,
        currency: 'INR',
        instructorName: 'Infosec Security Institute',
        durationHours: 50,
        level: 'ADVANCED',
        status: 'PUBLISHED',
        learningOutcomes: ['Identify security vulnerabilities', 'Execute penetration tests', 'Secure cloud environments'],
        prerequisites: ['Basic networking and Linux commands']
      }
    ];
    setBulkJsonText(JSON.stringify(sample, null, 2));
  };

  // Metric computations
  const totalCoursesCount = courses.length;
  const publishedCount = courses.filter((c) => c.status === 'PUBLISHED').length;
  const totalEnrollmentsAcrossCourses = courses.reduce(
    (acc, c) => acc + (c.enrollmentCount || 0),
    0
  );
  const avgCourseFee =
    totalCoursesCount > 0
      ? Math.round(
          courses.reduce((acc, c) => acc + (Number(c.price) || 0), 0) / totalCoursesCount
        )
      : 0;

  return (
    <div className="flex-1 bg-slate-50 pb-16">
      <AdminNav />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-md">
                <BookOpen className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  Course & Fees Management
                </h1>
                <p className="text-slate-500 text-sm mt-0.5">
                  List company courses, configure course fees and discounts, upload media, and manage student access.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => {
                setShowBulkModal(true);
                if (!bulkJsonText) loadSampleBulkTemplate();
              }}
              className="inline-flex items-center space-x-2 bg-white hover:bg-slate-100 text-slate-700 font-semibold text-sm px-4 py-2.5 rounded-xl border border-slate-200 shadow-xs transition"
            >
              <Upload className="w-4 h-4 text-indigo-600" />
              <span>Bulk Import Courses</span>
            </button>
            <button
              onClick={handleOpenCreateModal}
              className="inline-flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm px-4 py-2.5 rounded-xl shadow-md transition"
            >
              <Plus className="w-4 h-4" />
              <span>List New Course</span>
            </button>
          </div>
        </div>

        {/* Pricing & Course Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Total Courses
              </span>
              <BookOpen className="w-4 h-4 text-indigo-600" />
            </div>
            <p className="text-2xl font-black text-slate-900">{totalCoursesCount}</p>
            <p className="text-xs text-slate-500 mt-1">Listed in database</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Live & Published
              </span>
              <CheckCircle className="w-4 h-4 text-emerald-600" />
            </div>
            <p className="text-2xl font-black text-emerald-600">{publishedCount}</p>
            <p className="text-xs text-slate-500 mt-1">Visible to students</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Avg. Course Fee
              </span>
              <IndianRupee className="w-4 h-4 text-purple-600" />
            </div>
            <p className="text-2xl font-black text-purple-600">₹{avgCourseFee.toLocaleString('en-IN')}</p>
            <p className="text-xs text-slate-500 mt-1">Mean catalog price</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Total Enrolled Students
              </span>
              <Users className="w-4 h-4 text-blue-600" />
            </div>
            <p className="text-2xl font-black text-blue-600">{totalEnrollmentsAcrossCourses}</p>
            <p className="text-xs text-slate-500 mt-1">Cumulative admissions</p>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs mb-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex flex-1 flex-col sm:flex-row items-center gap-3 w-full">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search courses by title or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition"
                />
              </div>

              <div className="relative w-full sm:w-44">
                <Filter className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full pl-10 pr-8 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white appearance-none cursor-pointer"
                >
                  <option value="">All Statuses</option>
                  <option value="PUBLISHED">Published</option>
                  <option value="DRAFT">Draft</option>
                  <option value="ARCHIVED">Archived</option>
                </select>
              </div>

              <div className="relative w-full sm:w-44">
                <Layers className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <select
                  value={levelFilter}
                  onChange={(e) => setLevelFilter(e.target.value)}
                  className="w-full pl-10 pr-8 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white appearance-none cursor-pointer"
                >
                  <option value="">All Levels</option>
                  <option value="BEGINNER">Beginner</option>
                  <option value="INTERMEDIATE">Intermediate</option>
                  <option value="ADVANCED">Advanced</option>
                </select>
              </div>
            </div>

            <button
              onClick={fetchCourses}
              className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 transition self-end sm:self-auto"
              title="Refresh"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-indigo-600' : ''}`} />
            </button>
          </div>
        </div>

        {/* Courses Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center text-slate-400">
              <RefreshCw className="w-8 h-8 animate-spin mb-3 text-indigo-600" />
              <p className="text-sm font-semibold">Loading courses catalog...</p>
            </div>
          ) : courses.length === 0 ? (
            <div className="py-20 text-center px-4">
              <div className="w-16 h-16 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">No courses match your filter</h3>
              <p className="text-sm text-slate-500 max-w-md mx-auto mt-1 mb-6">
                Create your company's first course or import course batches with fees.
              </p>
              <button
                onClick={handleOpenCreateModal}
                className="inline-flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm px-5 py-2.5 rounded-xl shadow transition"
              >
                <Plus className="w-4 h-4" />
                <span>Create New Course</span>
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-700">
                <thead className="bg-slate-50 text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-4">Course Info</th>
                    <th className="px-6 py-4">Course Fees</th>
                    <th className="px-6 py-4">Level & Hours</th>
                    <th className="px-6 py-4">Enrolled Students</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {courses.map((course) => {
                    const discount =
                      course.originalPrice && course.originalPrice > course.price
                        ? Math.round(
                            ((course.originalPrice - course.price) /
                              course.originalPrice) *
                              100
                          )
                        : 0;

                    return (
                      <tr key={course.id} className="hover:bg-slate-50/60 transition group">
                        {/* Course Info */}
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 rounded-xl bg-slate-100 overflow-hidden flex-shrink-0 border border-slate-200 flex items-center justify-center">
                              {course.thumbnailUrl ? (
                                <img
                                  src={course.thumbnailUrl}
                                  alt={course.title}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    (e.target as HTMLElement).style.display = 'none';
                                  }}
                                />
                              ) : (
                                <BookOpen className="w-5 h-5 text-slate-400" />
                              )}
                            </div>
                            <div className="min-w-0">
                              <p className="font-extrabold text-slate-900 group-hover:text-indigo-600 transition truncate max-w-xs sm:max-w-md">
                                {course.title}
                              </p>
                              <p className="text-xs text-slate-400 font-mono truncate">
                                slug: {course.slug}
                              </p>
                              <p className="text-[11px] text-slate-500 mt-0.5">
                                By {course.instructorName || 'SkillForge Faculty'}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Fees Column */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex flex-col">
                            <div className="flex items-center space-x-2">
                              <span className="font-black text-slate-900 text-base">
                                ₹{course.price.toLocaleString('en-IN')}
                              </span>
                              {discount > 0 && (
                                <span className="px-1.5 py-0.5 rounded text-[10px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                  {discount}% OFF
                                </span>
                              )}
                            </div>
                            {course.originalPrice && course.originalPrice > course.price && (
                              <span className="text-xs text-slate-400 line-through">
                                ₹{course.originalPrice.toLocaleString('en-IN')}
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Level & Hours */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 py-0.5 text-xs font-bold rounded bg-slate-100 text-slate-700">
                            {course.level}
                          </span>
                          <span className="text-xs text-slate-400 block mt-1">
                            {course.durationHours || 0} Hours Duration
                          </span>
                        </td>

                        {/* Enrolled Students Matrix Link */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Link
                            to={`/admin/enrollments?courseId=${course.id}`}
                            className="inline-flex items-center space-x-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 px-3 py-1.5 rounded-xl font-bold text-xs transition"
                            title="Inspect all enrolled students for this course"
                          >
                            <Users className="w-3.5 h-3.5 text-indigo-600" />
                            <span>{course.enrollmentCount} Enrolled</span>
                            <ArrowUpRight className="w-3 h-3 text-indigo-500" />
                          </Link>
                        </td>

                        {/* Status */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                              course.status === 'PUBLISHED'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : course.status === 'DRAFT'
                                ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                : 'bg-slate-100 text-slate-600 border border-slate-200'
                            }`}
                          >
                            {course.status}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="px-6 py-4 text-right space-x-1 whitespace-nowrap">
                          <button
                            onClick={() => handleToggleStatus(course.id, course.status)}
                            className="p-1.5 text-slate-500 hover:text-slate-800 rounded-lg hover:bg-slate-100 transition"
                            title={
                              course.status === 'PUBLISHED'
                                ? 'Unpublish to Draft'
                                : 'Publish for Students'
                            }
                          >
                            {course.status === 'PUBLISHED' ? (
                              <EyeOff className="w-4 h-4 text-amber-600" />
                            ) : (
                              <Eye className="w-4 h-4 text-emerald-600" />
                            )}
                          </button>
                          <button
                            onClick={() => handleOpenEditModal(course.id)}
                            className="p-1.5 text-indigo-600 hover:text-indigo-800 rounded-lg hover:bg-indigo-50 transition"
                            title="Edit Course & Fees"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <Link
                            to={`/courses/${course.slug}`}
                            className="inline-block p-1.5 text-slate-500 hover:text-slate-800 rounded-lg hover:bg-slate-100 transition"
                            title="View Public Catalog Page"
                            target="_blank"
                          >
                            <ArrowUpRight className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => handleDeleteCourse(course.id, course.title)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition"
                            title="Delete / Archive Course"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
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

      {/* Create / Edit Course Modal */}
      {(showCreateModal || showEditModal) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-100 my-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center">
                  <BookOpen className="w-5 h-5" />
                </div>
                <h2 className="text-xl font-extrabold text-slate-900">
                  {editingCourseId ? 'Edit Course & Fees' : 'List New Course with Fees'}
                </h2>
              </div>
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setShowEditModal(false);
                }}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCourse} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Course Title *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Master Artificial Intelligence with Python"
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                />
              </div>

              {/* Pricing & Fees Section */}
              <div className="p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100">
                <div className="flex items-center space-x-1.5 mb-3">
                  <IndianRupee className="w-4 h-4 text-indigo-600" />
                  <span className="text-xs font-extrabold text-indigo-900 uppercase tracking-wider">
                    Course Fees & Pricing Structure
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Selling Fee (Price) *
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs">
                        ₹
                      </span>
                      <input
                        type="number"
                        required
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        placeholder="2999"
                        className="w-full pl-7 pr-3 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-bold"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Original Price (MRP)
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs">
                        ₹
                      </span>
                      <input
                        type="number"
                        value={originalPrice}
                        onChange={(e) => setOriginalPrice(e.target.value)}
                        placeholder="5999"
                        className="w-full pl-7 pr-3 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Currency
                    </label>
                    <select
                      value={currency}
                      onChange={(e) => setCurrency(e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-semibold"
                    >
                      <option value="INR">INR (₹)</option>
                      <option value="USD">USD ($)</option>
                      <option value="EUR">EUR (€)</option>
                    </select>
                  </div>
                </div>

                {parseFloat(originalPrice) > parseFloat(price) && (
                  <p className="text-xs text-emerald-700 font-semibold mt-2 flex items-center space-x-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>
                      Students receive a{' '}
                      {Math.round(
                        ((parseFloat(originalPrice) - parseFloat(price)) /
                          parseFloat(originalPrice)) *
                          100
                      )}
                      % discount tag!
                    </span>
                  </p>
                )}
              </div>

              {/* Course Media / Thumbnail Upload */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Course Thumbnail / Image
                </label>
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <div className="w-20 h-20 rounded-xl bg-white border border-slate-200 overflow-hidden flex items-center justify-center flex-shrink-0">
                    {thumbnailUrl ? (
                      <img
                        src={thumbnailUrl}
                        alt="Thumbnail preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <ImageIcon className="w-6 h-6 text-slate-300" />
                    )}
                  </div>

                  <div className="flex-1 w-full space-y-2">
                    <div className="flex items-center space-x-2">
                      <label className="cursor-pointer inline-flex items-center space-x-2 bg-white hover:bg-slate-100 text-indigo-600 font-bold text-xs px-3.5 py-2 rounded-xl border border-slate-200 shadow-xs transition">
                        <Upload className="w-3.5 h-3.5" />
                        <span>{uploadingImage ? 'Uploading...' : 'Upload Image File'}</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageFileUpload}
                          className="hidden"
                          disabled={uploadingImage}
                        />
                      </label>
                      <span className="text-xs text-slate-400">or paste URL below:</span>
                    </div>

                    <input
                      type="url"
                      value={thumbnailUrl}
                      onChange={(e) => setThumbnailUrl(e.target.value)}
                      placeholder="https://images.unsplash.com/... or uploaded URL"
                      className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Short Description *
                </label>
                <textarea
                  required
                  rows={2}
                  value={shortDesc}
                  onChange={(e) => setShortDesc(e.target.value)}
                  placeholder="Summary for course card and catalog..."
                  className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Duration (Hours)
                  </label>
                  <input
                    type="number"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Level
                  </label>
                  <select
                    value={level}
                    onChange={(e) => setLevel(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                  >
                    <option value="BEGINNER">BEGINNER</option>
                    <option value="INTERMEDIATE">INTERMEDIATE</option>
                    <option value="ADVANCED">ADVANCED</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Publication Status
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white font-bold"
                  >
                    <option value="PUBLISHED">PUBLISHED (Live)</option>
                    <option value="DRAFT">DRAFT (Hidden)</option>
                    <option value="ARCHIVED">ARCHIVED</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Instructor / Company Name
                  </label>
                  <input
                    type="text"
                    value={instructor}
                    onChange={(e) => setInstructor(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Custom Slug (Optional)
                  </label>
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="auto-generated-from-title"
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white font-mono text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Learning Outcomes (comma separated)
                </label>
                <input
                  type="text"
                  value={learningOutcomes}
                  onChange={(e) => setLearningOutcomes(e.target.value)}
                  placeholder="Master React, Build scalable APIs, Deploy to AWS"
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateModal(false);
                    setShowEditModal(false);
                  }}
                  className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2 text-sm font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-md transition disabled:opacity-50 flex items-center space-x-2"
                >
                  {submitting && <RefreshCw className="w-4 h-4 animate-spin" />}
                  <span>{submitting ? 'Saving Course...' : editingCourseId ? 'Update Course' : 'Publish Course'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Bulk Import / Upload Courses Modal */}
      {showBulkModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-5 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center">
                  <Upload className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">
                  Bulk Upload Courses & Fees
                </h3>
              </div>
              <button
                onClick={() => setShowBulkModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-500">
              Paste a JSON array of course objects with title, fees (price, originalPrice), descriptions, and level to import multiple courses at once.
            </p>

            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Course JSON Payload
              </span>
              <button
                type="button"
                onClick={loadSampleBulkTemplate}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-800"
              >
                Load Sample Template
              </button>
            </div>

            <textarea
              rows={10}
              value={bulkJsonText}
              onChange={(e) => setBulkJsonText(e.target.value)}
              placeholder="Paste JSON array here..."
              className="w-full p-3 font-mono text-xs bg-slate-900 text-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />

            <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowBulkModal(false)}
                className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition"
              >
                Cancel
              </button>
              <button
                onClick={handleBulkUpload}
                disabled={bulkUploading || !bulkJsonText.trim()}
                className="px-6 py-2 text-sm font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-md transition disabled:opacity-50 flex items-center space-x-2"
              >
                {bulkUploading && <RefreshCw className="w-4 h-4 animate-spin" />}
                <span>{bulkUploading ? 'Importing Courses...' : 'Import Courses'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
