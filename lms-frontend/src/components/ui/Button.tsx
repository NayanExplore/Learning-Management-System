import React from 'react';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'teal';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: React.ReactNode;
  iconRight?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      loading = false,
      disabled,
      className = '',
      icon,
      iconRight,
      type = 'button',
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-medium rounded-lg transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none';

    const sizeStyles = {
      sm: 'text-xs px-3 py-1.5 gap-1.5',
      md: 'text-sm px-4 py-2 gap-2',
      lg: 'text-base px-5 py-2.5 gap-2.5',
    }[size];

    const variantStyles = {
      primary:
        'bg-[#172B4D] hover:bg-[#0E1E38] text-white focus-visible:ring-[#172B4D] shadow-xs active:bg-[#0A1629]',
      secondary:
        'bg-slate-100 hover:bg-slate-200 text-slate-800 focus-visible:ring-slate-400 active:bg-slate-300',
      outline:
        'bg-white hover:bg-slate-50 text-slate-750 border border-[#E5E7EB] hover:border-slate-300 focus-visible:ring-slate-400 shadow-2xs text-slate-800',
      ghost:
        'bg-transparent hover:bg-slate-100 text-slate-700 hover:text-slate-900 focus-visible:ring-slate-400',
      danger:
        'bg-rose-600 hover:bg-rose-700 text-white focus-visible:ring-rose-500 shadow-xs active:bg-rose-800',
      teal:
        'bg-[#287C78] hover:bg-[#1E615E] text-white focus-visible:ring-[#287C78] shadow-xs active:bg-[#164947]',
    }[variant];

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled || loading}
        className={`${baseStyles} ${sizeStyles} ${variantStyles} ${className}`}
        {...props}
      >
        {loading ? (
          <Loader2 className="w-4 h-4 animate-spin shrink-0" />
        ) : icon ? (
          <span className="shrink-0">{icon}</span>
        ) : null}
        <span>{children}</span>
        {!loading && iconRight && <span className="shrink-0">{iconRight}</span>}
      </button>
    );
  }
);

Button.displayName = 'Button';

