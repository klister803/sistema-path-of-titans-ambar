import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface LogoProps {
  variant?: 'header' | 'regular';
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ variant = 'regular', className = '' }) => {
  const [showColoredLogo, setShowColoredLogo] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowColoredLogo(true), 1750);
    return () => clearTimeout(timer);
  }, [variant]);

  if (variant === 'header') {
    return (
      <div className={`flex flex-col items-center ${className}`}>
        <div className="relative w-[180px] h-[180px] mb-5">
          <AnimatePresence>
            <motion.img
              key="dark-logo"
              src="/images/logo-svg-escura.svg"
              alt="Planeta Âmbar Logo"
              className="absolute inset-0 w-full h-full"
              initial={{ opacity: 1, scale: 1 }}
              animate={{ opacity: showColoredLogo ? 0 : 1, scale: showColoredLogo ? 0.95 : 1 }}
              transition={{ duration: 1.75, ease: 'easeInOut', delay: 0 }}
            />
            <motion.img
              key="colored-logo"
              src="/images/logo-svg-colorida.svg"
              alt="Planeta Âmbar Logo Colorida"
              className="absolute inset-0 w-full h-full"
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: showColoredLogo ? 1 : 0, scale: 1 }}
              transition={{ duration: 1.75, ease: 'easeInOut', delay: 1.75 }}
            />
          </AnimatePresence>
        </div>
        <motion.h1 
          className="text-4xl font-bold text-gold-gradient"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 3.5 }}
        >
          Planeta Âmbar
        </motion.h1>
      </div>
    );
  }

  return (
    <div className={`flex items-center ${className}`}>
      <img
        src={`/src/svgs-custom/logo-svg-${showColoredLogo ? 'colorida' : 'escura'}.svg`}
        alt="Planeta Âmbar"
        className="w-[120px] h-[40px] object-contain transition-opacity duration-300"
      />
    </div>
  );
};
