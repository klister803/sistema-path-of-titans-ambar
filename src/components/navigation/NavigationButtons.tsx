import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Gamepad } from 'lucide-react';
import { BurningTransition } from '../effects/BurningTransition';

export const NavigationButtons = () => {
  const navigate = useNavigate();
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleLoginClick = () => {
    setIsTransitioning(true);
  };

  const handleTransitionComplete = () => {
    navigate('/login');
  };

  return (
    <div className="flex items-center gap-4">
      <motion.button
        onClick={handleLoginClick}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="
          bg-gradient-to-r from-[rgb(var(--color-gold-light))] to-[rgb(var(--color-gold))]
          text-[rgb(var(--color-obsidian))]
          px-6 py-2 rounded-lg font-semibold
          hover:shadow-[0_0_15px_rgba(var(--color-gold-light),0.5)]
          transition-shadow duration-300
        "
      >
        Entrar
      </motion.button>

      <motion.a
        href="https://discord.gg/6RbJhq9DWg"
        target="_blank"
        rel="noopener noreferrer"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="
          flex items-center gap-2
          bg-[#5865F2] text-white
          px-6 py-2 rounded-lg font-semibold
          hover:bg-[#4752C4]
          transition-colors duration-300
        "
      >
        <Gamepad size={20} />
        Jogar
      </motion.a>

      <BurningTransition
        isActive={isTransitioning}
        onComplete={handleTransitionComplete}
      />
    </div>
  );
};
