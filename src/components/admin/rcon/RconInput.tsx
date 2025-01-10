import React, { KeyboardEvent } from 'react';
import { Send, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

interface RconInputProps {
  value: string;
  onChange: (value: string) => void;
  onExecute: () => void;
  error: string | null;
}

export const RconInput: React.FC<RconInputProps> = ({
  value,
  onChange,
  onExecute,
  error
}) => {
  const handleKeyPress = (e: KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onExecute();
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Digite um comando RCON..."
          className="flex-1 bg-[rgba(var(--color-obsidian),0.5)]
                   border border-[rgba(var(--color-gold),0.3)]
                   rounded-lg py-2 px-4 text-[rgb(var(--color-gold))]
                   placeholder-[rgba(var(--color-gold),0.5)]
                   focus:outline-none focus:border-[rgb(var(--color-gold))]"
        />
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onExecute}
          className="px-4 py-2 bg-[rgb(var(--color-gold))]
                   text-[rgb(var(--color-obsidian))] rounded-lg
                   flex items-center gap-2 font-medium
                   hover:bg-[rgb(var(--color-gold-light))]
                   transition-colors"
        >
          <Send size={20} />
          Enviar
        </motion.button>
      </div>

      {error && (
        <div className="flex items-center gap-2 text-red-500 text-sm">
          <AlertCircle size={16} />
          {error}
        </div>
      )}
    </div>
  );
};
