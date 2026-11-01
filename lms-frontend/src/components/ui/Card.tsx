import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
}

export const Card: React.FC<CardProps> = ({ children, hover = false, className = '', ...props }) => {
  return (
    <div
      className={`bg-white rounded-xl border border-[#E5E7EB] shadow-xs ${
        hover ? 'hover:border-slate-300 hover:shadow-sm transition-all duration-150' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

