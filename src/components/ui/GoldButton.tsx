import React from 'react';
import { motion } from 'framer-motion';

interface GoldButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

export const GoldButton: React.FC<GoldButtonProps> = ({ 
  children, 
  onClick,
  className = ''
}) => {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`
        relative overflow-hidden
        bg-gradient-to-r from-[rgb(var(--color-gold-light))] to-[rgb(var(--color-gold))]
        text-[rgb(var(--color-obsidian))]
        font-bold py-3 px-6 rounded-lg
        shadow-lg
        transition-all duration-300
        hover:shadow-[0_0_15px_rgba(var(--color-gold-light),0.5)]
        ${className}
      `}
      onClick={onClick}
    >
      <span className="relative z-10">{children}</span>
      <div className="absolute inset-0 bg-gradient-to-r from-[rgb(var(--color-gold))] to-[rgb(var(--color-gold-light))] opacity-0 hover:opacity-100 transition-opacity duration-300" />
    </motion.button>
  );
};
