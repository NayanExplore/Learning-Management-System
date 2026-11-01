import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/client';
import { CourseSummary } from '../types';
import { CourseCard } from '../components/CourseCard';
import {
  GraduationCap,
  ShieldCheck,
  Check,
  ArrowRight,
  BookOpen,
  Code2,
  Cpu,
  Layers,
  ChevronDown,
  Compass,
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { CourseCardSkeleton } from '../components/ui/Skeleton';
import { EmptyState } from '../components/ui/EmptyState';

export const HomePage: React.FC = () => {
  const [courses, setCourses] = useState<CourseSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await api.get('/v1/courses/featured');
        if (res.data?.success && Array.isArray(res.data.data)) {
          setCourses(res.data.data);
        } else {
          // Fallback to general course list if featured returns empty
          const fallbackRes = await api.get('/v1/courses', { params: { size: 6 } });
          if (fallbackRes.data?.success && fallbackRes.data.data?.content) {
            setCourses(fallbackRes.data.data.content);
          }
        }
      } catch (err) {
        console.error('Failed to load courses for homepage', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const categories = [
    { id: 'ALL', label: 'All Curriculam' },
    { id: 'WEB', label: 'Web Engineering' },
    { id: 'BACKEND', label: 'Backend & Systems' },
    { id: 'CLOUD', label: 'Cloud & DevOps' },
  ];

  const filteredCourses = courses.filter((course) => {
    if (activeCategory === 'ALL') return true;
    const title = course.title.toLowerCase();
    if (activeCategory === 'WEB') {
      return title.includes('web') || title.includes('react') || title.includes('frontend') || title.includes('full stack');
    }
    if (activeCategory === 'BACKEND') {
      return title.includes('java') || title.includes('spring') || title.includes('python') || title.includes('backend') || title.includes('api');
    }
    if (activeCategory === 'CLOUD') {
      return title.includes('cloud') || title.includes('devops') || title.includes('aws') || title.includes('docker');
    }
    return true;
  });

  const faqs = [
    {
      q: 'How do verifiable certificates work?',
      a: 'When you complete all lessons in a course curriculum, SkillForge issues a verifiable digital credential with a permanent unique ID. Anyone can verify its authenticity anytime on our public registry at /verify-certificate.',
    },
    {
      q: 'Are the courses self-paced or scheduled?',
      a: 'All courses are self-paced with lifetime access. You can learn on your schedule, revisit lessons anytime, and track your progress across desktop and mobile devices.',
    },
    {
      q: 'How does payment and enrollment work?',
      a: 'Payments are processed securely through Razorpay. Once your payment succeeds, your account is enrolled immediately, and all curriculum sections unlock automatically in your learning dashboard.',
    },
    {
      q: 'Can I access the curriculum on mobile?',
      a: 'Yes. The entire learning interface is designed responsively for mobile phones, tablets, and desktop browsers, including inline video playback and curriculum navigation.',
    },
  ];

  return (
    <div className="flex-1 flex flex-col bg-slate-950 text-slate-100">
      {/* 1. Hero Section */}
      <section className="bg-slate-900/60 border-b border-slate-800 py-16 sm:py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/80 text-xs font-medium text-slate-300 border border-slate-700">
                <span className="w-2 h-2 rounded-full bg-teal-400"></span>
                <span>Practical engineering curriculam</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-5xl font-bold tracking-tight text-white leading-tight">
                Build skills that move your career forward.
              </h1>

              <p className="text-base sm:text-lg text-slate-400 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                SkillForge provides structured, project-driven software development tracks. Learn directly from real codebases, master architecture fundamentals, and earn verifiable credentials.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-2">
                <Link to="/courses">
                  <Button variant="teal" size="lg" iconRight={<ArrowRight className="w-4 h-4" />}>
                    Explore Courses
                  </Button>
                </Link>
                <Link to="/register">
                  <Button variant="outline" size="lg" className="border-slate-700 text-slate-200 hover:bg-slate-850 hover:text-white">
                    Get Started Free
                  </Button>
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="pt-6 border-t border-slate-800 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-slate-400">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-teal-400" />
                  <span>Verifiable credentials</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-teal-400" />
                  <span>Lifetime course access</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-teal-400" />
                  <span>Self-paced learning</span>
                </div>
              </div>
            </div>

            {/* Right Educational Visual */}
            <div className="lg:col-span-5">
              <div className="rounded-xl border border-slate-800 bg-slate-900 shadow-sm overflow-hidden">
                <div className="px-4 py-3 bg-slate-850/80 border-b border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-slate-700"></span>
                    <span className="w-3 h-3 rounded-full bg-slate-700"></span>
                    <span className="w-3 h-3 rounded-full bg-slate-700"></span>
                  </div>
                  <span className="text-xs font-mono text-slate-400">curriculum-overview.ts</span>
                </div>

                <div className="p-6 space-y-4">
                  <div className="space-y-2">
                    <span className="text-xs font-semibold uppercase tracking-wider text-teal-400">
                      Featured Track
                    </span>
                    <h3 className="text-lg font-semibold text-white">
                      Production Full-Stack Architecture
                    </h3>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Hands-on modules covering React, TypeScript, Spring Boot microservices, and secure deployments.
                    </p>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-slate-800">
                    <div className="flex items-center justify-between text-xs py-2 px-3 rounded-lg bg-slate-800/60 border border-slate-800">
                      <span className="text-slate-200 font-medium">01. Architecture & Design</span>
                      <span className="text-emerald-400 font-semibold">Completed</span>
                    </div>
                    <div className="flex items-center justify-between text-xs py-2 px-3 rounded-lg bg-slate-800/60 border border-slate-800">
                      <span className="text-slate-200 font-medium">02. RESTful APIs & Data Models</span>
                      <span className="text-teal-400 font-semibold">In Progress</span>
                    </div>
                    <div className="flex items-center justify-between text-xs py-2 px-3 rounded-lg bg-slate-800/60 border border-slate-800">
                      <span className="text-slate-200 font-medium">03. Production Deployment & CI/CD</span>
                      <span className="text-slate-500">Upcoming</span>
                    </div>
                  </div>

                  <div className="pt-3 flex items-center justify-between text-xs text-slate-400">
                    <span>Includes source code & assignments</span>
                    <Link to="/courses" className="text-teal-400 font-semibold hover:underline">
                      Browse catalog →
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Course Section with Category Filtering */}
      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-teal-400 mb-1">
                Explore Programs
              </p>
              <h2 className="text-2xl sm:text-3xl font-bold text-white">
                Featured Curriculam
              </h2>
              <p className="text-sm text-slate-400 mt-1 max-w-xl">
                Select from our latest active courses curated for real-world development environments.
              </p>
            </div>

            {/* Category tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
              {categories.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setActiveCategory(c.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${activeCategory === c.id
                      ? 'bg-teal-600 text-white'
                      : 'bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800'
                    }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          {/* Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <CourseCardSkeleton key={i} />
              ))}
            </div>
          ) : filteredCourses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCourses.slice(0, 6).map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={<BookOpen className="w-6 h-6" />}
              title="No courses in this category yet"
              description="Courses in this section are currently being updated. Browse all active courses to find other programs."
              actionLabel="View All Courses"
              actionHref="/courses"
            />
          )}

          <div className="text-center pt-4">
            <Link to="/courses">
              <Button variant="outline" size="md" iconRight={<ArrowRight className="w-4 h-4" />}>
                View All Available Courses
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* 3. Why Learn with SkillForge? (Genuine, practical benefits) */}
      <section className="bg-slate-900/40 border-y border-slate-800 py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <p className="text-xs font-semibold uppercase tracking-wider text-teal-400 mb-1">
              Methodology
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold text-white">
              Designed for practical competency
            </h2>
            <p className="text-sm text-slate-400 mt-2">
              Our curriculum focuses on engineering fundamentals and applied projects over superficial theory.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-xl border border-slate-800 bg-slate-900/80 space-y-3">
              <div className="w-10 h-10 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-teal-400">
                <Code2 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-white">Real Codebases & Tools</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Work with production patterns, Git workflows, database schema migrations, and REST APIs rather than isolated toy exercises.
              </p>
            </div>

            <div className="p-6 rounded-xl border border-slate-800 bg-slate-900/80 space-y-3">
              <div className="w-10 h-10 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-teal-400">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-white">Verifiable Credentials</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Upon curriculum completion, receive a certificate with a unique permanent identifier that can be verified by employers.
              </p>
            </div>

            <div className="p-6 rounded-xl border border-slate-800 bg-slate-900/80 space-y-3">
              <div className="w-10 h-10 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-teal-400">
                <Compass className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-white">Self-Paced Mastery</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Learn around your schedule with lifetime access, organized lecture notes, downloadable resources, and continuous progress saving.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. How It Works */}
      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <p className="text-xs font-semibold uppercase tracking-wider text-teal-400 mb-1">
              Workflow
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold text-white">
              How learning on SkillForge works
            </h2>
            <p className="text-sm text-slate-400 mt-2">
              A straightforward path from course selection to credential verification.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            <div className="space-y-3 relative p-6 rounded-xl bg-slate-900/50 border border-slate-800">
              <div className="text-2xl font-bold text-teal-400 font-mono">01</div>
              <h3 className="text-base font-semibold text-white">Select your course</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Browse our curriculum catalog, inspect lesson syllabus previews, and enroll securely through Razorpay.
              </p>
            </div>

            <div className="space-y-3 relative p-6 rounded-xl bg-slate-900/50 border border-slate-800">
              <div className="text-2xl font-bold text-teal-400 font-mono">02</div>
              <h3 className="text-base font-semibold text-white">Study & apply concepts</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Follow high-definition lectures, review code samples, and mark lessons complete as you progress.
              </p>
            </div>

            <div className="space-y-3 relative p-6 rounded-xl bg-slate-900/50 border border-slate-800">
              <div className="text-2xl font-bold text-teal-400 font-mono">03</div>
              <h3 className="text-base font-semibold text-white">Earn your credential</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Complete all mandatory lessons to generate your verifiable certificate, ready to share on LinkedIn or resumes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Frequently Asked Questions */}
      <section className="bg-slate-900/40 border-t border-slate-800 py-16 sm:py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-wider text-teal-400 mb-1">
              Support
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold text-white">
              Frequently Asked Questions
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              Common questions about enrollment, course content, and certificates.
            </p>
          </div>

          <div className="divide-y divide-slate-800 border-y border-slate-800">
            {faqs.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div key={index} className="py-4">
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    className="w-full flex items-center justify-between text-left font-semibold text-sm text-slate-100 hover:text-teal-400 transition-colors"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-400 shrink-0 ml-4 transition-transform duration-200 ${isOpen ? 'rotate-180 text-teal-400' : ''
                        }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="mt-2 text-xs sm:text-sm text-slate-400 leading-relaxed pr-8">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 6. Clean Call to Action */}
      <section className="bg-gradient-to-b from-slate-900 to-slate-950 border-t border-slate-800 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Ready to start learning?
          </h2>
          <p className="text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
            Create your account today or explore the course catalog to find the curriculum that matches your career goals.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link to="/courses">
              <Button variant="teal" size="md">
                Browse All Courses
              </Button>
            </Link>
            <Link to="/register">
              <Button variant="outline" size="md" className="border-slate-700 text-slate-200 hover:bg-slate-800">
                Create Account
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
