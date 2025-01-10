import React, { useState } from 'react';
import { X, Upload } from 'lucide-react';
import { GoldButton } from '../ui/GoldButton';
import { AuthInput } from '../auth/AuthInput';

interface GalleryUploadModalProps {
  onClose: () => void;
  onSuccess: (newImage: { id: string; imageUrl: string; description?: string }) => void;
}

export const GalleryUploadModal: React.FC<GalleryUploadModalProps> = ({ onClose, onSuccess }) => {
  const [imageUrl, setImageUrl] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    setLoading(true);
    // Simulate upload
    await new Promise(resolve => setTimeout(resolve, 1000));
    const newImage = {
      id: Math.random().toString(36).substring(2, 15),
      imageUrl,
      description
    };
    onSuccess(newImage);
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-[rgb(var(--color-obsidian))] border border-[rgba(var(--color-gold),0.3)] p-6 rounded-lg max-w-md mx-4 relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-[rgb(var(--color-gold))] hover:text-[rgb(var(--color-gold-light))]"
        >
          <X size={20} />
        </button>
        <h2 className="text-2xl font-bold text-[rgb(var(--color-gold))] mb-6">
          Adicionar à Galeria
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[rgb(var(--color-gold))] mb-1">
              URL da Imagem
            </label>
            <AuthInput
              type="text"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="URL da imagem"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[rgb(var(--color-gold))] mb-1">
              Descrição
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-[rgba(var(--color-obsidian),0.5)] border border-[rgba(var(--color-gold),0.3)] rounded-lg py-2 px-4 text-white placeholder-gray-400 focus:outline-none focus:border-[rgb(var(--color-gold))]"
              placeholder="Descrição da imagem"
            />
          </div>

          <GoldButton
            onClick={handleUpload}
            loading={loading}
            loadingText="Enviando..."
            text="Adicionar à Galeria"
          >
            <Upload size={20} />
          </GoldButton>
        </div>
      </div>
    </div>
  );
};
