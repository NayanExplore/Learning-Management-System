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
  ArrowLeft,
  Video,
  FileText,
  Upload,
  Play,
  Clock,
  MoveUp,
  MoveDown,
  X,
  Check,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { formatLessonDuration } from '../../utils/format';

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
      if (res.data?.success && res.data.data) {
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

  // Section Handlers
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
        showNotification('success', 'Curriculum section updated.');
      } else {
        await api.post(`/v1/admin/courses/${courseId}/sections`, payload);
        showNotification('success', 'New section added.');
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
    if (!window.confirm(`Delete section "${section.title}" and all its lessons?`)) return;

    try {
      await api.delete(`/v1/admin/sections/${section.id}`);
      showNotification('success', 'Section removed.');
      fetchCourseData();
    } catch (err: any) {
      showNotification('error', err.message || 'Failed to delete section.');
    }
  };

  const handleMoveSection = async (sectionIndex: number, direction: 'UP' | 'DOWN') => {
    if (!course || !course.sections) return;
    const targetIndex = direction === 'UP' ? sectionIndex - 1 : sectionIndex + 1;
    if (targetIndex < 0 || targetIndex >= course.sections.length) return;

    const newSections = [...course.sections];
    const temp = newSections[sectionIndex];
    newSections[sectionIndex] = newSections[targetIndex];
    newSections[targetIndex] = temp;

    const orderPayload = newSections.map((s, idx) => ({
      id: s.id,
      sortOrder: idx + 1,
    }));

    try {
      await api.patch(`/v1/admin/courses/${courseId}/sections/reorder`, orderPayload);
      fetchCourseData();
    } catch {
      showNotification('error', 'Failed to reorder sections.');
    }
  };

  // Lesson Handlers
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

  const handleOpenEditLesson = (sectionId: number, lesson: Lesson) => {
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
    setLessonPreview(Boolean(lesson.preview));
    setLessonMandatory(Boolean(lesson.mandatory));
    setLessonOrder(lesson.sortOrder || 1);
    setShowLessonModal(true);
  };

  const handleUploadAttachment = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', 'resources');

    setUploadingFile(true);
    try {
      const res = await api.post('/v1/admin/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (res.data?.success && res.data.data?.url) {
        const fileUrl = res.data.data.url;
        setLessonContentText((prev) => (prev ? `${prev}\n\nResource: ${fileUrl}` : `Resource: ${fileUrl}`));
        showNotification('success', 'File attached successfully.');
      }
    } catch (err: any) {
      showNotification('error', 'Upload failed: ' + (err.response?.data?.message || err.message));
    } finally {
      setUploadingFile(false);
    }
  };

  const handleSaveLesson = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lessonTitle.trim() || !targetSectionId) return;

    setLessonSubmitting(true);
    const durationSeconds = (parseInt(lessonDurationMinutes) || 0) * 60;
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
        showNotification('success', 'Lesson updated.');
      } else {
        await api.post(`/v1/admin/sections/${targetSectionId}/lessons`, payload);
        showNotification('success', 'New lesson added.');
      }
      setShowLessonModal(false);
      fetchCourseData();
    } catch (err: any) {
      showNotification('error', err.message || 'Failed to save lesson.');
    } finally {
      setLessonSubmitting(false);
    }
  };

  const handleDeleteLesson = async (lesson: Lesson) => {
    if (!window.confirm(`Delete lesson "${lesson.title}"?`)) return;

    try {
      await api.delete(`/v1/admin/lessons/${lesson.id}`);
      showNotification('success', 'Lesson deleted.');
      fetchCourseData();
    } catch (err: any) {
      showNotification('error', err.message || 'Failed to delete lesson.');
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

    const temp = newLessons[lessonIndex];
    newLessons[lessonIndex] = newLessons[targetIndex];
    newLessons[targetIndex] = temp;

    const orderPayload = newLessons.map((l, idx) => ({
      id: l.id,
      sortOrder: idx + 1,
    }));

    try {
      await api.patch(`/v1/admin/sections/${sectionId}/lessons/reorder`, orderPayload);
      fetchCourseData();
    } catch {
      showNotification('error', 'Failed to reorder lessons.');
    }
  };

  return (
    <div className="flex-1 bg-slate-950 text-slate-100 pb-16 min-h-screen">
      <AdminNav />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Toast status alert */}
        {statusMsg && (
          <div
            className={`p-3.5 rounded-lg border text-xs flex items-center justify-between ${
              statusMsg.type === 'success'
                ? 'bg-emerald-950/40 border-emerald-800/60 text-emerald-300'
                : 'bg-rose-950/40 border-rose-800/60 text-rose-300'
            }`}
          >
            <div className="flex items-center gap-2">
              {statusMsg.type === 'success' ? (
                <Check className="w-4 h-4 text-emerald-400" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-400" />
              )}
              <span>{statusMsg.text}</span>
            </div>
            <button onClick={() => setStatusMsg(null)}>
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              to="/admin/courses"
              className="p-1.5 rounded-lg border border-slate-800 bg-slate-900 text-slate-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-teal-400">
                  Curriculum Editor
                </span>
                <span className="text-slate-600">/</span>
                <span className="text-xs text-slate-400">Course #{courseId}</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-white">
                {course?.title || 'Loading Curriculum...'}
              </h1>
            </div>
          </div>

          <Button
            variant="primary"
            size="sm"
            icon={<Plus className="w-4 h-4" />}
            onClick={handleOpenAddSection}
          >
            Add Section
          </Button>
        </div>

        {/* Section List */}
        {loading ? (
          <div className="bg-slate-900 p-12 rounded-xl border border-slate-800 text-center text-xs text-slate-400">
            Loading curriculum sections...
          </div>
        ) : course?.sections && course.sections.length > 0 ? (
          <div className="space-y-4">
            {course.sections.map((section, sIndex) => {
              const isCollapsed = collapsedSections[section.id];
              return (
                <div
                  key={section.id}
                  className="bg-slate-900 rounded-xl border border-slate-800 shadow-sm overflow-hidden"
                >
                  {/* Section Bar */}
                  <div className="px-5 py-4 bg-slate-800/60 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <button
                        type="button"
                        onClick={() => toggleSectionCollapse(section.id)}
                        className="p-1 text-slate-400 hover:text-white"
                        aria-label="Toggle section"
                      >
                        <ChevronDown
                          className={`w-4 h-4 transition-transform duration-200 ${
                            isCollapsed ? '-rotate-90' : ''
                          }`}
                        />
                      </button>

                      <span className="text-xs font-mono font-semibold text-teal-400">
                        {String(sIndex + 1).padStart(2, '0')}
                      </span>

                      <div className="min-w-0">
                        <h3 className="text-sm font-semibold text-white truncate">
                          {section.title}
                        </h3>
                        {section.description && (
                          <p className="text-xs text-slate-400 truncate">{section.description}</p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 self-end sm:self-auto shrink-0">
                      <Button
                        variant="outline"
                        size="sm"
                        icon={<Plus className="w-3.5 h-3.5 text-teal-400" />}
                        onClick={() => handleOpenAddLesson(section.id)}
                      >
                        Add Lecture
                      </Button>

                      <button
                        type="button"
                        onClick={() => handleMoveSection(sIndex, 'UP')}
                        disabled={sIndex === 0}
                        className="p-1.5 text-slate-400 hover:text-white disabled:opacity-30 rounded hover:bg-slate-800"
                        title="Move Section Up"
                      >
                        <MoveUp className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleMoveSection(sIndex, 'DOWN')}
                        disabled={sIndex === (course.sections?.length || 0) - 1}
                        className="p-1.5 text-slate-400 hover:text-white disabled:opacity-30 rounded hover:bg-slate-800"
                        title="Move Section Down"
                      >
                        <MoveDown className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleOpenEditSection(section)}
                        className="p-1.5 text-slate-400 hover:text-teal-300 rounded hover:bg-slate-800"
                        title="Edit Section"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDeleteSection(section)}
                        className="p-1.5 text-slate-400 hover:text-rose-400 rounded hover:bg-slate-800"
                        title="Delete Section"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Lessons */}
                  {!isCollapsed && (
                    <div className="divide-y divide-slate-800">
                      {section.lessons && section.lessons.length > 0 ? (
                        section.lessons.map((lesson, lIndex) => (
                          <div
                            key={lesson.id}
                            className="px-5 py-3 flex items-center justify-between text-xs hover:bg-slate-800/40 transition-colors"
                          >
                            <div className="flex items-center gap-3 min-w-0 pr-3">
                              {lesson.contentType === 'VIDEO' ? (
                                <Video className="w-4 h-4 text-teal-400 shrink-0" />
                              ) : (
                                <FileText className="w-4 h-4 text-slate-500 shrink-0" />
                              )}
                              <span className="font-medium text-slate-200 truncate">
                                {lIndex + 1}. {lesson.title}
                              </span>
                              {lesson.preview && (
                                <Badge variant="teal" size="sm">
                                  Free Demo
                                </Badge>
                              )}
                              {lesson.videoDurationSeconds ? (
                                <span className="text-slate-400 font-mono">
                                  {formatLessonDuration(lesson.videoDurationSeconds)}
                                </span>
                              ) : null}
                            </div>

                            <div className="flex items-center gap-1 shrink-0">
                              <button
                                type="button"
                                onClick={() => handleMoveLesson(section.id, lIndex, 'UP')}
                                disabled={lIndex === 0}
                                className="p-1 text-slate-400 hover:text-white disabled:opacity-30 rounded hover:bg-slate-800"
                                title="Move Lesson Up"
                              >
                                <MoveUp className="w-3 h-3" />
                              </button>

                              <button
                                type="button"
                                onClick={() => handleMoveLesson(section.id, lIndex, 'DOWN')}
                                disabled={lIndex === section.lessons.length - 1}
                                className="p-1 text-slate-400 hover:text-white disabled:opacity-30 rounded hover:bg-slate-800"
                                title="Move Lesson Down"
                              >
                                <MoveDown className="w-3 h-3" />
                              </button>

                              <button
                                type="button"
                                onClick={() => handleOpenEditLesson(section.id, lesson)}
                                className="p-1 text-slate-400 hover:text-teal-300 rounded hover:bg-slate-800"
                                title="Edit Lesson"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>

                              <button
                                type="button"
                                onClick={() => handleDeleteLesson(lesson)}
                                className="p-1 text-slate-400 hover:text-rose-400 rounded hover:bg-slate-800"
                                title="Delete Lesson"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="p-6 text-center text-xs text-slate-400">
                          No lectures added to this section yet. Click "Add Lecture" to create one.
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-slate-900 p-12 rounded-xl border border-slate-800 text-center space-y-3">
            <Layers className="w-8 h-8 text-slate-600 mx-auto" />
            <h3 className="text-sm font-semibold text-white">No curriculum sections yet</h3>
            <p className="text-xs text-slate-400">Start by adding the first section for this course track.</p>
            <Button variant="primary" size="sm" onClick={handleOpenAddSection}>
              Add First Section
            </Button>
          </div>
        )}
      </div>

      {/* Section Modal */}
      {showSectionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-4">
          <div className="bg-slate-900 rounded-xl max-w-md w-full p-6 space-y-4 shadow-xl border border-slate-800 text-slate-100">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-semibold text-white">
                {editingSection ? 'Edit Section' : 'Add Curriculum Section'}
              </h3>
              <button
                type="button"
                onClick={() => setShowSectionModal(false)}
                className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveSection} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-200 mb-1">
                  Section Title <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={sectionTitle}
                  onChange={(e) => setSectionTitle(e.target.value)}
                  placeholder="e.g. 01. Getting Started & Setup"
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-200 mb-1">Description (Optional)</label>
                <textarea
                  rows={2}
                  value={sectionDesc}
                  onChange={(e) => setSectionDesc(e.target.value)}
                  placeholder="Overview of this module..."
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-800">
                <Button variant="ghost" size="sm" onClick={() => setShowSectionModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="sm" loading={sectionSubmitting}>
                  {editingSection ? 'Save Section' : 'Add Section'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Lesson Modal */}
      {showLessonModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-slate-900 rounded-xl max-w-lg w-full p-6 space-y-4 shadow-xl border border-slate-800 my-8 max-h-[90vh] overflow-y-auto text-slate-100">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-semibold text-white">
                {editingLesson ? 'Edit Lecture' : 'Add Lecture'}
              </h3>
              <button
                type="button"
                onClick={() => setShowLessonModal(false)}
                className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveLesson} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-200 mb-1">
                  Lecture Title <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={lessonTitle}
                  onChange={(e) => setLessonTitle(e.target.value)}
                  placeholder="e.g. Introduction to Component Lifecycle"
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-200 mb-1">Type</label>
                  <select
                    value={lessonType}
                    onChange={(e: any) => setLessonType(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                  >
                    <option value="VIDEO">Video Lecture</option>
                    <option value="TEXT">Article / Text Note</option>
                    <option value="RESOURCE">Downloadable Resource</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-200 mb-1">Duration (Minutes)</label>
                  <input
                    type="number"
                    value={lessonDurationMinutes}
                    onChange={(e) => setLessonDurationMinutes(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                  />
                </div>
              </div>

              {lessonType === 'VIDEO' && (
                <div>
                  <label className="block font-semibold text-slate-200 mb-1">Video URL (YouTube or MP4)</label>
                  <input
                    type="url"
                    value={lessonVideoUrl}
                    onChange={(e) => setLessonVideoUrl(e.target.value)}
                    placeholder="https://www.youtube.com/watch?v=..."
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                  />
                </div>
              )}

              <div>
                <label className="block font-semibold text-slate-200 mb-1">Description / Summary</label>
                <textarea
                  rows={2}
                  value={lessonDesc}
                  onChange={(e) => setLessonDesc(e.target.value)}
                  placeholder="Key takeaways from this lecture..."
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-semibold text-slate-200">Notes & Resource Links</label>
                  <label className="text-[11px] font-medium text-teal-400 hover:text-teal-300 cursor-pointer flex items-center gap-1">
                    <Upload className="w-3 h-3" />
                    <span>{uploadingFile ? 'Uploading...' : 'Attach File'}</span>
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
                  value={lessonContentText}
                  onChange={(e) => setLessonContentText(e.target.value)}
                  placeholder="Documentation, GitHub links, or code samples..."
                  className="w-full px-3 py-2 font-mono text-xs bg-slate-800 border border-slate-700 rounded-lg text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                />
              </div>

              <div className="flex items-center gap-4 pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                  <input
                    type="checkbox"
                    checked={lessonPreview}
                    onChange={(e) => setLessonPreview(e.target.checked)}
                    className="rounded bg-slate-800 border-slate-700 text-teal-600 focus:ring-teal-500"
                  />
                  <span>Free demo preview (visible before enrolling)</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                  <input
                    type="checkbox"
                    checked={lessonMandatory}
                    onChange={(e) => setLessonMandatory(e.target.checked)}
                    className="rounded bg-slate-800 border-slate-700 text-teal-600 focus:ring-teal-500"
                  />
                  <span>Mandatory completion</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-800">
                <Button variant="ghost" size="sm" onClick={() => setShowLessonModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="sm" loading={lessonSubmitting}>
                  {editingLesson ? 'Save Lecture' : 'Add Lecture'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
