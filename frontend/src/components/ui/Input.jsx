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
    <div className={`w-full ${className}`}>
      {label && <label className="input-label">{label}</label>}
      <div className="relative">
        <input
          ref={ref}
          type={type}
          className={`input-field ${error ? 'input-error' : ''} ${Icon ? 'pr-10' : ''}`}
          {...props}
        />
        {Icon && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <Icon className="h-5 w-5 text-gray-400" />
          </div>
        )}
      </div>
      {error && (
        <p className="error-message">
          <AlertCircle className="w-3 h-3" />
          {error}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
