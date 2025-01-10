import React from 'react';
import { UseFormRegister } from 'react-hook-form';
import { LoginFormData } from '../../../../types/auth';

interface RememberMeFieldProps {
  register: UseFormRegister<LoginFormData>;
}

export const RememberMeField: React.FC<RememberMeFieldProps> = ({ register }) => {
  return (
    <div className="flex items-center justify-between">
      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          {...register('rememberMe')}
          className="w-4 h-4 rounded border-[rgba(var(--color-gold),0.3)]
                   bg-[rgba(var(--color-obsidian),0.5)]
                   checked:bg-[rgb(var(--color-gold))]
                   checked:border-[rgb(var(--color-gold))]
                   focus:ring-[rgb(var(--color-gold))]"
        />
        <span className="text-sm text-[rgb(var(--color-gold))]">
          Lembrar-me
        </span>
      </label>
      
      <a href="/reset-password" className="text-sm text-[rgb(var(--color-gold))]
                            hover:text-[rgb(var(--color-gold-light))]
                            transition-colors">
        Esqueceu a senha?
      </a>
    </div>
  );
};
