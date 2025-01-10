import React, { useState } from 'react';
import { useAuthStore } from '../../stores/authStore';
import { motion } from 'framer-motion';
import { User, Edit } from 'lucide-react';
import { ProfileEditor } from './ProfileEditor';

export const UserProfile = () => {
  const user = useAuthStore(state => state.user);
  const [isEditing, setIsEditing] = useState(false);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCloseModal = () => {
    setIsEditing(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-[rgba(var(--color-obsidian),0.8)] border border-[rgba(var(--color-gold),0.2)] rounded-lg p-6 relative"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-[rgba(var(--color-gold),0.2)] flex items-center justify-center overflow-hidden">
            {user?.avatar_url ? (
              <img src={user.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <User size={32} className="text-[rgb(var(--color-gold))]" />
            )}
          </div>
          <div>
            <h2 className="text-xl font-bold text-[rgb(var(--color-gold))]">
              {user?.username}
            </h2>
            <p className="text-[rgba(var(--color-gold),0.8)]">
              Nível: 32
            </p>
          </div>
        </div>
        <button
          onClick={handleEditClick}
          className="text-[rgb(var(--color-gold))] hover:text-[rgb(var(--color-gold-light))] transition-colors"
        >
          <Edit size={20} />
        </button>
      </div>
      <div className="text-[rgba(var(--color-gold),0.8)]">
        <p>Experiência: 12345 / 20000</p>
        <p>Guilda: Planeta Âmbar</p>
        {user?.gender && <p>Gênero: {user.gender}</p>}
        {user?.favorite_dinosaur && <p>Dinossauro Favorito: {user.favorite_dinosaur}</p>}
        {user?.discord_links && (
          <div className="mt-2">
            Discord:
            {Object.entries(user.discord_links).map(([key, value]) => (
              <p key={key}>
                {key}: <a href={value as string} target="_blank" rel="noopener noreferrer" className="text-[rgb(var(--color-gold-light))] hover:underline">{value}</a>
              </p>
            ))}
          </div>
        )}
      </div>
      {isEditing && <ProfileEditor onClose={handleCloseModal} />}
    </motion.div>
  );
};
