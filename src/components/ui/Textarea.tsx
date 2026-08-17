import React, { forwardRef } from 'react';
import { clsx } from 'clsx';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  requiredAsterisk?: boolean;
  helperText?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, requiredAsterisk, helperText, className, id, rows = 3, ...props }, ref) => {
    const textareaId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label htmlFor={textareaId} className="block text-[11px] font-bold uppercase tracking-wider text-slate-700">
            {label} {requiredAsterisk && <span className="text-rose-600 font-bold">*</span>}
          </label>
        )}
        <textarea
          id={textareaId}
          ref={ref}
          rows={rows}
          className={clsx(
            'block w-full rounded-xl border text-sm transition-all duration-200 p-3.5 text-slate-900 bg-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-offset-slate-50',
            error
              ? 'border-rose-400 text-rose-900 focus:border-rose-600 focus:ring-rose-500/20'
              : 'border-slate-300 focus:border-indigo-600 focus:ring-indigo-500/20 hover:border-slate-400',
            className
          )}
          aria-invalid={!!error}
          aria-describedby={error ? `${textareaId}-error` : undefined}
          {...props}
        />
        {error ? (
          <p id={`${textareaId}-error`} className="text-xs font-medium text-rose-600 flex items-center gap-1 mt-1">
            <span>⚠️</span> {error}
          </p>
        ) : helperText ? (
          <p className="text-xs text-slate-500 mt-1">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';
