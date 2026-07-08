import React from 'react';

const Input = ({
  label,
  error,
  icon: Icon,
  className = '',
  ...props
}) => {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && <label className="form-label">{label}</label>}
      <div className={Icon ? 'form-input-icon-wrap' : ''}>
        {Icon && <Icon className="input-icon w-[18px] h-[18px]" />}
        <input
          className={`form-input ${error ? 'border-red-400 focus:border-red-400 focus:shadow-[0_0_0_3px_rgba(239,68,68,0.1)]' : ''}`}
          {...props}
        />
      </div>
      {error && <p className="text-xs text-red-500 font-sans mt-0.5">{error}</p>}
    </div>
  );
};

export default Input;
