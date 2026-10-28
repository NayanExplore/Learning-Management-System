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
  CheckCircle2,
  PlayCircle,
  Lock,
  ChevronDown,
  ChevronUp,
  Award,
  AlertCircle,
  FileText,
  X,
  Star,
  Sparkles,
  Globe,
  Users,
  ArrowRight,
  BookOpen,
  Calendar,
  Share2,
  Check,
} from 'lucide-react';

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
      if (res.data?.success) {
        const c: CourseDetail = res.data.data;
        setCourse(c);
        // Expand all sections by default
        const initialExpanded: Record<number, boolean> = {};
        c.sections.forEach((s) => {
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
        setCheckoutError(errMsg);
      },
    });
  };

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center py-32 bg-slate-50">
        <div className="relative">
          <div className="w-16 h-16 rounded-full border-4 border-indigo-200 border-t-indigo-600 animate-spin"></div>
          <Sparkles className="w-6 h-6 text-indigo-600 absolute inset-0 m-auto animate-pulse" />
        </div>
        <p className="mt-4 text-sm font-semibold text-slate-600 tracking-wide">Loading course curriculum...</p>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="flex-1 flex items-center justify-center py-24 px-4 bg-slate-50">
        <div className="max-w-md w-full bg-white p-8 rounded-3xl border border-slate-200 text-center shadow-xl">
          <div className="w-14 h-14 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center mx-auto mb-4 text-rose-500">
            <AlertCircle className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-extrabold text-slate-900 mb-2">Course Unavailable</h2>
          <p className="text-slate-600 text-sm mb-6 leading-relaxed">{error || 'Could not find this course.'}</p>
          <Link
            to="/courses"
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white px-6 py-3 rounded-xl font-bold text-sm hover:from-indigo-500 hover:to-indigo-600 transition shadow-lg shadow-indigo-600/25"
          >
            <span>Explore All Courses</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  const discountPct =
    course.originalPrice && course.originalPrice > course.price
      ? Math.round(((course.originalPrice - course.price) / course.originalPrice) * 100)
      : 0;

  const totalLessons = course.sections.reduce((acc, s) => acc + s.lessons.length, 0);

  return (
    <div className="flex-1 bg-slate-50">
      {/* Course Hero Banner with Obsidian Cosmic Dark Styling */}
      <section className="relative bg-slate-950 text-white overflow-hidden py-14 lg:py-20 border-b border-slate-800">
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-indigo-600/15 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute -bottom-20 left-10 w-[400px] h-[400px] bg-purple-600/15 rounded-full blur-[100px] pointer-events-none"></div>
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
            backgroundSize: '32px 32px',
          }}
        ></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb Navigation */}
          <nav className="flex items-center space-x-2 text-xs font-medium text-slate-400 mb-6">
            <Link to="/" className="hover:text-white transition">Home</Link>
            <span>/</span>
            <Link to="/courses" className="hover:text-white transition">Courses</Link>
            <span>/</span>
            <span className="text-indigo-400 font-semibold truncate max-w-xs">{course.title}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
            <div className="lg:col-span-2 space-y-5">
              {/* Badges strip */}
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="inline-flex items-center space-x-1.5 px-3 py-1 text-xs font-bold rounded-full bg-indigo-500/15 text-indigo-300 border border-indigo-400/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-400"></span>
                  <span>{course.level} Level</span>
                </span>

                <span className="inline-flex items-center space-x-1 px-3 py-1 text-xs font-bold rounded-full bg-amber-500/15 text-amber-300 border border-amber-400/30">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>4.9 (1,240 reviews)</span>
                </span>

                <span className="inline-flex items-center space-x-1 px-3 py-1 text-xs font-medium rounded-full bg-slate-800/80 text-slate-300 border border-slate-700">
                  <Users className="w-3.5 h-3.5 text-indigo-400" />
                  <span>14,500+ Students Enrolled</span>
                </span>
              </div>

              {/* Main Course Title */}
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight font-display text-white">
                {course.title}
              </h1>

              {/* Course Subtitle */}
              <p className="text-slate-300 text-base sm:text-lg leading-relaxed max-w-3xl">
                {course.shortDescription}
              </p>

              {/* Metadata Highlights */}
              <div className="flex flex-wrap items-center gap-6 pt-2 text-xs text-slate-300">
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-indigo-400" />
                  <span>{course.durationHours || 40} Hours Comprehensive</span>
                </div>
                <div className="flex items-center space-x-2">
                  <BookOpen className="w-4 h-4 text-emerald-400" />
                  <span>{course.sections.length} Sections &bull; {totalLessons} Lectures</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Globe className="w-4 h-4 text-purple-400" />
                  <span>English (Subtitles Included)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Award className="w-4 h-4 text-amber-400" />
                  <span>Verified Certificate</span>
                </div>
              </div>

              {/* Instructor Bio Strip */}
              {course.instructorName && (
                <div className="flex items-center justify-between pt-4 border-t border-slate-800/80">
                  <div className="flex items-center space-x-3.5">
                    <div className="relative">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center font-bold text-white text-base shadow-md">
                        {course.instructorName.charAt(0)}
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-slate-950 flex items-center justify-center">
                        <Check className="w-2.5 h-2.5 text-white stroke-[3]" />
                      </div>
                    </div>
                    <div>
                      <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Course Instructor</p>
                      <p className="text-sm font-bold text-white flex items-center space-x-1.5">
                        <span>{course.instructorName}</span>
                        <span className="text-[10px] bg-indigo-500/20 text-indigo-300 px-1.5 py-0.5 rounded font-mono font-medium">Verified Mentor</span>
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={handleShare}
                    className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>{copiedLink ? 'Copied Link!' : 'Share'}</span>
                  </button>
                </div>
              )}
            </div>

            {/* Mobile / Tablet pricing banner card */}
            <div className="lg:hidden bg-slate-900/90 backdrop-blur-xl p-6 rounded-3xl border border-slate-700/80 shadow-2xl">
              <div className="flex items-baseline space-x-3 mb-2">
                <span className="text-3xl font-black text-white">
                  ₹{course.price.toLocaleString('en-IN')}
                </span>
                {course.originalPrice && course.originalPrice > course.price && (
                  <>
                    <span className="text-sm text-slate-400 line-through">
                      ₹{course.originalPrice.toLocaleString('en-IN')}
                    </span>
                    <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                      {discountPct}% OFF
                    </span>
                  </>
                )}
              </div>
              <p className="text-xs text-emerald-400 font-semibold mb-4 flex items-center space-x-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Instant Lifetime Access • 30-Day Guarantee</span>
              </p>

              {checkoutError && (
                <div className="mb-4 p-3 bg-rose-500/20 border border-rose-500/40 rounded-xl text-xs text-rose-200">
                  {checkoutError}
                </div>
              )}

              {course.isEnrolled ? (
                <Link
                  to={`/learn/${course.id}`}
                  className="block w-full text-center bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold py-3.5 rounded-2xl transition shadow-lg shadow-emerald-600/30 text-sm"
                >
                  Continue Learning &rarr;
                </Link>
              ) : (
                <button
                  onClick={handleEnrollClick}
                  disabled={checkoutLoading}
                  className="w-full bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold py-3.5 rounded-2xl transition shadow-lg shadow-indigo-600/30 text-sm disabled:opacity-50"
                >
                  {checkoutLoading ? 'Processing Checkout...' : 'Enroll Now • Lifetime Access'}
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
          {/* Left Column: Learning Outcomes, Curriculum, About, Prerequisites */}
          <div className="lg:col-span-2 space-y-10">
            {/* What You Will Learn Card */}
            {course.learningOutcomes && course.learningOutcomes.length > 0 && (
              <div className="bg-white p-7 sm:p-9 rounded-3xl border border-slate-200/80 shadow-card-elevated relative overflow-hidden">
                <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-indigo-500 to-purple-600"></div>
                <div className="flex items-center space-x-2.5 mb-6">
                  <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <h2 className="text-xl font-bold font-display text-slate-900">What You Will Learn</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {course.learningOutcomes.map((outcome, idx) => (
                    <div
                      key={idx}
                      className="flex items-start space-x-3 p-3.5 rounded-2xl bg-slate-50/70 border border-slate-100 hover:border-indigo-100 transition"
                    >
                      <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                      <span className="text-slate-700 text-xs sm:text-sm leading-relaxed font-medium">{outcome}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Course Curriculum Section */}
            <div className="bg-white p-7 sm:p-9 rounded-3xl border border-slate-200/80 shadow-card-elevated">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-6 border-b border-slate-100 gap-2">
                <div>
                  <h2 className="text-xl font-bold font-display text-slate-900">Course Curriculum</h2>
                  <p className="text-xs text-slate-500 mt-1 font-medium">
                    {course.sections.length} Sections &bull; {totalLessons} Lessons &bull; Structured Hands-on Path
                  </p>
                </div>
                <div className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-full self-start">
                  All Lessons Included
                </div>
              </div>

              <div className="space-y-3.5 mt-6">
                {course.sections.map((section, sIdx) => {
                  const isExpanded = expandedSections[section.id];
                  return (
                    <div
                      key={section.id}
                      className="border border-slate-200/80 rounded-2xl overflow-hidden transition shadow-sm hover:border-slate-300"
                    >
                      <button
                        onClick={() => toggleSection(section.id)}
                        className="w-full flex items-center justify-between p-4 sm:p-5 bg-slate-50/80 hover:bg-slate-100/80 transition text-left"
                      >
                        <div className="flex items-center space-x-3.5">
                          <span className="text-xs font-black text-indigo-600 bg-indigo-100/70 border border-indigo-200 px-2.5 py-1 rounded-lg">
                            Section {sIdx + 1}
                          </span>
                          <span className="font-bold text-slate-900 text-sm sm:text-base">{section.title}</span>
                        </div>
                        <div className="flex items-center space-x-3 text-slate-500 text-xs font-semibold">
                          <span>{section.lessons.length} lessons</span>
                          {isExpanded ? (
                            <ChevronUp className="w-4 h-4 text-slate-600" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-slate-400" />
                          )}
                        </div>
                      </button>

                      {isExpanded && (
                        <div className="divide-y divide-slate-100 bg-white">
                          {section.lessons.map((lesson) => (
                            <div
                              key={lesson.id}
                              className="p-4 sm:p-4.5 flex items-center justify-between hover:bg-slate-50/60 transition text-sm"
                            >
                              <div className="flex items-center space-x-3.5 pr-2">
                                {lesson.contentType === 'VIDEO' ? (
                                  <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                                    <PlayCircle className="w-4 h-4" />
                                  </div>
                                ) : (
                                  <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-500 flex items-center justify-center shrink-0">
                                    <FileText className="w-4 h-4" />
                                  </div>
                                )}
                                <span className="text-slate-800 font-semibold text-xs sm:text-sm">{lesson.title}</span>
                              </div>

                              <div className="flex items-center space-x-3 shrink-0">
                                {lesson.videoDurationSeconds && (
                                  <span className="text-xs text-slate-400 font-mono">
                                    {Math.round(lesson.videoDurationSeconds / 60)} min
                                  </span>
                                )}

                                {lesson.preview ? (
                                  <button
                                    onClick={() => setPreviewLesson(lesson)}
                                    className="text-xs font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-3 py-1 rounded-lg border border-indigo-200/60 transition"
                                  >
                                    Free Preview
                                  </button>
                                ) : (
                                  <span className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400">
                                    <Lock className="w-3.5 h-3.5" />
                                  </span>
                                )}
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

            {/* Course Description Card */}
            <div className="bg-white p-7 sm:p-9 rounded-3xl border border-slate-200/80 shadow-card-elevated space-y-4">
              <h2 className="text-xl font-bold font-display text-slate-900">About This Course</h2>
              <div className="text-slate-700 text-sm leading-relaxed whitespace-pre-line font-normal">
                {course.description}
              </div>
            </div>

            {/* Prerequisites & Requirements */}
            {course.prerequisites && course.prerequisites.length > 0 && (
              <div className="bg-white p-7 sm:p-9 rounded-3xl border border-slate-200/80 shadow-card-elevated">
                <h2 className="text-xl font-bold font-display text-slate-900 mb-4">Requirements & Prerequisites</h2>
                <ul className="space-y-2.5">
                  {course.prerequisites.map((req, idx) => (
                    <li key={idx} className="flex items-center space-x-3 text-slate-700 text-xs sm:text-sm">
                      <div className="w-2 h-2 rounded-full bg-indigo-500 shrink-0"></div>
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Right Column: Desktop Sticky Premium Card */}
          <div className="hidden lg:block sticky top-28">
            <div className="bg-white rounded-3xl border border-slate-200/90 shadow-card-hover p-7 space-y-6 overflow-hidden relative">
              {/* Card Header Media Preview */}
              <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-900 shadow-inner group">
                <img
                  src={course.thumbnailUrl || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=80'}
                  alt={course.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500 opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-center justify-center">
                  <div className="w-14 h-14 rounded-full bg-white/90 text-indigo-600 flex items-center justify-center shadow-xl backdrop-blur group-hover:scale-110 transition">
                    <PlayCircle className="w-8 h-8 fill-indigo-600 text-white" />
                  </div>
                </div>
                <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-lg text-[11px] font-bold text-white flex items-center space-x-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Preview Course Trailer</span>
                </div>
              </div>

              {/* Pricing section */}
              <div>
                <div className="flex items-baseline space-x-3">
                  <span className="text-3xl font-black text-slate-900 tracking-tight font-display">
                    ₹{course.price.toLocaleString('en-IN')}
                  </span>
                  {course.originalPrice && course.originalPrice > course.price && (
                    <>
                      <span className="text-sm text-slate-400 line-through">
                        ₹{course.originalPrice.toLocaleString('en-IN')}
                      </span>
                      <span className="text-xs font-bold text-emerald-700 bg-emerald-100/80 border border-emerald-200 px-2 py-0.5 rounded-full">
                        {discountPct}% OFF
                      </span>
                    </>
                  )}
                </div>
                <div className="flex items-center space-x-1.5 text-xs text-rose-600 font-semibold mt-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Special discount ends soon &bull; Limited seats</span>
                </div>
              </div>

              {checkoutError && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700">
                  {checkoutError}
                </div>
              )}

              {course.isEnrolled ? (
                <div className="space-y-3">
                  <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-800 font-bold flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Enrolled & Ready to Learn</span>
                  </div>
                  <Link
                    to={`/learn/${course.id}`}
                    className="block w-full text-center bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold py-4 rounded-2xl transition shadow-lg shadow-emerald-600/30 text-sm"
                  >
                    Go to Learning Classroom &rarr;
                  </Link>
                </div>
              ) : (
                <button
                  onClick={handleEnrollClick}
                  disabled={checkoutLoading}
                  className="w-full bg-gradient-to-r from-indigo-600 via-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-extrabold py-4 rounded-2xl transition shadow-lg shadow-indigo-600/30 hover:shadow-indigo-600/50 hover:-translate-y-0.5 text-sm disabled:opacity-50"
                >
                  {checkoutLoading ? 'Opening Checkout...' : 'Enroll Now • Lifetime Access'}
                </button>
              )}

              {/* Guarantees & Features */}
              <div className="border-t border-slate-100 pt-5 space-y-3 text-xs text-slate-600">
                <p className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">This comprehensive course includes:</p>
                <div className="flex items-center space-x-2.5">
                  <PlayCircle className="w-4 h-4 text-indigo-500 shrink-0" />
                  <span>{course.durationHours || 40} hours on-demand HD video</span>
                </div>
                <div className="flex items-center space-x-2.5">
                  <BookOpen className="w-4 h-4 text-purple-500 shrink-0" />
                  <span>{totalLessons} full interactive modules & resources</span>
                </div>
                <div className="flex items-center space-x-2.5">
                  <Award className="w-4 h-4 text-amber-500 shrink-0" />
                  <span>Verifiable Certificate of Completion</span>
                </div>
                <div className="flex items-center space-x-2.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>100% Secure Razorpay checkout & 30-day refund</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Preview Lesson Modal */}
      {previewLesson && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-slate-900 rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-slate-800">
            <div className="p-4 bg-slate-950 text-white flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <PlayCircle className="w-5 h-5 text-indigo-400" />
                <h3 className="font-bold text-sm truncate">{previewLesson.title}</h3>
              </div>
              <button
                onClick={() => setPreviewLesson(null)}
                className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="aspect-video bg-black rounded-2xl overflow-hidden flex items-center justify-center text-slate-400 border border-slate-800">
                {previewLesson.videoUrl ? (
                  <iframe
                    src={previewLesson.videoUrl}
                    title={previewLesson.title}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                ) : (
                  <div className="text-center p-8">
                    <PlayCircle className="w-16 h-16 mx-auto mb-2 text-indigo-400 opacity-60" />
                    <p className="text-sm font-semibold text-slate-200">Interactive Preview Lecture</p>
                    <p className="text-xs text-slate-400 mt-1">Full content unlocked upon enrollment</p>
                  </div>
                )}
              </div>
              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">{previewLesson.description}</p>
              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => setPreviewLesson(null)}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold px-5 py-2.5 rounded-xl transition"
                >
                  Close Preview
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Razorpay Digital Payment Showcase Modal */}
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
