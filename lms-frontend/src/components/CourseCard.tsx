import React from 'react';
import { Link } from 'react-router-dom';
import { CourseSummary } from '../types';
import { Clock, User, ArrowRight, BookOpen } from 'lucide-react';
import { Badge } from './ui/Badge';
import { formatCurrency, formatDuration } from '../utils/format';

interface CourseCardProps {
  course: CourseSummary;
  isEnrolled?: boolean;
}

export const CourseCard: React.FC<CourseCardProps> = ({ course, isEnrolled }) => {
  const levelVariant: Record<string, 'neutral' | 'info' | 'purple' | 'teal'> = {
    BEGINNER: 'teal',
    INTERMEDIATE: 'info',
    ADVANCED: 'neutral',
  };

  const levelLabel: Record<string, string> = {
    BEGINNER: 'Beginner',
    INTERMEDIATE: 'Intermediate',
    ADVANCED: 'Advanced',
  };

  const discountPercent =
    course.originalPrice && course.originalPrice > course.price
      ? Math.round(((course.originalPrice - course.price) / course.originalPrice) * 100)
      : null;

  return (
    <article className="group bg-white rounded-xl border border-[#E5E7EB] hover:border-slate-300 hover:shadow-md transition-all duration-200 flex flex-col h-full overflow-hidden">
      {/* Thumbnail */}
      <div className="relative aspect-video w-full bg-slate-100 overflow-hidden border-b border-[#E5E7EB]">
        {course.thumbnailUrl ? (
          <img
            src={course.thumbnailUrl}
            alt={course.title}
            className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300 ease-out"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-slate-50 text-slate-400 p-4">
            <BookOpen className="w-8 h-8 text-slate-300 mb-1" />
            <span className="text-xs font-medium text-slate-500">SkillForge</span>
          </div>
        )}

        {/* Level Badge */}
        <div className="absolute top-3 left-3">
          <Badge variant={levelVariant[course.level] || 'default'} size="sm">
            {levelLabel[course.level] || course.level}
          </Badge>
        </div>

        {course.featured && (
          <div className="absolute top-3 right-3">
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-[#172B4D] text-white">
              Featured
            </span>
          </div>
        )}
      </div>

      {/* Body */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2">
          {/* Metadata bar */}
          <div className="flex items-center justify-between text-xs text-[#697386]">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>{formatDuration(course.durationHours)}</span>
            </span>
            {course.instructorName && (
              <span className="flex items-center gap-1 truncate max-w-[150px]" title={course.instructorName}>
                <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="truncate">{course.instructorName}</span>
              </span>
            )}
          </div>

          {/* Title */}
          <h3 className="text-base font-semibold text-[#20252B] line-clamp-2 leading-snug group-hover:text-[#172B4D] transition-colors">
            {course.title}
          </h3>

          {/* Short Description */}
          {course.shortDescription && (
            <p className="text-xs text-[#697386] line-clamp-2 leading-relaxed">
              {course.shortDescription}
            </p>
          )}
        </div>

        {/* Footer: Price & CTA */}
        <div className="pt-3 border-t border-[#E5E7EB] flex items-center justify-between mt-auto">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-bold text-[#20252B]">
                {formatCurrency(course.price, course.currency)}
              </span>
              {course.originalPrice && course.originalPrice > course.price && (
                <span className="text-xs text-[#697386] line-through">
                  {formatCurrency(course.originalPrice, course.currency)}
                </span>
              )}
            </div>
            {discountPercent && (
              <span className="text-[11px] font-medium text-emerald-700">
                {discountPercent}% off
              </span>
            )}
          </div>

          {isEnrolled ? (
            <Link
              to={`/learn/${course.id}`}
              className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-lg bg-[#287C78] hover:bg-[#1E615E] text-white transition-colors"
            >
              <span>Continue</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          ) : (
            <Link
              to={`/courses/${course.slug}`}
              className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-[#172B4D] hover:text-white text-[#20252B] transition-colors"
            >
              <span>View Course</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>
      </div>
    </article>
  );
};
