import React from 'react';
import { motion } from 'framer-motion';
import { Heart, MessageSquare, ThumbsDown, ThumbsUp } from 'lucide-react';

interface GalleryItemProps {
  item: {
    id: string;
    imageUrl: string;
    description?: string;
  };
}

export const GalleryItem: React.FC<GalleryItemProps> = ({ item }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="relative rounded-lg overflow-hidden group"
    >
      <img
        src={item.imageUrl}
        alt={item.description || 'Imagem da galeria'}
        className="w-full h-48 object-cover object-center transition-transform duration-300 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-amber-950/80 via-transparent to-transparent pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button className="text-[rgb(var(--color-gold))] hover:text-[rgb(var(--color-gold-light))] transition-colors">
            <ThumbsUp size={20} />
          </button>
          <button className="text-[rgb(var(--color-gold))] hover:text-[rgb(var(--color-gold-light))] transition-colors">
            <ThumbsDown size={20} />
          </button>
          <button className="text-[rgb(var(--color-gold))] hover:text-[rgb(var(--color-gold-light))] transition-colors">
            <MessageSquare size={20} />
          </button>
        </div>
        <button className="text-[rgb(var(--color-gold))] hover:text-[rgb(var(--color-gold-light))] transition-colors">
          <Heart size={20} />
        </button>
      </div>
    </motion.div>
  );
};
