import React from 'react';
import { clsx } from 'clsx';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'blue' | 'slate' | 'emerald' | 'amber' | 'red' | 'indigo';
  size?: 'sm' | 'md';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'indigo', size = 'md', className }) => {
  const variants = {
    indigo: 'bg-indigo-50 text-indigo-700 border-indigo-200 shadow-xs font-bold',
    blue: 'bg-blue-50 text-blue-700 border-blue-200 shadow-xs font-bold',
    slate: 'bg-slate-100 text-slate-700 border-slate-200 shadow-xs font-medium',
    emerald: 'bg-emerald-50 text-emerald-700 border-emerald-200 shadow-xs font-bold',
    amber: 'bg-amber-50 text-amber-800 border-amber-200 shadow-xs font-bold',
    red: 'bg-rose-50 text-rose-700 border-rose-200 shadow-xs font-bold',
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-[10px]',
    md: 'px-2.5 py-1 text-xs font-semibold',
  };

  return (
    <span className={clsx('inline-flex items-center rounded-lg border font-mono tracking-tight transition-all', variants[variant], sizes[size], className)}>
      {children}
    </span>
  );
};
