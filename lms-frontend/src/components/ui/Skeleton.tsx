import React from 'react';

export const Skeleton: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className = '', ...props }) => {
  return (
    <div
      className={`animate-pulse rounded-md bg-slate-200/80 ${className}`}
      {...props}
    />
  );
};

export const CourseCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-xl border border-[#E5E7EB] p-4 space-y-4">
      <Skeleton className="h-44 w-full rounded-lg" />
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-16" />
        </div>
        <Skeleton className="h-5 w-4/5" />
        <Skeleton className="h-4 w-full" />
      </div>
      <div className="pt-3 border-t border-[#E5E7EB] flex justify-between items-center">
        <Skeleton className="h-6 w-20" />
        <Skeleton className="h-8 w-24 rounded-lg" />
      </div>
    </div>
  );
};

