import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { api } from '../../api/client';
import { CourseDetail, CourseSection, Lesson } from '../../types';
import { AdminNav } from '../../components/AdminNav';
import {
  Layers,
  Plus,
  Edit2,
  Trash2,
  ChevronDown,
  ChevronUp,
  ArrowLeft,
  Video,
  FileText,
  Download,
  Upload,
  Play,
  Clock,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  MoveUp,
  MoveDown,
  X,
  FileSpreadsheet,
  Film,
  BookOpen,
} from 'lucide-react';

export const AdminCurriculumPage: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();

  const [course, setCourse] = useState<CourseDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [collapsedSections, setCollapsedSections] = useState<Record<number, boolean>>({});

  // Section Modal State
  const [showSectionModal, setShowSectionModal] = useState(false);
  const [editingSection, setEditingSection] = useState<CourseSection | null>(null);
  const [sectionTitle, setSectionTitle] = useState('');
  const [sectionDesc, setSectionDesc] = useState('');
  const [sectionOrder, setSectionOrder] = useState<number>(1);
  const [sectionSubmitting, setSectionSubmitting] = useState(false);

  // Lesson Modal State
  const [showLessonModal, setShowLessonModal] = useState(false);
  const [targetSectionId, setTargetSectionId] = useState<number | null>(null);
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
  const [lessonTitle, setLessonTitle] = useState('');
  const [lessonDesc, setLessonDesc] = useState('');
  const [lessonType, setLessonType] = useState<'VIDEO' | 'TEXT' | 'PDF' | 'RESOURCE'>('VIDEO');
  const [lessonVideoUrl, setLessonVideoUrl] = useState('');
  const [lessonDurationMinutes, setLessonDurationMinutes] = useState('15');
  const [lessonContentText, setLessonContentText] = useState('');
  const [lessonPreview, setLessonPreview] = useState(false);
  const [lessonMandatory, setLessonMandatory] = useState(true);
  const [lessonOrder, setLessonOrder] = useState<number>(1);
  const [lessonSubmitting, setLessonSubmitting] = useState(false);
  const [uploadingFile, setUploadingFile] = useState(false);

  // Status message
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const showNotification = (type: 'success' | 'error', text: string) => {
    setStatusMsg({ type, text });
    setTimeout(() => setStatusMsg(null), 4000);
  };

  const fetchCourseData = async () => {
    if (!courseId) return;
    setLoading(true);
    try {
      const res = await api.get(`/v1/courses/${courseId}`);
      if (res.data?.success) {
        setCourse(res.data.data);
      }
    } catch (err: any) {
      showNotification('error', err.message || 'Failed to load course details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourseData();
  }, [courseId]);

  const toggleSectionCollapse = (sId: number) => {
    setCollapsedSections((prev) => ({
      ...prev,
      [sId]: !prev[sId],
    }));
  };

  // ==========================================
  // SECTION HANDLERS
  // ==========================================

  const handleOpenAddSection = () => {
    setEditingSection(null);
    setSectionTitle('');
    setSectionDesc('');
    setSectionOrder((course?.sections?.length || 0) + 1);
    setShowSectionModal(true);
  };

  const handleOpenEditSection = (section: CourseSection) => {
    setEditingSection(section);
    setSectionTitle(section.title);
    setSectionDesc(section.description || '');
    setSectionOrder(section.sortOrder || 1);
    setShowSectionModal(true);
  };

  const handleSaveSection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sectionTitle.trim() || !courseId) return;

    setSectionSubmitting(true);
    const payload = {
      title: sectionTitle.trim(),
      description: sectionDesc.trim() || undefined,
      sortOrder: sectionOrder,
    };

    try {
      if (editingSection) {
        await api.put(`/v1/admin/sections/${editingSection.id}`, payload);
        showNotification('success', 'Curriculum section updated successfully.');
      } else {
        await api.post(`/v1/admin/courses/${courseId}/sections`, payload);
        showNotification('success', 'New curriculum section added successfully.');
      }
      setShowSectionModal(false);
      fetchCourseData();
    } catch (err: any) {
      showNotification('error', err.message || 'Failed to save section.');
    } finally {
      setSectionSubmitting(false);
    }
  };

  const handleDeleteSection = async (section: CourseSection) => {
    const lessonCount = section.lessons?.length || 0;
    const confirmPrompt = lessonCount > 0
      ? `Section "${section.title}" contains ${lessonCount} lectures. Are you sure you want to delete this section and all its lectures?`
      : `Are you sure you want to delete section "${section.title}"?`;

    if (!window.confirm(confirmPrompt)) return;

    try {
      await api.delete(`/v1/admin/sections/${section.id}`);
      showNotification('success', 'Section deleted successfully.');
      fetchCourseData();
    } catch (err: any) {
      showNotification('error', err.message || 'Failed to delete section.');
    }
  };

  const handleMoveSection = async (sectionIndex: number, direction: 'UP' | 'DOWN') => {
    if (!course || !course.sections) return;
    const newSections = [...course.sections];
    const targetIndex = direction === 'UP' ? sectionIndex - 1 : sectionIndex + 1;

    if (targetIndex < 0 || targetIndex >= newSections.length) return;

    // Swap
    const temp = newSections[sectionIndex];
    newSections[sectionIndex] = newSections[targetIndex];
    newSections[targetIndex] = temp;

    const orderedIds = newSections.map((s) => s.id);
    try {
      await api.patch(`/v1/admin/courses/${course.id}/sections/reorder`, orderedIds);
      fetchCourseData();
    } catch (err: any) {
      showNotification('error', err.message || 'Failed to reorder sections.');
    }
  };

  // ==========================================
  // LESSON HANDLERS
  // ==========================================

  const handleOpenAddLesson = (sectionId: number) => {
    const section = course?.sections.find((s) => s.id === sectionId);
    setTargetSectionId(sectionId);
    setEditingLesson(null);
    setLessonTitle('');
    setLessonDesc('');
    setLessonType('VIDEO');
    setLessonVideoUrl('');
    setLessonDurationMinutes('15');
    setLessonContentText('');
    setLessonPreview(false);
    setLessonMandatory(true);
    setLessonOrder((section?.lessons?.length || 0) + 1);
    setShowLessonModal(true);
  };

  const handleOpenEditLesson = (lesson: Lesson, sectionId: number) => {
    setTargetSectionId(sectionId);
    setEditingLesson(lesson);
    setLessonTitle(lesson.title);
    setLessonDesc(lesson.description || '');
    setLessonType(lesson.contentType || 'VIDEO');
    setLessonVideoUrl(lesson.videoUrl || '');
    setLessonDurationMinutes(
      lesson.videoDurationSeconds ? String(Math.round(lesson.videoDurationSeconds / 60)) : '15'
    );
    setLessonContentText(lesson.contentText || '');
    setLessonPreview(lesson.preview || false);
    setLessonMandatory(lesson.mandatory !== false);
    setLessonOrder(lesson.sortOrder || 1);
    setShowLessonModal(true);
  };

  const handleSaveLesson = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lessonTitle.trim() || !targetSectionId) return;

    setLessonSubmitting(true);
    const durationSeconds = (parseInt(lessonDurationMinutes, 10) || 0) * 60;

    const payload = {
      title: lessonTitle.trim(),
      description: lessonDesc.trim() || undefined,
      contentType: lessonType,
      videoUrl: lessonVideoUrl.trim() || undefined,
      videoDurationSeconds: durationSeconds > 0 ? durationSeconds : undefined,
      contentText: lessonContentText.trim() || undefined,
      sortOrder: lessonOrder,
      preview: lessonPreview,
      mandatory: lessonMandatory,
      sectionId: targetSectionId,
    };

    try {
      if (editingLesson) {
        await api.put(`/v1/admin/lessons/${editingLesson.id}`, payload);
        showNotification('success', 'Lecture updated successfully.');
      } else {
        await api.post(`/v1/admin/sections/${targetSectionId}/lessons`, payload);
        showNotification('success', 'New lecture created successfully.');
      }
      setShowLessonModal(false);
      fetchCourseData();
    } catch (err: any) {
      showNotification('error', err.message || 'Failed to save lecture.');
    } finally {
      setLessonSubmitting(false);
    }
  };

  const handleDeleteLesson = async (lesson: Lesson) => {
    if (!window.confirm(`Are you sure you want to delete lecture "${lesson.title}"?`)) return;

    try {
      await api.delete(`/v1/admin/lessons/${lesson.id}`);
      showNotification('success', 'Lecture deleted successfully.');
      fetchCourseData();
    } catch (err: any) {
      showNotification('error', err.message || 'Failed to delete lecture.');
    }
  };

  const handleMoveLesson = async (
    sectionId: number,
    lessonIndex: number,
    direction: 'UP' | 'DOWN'
  ) => {
    const section = course?.sections.find((s) => s.id === sectionId);
    if (!section || !section.lessons) return;

    const newLessons = [...section.lessons];
    const targetIndex = direction === 'UP' ? lessonIndex - 1 : lessonIndex + 1;

    if (targetIndex < 0 || targetIndex >= newLessons.length) return;

    // Swap
    const temp = newLessons[lessonIndex];
    newLessons[lessonIndex] = newLessons[targetIndex];
    newLessons[targetIndex] = temp;

    const orderedIds = newLessons.map((l) => l.id);
    try {
      await api.patch(`/v1/admin/sections/${sectionId}/lessons/reorder`, orderedIds);
      fetchCourseData();
    } catch (err: any) {
      showNotification('error', err.message || 'Failed to reorder lectures.');
    }
  };

  // Upload attachment file (PDF, code zip, slides) and append to contentText
  const handleUploadAttachment = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingFile(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await api.post('/v1/admin/upload?folder=curriculum', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (res.data?.success && res.data?.data?.url) {
        const fileUrl = res.data.data.url;
        const fileName = res.data.data.filename || file.name;
        const markdownLink = `\n- [Download Resource: ${fileName}](${fileUrl})\n`;
        setLessonContentText((prev) => (prev ? prev + markdownLink : markdownLink));
        showNotification('success', `File "${fileName}" uploaded and linked.`);
      }
    } catch (err: any) {
      showNotification('error', err.message || 'Failed to upload attachment.');
    } finally {
      setUploadingFile(false);
      e.target.value = '';
    }
  };

  // Calculations
  const allLessons = course?.sections?.flatMap((s) => s.lessons) || [];
  const totalVideoMinutes = Math.round(
    allLessons.reduce((acc, l) => acc + (l.videoDurationSeconds || 0), 0) / 60
  );
  const previewLessonsCount = allLessons.filter((l) => l.preview).length;

  return (
    <div className="flex-1 bg-slate-50 pb-20">
      <AdminNav />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Toast Notification */}
        {statusMsg && (
          <div
            className={`mb-6 p-4 rounded-2xl flex items-center justify-between text-sm shadow-md transition-all ${
              statusMsg.type === 'success'
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                : 'bg-rose-50 text-rose-800 border border-rose-200'
            }`}
          >
            <div className="flex items-center space-x-2.5">
              {statusMsg.type === 'success' ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              ) : (
                <AlertCircle className="w-5 h-5 text-rose-600" />
              )}
              <span className="font-semibold">{statusMsg.text}</span>
            </div>
            <button onClick={() => setStatusMsg(null)} className="text-slate-400 hover:text-slate-700">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Back Link & Header */}
        <div className="flex items-center justify-between mb-6">
          <Link
            to="/admin/courses"
            className="inline-flex items-center space-x-2 text-xs font-bold text-slate-500 hover:text-indigo-600 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Courses</span>
          </Link>

          {course && (
            <div className="flex items-center space-x-3">
              <Link
                to={`/courses/${course.slug}`}
                target="_blank"
                className="inline-flex items-center space-x-1.5 px-3.5 py-2 bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-xl border border-slate-200 transition shadow-xs"
              >
                <span>Catalog View</span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
              </Link>

              <Link
                to={`/learn/${course.id}`}
                target="_blank"
                className="inline-flex items-center space-x-1.5 px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-bold rounded-xl border border-emerald-200 transition shadow-xs"
              >
                <Play className="w-3.5 h-3.5 text-emerald-600" />
                <span>Open Player Theater</span>
              </Link>
            </div>
          )}
        </div>

        {/* Course Banner Card */}
        {loading ? (
          <div className="bg-white p-8 rounded-3xl border border-slate-200 text-center animate-pulse mb-8">
            <div className="h-6 w-1/3 bg-slate-200 rounded mx-auto mb-4"></div>
            <div className="h-4 w-1/2 bg-slate-100 rounded mx-auto"></div>
          </div>
        ) : !course ? (
          <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center mb-8">
            <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-3" />
            <h2 className="text-xl font-bold text-slate-900 mb-1">Course Not Found</h2>
            <p className="text-slate-500 text-sm mb-4">The requested course ID could not be loaded.</p>
            <Link to="/admin/courses" className="bg-indigo-600 text-white px-5 py-2 rounded-xl text-xs font-bold">
              Return to Courses
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-8 mb-8">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="flex items-start sm:items-center space-x-4">
                <div className="w-16 h-16 rounded-2xl bg-slate-100 border border-slate-200 overflow-hidden shrink-0 flex items-center justify-center shadow-xs">
                  {course.thumbnailUrl ? (
                    <img src={course.thumbnailUrl} alt={course.title} className="w-full h-full object-cover" />
                  ) : (
                    <BookOpen className="w-8 h-8 text-indigo-500" />
                  )}
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-1.5">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                        course.status === 'PUBLISHED'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}
                    >
                      {course.status}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-600">
                      {course.level}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">ID: #{course.id}</span>
                  </div>
                  <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                    {course.title}
                  </h1>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Instructor: <span className="font-semibold text-slate-700">{course.instructorName || 'Faculty'}</span> &bull; Fees: ₹{course.price.toLocaleString('en-IN')}
                  </p>
                </div>
              </div>

              {/* Action */}
              <div className="flex items-center space-x-3 shrink-0">
                <button
                  onClick={handleOpenAddSection}
                  className="inline-flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm px-5 py-3 rounded-2xl shadow-md shadow-indigo-600/20 transition"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Curriculum Section</span>
                </button>
              </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-100">
              <div className="bg-slate-50/70 p-3.5 rounded-2xl">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Sections
                </span>
                <span className="text-xl font-black text-slate-800">{course.sections?.length || 0}</span>
              </div>
              <div className="bg-slate-50/70 p-3.5 rounded-2xl">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Total Lectures
                </span>
                <span className="text-xl font-black text-slate-800">{allLessons.length}</span>
              </div>
              <div className="bg-slate-50/70 p-3.5 rounded-2xl">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Video Duration
                </span>
                <span className="text-xl font-black text-slate-800">{totalVideoMinutes} Mins</span>
              </div>
              <div className="bg-slate-50/70 p-3.5 rounded-2xl">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Free Previews
                </span>
                <span className="text-xl font-black text-emerald-600">{previewLessonsCount} Lectures</span>
              </div>
            </div>
          </div>
        )}

        {/* Curriculum Sections List */}
        {course && (
          <div className="space-y-6">
            {course.sections && course.sections.length > 0 ? (
              course.sections.map((section, sIndex) => {
                const isCollapsed = collapsedSections[section.id];
                const sectionDurationMinutes = Math.round(
                  (section.lessons || []).reduce((acc, l) => acc + (l.videoDurationSeconds || 0), 0) / 60
                );

                return (
                  <div
                    key={section.id}
                    className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden transition-all"
                  >
                    {/* Section Header */}
                    <div className="p-5 sm:p-6 bg-slate-50/60 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex items-start space-x-3.5">
                        <button
                          onClick={() => toggleSectionCollapse(section.id)}
                          className="mt-0.5 p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition"
                          title={isCollapsed ? 'Expand section' : 'Collapse section'}
                        >
                          {isCollapsed ? <ChevronDown className="w-5 h-5" /> : <ChevronUp className="w-5 h-5" />}
                        </button>

                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-indigo-100 text-indigo-700 uppercase tracking-wider">
                              Section {sIndex + 1}
                            </span>
                            <span className="text-xs text-slate-400 font-semibold">
                              {section.lessons?.length || 0} Lectures &bull; {sectionDurationMinutes} Mins
                            </span>
                          </div>
                          <h3 className="text-base sm:text-lg font-bold text-slate-900 mt-1">
                            {section.title}
                          </h3>
                          {section.description && (
                            <p className="text-xs text-slate-500 mt-0.5 max-w-2xl">{section.description}</p>
                          )}
                        </div>
                      </div>

                      {/* Section Action Controls */}
                      <div className="flex items-center space-x-2 shrink-0 justify-end pt-2 md:pt-0">
                        <button
                          onClick={() => handleOpenAddLesson(section.id)}
                          className="inline-flex items-center space-x-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 px-3 py-1.5 rounded-xl text-xs font-bold transition shadow-2xs"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add Lecture</span>
                        </button>

                        <button
                          onClick={() => handleOpenEditSection(section)}
                          className="p-1.5 text-slate-500 hover:text-indigo-600 rounded-lg hover:bg-slate-200/50 transition"
                          title="Edit Section Title / Description"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => handleMoveSection(sIndex, 'UP')}
                          disabled={sIndex === 0}
                          className="p-1.5 text-slate-400 hover:text-slate-700 disabled:opacity-20 rounded-lg transition"
                          title="Move Section Up"
                        >
                          <MoveUp className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => handleMoveSection(sIndex, 'DOWN')}
                          disabled={sIndex === (course.sections?.length || 0) - 1}
                          className="p-1.5 text-slate-400 hover:text-slate-700 disabled:opacity-20 rounded-lg transition"
                          title="Move Section Down"
                        >
                          <MoveDown className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => handleDeleteSection(section)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition"
                          title="Delete Section"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Lessons Content */}
                    {!isCollapsed && (
                      <div className="p-4 sm:p-6 space-y-3">
                        {section.lessons && section.lessons.length > 0 ? (
                          section.lessons.map((lesson, lIndex) => {
                            const durationMins = lesson.videoDurationSeconds
                              ? Math.round(lesson.videoDurationSeconds / 60)
                              : 0;

                            return (
                              <div
                                key={lesson.id}
                                className="bg-slate-50/70 hover:bg-slate-50 border border-slate-200/80 p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition group"
                              >
                                <div className="flex items-start sm:items-center space-x-3.5 min-w-0">
                                  {/* Icon by Content Type */}
                                  <div
                                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-2xs ${
                                      lesson.contentType === 'VIDEO'
                                        ? 'bg-purple-100 text-purple-700'
                                        : lesson.contentType === 'PDF'
                                        ? 'bg-amber-100 text-amber-700'
                                        : lesson.contentType === 'RESOURCE'
                                        ? 'bg-emerald-100 text-emerald-700'
                                        : 'bg-blue-100 text-blue-700'
                                    }`}
                                  >
                                    {lesson.contentType === 'VIDEO' ? (
                                      <Film className="w-4 h-4" />
                                    ) : lesson.contentType === 'PDF' ? (
                                      <FileSpreadsheet className="w-4 h-4" />
                                    ) : lesson.contentType === 'RESOURCE' ? (
                                      <Download className="w-4 h-4" />
                                    ) : (
                                      <FileText className="w-4 h-4" />
                                    )}
                                  </div>

                                  <div className="min-w-0">
                                    <div className="flex flex-wrap items-center gap-2">
                                      <span className="text-xs font-bold text-slate-400">
                                        {sIndex + 1}.{lIndex + 1}
                                      </span>
                                      <h4 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition truncate">
                                        {lesson.title}
                                      </h4>
                                      {lesson.preview && (
                                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700 border border-emerald-200">
                                          Free Demo
                                        </span>
                                      )}
                                      {!lesson.mandatory && (
                                        <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-200 text-slate-600">
                                          Optional
                                        </span>
                                      )}
                                    </div>

                                    {/* Subtitle / Details */}
                                    <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500 mt-1">
                                      {durationMins > 0 && (
                                        <span className="flex items-center space-x-1">
                                          <Clock className="w-3 h-3 text-slate-400" />
                                          <span>{durationMins} Mins</span>
                                        </span>
                                      )}
                                      {lesson.videoUrl && (
                                        <span className="text-indigo-600 truncate max-w-xs font-mono text-[10px]">
                                          {lesson.videoUrl}
                                        </span>
                                      )}
                                      {lesson.contentText && (
                                        <span className="text-emerald-700 font-semibold flex items-center space-x-1">
                                          <Download className="w-3 h-3" />
                                          <span>Has Attached Resources</span>
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </div>

                                {/* Lesson Actions */}
                                <div className="flex items-center space-x-1.5 shrink-0 justify-end pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-200/60">
                                  <button
                                    onClick={() => handleOpenEditLesson(lesson, section.id)}
                                    className="p-1.5 text-indigo-600 hover:text-indigo-800 rounded-lg hover:bg-indigo-50 transition"
                                    title="Edit Lecture Details"
                                  >
                                    <Edit2 className="w-4 h-4" />
                                  </button>

                                  <button
                                    onClick={() => handleMoveLesson(section.id, lIndex, 'UP')}
                                    disabled={lIndex === 0}
                                    className="p-1.5 text-slate-400 hover:text-slate-700 disabled:opacity-20 rounded-lg transition"
                                    title="Move Lecture Up"
                                  >
                                    <MoveUp className="w-3.5 h-3.5" />
                                  </button>

                                  <button
                                    onClick={() => handleMoveLesson(section.id, lIndex, 'DOWN')}
                                    disabled={lIndex === (section.lessons?.length || 0) - 1}
                                    className="p-1.5 text-slate-400 hover:text-slate-700 disabled:opacity-20 rounded-lg transition"
                                    title="Move Lecture Down"
                                  >
                                    <MoveDown className="w-3.5 h-3.5" />
                                  </button>

                                  <button
                                    onClick={() => handleDeleteLesson(lesson)}
                                    className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition"
                                    title="Delete Lecture"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>
                            );
                          })
                        ) : (
                          <div className="py-8 text-center bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                            <Layers className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                            <p className="text-xs font-semibold text-slate-600">No lectures in this section yet.</p>
                            <button
                              onClick={() => handleOpenAddLesson(section.id)}
                              className="mt-2 text-xs font-bold text-indigo-600 hover:text-indigo-700 underline"
                            >
                              Add First Lecture
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center shadow-xs">
                <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-4">
                  <Layers className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-1">No Curriculum Defined Yet</h3>
                <p className="text-sm text-slate-500 max-w-md mx-auto mb-6">
                  Build your course structure by adding learning modules, video lessons, and downloadable course resources.
                </p>
                <button
                  onClick={handleOpenAddSection}
                  className="inline-flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm px-5 py-3 rounded-xl shadow-md transition"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create First Curriculum Section</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ==========================================
          MODAL: ADD / EDIT SECTION
      ========================================== */}
      {showSectionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                  <Layers className="w-4 h-4" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">
                  {editingSection ? 'Edit Curriculum Section' : 'Create Curriculum Section'}
                </h3>
              </div>
              <button
                onClick={() => setShowSectionModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveSection} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Section Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Core Architecture & Environment Setup"
                  value={sectionTitle}
                  onChange={(e) => setSectionTitle(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500 outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Section Description & Outcomes
                </label>
                <textarea
                  rows={3}
                  placeholder="Summary of skills and concepts covered in this module..."
                  value={sectionDesc}
                  onChange={(e) => setSectionDesc(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500 outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Sort Order Number
                </label>
                <input
                  type="number"
                  min="1"
                  value={sectionOrder}
                  onChange={(e) => setSectionOrder(parseInt(e.target.value, 10) || 1)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500 outline-hidden"
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowSectionModal(false)}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={sectionSubmitting}
                  className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition shadow disabled:opacity-50"
                >
                  {sectionSubmitting ? 'Saving...' : editingSection ? 'Update Section' : 'Add Section'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==========================================
          MODAL: ADD / EDIT LESSON
      ========================================== */}
      {showLessonModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative my-8 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
                  <Film className="w-4 h-4" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">
                  {editingLesson ? 'Edit Lecture' : 'Add Lecture to Section'}
                </h3>
              </div>
              <button
                onClick={() => setShowLessonModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveLesson} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Lecture Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Master Deep Querying with Spring Data JPA"
                  value={lessonTitle}
                  onChange={(e) => setLessonTitle(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500 outline-hidden"
                />
              </div>

              {/* Destination Section (if editing, allows moving between sections) */}
              {course?.sections && course.sections.length > 1 && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Parent Curriculum Section
                  </label>
                  <select
                    value={targetSectionId || ''}
                    onChange={(e) => setTargetSectionId(Number(e.target.value))}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500 outline-hidden bg-white"
                  >
                    {course.sections.map((s, idx) => (
                      <option key={s.id} value={s.id}>
                        Section {idx + 1}: {s.title}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Content Type
                  </label>
                  <select
                    value={lessonType}
                    onChange={(e) => setLessonType(e.target.value as any)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500 outline-hidden bg-white"
                  >
                    <option value="VIDEO">Video Lecture</option>
                    <option value="TEXT">Reading & Code Walkthrough</option>
                    <option value="PDF">PDF Slides & Manual</option>
                    <option value="RESOURCE">Downloadable Resource / Project</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Duration (Minutes)
                  </label>
                  <input
                    type="number"
                    min="1"
                    placeholder="15"
                    value={lessonDurationMinutes}
                    onChange={(e) => setLessonDurationMinutes(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500 outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Video Stream URL (YouTube, Vimeo, MP4 Direct or Cloud Link)
                </label>
                <input
                  type="url"
                  placeholder="https://www.youtube.com/watch?v=... or https://cloud.com/video.mp4"
                  value={lessonVideoUrl}
                  onChange={(e) => setLessonVideoUrl(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500 outline-hidden font-mono text-xs"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  YouTube watch URLs are automatically converted to embed format for flawless playback in the player theater.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Lecture Description / Summary
                </label>
                <textarea
                  rows={2}
                  placeholder="Overview of the core takeaways in this lecture..."
                  value={lessonDesc}
                  onChange={(e) => setLessonDesc(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500 outline-hidden"
                />
              </div>

              {/* Downloadable Resources & Content Notes */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Curriculum Notes & Downloadable Resources
                  </label>

                  {/* Direct File Attachment Button */}
                  <label className="inline-flex items-center space-x-1.5 px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold rounded-lg cursor-pointer transition">
                    <Upload className="w-3.5 h-3.5" />
                    <span>{uploadingFile ? 'Uploading...' : 'Attach Document / File'}</span>
                    <input
                      type="file"
                      onChange={handleUploadAttachment}
                      disabled={uploadingFile}
                      className="hidden"
                    />
                  </label>
                </div>
                <textarea
                  rows={3}
                  placeholder="Paste GitHub links, documentation markdown, or attach project PDF files..."
                  value={lessonContentText}
                  onChange={(e) => setLessonContentText(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500 outline-hidden font-mono text-xs"
                />
              </div>

              {/* Toggles */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <label className="flex items-center space-x-2.5 bg-slate-50 p-3 rounded-xl border border-slate-200/80 cursor-pointer hover:bg-slate-100/60 transition">
                  <input
                    type="checkbox"
                    checked={lessonPreview}
                    onChange={(e) => setLessonPreview(e.target.checked)}
                    className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
                  />
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">Free Demo Preview</span>
                    <span className="text-[11px] text-slate-500">Unenrolled users can preview</span>
                  </div>
                </label>

                <label className="flex items-center space-x-2.5 bg-slate-50 p-3 rounded-xl border border-slate-200/80 cursor-pointer hover:bg-slate-100/60 transition">
                  <input
                    type="checkbox"
                    checked={lessonMandatory}
                    onChange={(e) => setLessonMandatory(e.target.checked)}
                    className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
                  />
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">Mandatory Completion</span>
                    <span className="text-[11px] text-slate-500">Required to unlock certificate</span>
                  </div>
                </label>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowLessonModal(false)}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={lessonSubmitting}
                  className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition shadow disabled:opacity-50"
                >
                  {lessonSubmitting ? 'Saving...' : editingLesson ? 'Update Lecture' : 'Add Lecture'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
