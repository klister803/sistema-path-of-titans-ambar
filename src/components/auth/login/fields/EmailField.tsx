import React from 'react';
import { Mail } from 'lucide-react';
import { AuthInput } from '../../AuthInput';
import { UseFormRegister } from 'react-hook-form';
import { LoginFormData } from '../../../../types/auth';

interface EmailFieldProps {
  register: UseFormRegister<LoginFormData>;
  error?: string;
}

export const EmailField: React.FC<EmailFieldProps> = ({ register, error }) => {
  return (
    <div>
      <label className="block text-sm font-medium text-[rgb(var(--color-gold))] mb-1">
        Email
      </label>
      <AuthInput
        type="email"
        icon={<Mail size={20} />}
        placeholder="seu@email.com"
        error={error}
        {...register('email')}
      />
    </div>
  );
};
