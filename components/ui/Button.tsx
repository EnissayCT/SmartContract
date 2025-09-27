
import React, { ReactNode } from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'accent' | 'outline';
  isLoading?: boolean;
  icon?: ReactNode;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  isLoading = false, 
  icon,
  className = '',
  ...props 
}) => {
  const baseStyles = 'inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 transition-transform transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100';

  const variantStyles = {
    primary: 'bg-primary text-white hover:bg-primary-light focus:ring-primary',
    secondary: 'bg-secondary text-white hover:bg-green-600 focus:ring-secondary',
    accent: 'bg-accent text-white hover:bg-red-700 focus:ring-accent',
    outline: 'bg-transparent text-primary border-primary hover:bg-primary hover:text-white',
  };

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? (
        <div className="w-5 h-5 border-2 border-t-2 border-current border-t-transparent rounded-full animate-spin"></div>
      ) : (
        <>
          {icon && <span className="mr-2 -ml-1">{icon}</span>}
          {children}
        </>
      )}
    </button>
  );
};

export default Button;
