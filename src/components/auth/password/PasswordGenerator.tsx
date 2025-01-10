import React, { useState } from 'react';
import { Wand2, Copy, Check } from 'lucide-react';
import { generateStrongPassword } from '../../../lib/utils/passwordUtils';

interface PasswordGeneratorProps {
  onSelect: (password: string) => void;
}

export const PasswordGenerator: React.FC<PasswordGeneratorProps> = ({ onSelect }) => {
  const [generatedPassword, setGeneratedPassword] = useState<string>('');
  const [copied, setCopied] = useState(false);

  const handleGeneratePassword = () => {
    const newPassword = generateStrongPassword();
    setGeneratedPassword(newPassword);
    onSelect(newPassword);
  };

  const handleCopyPassword = async () => {
    await navigator.clipboard.writeText(generatedPassword);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-3">
      <button
        type="button"
        onClick={handleGeneratePassword}
        className="flex items-center gap-2 text-[rgb(var(--color-gold))] hover:text-[rgb(var(--color-gold-light))] transition-colors"
      >
        <Wand2 size={16} />
        <span>Gerar Senha Forte</span>
      </button>

      {generatedPassword && (
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={generatedPassword}
            readOnly
            className="flex-1 bg-[rgba(var(--color-obsidian),0.5)] border border-[rgba(var(--color-gold),0.3)] rounded-lg py-2 px-4 text-white"
          />
          <button
            type="button"
            onClick={handleCopyPassword}
            className="p-2 text-[rgb(var(--color-gold))] hover:text-[rgb(var(--color-gold-light))] transition-colors"
          >
            {copied ? <Check size={20} /> : <Copy size={20} />}
          </button>
        </div>
      )}
    </div>
  );
};
