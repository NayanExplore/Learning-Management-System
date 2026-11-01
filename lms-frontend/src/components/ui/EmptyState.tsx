import React from 'react';
import { Button } from './Button';

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  actionHref?: string;
  secondaryActionLabel?: string;
  onSecondaryAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  actionHref,
  secondaryActionLabel,
  onSecondaryAction,
  className = '',
}) => {
  return (
    <div className={`p-8 sm:p-12 text-center rounded-xl border border-dashed border-[#E5E7EB] bg-slate-50/50 ${className}`}>
      {icon && (
        <div className="w-12 h-12 mx-auto mb-3.5 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
          {icon}
        </div>
      )}
      <h3 className="text-base font-semibold text-[#20252B] mb-1.5">{title}</h3>
      <p className="text-sm text-[#697386] max-w-md mx-auto mb-6 leading-relaxed">{description}</p>
      {(actionLabel || secondaryActionLabel) && (
        <div className="flex flex-wrap items-center justify-center gap-3">
          {actionHref && actionLabel ? (
            <a
              href={actionHref}
              className="inline-flex items-center justify-center font-medium rounded-lg text-sm px-4 py-2 bg-[#172B4D] hover:bg-[#0E1E38] text-white shadow-xs transition-colors"
            >
              {actionLabel}
            </a>
          ) : actionLabel && onAction ? (
            <Button variant="primary" onClick={onAction}>
              {actionLabel}
            </Button>
          ) : null}
          {secondaryActionLabel && onSecondaryAction && (
            <Button variant="outline" onClick={onSecondaryAction}>
              {secondaryActionLabel}
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

