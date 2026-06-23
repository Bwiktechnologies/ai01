import React from 'react';

const Button = ({
  children,
  variant = 'primary', // 'primary', 'secondary', 'ghost', 'danger', 'icon'
  className = '',
  isLoading = false,
  disabled = false,
  ...props
}) => {
  const baseStyles = "inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variantStyles = {
    primary: "bg-[var(--color-accent)] hover:bg-blue-600 text-white shadow-md hover:shadow-[0_8px_20px_rgba(59,130,246,0.3)] focus:ring-blue-500",
    secondary: "bg-gray-100 hover:bg-gray-200 text-gray-800 focus:ring-gray-300",
    ghost: "bg-transparent hover:bg-gray-100 text-gray-700 focus:ring-gray-300",
    danger: "bg-red-500 hover:bg-red-600 text-white shadow-md hover:shadow-lg focus:ring-red-500",
    icon: "p-2 rounded-full hover:bg-gray-100 focus:ring-gray-300",
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
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
      {children}
    </button>
  );
};

export default Button;
