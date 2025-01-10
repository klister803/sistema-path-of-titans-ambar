import React from 'react';
import { motion } from 'framer-motion';
import { Play, UserPlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Logo } from '../brand/Logo';
import { ImageContainer } from '../brand/ImageContainer';

export const Hero = () => {
  const navigate = useNavigate();

  const handleCreateAccount = () => {
    navigate('/register');
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 py-20">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1601575927655-c3d27b5c00bc')] bg-cover bg-center bg-no-repeat opacity-20" />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 text-center"
      >
        <Logo variant="header" className="mb-6" />
        <p className="text-xl md:text-2xl text-green-50 mb-12 max-w-2xl mx-auto">
          Explore um mundo pré-histórico repleto de mistérios, criaturas ancestrais e aventuras épicas.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center justify-center gap-2 bg-amber-500 text-amber-950 px-8 py-4 rounded-lg font-bold text-lg hover:bg-amber-400 transition-colors"
          >
            <Play size={24} />
            Jogar Agora
          </motion.button>
          
          <motion.button
            onClick={handleCreateAccount}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center justify-center gap-2 bg-green-700 text-green-50 px-8 py-4 rounded-lg font-bold text-lg hover:bg-green-600 transition-colors"
          >
            <UserPlus size={24} />
            Criar Conta
          </motion.button>
        </div>
      </motion.div>
    </section>
  );
};
