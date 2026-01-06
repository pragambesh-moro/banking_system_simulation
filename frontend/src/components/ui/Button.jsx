import React from 'react';

const Button = ({ 
  children, 
  variant = 'primary', 
  type = 'button',
  onClick,
  disabled = false,
  className = '',
  fullWidth = false,
}) => {
  const baseStyles = 'font-semibold py-3 px-6 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-primary hover:bg-primary-dark text-white shadow-md hover:shadow-lg',
    secondary: 'bg-white border-2 border-primary text-primary hover:bg-primary hover:text-white',
    outline: 'border-2 border-gray-300 text-gray-700 hover:border-primary hover:text-primary',
    danger: 'bg-danger hover:bg-red-600 text-white',
  };

  const widthClass = fullWidth ? 'w-full' : '';

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${widthClass} ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;