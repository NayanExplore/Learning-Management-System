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
  Layers,
  Search,
  Upload,
  Trash2,
  RefreshCw,
  Image as ImageIcon,
  ArrowRight,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { formatCurrency, formatDuration } from '../../utils/format';

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
      if (searchTerm.trim()) params.q = searchTerm.trim();
      if (statusFilter) params.status = statusFilter;
      if (levelFilter) params.level = levelFilter;

      const res = await api.get('/v1/admin/courses', { params });
      if (res.data?.success && res.data.data?.content) {
        setCourses(res.data.data.content);
      }
    } catch (err) {
      console.error('Failed to load admin courses', err);
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
        setInstructor(c.instructorName || 'SkillForge Faculty');
        setInstructorBio(c.instructorBio || '');
        setDuration(String(c.durationHours || 40));
        setLevel(c.level || 'BEGINNER');
        setStatus(c.status || 'PUBLISHED');
        setThumbnailUrl(c.thumbnailUrl || '');
        setLearningOutcomes((c.learningOutcomes || []).join(', '));
        setPrerequisites((c.prerequisites || []).join(', '));
        setShowEditModal(true);
      }
    } catch (err: any) {
      alert('Failed to fetch course details for editing: ' + err.message);
    }
  };

  const handleSubmitCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      alert('Course title is required');
      return;
    }

    const payload = {
      title: title.trim(),
      slug: slug.trim() || undefined,
      shortDescription: shortDesc.trim() || undefined,
      description: description.trim() || undefined,
      price: parseFloat(price) || 0,
      originalPrice: parseFloat(originalPrice) || undefined,
      currency: currency.trim() || 'INR',
      instructorName: instructor.trim() || 'SkillForge Faculty',
      instructorBio: instructorBio.trim() || undefined,
      durationHours: parseInt(duration) || 40,
      level,
      status,
      thumbnailUrl: thumbnailUrl.trim() || undefined,
      learningOutcomes: learningOutcomes
        ? learningOutcomes.split(',').map((s) => s.trim()).filter(Boolean)
        : [],
      prerequisites: prerequisites
        ? prerequisites.split(',').map((s) => s.trim()).filter(Boolean)
        : [],
    };

    setSubmitting(true);
    try {
      if (editingCourseId) {
        await api.put(`/v1/admin/courses/${editingCourseId}`, payload);
        alert('Course updated successfully.');
        setShowEditModal(false);
      } else {
        await api.post('/v1/admin/courses', payload);
        alert('New course created successfully.');
        setShowCreateModal(false);
      }
      fetchCourses();
    } catch (err: any) {
      alert(err.response?.data?.message || err.message || 'Operation failed');
    } finally {
      setSubmitting(false);
    }
  };

  const loadSampleBulkTemplate = () => {
    const sample = [
      {
        title: 'Full Stack Java & Spring Boot Mastery',
        shortDescription: 'Master microservices, JPA Hibernate, Docker and React frontend.',
        price: 3499,
        originalPrice: 6999,
        level: 'INTERMEDIATE',
        durationHours: 50,
        status: 'PUBLISHED',
      },
      {
        title: 'Cloud DevOps with AWS & Terraform',
        shortDescription: 'Infrastructure as Code, Kubernetes clusters, CI/CD pipelines.',
        price: 3999,
        originalPrice: 7999,
        level: 'ADVANCED',
        durationHours: 45,
        status: 'PUBLISHED',
      },
    ];
    setBulkJsonText(JSON.stringify(sample, null, 2));
  };

  const handleBulkUpload = async () => {
    if (!bulkJsonText.trim()) return;
    try {
      const parsed = JSON.parse(bulkJsonText);
      if (!Array.isArray(parsed)) {
        alert('Payload must be a JSON array of course objects.');
        return;
      }
      setBulkUploading(true);
      await api.post('/v1/admin/courses/bulk', parsed);
      alert(`Successfully imported ${parsed.length} courses.`);
      setShowBulkModal(false);
      setBulkJsonText('');
      fetchCourses();
    } catch (err: any) {
      alert('Bulk import failed: ' + (err.response?.data?.message || err.message));
    } finally {
      setBulkUploading(false);
    }
  };

  return (
    <div className="flex-1 bg-slate-950 text-slate-100 pb-16">
      <AdminNav />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Header & Primary Actions */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Course & Fee Management
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Create and publish courses, configure curriculum sections, adjust fees, and upload media.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <Button
              variant="outline"
              size="sm"
              icon={<Upload className="w-4 h-4" />}
              onClick={() => setShowBulkModal(true)}
              className="border-slate-700 text-slate-200 hover:bg-slate-800"
            >
              Bulk Import
            </Button>
            <Button
              variant="teal"
              size="sm"
              icon={<Plus className="w-4 h-4" />}
              onClick={handleOpenCreateModal}
            >
              Create Course
            </Button>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="bg-slate-900 p-3.5 rounded-xl border border-slate-800 shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-8 py-1.5 text-xs bg-slate-800 border border-slate-700 rounded-lg text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-xs bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-teal-500/20 text-slate-200"
            >
              <option value="">All Statuses</option>
              <option value="PUBLISHED">Published</option>
              <option value="DRAFT">Draft</option>
              <option value="ARCHIVED">Archived</option>
            </select>

            <select
              value={levelFilter}
              onChange={(e) => setLevelFilter(e.target.value)}
              className="text-xs bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-teal-500/20 text-slate-200"
            >
              <option value="">All Levels</option>
              <option value="BEGINNER">Beginner</option>
              <option value="INTERMEDIATE">Intermediate</option>
              <option value="ADVANCED">Advanced</option>
            </select>
          </div>
        </div>

        {/* Courses Table */}
        <div className="bg-slate-900 rounded-xl border border-slate-800 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-850 border-b border-slate-800 text-slate-400">
                <tr>
                  <th className="px-5 py-3 font-semibold">Course</th>
                  <th className="px-5 py-3 font-semibold">Price</th>
                  <th className="px-5 py-3 font-semibold">Level & Duration</th>
                  <th className="px-5 py-3 font-semibold">Status</th>
                  <th className="px-5 py-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="px-5 py-12 text-center text-xs text-slate-400">
                      <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-slate-500" />
                      Loading course inventory...
                    </td>
                  </tr>
                ) : courses.length > 0 ? (
                  courses.map((course) => (
                    <tr key={course.id} className="hover:bg-slate-800/40">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-9 bg-slate-800 rounded overflow-hidden shrink-0 border border-slate-700">
                            {course.thumbnailUrl ? (
                              <img src={course.thumbnailUrl} alt={course.title} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-slate-500">
                                <BookOpen className="w-4 h-4" />
                              </div>
                            )}
                          </div>
                          <div className="min-w-0">
                            <span className="font-semibold text-white line-clamp-1">{course.title}</span>
                            <span className="text-[11px] text-slate-400">{course.instructorName || 'SkillForge Faculty'}</span>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-3.5 font-semibold text-white">
                        {formatCurrency(course.price, course.currency)}
                      </td>

                      <td className="px-5 py-3.5 text-slate-400">
                        <div className="text-slate-200">{course.level}</div>
                        <div className="text-[11px] text-slate-500">{formatDuration(course.durationHours)}</div>
                      </td>

                      <td className="px-5 py-3.5">
                        <Badge
                          variant={course.status === 'PUBLISHED' ? 'success' : 'neutral'}
                          size="sm"
                        >
                          {course.status}
                        </Badge>
                      </td>

                      <td className="px-5 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Link
                            to={`/admin/courses/${course.id}/curriculum`}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-teal-500/10 text-teal-400 hover:bg-teal-500/20 font-medium text-[11px] transition-colors"
                            title="Manage curriculum sections and lectures"
                          >
                            <Layers className="w-3.5 h-3.5" />
                            <span>Curriculum</span>
                          </Link>

                          <button
                            type="button"
                            onClick={() => handleToggleStatus(course.id, course.status)}
                            className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800"
                            title={course.status === 'PUBLISHED' ? 'Unpublish to Draft' : 'Publish Course'}
                          >
                            {course.status === 'PUBLISHED' ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>

                          <button
                            type="button"
                            onClick={() => handleOpenEditModal(course.id)}
                            className="p-1 rounded text-slate-400 hover:text-teal-400 hover:bg-slate-800"
                            title="Edit course details"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDeleteCourse(course.id, course.title)}
                            className="p-1 rounded text-slate-400 hover:text-rose-400 hover:bg-slate-800"
                            title="Delete course"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-5 py-8 text-center text-xs text-slate-400">
                      No courses match your criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Course Create / Edit Modal */}
      {(showCreateModal || showEditModal) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-slate-900 rounded-xl max-w-2xl w-full p-6 space-y-4 shadow-xl border border-slate-800 my-8 max-h-[90vh] overflow-y-auto text-slate-100">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-semibold text-white">
                {editingCourseId ? 'Edit Course Details' : 'Create New Course'}
              </h3>
              <button
                type="button"
                onClick={() => {
                  setShowCreateModal(false);
                  setShowEditModal(false);
                }}
                className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmitCourse} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-200 mb-1">
                  Course Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Full Stack React & Spring Boot"
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-200 mb-1">Price (INR)</label>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-200 mb-1">Original Price (INR)</label>
                  <input
                    type="number"
                    value={originalPrice}
                    onChange={(e) => setOriginalPrice(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-200 mb-1">Level</label>
                  <select
                    value={level}
                    onChange={(e) => setLevel(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                  >
                    <option value="BEGINNER">Beginner</option>
                    <option value="INTERMEDIATE">Intermediate</option>
                    <option value="ADVANCED">Advanced</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-200 mb-1">Duration (Hours)</label>
                  <input
                    type="number"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-200 mb-1">Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                  >
                    <option value="PUBLISHED">Published</option>
                    <option value="DRAFT">Draft</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-200 mb-1">Thumbnail URL</label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={thumbnailUrl}
                    onChange={(e) => setThumbnailUrl(e.target.value)}
                    placeholder="https://..."
                    className="flex-1 px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                  />
                  <label className="px-3 py-2 bg-slate-800 hover:bg-slate-750 border border-slate-700 text-slate-200 rounded-lg cursor-pointer flex items-center gap-1 font-medium transition-colors">
                    <Upload className="w-3.5 h-3.5" />
                    <span>{uploadingImage ? 'Uploading...' : 'Upload'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageFileUpload}
                      disabled={uploadingImage}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-200 mb-1">Short Description</label>
                <input
                  type="text"
                  value={shortDesc}
                  onChange={(e) => setShortDesc(e.target.value)}
                  placeholder="One sentence summary of what is taught..."
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-200 mb-1">Full Description</label>
                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Detailed course breakdown..."
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-800">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setShowCreateModal(false);
                    setShowEditModal(false);
                  }}
                  className="text-slate-400 hover:text-white"
                >
                  Cancel
                </Button>
                <Button type="submit" variant="teal" size="sm" loading={submitting}>
                  {editingCourseId ? 'Save Changes' : 'Create Course'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Bulk Import Modal */}
      {showBulkModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-xs p-4">
          <div className="bg-slate-900 rounded-xl max-w-xl w-full p-6 space-y-4 shadow-xl border border-slate-800 text-slate-100">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-semibold text-white">Bulk Import Courses</h3>
              <button
                type="button"
                onClick={() => setShowBulkModal(false)}
                className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-400">
              Paste a JSON array of course objects with title, price, description, and level.
            </p>

            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-200">JSON Payload</span>
              <button
                type="button"
                onClick={loadSampleBulkTemplate}
                className="text-xs font-medium text-teal-400 hover:underline"
              >
                Load Sample Template
              </button>
            </div>

            <textarea
              rows={8}
              value={bulkJsonText}
              onChange={(e) => setBulkJsonText(e.target.value)}
              placeholder="Paste JSON array here..."
              className="w-full p-3 font-mono text-xs bg-slate-800 border border-slate-700 rounded-lg text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
            />

            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-800">
              <Button variant="ghost" size="sm" onClick={() => setShowBulkModal(false)} className="text-slate-400 hover:text-white">
                Cancel
              </Button>
              <Button
                variant="teal"
                size="sm"
                onClick={handleBulkUpload}
                loading={bulkUploading}
                disabled={!bulkJsonText.trim()}
              >
                Import Courses
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
