import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { Card } from '../ui/Card';
import { GalleryUploadModal } from './GalleryUploadModal';
import { GalleryItem } from './GalleryItem';

interface GalleryItem {
  id: string;
  imageUrl: string;
  description?: string;
}

export const Gallery = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([
    {
      id: '1',
      imageUrl: 'https://images.unsplash.com/photo-1589756033371-c2e57f7f7b53',
      description: 'Minha primeira captura de tela',
    },
    {
      id: '2',
      imageUrl: 'https://images.unsplash.com/photo-1589756033371-c2e57f7f7b53',
      description: 'Uma vista incrível do jogo',
    },
    {
      id: '3',
      imageUrl: 'https://images.unsplash.com/photo-1589756033371-c2e57f7f7b53',
      description: 'Meu dinossauro favorito',
    },
  ]);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleUploadSuccess = (newImage: GalleryItem) => {
    setGalleryItems(prevItems => [...prevItems, newImage]);
    setIsModalOpen(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-[rgba(var(--color-obsidian),0.8)] border border-[rgba(var(--color-gold),0.2)] rounded-lg p-6"
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-[rgb(var(--color-gold))]">
          Galeria
        </h2>
        <button
          onClick={handleOpenModal}
          className="flex items-center gap-2 text-[rgb(var(--color-gold))] hover:text-[rgb(var(--color-gold-light))] transition-colors"
        >
          <Plus size={20} />
          Adicionar
        </button>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {galleryItems.map((item) => (
          <GalleryItem key={item.id} item={item} />
        ))}
      </div>
      {isModalOpen && <GalleryUploadModal onClose={handleCloseModal} onSuccess={handleUploadSuccess} />}
    </motion.div>
  );
};
