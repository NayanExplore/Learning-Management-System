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
  HelpCircle,
  Download,
  AlertCircle,
  ListOrdered,
  Sparkles,
  ExternalLink,
  BookOpen,
} from 'lucide-react';

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

        // Find first lesson to play
        let firstLesson: Lesson | null = null;
        for (const s of c.sections) {
          if (s.lessons.length > 0) {
            firstLesson = s.lessons[0];
            break;
          }
        }
        setCurrentLesson(firstLesson);
      }

      if (progRes.data?.success) {
        setCompletedLessonIds(progRes.data.data.completedLessonIds || []);
        setProgressPct(progRes.data.data.overallProgressPct || 0);
      }

      if (quizRes.data?.success) {
        setQuizzes(quizRes.data.data);
      }

      if (certRes.data?.success) {
        const userCerts = certRes.data.data;
        const matchingCert = userCerts.find((cert: any) => cert.courseId === Number(courseId));
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

  const allLessons: Lesson[] = course ? course.sections.flatMap((s) => s.lessons) : [];
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
      if (progRes.data?.success) {
        setProgressPct(progRes.data.data.overallProgressPct);
      }

      const certRes = await api.get('/v1/student/certificates');
      if (certRes.data?.success) {
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
    } catch (err) {
      alert('Failed to download certificate.');
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center py-32 bg-slate-950 text-white">
        <div className="relative">
          <div className="w-16 h-16 rounded-full border-4 border-indigo-500/20 border-t-indigo-500 animate-spin"></div>
          <Sparkles className="w-6 h-6 text-indigo-400 absolute inset-0 m-auto animate-pulse" />
        </div>
        <p className="mt-4 text-xs font-semibold text-slate-400 tracking-wider uppercase">Loading Learning Cockpit...</p>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="flex-1 flex items-center justify-center py-24 p-4 bg-slate-950">
        <div className="bg-slate-900 p-8 rounded-3xl border border-slate-800 text-center max-w-md shadow-2xl">
          <div className="w-14 h-14 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center mx-auto mb-4 text-rose-400">
            <AlertCircle className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold mb-2 text-white">Access Denied</h2>
          <p className="text-slate-400 text-sm mb-6 leading-relaxed">
            You must be enrolled in this course to access the classroom theater.
          </p>
          <Link
            to="/courses"
            className="inline-block bg-gradient-to-r from-indigo-600 to-indigo-700 text-white px-6 py-3 rounded-xl text-sm font-bold shadow-lg shadow-indigo-600/25"
          >
            Browse Courses
          </Link>
        </div>
      </div>
    );
  }

  const isCurrentLessonCompleted = currentLesson ? completedLessonIds.includes(currentLesson.id) : false;

  return (
    <div className="flex-1 bg-slate-950 text-slate-100 flex flex-col lg:flex-row min-h-[calc(100vh-4rem)]">
      {/* Main Classroom Player Area */}
      <div className="flex-1 flex flex-col p-4 sm:p-6 lg:p-8 overflow-y-auto">
        {/* Navigation Breadcrumb & Back */}
        <div className="flex items-center justify-between mb-5">
          <Link
            to="/dashboard"
            className="inline-flex items-center space-x-2 text-xs font-bold text-slate-400 hover:text-white transition group"
          >
            <div className="w-7 h-7 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center group-hover:bg-slate-800 transition">
              <ChevronLeft className="w-4 h-4" />
            </div>
            <span>Dashboard</span>
            <span className="text-slate-600">/</span>
            <span className="text-indigo-400 font-semibold truncate max-w-xs">{course.title}</span>
          </Link>

          {certificateId && (
            <button
              onClick={downloadCert}
              className="inline-flex items-center space-x-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold px-3.5 py-1.5 rounded-xl shadow-md transition"
            >
              <Award className="w-4 h-4" />
              <span>Certificate Unlocked</span>
            </button>
          )}
        </div>

        {/* Completion Celebration Banner */}
        {certificateId && (
          <div className="mb-6 bg-gradient-to-r from-emerald-950/80 via-slate-900 to-indigo-950/80 border border-emerald-500/40 p-5 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
            <div className="flex items-center space-x-3.5 text-left">
              <div className="w-12 h-12 bg-gradient-to-tr from-emerald-500 to-teal-400 rounded-2xl flex items-center justify-center text-slate-950 shrink-0 font-bold shadow-lg shadow-emerald-500/20">
                <Award className="w-7 h-7" />
              </div>
              <div>
                <h4 className="font-extrabold text-emerald-400 text-sm sm:text-base flex items-center space-x-1.5">
                  <span>Congratulations! Course Completed</span>
                  <Sparkles className="w-4 h-4 text-amber-400" />
                </h4>
                <p className="text-xs text-slate-300 mt-0.5">
                  Your verified certificate <span className="font-mono text-emerald-300">#{certificateId}</span> is officially minted.
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2.5 shrink-0">
              <button
                onClick={downloadCert}
                className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl flex items-center space-x-1.5 shadow transition"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download PDF</span>
              </button>
              <Link
                to={`/verify-certificate/${certificateId}`}
                className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold px-3.5 py-2.5 rounded-xl border border-slate-700 transition"
              >
                Verify
              </Link>
            </div>
          </div>
        )}

        {/* Video / Content Display */}
        {currentLesson ? (
          <div className="space-y-6">
            <div className="aspect-video bg-black rounded-3xl overflow-hidden shadow-2xl border border-slate-800/80 relative flex items-center justify-center">
              {currentLesson.videoUrl ? (
                <iframe
                  src={currentLesson.videoUrl}
                  title={currentLesson.title}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              ) : (
                <div className="text-center p-8 max-w-lg">
                  <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto mb-4">
                    <PlayCircle className="w-8 h-8" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{currentLesson.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {currentLesson.description || 'Watch the video lesson attentively and follow along in your local development environment.'}
                  </p>
                </div>
              )}
            </div>

            {/* Lesson Title & Controls */}
            <div className="bg-slate-900/90 backdrop-blur-xl p-5 sm:p-6 rounded-3xl border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-lg">
              <div>
                <span className="text-[11px] font-bold text-indigo-400 uppercase tracking-widest bg-indigo-500/10 border border-indigo-500/20 px-2.5 py-1 rounded-full">
                  Lecture {currentIndex + 1} of {allLessons.length}
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-white mt-2 font-display">{currentLesson.title}</h2>
                {currentLesson.description && (
                  <p className="text-xs text-slate-400 mt-1 max-w-xl leading-relaxed">{currentLesson.description}</p>
                )}
              </div>

              <div className="flex items-center space-x-3 shrink-0 w-full sm:w-auto justify-end pt-2 sm:pt-0">
                <button
                  onClick={goToPrevLesson}
                  disabled={currentIndex <= 0}
                  className="p-3 rounded-2xl bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:pointer-events-none transition text-slate-300 border border-slate-700/60"
                  title="Previous Lesson"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                <button
                  onClick={handleMarkComplete}
                  disabled={updatingProgress}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-2xl text-xs font-bold transition shadow-lg ${
                    isCurrentLessonCompleted
                      ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-emerald-600/20'
                      : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-indigo-600/30'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{isCurrentLessonCompleted ? 'Completed' : 'Mark Complete & Next'}</span>
                </button>

                <button
                  onClick={goToNextLesson}
                  disabled={currentIndex >= allLessons.length - 1}
                  className="p-3 rounded-2xl bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:pointer-events-none transition text-slate-300 border border-slate-700/60"
                  title="Next Lesson"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Lesson Text or Resources if available */}
            {currentLesson.contentText && (
              <div className="bg-slate-900/60 p-6 sm:p-8 rounded-3xl border border-slate-800 text-slate-300 text-sm leading-relaxed whitespace-pre-line">
                <div className="flex items-center space-x-2 text-white font-bold text-base mb-3">
                  <BookOpen className="w-4 h-4 text-indigo-400" />
                  <span>Curriculum Notes & Resource Links</span>
                </div>
                {currentLesson.contentText}
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-20 text-slate-500">Select a lesson to begin.</div>
        )}
      </div>

      {/* Curriculum & Quizzes Sidebar Drawer */}
      <div className="w-full lg:w-96 bg-slate-900/95 border-t lg:border-t-0 lg:border-l border-slate-800 flex flex-col shrink-0">
        {/* Progress header */}
        <div className="p-5 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center justify-between text-xs font-bold mb-2">
            <span className="text-slate-400 uppercase tracking-wider text-[11px]">Course Completion</span>
            <span className="text-indigo-400 font-mono text-sm">{progressPct}%</span>
          </div>
          <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-indigo-500 to-purple-500 h-full rounded-full transition-all duration-300 shadow"
              style={{ width: `${progressPct}%` }}
            ></div>
          </div>
          <p className="text-[11px] text-slate-400 mt-2 font-medium">
            {completedLessonIds.length} of {allLessons.length} lessons completed
          </p>
        </div>

        {/* Quizzes Button Section */}
        {quizzes.length > 0 && (
          <div className="p-4 border-b border-slate-800 bg-indigo-950/20">
            <p className="text-[11px] font-bold text-indigo-300 uppercase tracking-wider mb-2.5 flex items-center space-x-1.5">
              <HelpCircle className="w-3.5 h-3.5 text-indigo-400" />
              <span>Required Assessments</span>
            </p>
            <div className="space-y-2">
              {quizzes.map((q) => (
                <Link
                  key={q.id}
                  to={`/quiz/${q.id}`}
                  className="flex items-center justify-between bg-slate-800/90 hover:bg-slate-800 p-3.5 rounded-2xl border border-indigo-500/30 transition text-xs font-bold text-white group"
                >
                  <div className="flex items-center space-x-2.5">
                    <div className="w-7 h-7 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center group-hover:scale-105 transition">
                      <ListOrdered className="w-4 h-4" />
                    </div>
                    <span>{q.title}</span>
                  </div>
                  <span className="text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md">
                    Pass {q.passingScore}% &rarr;
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Sections & Lessons List */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-800/60 p-2">
          {course.sections.map((section, sIdx) => (
            <div key={section.id} className="py-2">
              <div className="px-3 py-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Section {sIdx + 1}: {section.title}
              </div>

              <div className="space-y-1">
                {section.lessons.map((lesson) => {
                  const isActive = currentLesson?.id === lesson.id;
                  const isDone = completedLessonIds.includes(lesson.id);

                  return (
                    <button
                      key={lesson.id}
                      onClick={() => setCurrentLesson(lesson)}
                      className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-left transition ${
                        isActive
                          ? 'bg-indigo-600/20 text-white border border-indigo-500/40 shadow-sm'
                          : 'hover:bg-slate-800/50 text-slate-300'
                      }`}
                    >
                      <div className="flex items-center space-x-3 text-xs pr-2">
                        {isDone ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        ) : lesson.contentType === 'VIDEO' ? (
                          <PlayCircle className={`w-4 h-4 shrink-0 ${isActive ? 'text-indigo-400' : 'text-slate-500'}`} />
                        ) : (
                          <FileText className={`w-4 h-4 shrink-0 ${isActive ? 'text-indigo-400' : 'text-slate-500'}`} />
                        )}
                        <span className={`font-medium ${isActive ? 'text-white font-bold' : ''}`}>
                          {lesson.title}
                        </span>
                      </div>

                      {lesson.videoDurationSeconds && (
                        <span className="text-[10px] text-slate-500 font-mono shrink-0">
                          {Math.round(lesson.videoDurationSeconds / 60)}m
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
