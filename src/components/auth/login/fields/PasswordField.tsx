import React from 'react';
import { Lock } from 'lucide-react';
import { AuthInput } from '../../AuthInput';
import { UseFormRegister } from 'react-hook-form';
import { LoginFormData } from '../../../../types/auth';

interface PasswordFieldProps {
  register: UseFormRegister<LoginFormData>;
  error?: string;
}

export const PasswordField: React.FC<PasswordFieldProps> = ({ register, error }) => {
  return (
    <div>
      <label className="block text-sm font-medium text-[rgb(var(--color-gold))] mb-1">
        Senha
      </label>
      <AuthInput
        type="password"
        icon={<Lock size={20} />}
        placeholder="••••••••"
        error={error}
        {...register('password')}
      />
    </div>
  );
};
