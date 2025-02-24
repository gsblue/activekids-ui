import React from 'react';
import JoeyLogo from '../../assets/joey-logo.png';

interface LogoProps {
  size?: 'small' | 'medium' | 'large';
}

const Logo: React.FC<LogoProps> = ({ size = 'medium' }) => {
  const sizeClasses = {
    small: 'h-8',
    medium: 'h-10',
    large: 'h-12',
  };

  return (
    <div className="flex items-center space-x-2">
      <img 
        src={JoeyLogo} 
        alt="Good Joeys Logo" 
        className={`${sizeClasses[size]} w-auto`}
      />
      <span className={`font-bold ${size === 'large' ? 'text-3xl' : 'text-2xl'} text-primary-600`}>
        Good Joeys
      </span>
    </div>
  );
};

export default Logo; 