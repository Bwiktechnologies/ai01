import React, { forwardRef } from 'react';
import { AlertCircle } from 'lucide-react';

const Input = forwardRef(({
  label,
  error,
  type = 'text',
  className = '',
  icon: Icon,
  ...props
}, ref) => {
  return (
    <div className={`w-full flex flex-col gap-1.5 ${className}`}>
      {label && <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">{label}</label>}
      <div className="relative">
        <input
          ref={ref}
          type={type}
          className={`w-full h-12 px-4 rounded-xl border bg-gray-50/50 dark:bg-gray-800/50 text-gray-900 dark:text-gray-100 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-[var(--color-accent)]/20 ${
            error 
              ? 'border-red-400 focus:border-red-500 bg-red-50/20' 
              : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 focus:border-[var(--color-accent)] dark:focus:border-[var(--color-accent)]'
          } ${Icon ? 'pr-11' : ''}`}
          {...props}
        />
        {Icon && (
          <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-gray-400">
            <Icon className="h-5 w-5" />
          </div>
        )}
      </div>
      {error && (
        <p className="flex items-center gap-1.5 text-xs font-medium text-red-500 mt-1">
          <AlertCircle className="w-3.5 h-3.5" />
          {error}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
