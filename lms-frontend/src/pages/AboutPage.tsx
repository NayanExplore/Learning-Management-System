import React from 'react';
import { GraduationCap, Award, Users, ShieldCheck, HeartHandshake, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const AboutPage: React.FC = () => {
  return (
    <div className="flex-1 bg-slate-50 py-16 sm:py-24 relative overflow-hidden">
      {/* Ambient gradient glows */}
      <div className="absolute top-0 right-1/3 w-[500px] h-[500px] bg-indigo-100/50 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-10 left-1/4 w-[500px] h-[500px] bg-purple-100/50 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 px-3.5 py-1.5 rounded-full text-indigo-700 text-xs font-bold uppercase tracking-wider mb-4 shadow-sm">
            <GraduationCap className="w-4 h-4 text-indigo-600" />
            <span>Our Mission & Vision</span>
          </div>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight font-display leading-tight">
            Bridging The Gap Between Theory & Industry Mastery
          </h1>
          <p className="mt-5 text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
            SkillForge Academy was founded with a singular conviction: empowering engineers, data practitioners, and tech leaders with direct access to production-grade curricula designed and mentored by veterans from premier tech enterprises.
          </p>
        </div>

        {/* 3 Value Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-3xl border border-slate-200/90 shadow-card-elevated hover:shadow-card-hover transition duration-300 text-center relative overflow-hidden group">
            <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-5 border border-indigo-100 group-hover:scale-110 transition shadow-sm">
              <Award className="w-7 h-7" />
            </div>
            <h3 className="font-black text-slate-900 text-xl font-display mb-2.5">Rigorous Accreditation</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              We uphold uncompromising quality standards. Our verifiable credentials reflect genuine proficiency validated through comprehensive assessments and practical codebase capstones.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-slate-200/90 shadow-card-elevated hover:shadow-card-hover transition duration-300 text-center relative overflow-hidden group">
            <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-5 border border-emerald-100 group-hover:scale-110 transition shadow-sm">
              <Users className="w-7 h-7" />
            </div>
            <h3 className="font-black text-slate-900 text-xl font-display mb-2.5">14,500+ Strong Alumni</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Our graduates are driving product innovations as full-stack engineers, cloud architects, and data scientists across Google, Amazon, Microsoft, and high-growth unicorns worldwide.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-slate-200/90 shadow-card-elevated hover:shadow-card-hover transition duration-300 text-center relative overflow-hidden group">
            <div className="w-14 h-14 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-5 border border-purple-100 group-hover:scale-110 transition shadow-sm">
              <Sparkles className="w-7 h-7" />
            </div>
            <h3 className="font-black text-slate-900 text-xl font-display mb-2.5">Production Blueprints</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Every course is structured around real distributed microservices, battle-tested architectural patterns, and production CI/CD deployment pipelines.
            </p>
          </div>
        </div>

        {/* Philosophy Card */}
        <div className="bg-slate-950 text-white rounded-3xl p-8 sm:p-14 border border-slate-800 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/10 rounded-full blur-[100px] pointer-events-none"></div>

          <div className="relative max-w-3xl">
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-400">Core Principles</span>
            <h2 className="text-2xl sm:text-4xl font-black font-display mt-2 mb-4">Our Teaching Philosophy</h2>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-8">
              We reject shallow surface-level tutorials. Every SkillForge curriculum focuses on fundamental software design principles, concurrency models, architectural resiliency, testing discipline, and high-scale production reliability.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-slate-200">
              <div className="flex items-center space-x-3 p-3 rounded-2xl bg-slate-900/60 border border-slate-800">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <span className="text-xs sm:text-sm font-medium">Curricula vetted by Principal Tech Architects</span>
              </div>
              <div className="flex items-center space-x-3 p-3 rounded-2xl bg-slate-900/60 border border-slate-800">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <span className="text-xs sm:text-sm font-medium">Tamper-proof verifiable credentials</span>
              </div>
              <div className="flex items-center space-x-3 p-3 rounded-2xl bg-slate-900/60 border border-slate-800">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <span className="text-xs sm:text-sm font-medium">Interactive evaluations & hands-on exercises</span>
              </div>
              <div className="flex items-center space-x-3 p-3 rounded-2xl bg-slate-900/60 border border-slate-800">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <span className="text-xs sm:text-sm font-medium">Lifetime access & continuous curriculum updates</span>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-800/80">
              <Link
                to="/courses"
                className="inline-flex items-center space-x-2 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white px-6 py-3.5 rounded-2xl font-bold text-sm shadow-lg shadow-indigo-600/30 hover:from-indigo-500 hover:to-indigo-600 transition"
              >
                <span>Explore Our Curriculum</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
