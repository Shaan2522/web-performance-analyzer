import React from 'react';

function Button({ children, onClick, variant = 'primary', className = '', ...props }) {
  const baseStyle = "px-4 py-2 rounded-md font-semibold transition-colors duration-200 ease-in-out";
  let variantStyle = '';

  switch (variant) {
    case 'primary':
      variantStyle = "bg-blue-500 text-white hover:bg-blue-600";
      break;
    case 'secondary':
      variantStyle = "bg-gray-200 text-gray-800 hover:bg-gray-300";
      break;
    case 'danger':
      variantStyle = "bg-red-500 text-white hover:bg-red-600";
      break;
    case 'outline':
      variantStyle = "bg-transparent border border-blue-500 text-blue-500 hover:bg-blue-50 hover:text-blue-600";
      break;
    default:
      variantStyle = "bg-blue-500 text-white hover:bg-blue-600";
  }

  return (
    <button
      className={`${baseStyle} ${variantStyle} ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;
