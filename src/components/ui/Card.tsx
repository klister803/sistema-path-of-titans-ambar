import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ children, className = '' }) => {
  return (
    <div className={`
      bg-[rgba(var(--color-obsidian),0.8)]
      border border-[rgba(var(--color-gold),0.2)]
      rounded-lg
      backdrop-blur-sm
      ${className}
    `}>
      {children}
    </div>
  );
};
