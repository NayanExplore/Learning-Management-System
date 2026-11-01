import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { api } from '../api/client';
import { CourseDetail, Lesson, Quiz } from '../types';
import {
  PlayCircle,
  FileText,
  CheckCircle2,
  Lock,
  ChevronLeft,
  ChevronRight,
  Award,
  Download,
  AlertCircle,
  ListOrdered,
  ArrowLeft,
  Menu,
  X,
  BookOpen,
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { formatLessonDuration } from '../utils/format';

const getEmbedUrl = (url?: string): string => {
  if (!url) return '';
  if (url.includes('youtube.com/watch?v=')) {
    const videoId = url.split('v=')[1]?.split('&')[0];
    return `https://www.youtube.com/embed/${videoId}`;
  }
  if (url.includes('youtu.be/')) {
    const videoId = url.split('youtu.be/')[1]?.split('?')[0];
    return `https://www.youtube.com/embed/${videoId}`;
  }
  return url;
};

export const CoursePlayerPage: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();

  const [course, setCourse] = useState<CourseDetail | null>(null);
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [completedLessonIds, setCompletedLessonIds] = useState<number[]>([]);
  const [progressPct, setProgressPct] = useState<number>(0);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingProgress, setUpdatingProgress] = useState(false);
  const [certificateId, setCertificateId] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const fetchCourseData = async () => {
    setLoading(true);
    try {
      const [courseRes, progRes, quizRes, certRes] = await Promise.all([
        api.get(`/v1/courses/${courseId}`),
        api.get(`/v1/student/courses/${courseId}/progress`),
        api.get(`/v1/courses/${courseId}/quizzes`),
        api.get('/v1/student/certificates'),
      ]);

      if (courseRes.data?.success) {
        const c: CourseDetail = courseRes.data.data;
        setCourse(c);

        // Find first incomplete or first lesson to play
        let targetLesson: Lesson | null = null;
        for (const s of c.sections || []) {
          if (s.lessons && s.lessons.length > 0) {
            targetLesson = s.lessons[0];
            break;
          }
        }
        setCurrentLesson(targetLesson);
      }

      if (progRes.data?.success && progRes.data.data) {
        setCompletedLessonIds(progRes.data.data.completedLessonIds || []);
        setProgressPct(progRes.data.data.overallProgressPct || 0);
      }

      if (quizRes.data?.success && Array.isArray(quizRes.data.data)) {
        setQuizzes(quizRes.data.data);
      }

      if (certRes.data?.success && Array.isArray(certRes.data.data)) {
        const matchingCert = certRes.data.data.find((cert: any) => cert.courseId === Number(courseId));
        if (matchingCert) {
          setCertificateId(matchingCert.certificateId);
        }
      }
    } catch (err: any) {
      console.error('Failed to load course player data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourseData();
  }, [courseId]);

  const allLessons: Lesson[] = course ? (course.sections || []).flatMap((s) => s.lessons || []) : [];
  const currentIndex = currentLesson ? allLessons.findIndex((l) => l.id === currentLesson.id) : -1;

  const goToNextLesson = () => {
    if (currentIndex >= 0 && currentIndex < allLessons.length - 1) {
      setCurrentLesson(allLessons[currentIndex + 1]);
    }
  };

  const goToPrevLesson = () => {
    if (currentIndex > 0) {
      setCurrentLesson(allLessons[currentIndex - 1]);
    }
  };

  const handleMarkComplete = async () => {
    if (!currentLesson) return;
    setUpdatingProgress(true);
    try {
      await api.post(`/v1/lessons/${currentLesson.id}/progress`, {
        completed: true,
        progressPct: 100,
      });

      if (!completedLessonIds.includes(currentLesson.id)) {
        setCompletedLessonIds((prev) => [...prev, currentLesson.id]);
      }

      const progRes = await api.get(`/v1/student/courses/${courseId}/progress`);
      if (progRes.data?.success && progRes.data.data) {
        setProgressPct(progRes.data.data.overallProgressPct);
      }

      const certRes = await api.get('/v1/student/certificates');
      if (certRes.data?.success && Array.isArray(certRes.data.data)) {
        const matchingCert = certRes.data.data.find((c: any) => c.courseId === Number(courseId));
        if (matchingCert) {
          setCertificateId(matchingCert.certificateId);
        }
      }

      goToNextLesson();
    } catch (err) {
      console.error('Failed to update lesson progress', err);
    } finally {
      setUpdatingProgress(false);
    }
  };

  const downloadCert = async () => {
    if (!certificateId) return;
    try {
      const response = await api.get(`/v1/certificates/${certificateId}/download`, {
        responseType: 'blob',
      });
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${certificateId}.pdf`;
      link.click();
      window.URL.revokeObjectURL(url);
    } catch {
      alert('Failed to download certificate.');
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center py-24 bg-slate-900 text-white">
        <div className="w-8 h-8 rounded-full border-2 border-slate-700 border-t-white animate-spin"></div>
        <p className="mt-3 text-xs text-slate-400">Loading classroom...</p>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="flex-1 flex items-center justify-center py-20 px-4 bg-[#FAFAF8]">
        <div className="max-w-md w-full bg-white p-8 rounded-xl border border-[#E5E7EB] text-center shadow-xs space-y-4">
          <AlertCircle className="w-8 h-8 text-rose-600 mx-auto" />
          <h2 className="text-base font-semibold text-[#20252B]">Course not found</h2>
          <Link to="/dashboard">
            <Button variant="primary" size="sm">
              Return to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const isCurrentDone = currentLesson ? completedLessonIds.includes(currentLesson.id) : false;

  return (
    <div className="flex-1 flex flex-col lg:flex-row min-h-[calc(100vh-64px)] bg-slate-900 text-slate-100">
      {/* Main Video & Lesson Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Control Bar */}
        <div className="bg-slate-950 px-4 sm:px-6 py-3 border-b border-slate-800 flex items-center justify-between text-xs">
          <div className="flex items-center gap-3 truncate">
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Dashboard</span>
            </Link>
            <span className="text-slate-700 hidden sm:inline">|</span>
            <span className="font-medium text-slate-200 truncate">{course.title}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
              aria-label="Toggle curriculum sidebar"
            >
              {sidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Certificate Conferred Alert (if 100% completed) */}
        {certificateId && (
          <div className="bg-emerald-950/70 border-b border-emerald-800/80 px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-emerald-300 font-medium">
              <Award className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Congratulations! You completed this curriculum. Credential #{certificateId} has been issued.</span>
            </div>
            <div className="flex items-center gap-2">
              <Link
                to={`/verify-certificate/${certificateId}`}
                className="underline text-emerald-400 hover:text-emerald-300"
              >
                Verify Registry
              </Link>
              <Button
                variant="outline"
                size="sm"
                onClick={downloadCert}
                className="bg-transparent border-emerald-700 text-emerald-200 hover:bg-emerald-900/50"
              >
                <Download className="w-3.5 h-3.5 mr-1" /> PDF
              </Button>
            </div>
          </div>
        )}

        {/* Video Player Theater */}
        <div className="bg-black aspect-video w-full flex items-center justify-center relative">
          {currentLesson ? (
            currentLesson.contentType === 'VIDEO' && currentLesson.videoUrl ? (
              <iframe
                src={getEmbedUrl(currentLesson.videoUrl)}
                title={currentLesson.title}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : currentLesson.contentType === 'TEXT' || currentLesson.contentText ? (
              <div className="p-8 max-w-3xl w-full text-slate-200 overflow-y-auto max-h-full">
                <h3 className="text-xl font-bold mb-4">{currentLesson.title}</h3>
                <div className="text-sm leading-relaxed whitespace-pre-line text-slate-300">
                  {currentLesson.contentText || currentLesson.description}
                </div>
              </div>
            ) : (
              <div className="text-center p-8 text-slate-400">
                <PlayCircle className="w-12 h-12 mx-auto mb-2 opacity-40 text-slate-500" />
                <p className="text-sm font-medium text-slate-300">{currentLesson.title}</p>
                <p className="text-xs text-slate-500 mt-1">Ready for study</p>
              </div>
            )
          ) : (
            <div className="text-center p-8 text-slate-400">
              <BookOpen className="w-12 h-12 mx-auto mb-2 opacity-40" />
              <p className="text-sm">Select a lesson from the curriculum to begin</p>
            </div>
          )}
        </div>

        {/* Lesson Bottom Control & Notes Area */}
        <div className="bg-slate-950 p-6 flex-1 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
            <div>
              <span className="text-xs text-slate-400 font-mono">
                Lesson {currentIndex + 1} of {allLessons.length}
              </span>
              <h2 className="text-lg font-bold text-white mt-0.5">
                {currentLesson?.title || 'Course Lecture'}
              </h2>
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={goToPrevLesson}
                disabled={currentIndex <= 0}
                className="bg-slate-900 border-slate-700 text-slate-200 hover:bg-slate-800"
              >
                <ChevronLeft className="w-4 h-4 mr-1" /> Previous
              </Button>

              <Button
                variant={isCurrentDone ? 'secondary' : 'teal'}
                size="sm"
                onClick={handleMarkComplete}
                loading={updatingProgress}
              >
                {isCurrentDone ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 mr-1 text-emerald-500" />
                    <span>Completed &bull; Next</span>
                  </>
                ) : (
                  <span>Mark as Complete &rarr;</span>
                )}
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={goToNextLesson}
                disabled={currentIndex >= allLessons.length - 1}
                className="bg-slate-900 border-slate-700 text-slate-200 hover:bg-slate-800"
              >
                Next <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>

          {/* Description & Resources */}
          {currentLesson?.description && (
            <div className="space-y-2">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Lecture Summary
              </h4>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-3xl">
                {currentLesson.description}
              </p>
            </div>
          )}

          {currentLesson?.contentText && currentLesson.contentType !== 'TEXT' && (
            <div className="space-y-2 pt-2">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Downloadable Notes & Code Samples
              </h4>
              <div className="p-4 rounded-lg bg-slate-900 border border-slate-800 font-mono text-xs text-slate-300 leading-relaxed whitespace-pre-wrap">
                {currentLesson.contentText}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Curriculum Sidebar */}
      <aside
        className={`${
          sidebarOpen ? 'block' : 'hidden'
        } lg:block w-full lg:w-80 bg-slate-950 border-t lg:border-t-0 lg:border-l border-slate-800 flex flex-col shrink-0`}
      >
        {/* Progress header */}
        <div className="p-4 border-b border-slate-800 bg-slate-900/60">
          <div className="flex items-center justify-between text-xs font-semibold mb-2">
            <span className="text-slate-400 uppercase tracking-wider text-[11px]">Progress</span>
            <span className="text-[#287C78] font-mono text-sm">{progressPct}%</span>
          </div>
          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
            <div
              className="bg-[#287C78] h-full rounded-full transition-all duration-300"
              style={{ width: `${progressPct}%` }}
            />
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            {completedLessonIds.length} of {allLessons.length} lessons completed
          </p>
        </div>

        {/* Quizzes / Assessments if present */}
        {quizzes.length > 0 && (
          <div className="p-3 border-b border-slate-800 bg-slate-900/30">
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Assessments
            </p>
            <div className="space-y-1.5">
              {quizzes.map((q) => (
                <Link
                  key={q.id}
                  to={`/quiz/${q.id}`}
                  className="flex items-center justify-between p-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-medium text-slate-200"
                >
                  <div className="flex items-center gap-2 truncate pr-2">
                    <ListOrdered className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{q.title}</span>
                  </div>
                  <span className="text-[11px] text-emerald-400 font-mono">
                    Pass {q.passingScore}%
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Sections & Lessons */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-800/60 p-2">
          {course.sections?.map((section, sIndex) => (
            <div key={section.id} className="py-2">
              <div className="px-3 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Section {sIndex + 1}: {section.title}
              </div>

              <div className="space-y-0.5 mt-1">
                {section.lessons?.map((lesson) => {
                  const isActive = currentLesson?.id === lesson.id;
                  const isDone = completedLessonIds.includes(lesson.id);

                  return (
                    <button
                      key={lesson.id}
                      type="button"
                      onClick={() => {
                        setCurrentLesson(lesson);
                        setSidebarOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-left transition-colors text-xs ${
                        isActive
                          ? 'bg-slate-800 text-white font-medium border border-slate-700'
                          : 'text-slate-300 hover:bg-slate-900'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0 pr-2">
                        {isDone ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        ) : lesson.contentType === 'VIDEO' ? (
                          <PlayCircle className="w-4 h-4 text-slate-500 shrink-0" />
                        ) : (
                          <FileText className="w-4 h-4 text-slate-500 shrink-0" />
                        )}
                        <span className="truncate">{lesson.title}</span>
                      </div>

                      {lesson.videoDurationSeconds ? (
                        <span className="text-[10px] text-slate-500 font-mono shrink-0">
                          {formatLessonDuration(lesson.videoDurationSeconds)}
                        </span>
                      ) : null}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </aside>
    </div>
  );
};
