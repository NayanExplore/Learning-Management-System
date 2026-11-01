import React, { useState } from 'react';
import { Lock, Eye, EyeOff } from 'lucide-react';

export interface PasswordInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ label, error, helperText, className = '', id, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
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
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
            <Lock className="w-4 h-4" />
          </div>

          <input
            id={inputId}
            ref={ref}
            type={showPassword ? 'text' : 'password'}
            className={`w-full rounded-lg bg-white dark:bg-slate-900 border ${
              error
                ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-500/20'
                : 'border-[#E5E7EB] dark:border-slate-700 focus:border-[#172B4D] dark:focus:border-[#287C78] focus:ring-[#172B4D]/15 dark:focus:ring-[#287C78]/25'
            } text-sm text-[#20252B] dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 pl-9 pr-10 py-2 transition-colors duration-150 focus:outline-none focus:ring-2 disabled:bg-slate-50 dark:disabled:bg-slate-800 disabled:text-slate-500 disabled:cursor-not-allowed ${className}`}
            {...props}
          />

          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            tabIndex={-1}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 focus:outline-none transition-colors"
            title={showPassword ? 'Hide password' : 'Show password'}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? (
              <EyeOff className="w-4 h-4 transition-transform hover:scale-110" />
            ) : (
              <Eye className="w-4 h-4 transition-transform hover:scale-110" />
            )}
          </button>
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

PasswordInput.displayName = 'PasswordInput';

