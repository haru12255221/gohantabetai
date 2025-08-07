import React from 'react';

interface CardProps {
  variant: 'swipe' | 'list';
  children: React.ReactNode;
  className?: string;
  onClick?: (shopId: string) => void;
  shopId?: string;
}

const Card: React.FC<CardProps> = ({ variant, children, className = '' }) => {
  const baseClasses = 'bg-white rounded-2xl overflow-hidden transition-all duration-300';
  
  const variantClasses = {
    swipe: 'w-75 h-96 shadow-xl hover:shadow-card-hover hover:-translate-y-1',
    list: 'shadow-card p-4 mb-4 hover:shadow-card-hover hover:-translate-y-0.5',
  };

  return (
    <div className={`${baseClasses} ${variantClasses[variant]} ${className}`}>
      {children}
    </div>
  );
};

export default Card;
