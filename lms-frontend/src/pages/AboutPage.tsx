import React from 'react';
import { GraduationCap, Award, Users, ShieldCheck, ArrowRight, Code2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';

export const AboutPage: React.FC = () => {
  return (
    <div className="flex-1 bg-slate-950 py-12 lg:py-16 text-slate-100">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Mission Statement */}
        <div className="space-y-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-teal-400">
            About SkillForge
          </p>
          <h1 className="text-2xl sm:text-4xl font-bold text-white tracking-tight leading-tight">
            Bridging the gap between software theory and industry engineering standards.
          </h1>
          <p className="text-sm sm:text-base text-slate-400 leading-relaxed max-w-3xl">
            SkillForge Academy was created to give aspiring and working software engineers structured access to real production patterns. Our curriculam focus on architecture, clean code, database persistence, and cloud-native deployments.
          </p>
        </div>

        {/* 3 Core Principles */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 shadow-xs space-y-3">
            <div className="w-9 h-9 rounded-lg bg-slate-800 flex items-center justify-center text-teal-400">
              <Code2 className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-semibold text-white">Applied Engineering</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Every course is structured around real codebases, practical exercises, and deployable end-to-end architectures.
            </p>
          </div>

          <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 shadow-xs space-y-3">
            <div className="w-9 h-9 rounded-lg bg-slate-800 flex items-center justify-center text-teal-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-semibold text-white">Verifiable Credentials</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Each completed curriculum generates a cryptographically stamped certificate that can be verified publicly on our registry.
            </p>
          </div>

          <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 shadow-xs space-y-3">
            <div className="w-9 h-9 rounded-lg bg-slate-800 flex items-center justify-center text-teal-400">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-semibold text-white">Transparent & Self-Paced</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Lifetime course access, clear pricing with no hidden recurring charges, and self-paced progress across all devices.
            </p>
          </div>
        </div>

        {/* Philosophy Card */}
        <div className="bg-slate-900 p-8 rounded-xl border border-slate-800 shadow-xs space-y-6">
          <div className="space-y-2">
            <h2 className="text-lg font-semibold text-white">Our Approach to Learning</h2>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-2xl">
              We believe engineers learn best by building, testing, and debugging software rather than memorizing syntax. Our lessons emphasize architectural decisions, performance tradeoffs, and automated testing discipline.
            </p>
          </div>

          <div className="pt-2">
            <Link to="/courses">
              <Button variant="teal" size="md" iconRight={<ArrowRight className="w-4 h-4" />}>
                Explore Curriculam
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
