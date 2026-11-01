import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, leftIcon, rightIcon, className = '', id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label htmlFor={inputId} className="block text-xs font-semibold text-[#20252B] dark:text-slate-200 tracking-normal">
            {label}
            {props.required && <span className="text-rose-500 ml-0.5">*</span>}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
              {leftIcon}
            </div>
          )}
          <input
            id={inputId}
            ref={ref}
            className={`w-full rounded-lg bg-white dark:bg-slate-800 border ${
              error
                ? 'border-rose-400 dark:border-rose-600 focus:border-rose-500 focus:ring-rose-500/20'
                : 'border-[#E5E7EB] dark:border-slate-700 focus:border-[#172B4D] dark:focus:border-teal-500 focus:ring-[#172B4D]/15 dark:focus:ring-teal-500/20'
            } text-sm text-[#20252B] dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 ${
              leftIcon ? 'pl-9' : 'pl-3.5'
            } ${
              rightIcon ? 'pr-9' : 'pr-3.5'
            } py-2 transition-colors duration-150 focus:outline-none focus:ring-2 disabled:bg-slate-50 dark:disabled:bg-slate-800/50 disabled:text-slate-500 disabled:cursor-not-allowed ${className}`}
            {...props}
          />
          {rightIcon && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 dark:text-slate-500">
              {rightIcon}
            </div>
          )}
        </div>
        {error ? (
          <p className="text-xs text-rose-600 dark:text-rose-400 font-medium">{error}</p>
        ) : helperText ? (
          <p className="text-xs text-[#697386] dark:text-slate-400">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = 'Input';

