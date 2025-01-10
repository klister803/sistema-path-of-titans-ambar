import React, { useState } from 'react';
import { useAuthStore } from '../../stores/authStore';
import { X } from 'lucide-react';
import { AuthInput } from '../auth/AuthInput';
import { GoldButton } from '../ui/GoldButton';

interface ProfileEditorProps {
  onClose: () => void;
}

export const ProfileEditor: React.FC<ProfileEditorProps> = ({ onClose }) => {
  const user = useAuthStore(state => state.user);
  const updateProfile = useAuthStore(state => state.updateProfile);
  const [loading, setLoading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState(user?.avatar_url || '');
  const [gender, setGender] = useState(user?.gender || '');
  const [favoriteDinosaur, setFavoriteDinosaur] = useState(user?.favorite_dinosaur || '');
  const [discordLinks, setDiscordLinks] = useState(user?.discord_links || {});

  const handleSave = async () => {
    setLoading(true);
    try {
      await updateProfile({
        avatarUrl,
        gender,
        favoriteDinosaur,
        discordLinks
      });
      onClose();
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddDiscordLink = () => {
    const newKey = `link${Object.keys(discordLinks).length + 1}`;
    setDiscordLinks({ ...discordLinks, [newKey]: '' });
  };

  const handleRemoveDiscordLink = (key: string) => {
    const { [key]: removed, ...rest } = discordLinks;
    setDiscordLinks(rest);
  };

  const handleDiscordLinkChange = (key: string, value: string) => {
    setDiscordLinks({ ...discordLinks, [key]: value });
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
          Editar Perfil
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[rgb(var(--color-gold))] mb-1">
              URL do Avatar
            </label>
            <AuthInput
              type="text"
              value={avatarUrl}
              onChange={(e) => setAvatarUrl(e.target.value)}
              placeholder="URL da imagem do seu avatar"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[rgb(var(--color-gold))] mb-1">
              Gênero
            </label>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="w-full bg-[rgba(var(--color-obsidian),0.5)] border border-[rgba(var(--color-gold),0.3)] rounded-lg py-2 px-4 text-white focus:outline-none focus:border-[rgb(var(--color-gold))]"
            >
              <option value="">Selecione</option>
              <option value="masculino">Masculino</option>
              <option value="feminino">Feminino</option>
              <option value="nao_binario">Não-Binário</option>
              <option value="outro">Outro</option>
              <option value="prefiro_nao_dizer">Prefiro não dizer</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-[rgb(var(--color-gold))] mb-1">
              Dinossauro Favorito
            </label>
            <AuthInput
              type="text"
              value={favoriteDinosaur}
              onChange={(e) => setFavoriteDinosaur(e.target.value)}
              placeholder="Seu dinossauro favorito"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[rgb(var(--color-gold))] mb-1">
              Links do Discord
            </label>
            {Object.entries(discordLinks).map(([key, value]) => (
              <div key={key} className="flex items-center gap-2 mb-2">
                <AuthInput
                  type="text"
                  value={value as string}
                  onChange={(e) => handleDiscordLinkChange(key, e.target.value)}
                  placeholder="Link do Discord"
                  className="flex-1"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveDiscordLink(key)}
                  className="text-red-500 hover:text-red-400 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={handleAddDiscordLink}
              className="text-[rgb(var(--color-gold))] hover:text-[rgb(var(--color-gold-light))] transition-colors"
            >
              Adicionar Link
            </button>
          </div>

          <GoldButton
            onClick={handleSave}
            loading={loading}
            loadingText="Salvando..."
            text="Salvar Alterações"
          />
        </div>
      </div>
    </div>
  );
};
