import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/client';
import { CourseSummary } from '../types';
import { CourseCard } from '../components/CourseCard';
import {
  GraduationCap,
  ShieldCheck,
  CheckCircle,
  PlayCircle,
  Award,
  ArrowRight,
  Star,
  Users,
  Clock,
  Sparkles,
  Code2,
  Terminal,
  Zap,
  Laptop,
  CheckCircle2,
  Flame,
  ChevronDown,
  HelpCircle,
  BookOpen,
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const [featuredCourses, setFeaturedCourses] = useState<CourseSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [previewTab, setPreviewTab] = useState<'video' | 'code' | 'cert'>('code');

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await api.get('/v1/courses/featured');
        if (res.data?.success) {
          setFeaturedCourses(res.data.data);
        }
      } catch (err) {
        console.error('Failed to load featured courses', err);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  const categories = [
    { id: 'ALL', label: 'All Curricula' },
    { id: 'WEB', label: 'Full Stack Web' },
    { id: 'DATA', label: 'AI & Python' },
    { id: 'CLOUD', label: 'Cloud & DevOps' },
  ];

  const filteredCourses = featuredCourses.filter((course) => {
    if (activeCategory === 'ALL') return true;
    if (activeCategory === 'WEB') return course.title.toLowerCase().includes('web') || course.title.toLowerCase().includes('react') || course.title.toLowerCase().includes('full stack');
    if (activeCategory === 'DATA') return course.title.toLowerCase().includes('python') || course.title.toLowerCase().includes('data') || course.title.toLowerCase().includes('ai');
    if (activeCategory === 'CLOUD') return course.title.toLowerCase().includes('cloud') || course.title.toLowerCase().includes('devops') || course.title.toLowerCase().includes('aws');
    return true;
  });

  const faqs = [
    {
      q: 'How do I receive and share my verifiable certificate?',
      a: 'Certificates are generated immediately upon completing all curriculum lessons and achieving the passing score (typically 70%+) on course assessments. Every credential features a unique alphanumeric identifier and cryptographic QR code that employers or LinkedIn connections can verify instantly.',
    },
    {
      q: 'Are the assessments timed and server-graded?',
      a: 'Yes. Assessments are evaluated securely on our server using deterministic validation. You receive instant feedback on incorrect answers, breakdown of topic masteries, and actionable suggestions to review specific lectures before attempting retakes.',
    },
    {
      q: 'Can I access the curriculum on mobile and tablets?',
      a: 'Absolutely. SkillForge is fully responsive with adaptive video bitrate streaming, offline-friendly code cheatsheets, and responsive touch controls across iOS, Android, macOS, and Windows devices.',
    },
    {
      q: 'What payment methods are supported through Razorpay?',
      a: 'We support all major domestic and international credit/debit cards (Visa, MasterCard, RuPay, Amex), UPI (Google Pay, PhonePe, Paytm, BHIM), Net Banking across 50+ banks, and popular digital wallets with instant automated enrollment.',
    },
  ];

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* 1. Hero Section with Cosmic Mesh & Floating Interactive Terminal */}
      <section className="relative mesh-dark text-white pt-16 pb-24 lg:pt-24 lg:pb-32 overflow-hidden border-b border-indigo-950/60">
        {/* Glow Spheres */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-indigo-600/20 blur-[130px] rounded-full pointer-events-none"></div>
        <div className="absolute top-1/3 right-10 w-[400px] h-[300px] bg-purple-600/15 blur-[120px] rounded-full pointer-events-none"></div>
        <div className="absolute bottom-10 left-10 w-[350px] h-[250px] bg-cyan-600/15 blur-[110px] rounded-full pointer-events-none"></div>

        {/* Ambient Grid Pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(rgba(99,102,241,0.15)_1px,transparent_1px)] [background-size:28px_28px] opacity-40"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Content Column */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              {/* Status Pill */}
              <div className="inline-flex items-center space-x-2.5 bg-slate-800/80 hover:bg-slate-800 border border-indigo-500/30 px-3.5 py-1.5 rounded-full text-indigo-300 text-xs font-semibold tracking-wide backdrop-blur-md shadow-xs transition-colors">
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                </span>
                <span className="text-slate-200">2026 Next-Gen Curriculum Released</span>
                <span className="text-indigo-400 font-extrabold">• Free Preview</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] text-white">
                Master In-Demand Skills.{' '}
                <span className="gradient-text-vibrant block mt-1">
                  Build World-Class Careers.
                </span>
              </h1>

              {/* Subheading */}
              <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
                Accelerate your software engineering and tech proficiency through high-impact video masterclasses, hands-on capstone repositories, server-graded quizzes, and cryptographically verifiable certificates.
              </p>

              {/* CTAs */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start space-y-3 sm:space-y-0 sm:space-x-4">
                <Link
                  to="/courses"
                  className="w-full sm:w-auto inline-flex items-center justify-center space-x-2.5 bg-gradient-to-r from-indigo-500 via-indigo-600 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold px-8 py-4 rounded-xl shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 transition-all duration-200 transform hover:-translate-y-0.5 text-base"
                >
                  <span>Explore All Curricula</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>

                <Link
                  to="/verify-certificate"
                  className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-slate-900/80 hover:bg-slate-800 text-slate-200 border border-slate-700/80 hover:border-slate-600 font-semibold px-6 py-4 rounded-xl backdrop-blur-md transition-all duration-200 text-base"
                >
                  <ShieldCheck className="w-5 h-5 text-emerald-400" />
                  <span>Verify Credential</span>
                </Link>
              </div>

              {/* Social Proof Badges */}
              <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-slate-400">
                <div className="flex items-center space-x-2">
                  <div className="flex -space-x-2">
                    <div className="w-7 h-7 rounded-full bg-indigo-600 border-2 border-slate-900 flex items-center justify-center text-[10px] font-bold text-white">AK</div>
                    <div className="w-7 h-7 rounded-full bg-emerald-600 border-2 border-slate-900 flex items-center justify-center text-[10px] font-bold text-white">SP</div>
                    <div className="w-7 h-7 rounded-full bg-amber-600 border-2 border-slate-900 flex items-center justify-center text-[10px] font-bold text-white">RV</div>
                    <div className="w-7 h-7 rounded-full bg-purple-600 border-2 border-slate-900 flex items-center justify-center text-[10px] font-bold text-white">MJ</div>
                  </div>
                  <span className="font-semibold text-slate-200">10,000+ Alumni</span>
                </div>

                <div className="flex items-center space-x-1.5">
                  <div className="flex text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                    ))}
                  </div>
                  <span className="font-semibold text-slate-200">4.9 / 5 Rating</span>
                </div>

                <div className="flex items-center space-x-1 text-emerald-400 font-semibold">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>100% Industry Verified</span>
                </div>
              </div>
            </div>

            {/* Right Interactive Mockup Column */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-lg lg:max-w-none">
                {/* Floating Glow Behind Window */}
                <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-3xl blur-xl opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>

                {/* Glassmorphic Classroom Terminal Card */}
                <div className="relative rounded-2xl bg-slate-900/90 border border-slate-700/80 shadow-2xl backdrop-blur-xl overflow-hidden">
                  {/* Window Bar */}
                  <div className="bg-slate-950/80 px-4 py-3 border-b border-slate-800 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 rounded-full bg-rose-500/80"></div>
                      <div className="w-3 h-3 rounded-full bg-amber-500/80"></div>
                      <div className="w-3 h-3 rounded-full bg-emerald-500/80"></div>
                      <span className="text-[11px] font-mono text-slate-400 ml-2">SkillForge Interactive Learning Lab</span>
                    </div>
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                      Live Preview
                    </span>
                  </div>

                  {/* Tab Selector */}
                  <div className="flex border-b border-slate-800 bg-slate-900/50 text-xs font-semibold text-slate-400">
                    <button
                      onClick={() => setPreviewTab('code')}
                      className={`flex-1 py-2.5 px-3 flex items-center justify-center space-x-1.5 transition-colors ${
                        previewTab === 'code' ? 'bg-slate-800 text-indigo-400 border-b-2 border-indigo-500' : 'hover:text-slate-200'
                      }`}
                    >
                      <Terminal className="w-3.5 h-3.5" />
                      <span>Code Playground</span>
                    </button>
                    <button
                      onClick={() => setPreviewTab('video')}
                      className={`flex-1 py-2.5 px-3 flex items-center justify-center space-x-1.5 transition-colors ${
                        previewTab === 'video' ? 'bg-slate-800 text-indigo-400 border-b-2 border-indigo-500' : 'hover:text-slate-200'
                      }`}
                    >
                      <PlayCircle className="w-3.5 h-3.5" />
                      <span>Video Lesson</span>
                    </button>
                    <button
                      onClick={() => setPreviewTab('cert')}
                      className={`flex-1 py-2.5 px-3 flex items-center justify-center space-x-1.5 transition-colors ${
                        previewTab === 'cert' ? 'bg-slate-800 text-indigo-400 border-b-2 border-indigo-500' : 'hover:text-slate-200'
                      }`}
                    >
                      <Award className="w-3.5 h-3.5" />
                      <span>Verified Cert</span>
                    </button>
                  </div>

                  {/* Window Body Display */}
                  <div className="p-5 font-mono text-xs">
                    {previewTab === 'code' && (
                      <div className="space-y-3">
                        <div className="text-slate-400">// Exercise 04: Build a High-Throughput REST Gateway</div>
                        <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 text-slate-200 leading-relaxed overflow-x-auto">
                          <p><span className="text-purple-400">@Service</span></p>
                          <p><span className="text-indigo-400">public class</span> <span className="text-amber-300">OrderProcessingPipeline</span> &#123;</p>
                          <p className="pl-4"><span className="text-purple-400">@Transactional</span></p>
                          <p className="pl-4"><span className="text-indigo-400">public</span> OrderResult <span className="text-sky-300">executeCheckout</span>(PaymentPayload payload) &#123;</p>
                          <p className="pl-8 text-emerald-400">// Instant HMAC-SHA256 signature verification</p>
                          <p className="pl-8"><span className="text-indigo-400">return</span> paymentEngine.verifyAndFulfill(payload);</p>
                          <p className="pl-4">&#125;</p>
                          <p>&#125;</p>
                        </div>
                        <div className="flex items-center justify-between pt-1">
                          <div className="flex items-center space-x-2 text-emerald-400 font-sans font-semibold">
                            <CheckCircle2 className="w-4 h-4" />
                            <span>14/14 Automated Test Suites Passed (100%)</span>
                          </div>
                          <span className="text-[11px] font-sans font-bold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
                            +50 XP
                          </span>
                        </div>
                      </div>
                    )}

                    {previewTab === 'video' && (
                      <div className="space-y-3">
                        <div className="h-44 rounded-xl bg-gradient-to-tr from-slate-950 via-indigo-950 to-slate-900 border border-slate-800 flex flex-col items-center justify-center relative overflow-hidden group/vid cursor-pointer">
                          <div className="w-14 h-14 rounded-full bg-indigo-600/90 text-white flex items-center justify-center shadow-lg group-hover/vid:scale-110 transition-transform">
                            <PlayCircle className="w-8 h-8 ml-0.5" />
                          </div>
                          <span className="font-sans font-semibold text-xs text-slate-200 mt-3">
                            Full Stack React & Spring Boot: Section 04
                          </span>
                          <span className="text-[10px] text-indigo-300 font-sans">
                            28m 42s • 1080p Ultra HD
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-slate-400 font-sans text-xs">
                          <span>Chapter: Database Connection Pools & Sockets</span>
                          <span className="text-indigo-400 font-semibold">Marked Complete</span>
                        </div>
                      </div>
                    )}

                    {previewTab === 'cert' && (
                      <div className="space-y-3">
                        <div className="p-4 rounded-xl bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-950 border border-indigo-500/40 text-center font-sans space-y-2">
                          <Award className="w-8 h-8 text-amber-400 mx-auto" />
                          <p className="text-[10px] uppercase font-bold tracking-widest text-indigo-300">Certificate of Completion</p>
                          <p className="text-sm font-bold text-white">Full Stack Software Engineering</p>
                          <p className="text-[11px] text-slate-400 font-mono">Issued to: Aman Kumar • ID: SF-202610-8F92A</p>
                          <div className="pt-2 flex justify-center">
                            <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[11px] font-semibold border border-emerald-500/30">
                              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                              <span>Cryptographically Verified</span>
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Key Metrics Bar */}
      <section className="bg-white border-b border-slate-200/80 py-8 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 divide-y sm:divide-y-0 sm:divide-x divide-slate-100">
            <div className="text-center pt-3 sm:pt-0">
              <div className="flex items-center justify-center space-x-1.5 text-indigo-600 mb-1">
                <Users className="w-5 h-5" />
                <span className="text-3xl font-display font-extrabold text-slate-900 tracking-tight">10,000+</span>
              </div>
              <p className="text-xs sm:text-sm font-semibold text-slate-500">Active Students Enrolled</p>
            </div>

            <div className="text-center pt-3 sm:pt-0">
              <div className="flex items-center justify-center space-x-1.5 text-emerald-600 mb-1">
                <CheckCircle className="w-5 h-5" />
                <span className="text-3xl font-display font-extrabold text-slate-900 tracking-tight">95%</span>
              </div>
              <p className="text-xs sm:text-sm font-semibold text-slate-500">Graduation Completion Rate</p>
            </div>

            <div className="text-center pt-3 sm:pt-0">
              <div className="flex items-center justify-center space-x-1.5 text-amber-500 mb-1">
                <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                <span className="text-3xl font-display font-extrabold text-slate-900 tracking-tight">4.9 / 5</span>
              </div>
              <p className="text-xs sm:text-sm font-semibold text-slate-500">Average Student Rating</p>
            </div>

            <div className="text-center pt-3 sm:pt-0">
              <div className="flex items-center justify-center space-x-1.5 text-purple-600 mb-1">
                <Award className="w-5 h-5" />
                <span className="text-3xl font-display font-extrabold text-slate-900 tracking-tight">100%</span>
              </div>
              <p className="text-xs sm:text-sm font-semibold text-slate-500">Verifiable Credentials</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Featured Courses Section with Dynamic Category Filtering */}
      <section className="py-20 sm:py-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 space-y-4 md:space-y-0">
          <div>
            <div className="inline-flex items-center space-x-2 text-indigo-600 font-bold text-xs uppercase tracking-widest mb-2 bg-indigo-50 px-2.5 py-1 rounded-md">
              <Flame className="w-3.5 h-3.5 text-indigo-600" />
              <span>Industry-Accredited Programs</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-slate-900 tracking-tight">
              Featured Learning Paths
            </h2>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center space-x-2 overflow-x-auto pb-2 md:pb-0">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                  activeCategory === cat.id
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/25'
                    : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Courses Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-96 rounded-2xl bg-slate-200/80 animate-pulse border border-slate-200"></div>
            ))}
          </div>
        ) : filteredCourses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCourses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-md mx-auto shadow-sm">
            <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-slate-800 mb-1">No courses found</h3>
            <p className="text-slate-500 text-sm mb-4">
              We couldn't find featured courses in this category right now.
            </p>
            <button
              onClick={() => setActiveCategory('ALL')}
              className="text-xs font-bold bg-indigo-600 text-white px-4 py-2 rounded-lg"
            >
              Reset Category
            </button>
          </div>
        )}

        <div className="mt-14 text-center">
          <Link
            to="/courses"
            className="inline-flex items-center space-x-2 text-sm font-bold bg-slate-100 hover:bg-indigo-50 text-indigo-700 border border-slate-200 hover:border-indigo-200 px-6 py-3 rounded-xl transition-all shadow-xs"
          >
            <span>Browse Full Catalog of All Bootcamps & Courses</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* 4. Bento Grid: The SkillForge Advantage */}
      <section className="bg-slate-900 text-white py-20 sm:py-28 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.06)_1px,transparent_1px)] [background-size:24px_24px]"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center space-x-2 text-indigo-400 font-bold text-xs uppercase tracking-widest mb-2 bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-400/20">
              <Zap className="w-3.5 h-3.5" />
              <span>Engineered For Real Mastery</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-display font-extrabold text-white tracking-tight">
              Why Engineers Choose SkillForge
            </h2>
            <p className="text-slate-400 mt-4 text-base leading-relaxed">
              We discarded passive video watching. Every module forces you to synthesize code, configure environments, pass rigorous assessments, and earn credentials that carry weight.
            </p>
          </div>

          {/* Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {/* Card 1 */}
            <div className="bg-slate-800/80 backdrop-blur-md rounded-2xl border border-slate-700/80 p-8 flex flex-col justify-between hover:border-indigo-500/40 transition-colors">
              <div>
                <div className="w-12 h-12 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center mb-6 border border-indigo-500/30">
                  <PlayCircle className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-display font-bold text-white mb-2">High-Definition Structured Video</h3>
                <p className="text-slate-300 text-sm leading-relaxed">
                  Sequenced modular lectures, architectural diagrams, step-by-step terminal demonstrations, and downloadable boilerplate repositories.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-700/60 flex items-center text-xs text-indigo-400 font-semibold">
                <span>Adaptive Bitrate Streaming (1080p)</span>
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-slate-800/80 backdrop-blur-md rounded-2xl border border-slate-700/80 p-8 flex flex-col justify-between hover:border-emerald-500/40 transition-colors">
              <div>
                <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-6 border border-emerald-500/30">
                  <CheckCircle className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-display font-bold text-white mb-2">Server-Graded Assessments</h3>
                <p className="text-slate-300 text-sm leading-relaxed">
                  Rigorous quizzes test architectural trade-offs, edge conditions, and syntax mastery before permitting module progression.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-700/60 flex items-center text-xs text-emerald-400 font-semibold">
                <span>70%+ Passing Benchmark Required</span>
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-slate-800/80 backdrop-blur-md rounded-2xl border border-slate-700/80 p-8 flex flex-col justify-between hover:border-purple-500/40 transition-colors">
              <div>
                <div className="w-12 h-12 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center mb-6 border border-purple-500/30">
                  <Award className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-display font-bold text-white mb-2">Instant Verifiable Credentials</h3>
                <p className="text-slate-300 text-sm leading-relaxed">
                  Automated PDF certificate generation signed with cryptographic keys. Easily attachable to LinkedIn with a public verification URL.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-700/60 flex items-center text-xs text-purple-400 font-semibold">
                <span>Unique ID & QR Verification</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. How It Works: The 4-Step Career Progression */}
      <section className="py-20 sm:py-28 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-xs font-bold text-indigo-600 uppercase tracking-widest mb-2">Learning Blueprint</h2>
            <h3 className="text-3xl sm:text-4xl font-display font-extrabold text-slate-900 tracking-tight">
              From Beginner to Certified Specialist
            </h3>
            <p className="text-slate-600 mt-3 text-sm sm:text-base">
              A frictionless progression path designed to build confidence, muscle memory, and job readiness.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white font-extrabold flex items-center justify-center mb-4">
                01
              </div>
              <h4 className="font-bold text-slate-900 text-base mb-2">Enroll & Instant Unlock</h4>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                Secure checkout via Razorpay unlocks the entire lecture series, slides, repositories, and community forum.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white font-extrabold flex items-center justify-center mb-4">
                02
              </div>
              <h4 className="font-bold text-slate-900 text-base mb-2">Follow Practical Labs</h4>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                Watch short bite-sized videos and code alongside the instructor on production-style capstone projects.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white font-extrabold flex items-center justify-center mb-4">
                03
              </div>
              <h4 className="font-bold text-slate-900 text-base mb-2">Pass Assessments</h4>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                Validate your grasp with rigorous quizzes. Immediate scoring pinpoints strengths and highlights areas for improvement.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white font-extrabold flex items-center justify-center mb-4">
                04
              </div>
              <h4 className="font-bold text-slate-900 text-base mb-2">Download Certificate</h4>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                Receive an accredited certificate with a permanent verification URL to showcase to recruiters and managers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Testimonials Section */}
      <section className="py-20 sm:py-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-xs font-bold text-indigo-600 uppercase tracking-widest mb-2">Alumni Reviews</h2>
          <h3 className="text-3xl sm:text-4xl font-display font-extrabold text-slate-900 tracking-tight">
            Loved By Thousands of Engineers
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex text-amber-400 space-x-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <p className="text-slate-700 text-sm leading-relaxed">
                "The Full-Stack Bootcamp gave me the practical knowledge and confidence to ace my interviews. The certificate verification link on my CV made a huge impression on recruiters."
              </p>
            </div>
            <div className="mt-8 pt-4 border-t border-slate-100 flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 text-white font-bold flex items-center justify-center text-sm shadow-sm">
                AK
              </div>
              <div>
                <p className="font-bold text-slate-900 text-sm">Aman Kumar</p>
                <p className="text-xs text-slate-500">Software Engineer at Infosys</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex text-amber-400 space-x-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <p className="text-slate-700 text-sm leading-relaxed">
                "The assessments aren't just multiple choice guesses. They test edge cases and practical implementations. Easily the best investment I've made in my career."
              </p>
            </div>
            <div className="mt-8 pt-4 border-t border-slate-100 flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-600 text-white font-bold flex items-center justify-center text-sm shadow-sm">
                SP
              </div>
              <div>
                <p className="font-bold text-slate-900 text-sm">Sneha Patel</p>
                <p className="text-xs text-slate-500">Data Analyst at Flipkart</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex text-amber-400 space-x-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <p className="text-slate-700 text-sm leading-relaxed">
                "Razorpay checkout was instant, and the course opened up on my dashboard within seconds with SMS and WhatsApp confirmations. Outstanding learning experience."
              </p>
            </div>
            <div className="mt-8 pt-4 border-t border-slate-100 flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-600 to-orange-600 text-white font-bold flex items-center justify-center text-sm shadow-sm">
                RV
              </div>
              <div>
                <p className="font-bold text-slate-900 text-sm">Rohan Varma</p>
                <p className="text-xs text-slate-500">Cloud Consultant</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Interactive Collapsible FAQ Section */}
      <section className="bg-slate-100/70 py-20 border-t border-slate-200">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center space-x-1.5 text-xs font-bold text-indigo-600 uppercase tracking-widest mb-2 bg-indigo-50 px-2.5 py-1 rounded-md">
              <HelpCircle className="w-3.5 h-3.5 text-indigo-600" />
              <span>Answers to Common Queries</span>
            </div>
            <h3 className="text-3xl font-display font-extrabold text-slate-900 tracking-tight">Frequently Asked Questions</h3>
          </div>

          <div className="space-y-3.5">
            {faqs.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div
                  key={index}
                  className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-xs transition-all duration-200"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    className="w-full py-4 px-6 text-left flex items-center justify-between font-bold text-slate-900 hover:text-indigo-600 transition-colors"
                  >
                    <span className="text-base">{faq.q}</span>
                    <ChevronDown
                      className={`w-5 h-5 text-slate-400 shrink-0 ml-4 transition-transform duration-200 ${
                        isOpen ? 'rotate-180 text-indigo-600' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-6 pb-5 text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 8. Call To Action Footer Banner */}
      <section className="mesh-dark text-white py-20 sm:py-24 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-indigo-600/30 blur-[130px] rounded-full pointer-events-none"></div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-6">
          <div className="inline-flex items-center space-x-2 bg-indigo-500/20 border border-indigo-400/30 px-3.5 py-1.5 rounded-full text-indigo-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-indigo-300" />
            <span>Start Learning Today</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-display font-extrabold tracking-tight text-white leading-tight">
            Ready to Accelerate Your Engineering Career?
          </h2>

          <p className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Join thousands of ambitious developers, engineers, and data professionals. Instant access, self-paced mastery, and verifiable accreditation.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-4">
            <Link
              to="/courses"
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-gradient-to-r from-indigo-500 via-indigo-600 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold px-8 py-4 rounded-xl shadow-lg shadow-indigo-500/40 hover:shadow-indigo-500/60 transition-all duration-200 transform hover:-translate-y-0.5 text-base"
            >
              <span>Explore All Curricula</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/register"
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-700 font-semibold px-8 py-4 rounded-xl transition text-base"
            >
              <span>Create Free Account</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
