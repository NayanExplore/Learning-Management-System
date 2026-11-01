import React from 'react';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'neutral' | 'success' | 'warning' | 'info' | 'teal' | 'purple';
  size?: 'sm' | 'md';
  dot?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'md',
  dot = false,
  className = '',
  ...props
}) => {
  const sizeStyles = {
    sm: 'text-[11px] px-2 py-0.5 font-medium',
    md: 'text-xs px-2.5 py-1 font-medium',
  }[size];

  const variantStyles = {
    default: 'bg-slate-100 text-slate-700 border border-slate-200/80',
    neutral: 'bg-slate-50 text-slate-600 border border-slate-200/60',
    success: 'bg-emerald-50 text-emerald-700 border border-emerald-200/70',
    warning: 'bg-amber-50 text-amber-800 border border-amber-200/70',
    info: 'bg-blue-50 text-blue-700 border border-blue-200/70',
    teal: 'bg-[#E6F3F2] text-[#1E615E] border border-[#B9E0DD]',
    purple: 'bg-purple-50 text-purple-700 border border-purple-200/70',
  }[variant];

  const dotColors = {
    default: 'bg-slate-400',
    neutral: 'bg-slate-400',
    success: 'bg-emerald-500',
    warning: 'bg-amber-500',
    info: 'bg-blue-500',
    teal: 'bg-[#287C78]',
    purple: 'bg-purple-500',
  }[variant];

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-md ${sizeStyles} ${variantStyles} ${className}`}
      {...props}
    >
      {dot && <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${dotColors}`} />}
      <span>{children}</span>
    </span>
  );
};

