import React from 'react';

const Input = ({ 
  label, 
  type = 'text', 
  placeholder,
  value,
  onChange,
  error,
  required = false,
  disabled = false,
  name,
  ...props 
}) => {
  return (
    <div className="mb-4">
      {label && (
        <label className="block text-sm font-semibold text-gray-300 mb-2">
          {label}
          {required && <span className="text-red-400 ml-1">*</span>}
        </label>
      )}
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        className={`
          w-full px-4 py-3 border rounded-lg 
          bg-gray-700 text-gray-100 placeholder-gray-500
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
          disabled:bg-gray-800 disabled:cursor-not-allowed
          ${error ? 'border-red-500' : 'border-gray-600'}
        `}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-400">{error}</p>
      )}
    </div>
  );
};

export default Input;