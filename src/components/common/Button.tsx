import React from 'react';
import { Link } from 'react-router-dom';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'text';
  size?: 'sm' | 'md' | 'lg';
  as?: typeof Link;
  to?: string;
  children: React.ReactNode;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  as: Component = 'button',
  className = '',
  children,
  ...props
}) => {
  const baseStyles = `
    inline-flex items-center justify-center
    font-medium transition-all duration-200
    focus:outline-none focus:ring-2 focus:ring-offset-2
    disabled:opacity-50 disabled:cursor-not-allowed
  `;

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm rounded-md',
    md: 'px-4 py-2 text-sm rounded-md',
    lg: 'px-6 py-3 text-base rounded-lg'
  };

  const variantStyles = {
    primary: `
      bg-primary-600 text-white
      hover:bg-primary-700
      focus:ring-primary-500
      shadow-sm
    `,
    secondary: `
      bg-white text-gray-700
      hover:bg-gray-50
      focus:ring-primary-500
      border border-gray-300
      shadow-sm
    `,
    text: `
      text-primary-600
      hover:text-primary-700
      focus:ring-primary-500
      hover:bg-primary-50
      rounded-md
    `
  };

  const combinedClassName = `
    ${baseStyles}
    ${sizeStyles[size]}
    ${variantStyles[variant]}
    ${className}
  `.trim();

  if (Component === Link) {
    return (
      <Link
        {...(props as any)}
        className={combinedClassName}
      >
        {children}
      </Link>
    );
  }

  return (
    <button
      {...props}
      className={combinedClassName}
    >
      {children}
    </button>
  );
};

export default Button; 