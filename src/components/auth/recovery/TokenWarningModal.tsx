import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface TokenWarningModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const TokenWarningModal: React.FC<TokenWarningModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-[rgb(var(--color-obsidian))] border border-[rgba(var(--color-gold),0.3)] p-6 rounded-lg max-w-md mx-4">
        <div className="flex items-center gap-3 mb-4">
          <AlertTriangle className="text-amber-500" size={24} />
          <h3 className="text-xl font-bold text-[rgb(var(--color-gold))]">
            Atenção!
          </h3>
        </div>

        <p className="text-white mb-4">
          Um arquivo contendo seu token de recuperação será baixado automaticamente.
          Este token é a ÚNICA forma de recuperar sua conta se você perder sua senha.
        </p>

        <ul className="list-disc list-inside text-white space-y-2 mb-6">
          <li>Guarde o arquivo em local seguro</li>
          <li>Faça backup do arquivo</li>
          <li>Nunca compartilhe o token com ninguém</li>
          <li>Sem o token, não será possível recuperar sua conta</li>
        </ul>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-[rgb(var(--color-gold))] hover:text-[rgb(var(--color-gold-light))]"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600"
          >
            Entendi e quero continuar
          </button>
        </div>
      </div>
    </div>
  );
};
