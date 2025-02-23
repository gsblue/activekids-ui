import React from 'react';
import { theme } from '../../theme/theme';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  elevation?: 'sm' | 'md' | 'lg' | 'xl';
}

const Card: React.FC<CardProps> = ({
  children,
  className = '',
  elevation = 'md'
}) => {
  return (
    <div
      className={`
        bg-white rounded-lg ${theme.shadows[elevation]}
        p-6 transition-shadow duration-200
        ${className}
      `}
    >
      {children}
    </div>
  );
};

export default Card; 