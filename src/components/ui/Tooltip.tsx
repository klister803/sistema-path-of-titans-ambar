import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

interface TooltipProps {
  children: React.ReactNode;
  content: string;
}

export const Tooltip: React.FC<TooltipProps> = ({ children, content }) => {
  const [isVisible, setIsVisible] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    setIsVisible(true);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsVisible(false);
    }, 100);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (tooltipRef.current && !tooltipRef.current.contains(event.target as Node)) {
        setIsVisible(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div
      className="relative inline-block"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      ref={tooltipRef}
    >
      {children}
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.1 }}
          className="absolute z-50 bg-[rgba(var(--color-obsidian),0.9)] border border-[rgba(var(--color-gold),0.2)] rounded-lg p-2 text-sm text-[rgb(var(--color-gold))] whitespace-nowrap"
          style={{ top: '100%', left: '50%', transform: 'translateX(-50%)' }}
        >
          {content}
        </motion.div>
      )}
    </div>
  );
};
