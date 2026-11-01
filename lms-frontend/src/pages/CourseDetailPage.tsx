import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { api } from '../api/client';
import { CourseDetail, Lesson, OrderResponse } from '../types';
import { useAuth } from '../context/AuthContext';
import { initiateRazorpayCheckout } from '../utils/razorpay';
import { RazorpayModal } from '../components/RazorpayModal';
import {
  Clock,
  User,
  ShieldCheck,
  Check,
  PlayCircle,
  Lock,
  ChevronDown,
  Award,
  AlertCircle,
  FileText,
  X,
  Share2,
  BookOpen,
  ArrowRight,
  HelpCircle,
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { formatCurrency, formatDuration, formatLessonDuration } from '../utils/format';

export const CourseDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [course, setCourse] = useState<CourseDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [expandedSections, setExpandedSections] = useState<Record<number, boolean>>({});
  const [previewLesson, setPreviewLesson] = useState<Lesson | null>(null);
  const [showRazorpayModal, setShowRazorpayModal] = useState(false);
  const [pendingOrder, setPendingOrder] = useState<OrderResponse | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  const fetchCourse = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/v1/courses/${slug}`);
      if (res.data?.success && res.data.data) {
        const c: CourseDetail = res.data.data;
        setCourse(c);
        // Expand all sections by default
        const initialExpanded: Record<number, boolean> = {};
        c.sections?.forEach((s) => {
          initialExpanded[s.id] = true;
        });
        setExpandedSections(initialExpanded);
      } else {
        setError('Course not found');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load course details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourse();
  }, [slug]);

  const toggleSection = (sectionId: number) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleEnrollClick = async () => {
    if (!user) {
      navigate('/login', { state: { from: `/courses/${slug}` } });
      return;
    }

    if (!course) return;

    setCheckoutLoading(true);
    setCheckoutError(null);

    await initiateRazorpayCheckout({
      courseId: course.id,
      courseTitle: course.title,
      user,
      onShowcaseModal: (order) => {
        setCheckoutLoading(false);
        setPendingOrder(order);
        setShowRazorpayModal(true);
      },
      onSuccess: (orderNumber) => {
        setCheckoutLoading(false);
        setShowRazorpayModal(false);
        navigate(`/learn/${course.id}`, {
          state: { message: `Enrollment confirmed! Order #${orderNumber}` },
        });
      },
      onError: (errMsg) => {
        setCheckoutLoading(false);
        let friendlyMsg = errMsg;
        if (errMsg.includes('401') || errMsg.toLowerCase().includes('unauthorized')) {
          friendlyMsg = 'Your session has expired. Please log in again to enroll.';
        } else if (errMsg.includes('403') || errMsg.toLowerCase().includes('forbidden')) {
          friendlyMsg = 'You do not have permission to enroll. Please contact support.';
        } else if (errMsg.includes('500') || errMsg.toLowerCase().includes('server error')) {
          friendlyMsg = 'Server error. Please try again in a moment.';
        }
        setCheckoutError(friendlyMsg);
      },
    });
  };

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center py-24 bg-[#FAFAF8] dark:bg-slate-950">
        <div className="w-8 h-8 rounded-full border-2 border-slate-300 dark:border-slate-700 border-t-[#172B4D] dark:border-t-teal-500 animate-spin"></div>
        <p className="mt-3 text-xs text-[#697386] dark:text-slate-400">Loading course curriculum...</p>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="flex-1 flex items-center justify-center py-20 px-4 bg-[#FAFAF8] dark:bg-slate-950">
        <div className="max-w-md w-full bg-white dark:bg-slate-900 p-8 rounded-xl border border-[#E5E7EB] dark:border-slate-800 text-center shadow-xs space-y-4">
          <div className="w-12 h-12 rounded-full bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-semibold text-[#20252B] dark:text-white">Course Unavailable</h2>
          <p className="text-xs text-[#697386] dark:text-slate-400">{error || 'Could not find this course.'}</p>
          <Link to="/courses">
            <Button variant="primary" size="sm">
              Return to Catalog
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const totalLessons = course.sections?.reduce((acc, s) => acc + (s.lessons?.length || 0), 0) || 0;
  const discountPct =
    course.originalPrice && course.originalPrice > course.price
      ? Math.round(((course.originalPrice - course.price) / course.originalPrice) * 100)
      : null;

  return (
    <div className="flex-1 bg-[#FAFAF8] dark:bg-slate-950 transition-colors">
      {/* 1. Header Area */}
      <section className="bg-white dark:bg-slate-900 border-b border-[#E5E7EB] dark:border-slate-800 py-10 lg:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <Link to="/courses" className="text-xs text-[#697386] dark:text-slate-400 hover:text-[#20252B] dark:hover:text-white transition-colors">
                Courses
              </Link>
              <span className="text-slate-300 dark:text-slate-700">/</span>
              <Badge variant="teal" size="sm">
                {course.level}
              </Badge>
              {course.featured && (
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-[#172B4D] dark:bg-teal-700 text-white">
                  Featured Track
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#20252B] dark:text-white tracking-tight leading-tight">
              {course.title}
            </h1>

            {course.shortDescription && (
              <p className="text-sm sm:text-base text-[#697386] dark:text-slate-300 leading-relaxed">
                {course.shortDescription}
              </p>
            )}

            {/* Metadata strip */}
            <div className="flex flex-wrap items-center gap-4 text-xs text-[#697386] dark:text-slate-400 pt-2">
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-slate-400 dark:text-slate-500" />
                <span>{formatDuration(course.durationHours)}</span>
              </span>
              <span className="flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-slate-400 dark:text-slate-500" />
                <span>{totalLessons} lessons</span>
              </span>
              {course.instructorName && (
                <span className="flex items-center gap-1.5">
                  <User className="w-4 h-4 text-slate-400 dark:text-slate-500" />
                  <span>Instructor: <strong className="text-[#20252B] dark:text-slate-200">{course.instructorName}</strong></span>
                </span>
              )}
              <button
                type="button"
                onClick={handleShare}
                className="inline-flex items-center gap-1 text-slate-500 dark:text-slate-400 hover:text-[#20252B] dark:hover:text-white transition-colors ml-auto sm:ml-0"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>{copiedLink ? 'Link copied' : 'Share'}</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Main Content & Sticky Enrollment Sidebar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Column: Details & Curriculum */}
          <div className="lg:col-span-8 space-y-8">
            {/* What you will learn */}
            {course.learningOutcomes && course.learningOutcomes.length > 0 && (
              <div className="bg-white dark:bg-slate-900 p-6 sm:p-7 rounded-xl border border-[#E5E7EB] dark:border-slate-800 shadow-xs space-y-4">
                <h2 className="text-base font-semibold text-[#20252B] dark:text-white">What you will learn</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {course.learningOutcomes.map((outcome, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs text-[#20252B] dark:text-slate-300 leading-relaxed">
                      <Check className="w-4 h-4 text-[#287C78] dark:text-teal-400 shrink-0 mt-0.5" />
                      <span>{outcome}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Curriculum Accordion */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-[#E5E7EB] dark:border-slate-800 shadow-xs overflow-hidden">
              <div className="p-6 border-b border-[#E5E7EB] dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h2 className="text-base font-semibold text-[#20252B] dark:text-white">Course Curriculum</h2>
                  <p className="text-xs text-[#697386] dark:text-slate-400 mt-0.5">
                    {course.sections?.length || 0} sections &bull; {totalLessons} lessons &bull; {formatDuration(course.durationHours)} total duration
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const allExpanded = Object.values(expandedSections).every(Boolean);
                    const updated: Record<number, boolean> = {};
                    course.sections?.forEach((s) => {
                      updated[s.id] = !allExpanded;
                    });
                    setExpandedSections(updated);
                  }}
                  className="text-xs text-[#172B4D] dark:text-teal-400 font-medium hover:underline self-start sm:self-auto"
                >
                  {Object.values(expandedSections).every(Boolean) ? 'Collapse all sections' : 'Expand all sections'}
                </button>
              </div>

              <div className="divide-y divide-[#E5E7EB] dark:divide-slate-800">
                {course.sections?.map((section, sIndex) => {
                  const isExpanded = expandedSections[section.id];
                  return (
                    <div key={section.id}>
                      <button
                        type="button"
                        onClick={() => toggleSection(section.id)}
                        className="w-full px-6 py-4 flex items-center justify-between bg-slate-50/70 dark:bg-slate-800/60 hover:bg-slate-100/60 dark:hover:bg-slate-800 transition-colors text-left"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-mono font-semibold text-[#697386] dark:text-slate-400">
                            {String(sIndex + 1).padStart(2, '0')}
                          </span>
                          <span className="text-sm font-semibold text-[#20252B] dark:text-slate-200">
                            {section.title}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-xs text-[#697386] dark:text-slate-400">
                            {section.lessons?.length || 0} lessons
                          </span>
                          <ChevronDown
                            className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                              isExpanded ? 'rotate-180 text-[#20252B] dark:text-white' : ''
                            }`}
                          />
                        </div>
                      </button>

                      {isExpanded && (
                        <div className="divide-y divide-slate-100 dark:divide-slate-800/60 bg-white dark:bg-slate-900">
                          {section.lessons?.map((lesson, lIndex) => (
                            <div
                              key={lesson.id}
                              className="px-6 py-3.5 flex items-center justify-between text-xs hover:bg-slate-50/50 dark:hover:bg-slate-850 transition-colors"
                            >
                              <div className="flex items-center gap-3 min-w-0 pr-3">
                                {lesson.contentType === 'VIDEO' ? (
                                  <PlayCircle className="w-4 h-4 text-slate-400 dark:text-slate-500 shrink-0" />
                                ) : (
                                  <FileText className="w-4 h-4 text-slate-400 dark:text-slate-500 shrink-0" />
                                )}
                                <span className="font-medium text-[#20252B] dark:text-slate-300 truncate">
                                  {lIndex + 1}. {lesson.title}
                                </span>
                              </div>

                              <div className="flex items-center gap-3 shrink-0">
                                {lesson.preview && (
                                  <button
                                    type="button"
                                    onClick={() => setPreviewLesson(lesson)}
                                    className="text-[11px] font-semibold text-[#287C78] dark:text-teal-400 hover:underline px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200/70 dark:border-emerald-800"
                                  >
                                    Preview
                                  </button>
                                )}
                                {lesson.videoDurationSeconds ? (
                                  <span className="text-[#697386] dark:text-slate-500 font-mono">
                                    {formatLessonDuration(lesson.videoDurationSeconds)}
                                  </span>
                                ) : null}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Course Description */}
            <div className="bg-white dark:bg-slate-900 p-6 sm:p-7 rounded-xl border border-[#E5E7EB] dark:border-slate-800 shadow-xs space-y-3">
              <h2 className="text-base font-semibold text-[#20252B] dark:text-white">About this curriculum</h2>
              <div className="text-sm text-[#20252B] dark:text-slate-300 leading-relaxed whitespace-pre-line">
                {course.description || course.shortDescription || 'Full curriculum details and syllabus.'}
              </div>
            </div>

            {/* Prerequisites */}
            {course.prerequisites && course.prerequisites.length > 0 && (
              <div className="bg-white dark:bg-slate-900 p-6 sm:p-7 rounded-xl border border-[#E5E7EB] dark:border-slate-800 shadow-xs space-y-3">
                <h2 className="text-base font-semibold text-[#20252B] dark:text-white">Prerequisites & Requirements</h2>
                <ul className="space-y-2">
                  {course.prerequisites.map((req, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-xs text-[#20252B] dark:text-slate-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-400 dark:bg-slate-600 mt-1.5 shrink-0" />
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Right Column: Sticky Enrollment Box */}
          <div className="lg:col-span-4">
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-[#E5E7EB] dark:border-slate-800 shadow-xs p-6 sticky top-24 space-y-5">
              {/* Thumbnail */}
              <div className="aspect-video w-full rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-800 border border-[#E5E7EB] dark:border-slate-800">
                {course.thumbnailUrl ? (
                  <img
                    src={course.thumbnailUrl}
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-400">
                    <BookOpen className="w-8 h-8" />
                  </div>
                )}
              </div>

              {/* Price */}
              <div>
                <div className="flex items-baseline gap-2.5">
                  <span className="text-2xl font-bold text-[#20252B] dark:text-white">
                    {formatCurrency(course.price, course.currency)}
                  </span>
                  {course.originalPrice && course.originalPrice > course.price && (
                    <>
                      <span className="text-sm text-[#697386] dark:text-slate-500 line-through">
                        {formatCurrency(course.originalPrice, course.currency)}
                      </span>
                      {discountPct && (
                        <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
                          {discountPct}% off
                        </span>
                      )}
                    </>
                  )}
                </div>
              </div>

              {checkoutError && (
                <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 rounded-lg text-xs text-rose-700 dark:text-rose-300">
                  {checkoutError}
                </div>
              )}

              {/* Action */}
              {course.isEnrolled ? (
                <div className="space-y-2">
                  <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 text-emerald-800 dark:text-emerald-300 rounded-lg text-xs font-medium flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span>You are enrolled in this track</span>
                  </div>
                  <Link to={`/learn/${course.id}`} className="block w-full">
                    <Button variant="teal" size="md" className="w-full" iconRight={<ArrowRight className="w-4 h-4" />}>
                      Go to Classroom
                    </Button>
                  </Link>
                </div>
              ) : (
                <Button
                  variant="primary"
                  size="lg"
                  className="w-full"
                  loading={checkoutLoading}
                  onClick={handleEnrollClick}
                >
                  Enroll Now
                </Button>
              )}

              {/* Inclusions */}
              <div className="pt-4 border-t border-[#E5E7EB] dark:border-slate-800 space-y-2.5 text-xs text-[#697386] dark:text-slate-400">
                <p className="font-semibold text-[#20252B] dark:text-slate-200">This course includes:</p>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-slate-400 dark:text-slate-500 shrink-0" />
                  <span>{formatDuration(course.durationHours)} of structured lectures</span>
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-slate-400 dark:text-slate-500 shrink-0" />
                  <span>{totalLessons} full curriculum modules & resources</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-slate-400 dark:text-slate-500 shrink-0" />
                  <span>Verifiable Certificate upon completion</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-slate-400 dark:text-slate-500 shrink-0" />
                  <span>Secure checkout via Razorpay</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lesson Preview Modal */}
      {previewLesson && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-slate-900 rounded-xl max-w-2xl w-full overflow-hidden shadow-xl border border-[#E5E7EB] dark:border-slate-800">
            <div className="p-4 border-b border-[#E5E7EB] dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <PlayCircle className="w-4 h-4 text-[#287C78] dark:text-teal-400" />
                <h3 className="font-semibold text-sm text-[#20252B] dark:text-white truncate">{previewLesson.title}</h3>
              </div>
              <button
                type="button"
                onClick={() => setPreviewLesson(null)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="aspect-video bg-black rounded-lg overflow-hidden flex items-center justify-center text-slate-400">
                {previewLesson.videoUrl ? (
                  <iframe
                    src={previewLesson.videoUrl}
                    title={previewLesson.title}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <div className="text-center p-6 text-slate-400">
                    <PlayCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p className="text-xs">No video URL available for preview</p>
                  </div>
                )}
              </div>
              {previewLesson.description && (
                <p className="text-xs text-[#697386] dark:text-slate-400 leading-relaxed">{previewLesson.description}</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Razorpay Showcase Modal */}
      {showRazorpayModal && pendingOrder && user && course && (
        <RazorpayModal
          isOpen={showRazorpayModal}
          onClose={() => setShowRazorpayModal(false)}
          order={pendingOrder}
          courseTitle={course.title}
          user={user}
          onPaymentSuccess={(orderNumber) => {
            setShowRazorpayModal(false);
            navigate(`/learn/${course.id}`, {
              state: { message: `Payment verified via Razorpay! Enrolled in ${course.title} (Order #${orderNumber})` },
            });
          }}
          onPaymentError={(errMsg) => {
            setCheckoutError(errMsg);
          }}
        />
      )}
    </div>
  );
};
