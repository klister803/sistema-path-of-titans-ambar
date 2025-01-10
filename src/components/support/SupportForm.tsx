import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { AuthInput } from '../auth/AuthInput';
import { FormError } from '../auth/FormError';

const supportSchema = z.object({
  name: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres'),
  email: z.string().email('Email inválido'),
  subject: z.string().min(5, 'Assunto deve ter pelo menos 5 caracteres'),
  message: z.string().min(20, 'Mensagem deve ter pelo menos 20 caracteres'),
});

type SupportFormData = z.infer<typeof supportSchema>;

export const SupportForm = () => {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<SupportFormData>({
    resolver: zodResolver(supportSchema),
  });

  const onSubmit = async (data: SupportFormData) => {
    // Implement form submission logic
    console.log('Form data:', data);
    await new Promise(resolve => setTimeout(resolve, 1000));
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-[rgb(var(--color-gold))] mb-1">
          Nome
        </label>
        <AuthInput
          type="text"
          error={errors.name?.message}
          {...register('name')}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-[rgb(var(--color-gold))] mb-1">
          Email
        </label>
        <AuthInput
          type="email"
          error={errors.email?.message}
          {...register('email')}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-[rgb(var(--color-gold))] mb-1">
          Assunto
        </label>
        <AuthInput
          type="text"
          error={errors.subject?.message}
          {...register('subject')}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-[rgb(var(--color-gold))] mb-1">
          Mensagem
        </label>
        <textarea
          {...register('message')}
          className="w-full bg-[rgba(var(--color-obsidian),0.5)]
                   border border-[rgba(var(--color-gold),0.3)]
                   rounded-lg py-2 px-4 min-h-[120px]
                   text-white placeholder-gray-400
                   focus:outline-none focus:border-[rgb(var(--color-gold))]"
        />
        {errors.message && <FormError message={errors.message.message} />}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-[rgb(var(--color-gold))] text-[rgb(var(--color-obsidian))]
                 py-2 px-4 rounded-lg font-medium
                 hover:bg-[rgb(var(--color-gold-light))]
                 disabled:opacity-50 disabled:cursor-not-allowed
                 transition-colors"
      >
        {isSubmitting ? 'Enviando...' : 'Enviar Mensagem'}
      </button>
    </form>
  );
};
