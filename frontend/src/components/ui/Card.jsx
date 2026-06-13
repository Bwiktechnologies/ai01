import React from 'react';

const Card = ({ children, className = '', hoverable = false, ...props }) => {
  return (
    <div
      className={`bg-[var(--color-card)] border border-[var(--color-border)] rounded-[20px] p-6 shadow-card transition-all duration-200 ${
        hoverable ? 'cursor-pointer hover:shadow-card-hover hover:-translate-y-[2px]' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
