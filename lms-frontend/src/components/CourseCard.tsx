import React from 'react';
import { Link } from 'react-router-dom';
import { CourseSummary } from '../types';
import { Clock, User, ArrowRight, BookOpen, Star, Sparkles, CheckCircle2 } from 'lucide-react';

interface CourseCardProps {
  course: CourseSummary;
  isEnrolled?: boolean;
}

export const CourseCard: React.FC<CourseCardProps> = ({ course, isEnrolled }) => {
  const levelBadge = {
    BEGINNER: { label: 'Beginner', bg: 'bg-emerald-500/10 text-emerald-700 border-emerald-300/60' },
    INTERMEDIATE: { label: 'Intermediate', bg: 'bg-sky-500/10 text-sky-700 border-sky-300/60' },
    ADVANCED: { label: 'Advanced', bg: 'bg-purple-500/10 text-purple-700 border-purple-300/60' },
  }[course.level] || { label: course.level, bg: 'bg-slate-500/10 text-slate-700 border-slate-300/60' };

  const discountPercent =
    course.originalPrice && course.originalPrice > course.price
      ? Math.round(((course.originalPrice - course.price) / course.originalPrice) * 100)
      : null;

  return (
    <div className="group relative bg-white rounded-2xl border border-slate-200/90 hover:border-indigo-500/40 shadow-sm hover:shadow-card-hover transition-all duration-300 transform hover:-translate-y-1.5 flex flex-col h-full overflow-hidden">
      {/* Thumbnail Area */}
      <div className="h-52 bg-gradient-to-tr from-slate-900 via-indigo-950 to-slate-900 relative overflow-hidden flex items-center justify-center">
        {course.thumbnailUrl ? (
          <img
            src={course.thumbnailUrl}
            alt={course.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          />
        ) : (
          <div className="text-center p-6 text-white relative z-10">
            <div className="w-14 h-14 mx-auto mb-2 rounded-2xl bg-indigo-500/20 backdrop-blur-md flex items-center justify-center border border-indigo-400/30 text-indigo-300">
              <BookOpen className="w-7 h-7" />
            </div>
            <span className="text-[11px] font-bold tracking-widest uppercase text-indigo-200">SkillForge Academy</span>
          </div>
        )}

        {/* Ambient Dark Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none"></div>

        {/* Level Badge */}
        <div className="absolute top-3 left-3 z-10">
          <span className={`inline-flex items-center px-2.5 py-1 text-[11px] font-bold rounded-full border backdrop-blur-md bg-white/95 shadow-xs ${levelBadge.bg}`}>
            <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5"></span>
            {levelBadge.label}
          </span>
        </div>

        {/* Featured Badge */}
        {course.featured && (
          <div className="absolute top-3 right-3 z-10">
            <span className="inline-flex items-center space-x-1 px-2.5 py-1 text-[11px] font-extrabold rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md shadow-amber-500/25">
              <Sparkles className="w-3 h-3" />
              <span>Featured</span>
            </span>
          </div>
        )}

        {/* Floating Rating Pill at Bottom of Thumbnail */}
        <div className="absolute bottom-3 left-3 z-10 flex items-center space-x-2">
          <div className="flex items-center space-x-1 bg-slate-900/80 backdrop-blur-md px-2 py-0.5 rounded-md text-white text-xs font-semibold border border-white/10">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span>4.9</span>
            <span className="text-slate-400 text-[10px]">(1.2k)</span>
          </div>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Metadata Row */}
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2.5">
            {course.durationHours ? (
              <span className="inline-flex items-center space-x-1.5 bg-slate-50 px-2 py-1 rounded-md text-slate-600 font-medium border border-slate-100">
                <Clock className="w-3.5 h-3.5 text-indigo-500" />
                <span>{course.durationHours} Hours Practical</span>
              </span>
            ) : (
              <span className="text-slate-400">Self-Paced</span>
            )}

            {course.instructorName && (
              <span className="inline-flex items-center space-x-1 text-slate-600 font-medium truncate max-w-[150px]">
                <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="truncate">{course.instructorName}</span>
              </span>
            )}
          </div>

          {/* Title */}
          <h3 className="font-display font-bold text-slate-900 text-lg mb-2 line-clamp-2 leading-snug group-hover:text-indigo-600 transition-colors">
            {course.title}
          </h3>

          {/* Description */}
          <p className="text-slate-600 text-xs sm:text-sm line-clamp-2 mb-4 leading-relaxed font-normal">
            {course.shortDescription || 'Master industry-standard engineering skills with capstone projects and assessments.'}
          </p>

          {/* Feature Highlights Pills */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            <span className="inline-flex items-center text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
              <CheckCircle2 className="w-3 h-3 mr-1 text-emerald-600" /> Verified Certificate
            </span>
            <span className="inline-flex items-center text-[10px] font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
              Lifetime Access
            </span>
          </div>
        </div>

        {/* Pricing & Call To Action */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between mt-auto">
          <div>
            <div className="flex items-baseline space-x-2">
              <span className="text-2xl font-display font-extrabold text-slate-900 tracking-tight">
                ₹{course.price.toLocaleString('en-IN')}
              </span>
              {course.originalPrice && course.originalPrice > course.price && (
                <span className="text-xs text-slate-400 line-through font-medium">
                  ₹{course.originalPrice.toLocaleString('en-IN')}
                </span>
              )}
            </div>
            {discountPercent && (
              <span className="inline-block text-[10px] font-extrabold text-emerald-600 uppercase tracking-wide">
                Save {discountPercent}% Today
              </span>
            )}
          </div>

          {isEnrolled ? (
            <Link
              to={`/learn/${course.id}`}
              className="inline-flex items-center space-x-1.5 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-xl shadow-md shadow-emerald-600/20 transition-all duration-200 transform hover:scale-102"
            >
              <span>Continue Learning</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          ) : (
            <Link
              to={`/courses/${course.slug}`}
              className="inline-flex items-center space-x-1.5 text-xs font-bold bg-slate-900 hover:bg-indigo-600 text-white px-4 py-2.5 rounded-xl shadow-md hover:shadow-indigo-600/25 transition-all duration-200 transform group-hover:bg-indigo-600 group-hover:scale-102"
            >
              <span>View Course</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};
