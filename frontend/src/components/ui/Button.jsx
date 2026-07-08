import React from 'react';

const Button = ({
  children,
  variant = 'primary',
  className = '',
  isLoading = false,
  disabled = false,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-sans font-semibold rounded-xl transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

  const variantStyles = {
    primary: 'bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white shadow-[0_2px_8px_rgba(229,90,40,0.25)] hover:shadow-[0_4px_16px_rgba(229,90,40,0.35)] hover:-translate-y-px active:translate-y-0',
    secondary: 'bg-[var(--color-bg)] hover:bg-[var(--color-border-light)] text-[var(--color-primary)] border border-[var(--color-border)]',
    ghost: 'bg-transparent hover:bg-[var(--color-bg)] text-[var(--color-text-secondary)] hover:text-[var(--color-primary)]',
    danger: 'bg-red-500 hover:bg-red-600 text-white shadow-md',
    icon: 'p-2 rounded-full hover:bg-[var(--color-bg)] text-[var(--color-text-secondary)]',
  };

  const selectedStyle = variantStyles[variant] || variantStyles.primary;

  return (
    <button
      className={`${baseStyles} ${selectedStyle} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      )}
      {children}
    </button>
  );
};

export default Button;
