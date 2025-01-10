import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { AuthInput } from '../AuthInput';
import { FormError } from '../FormError';
import { SubmitButton } from '../SubmitButton';
import { supabase } from '../../../lib/supabase';
import { hashToken } from '../../../lib/utils/tokenUtils';

const tokenRecoverySchema = z.object({
  email: z.string().email('Email inválido'),
  token: z.string().min(64, 'Token inválido'),
});

type TokenRecoveryFormData = z.infer<typeof tokenRecoverySchema>;

export const TokenRecoveryForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors } } = useForm<TokenRecoveryFormData>({
    resolver: zodResolver(tokenRecoverySchema),
  });

  const onSubmit = async (data: TokenRecoveryFormData) => {
    setLoading(true);
    setError(null);

    try {
      const hashedToken = hashToken(data.token);
      
      const { data: user } = await supabase
        .from('users')
        .select('id')
        .eq('email', data.email)
        .single();

      if (!user) {
        throw new Error('Email não encontrado');
      }

      const { data: validToken } = await supabase.rpc(
        'validate_recovery_token',
        { 
          p_token_hash: hashedToken,
          p_user_id: user.id
        }
      );

      if (!validToken) {
        throw new Error('Token inválido ou expirado');
      }

      // Token válido, redirecionar para definição de nova senha
      navigate('/reset-password', {
        state: { 
          email: data.email,
          token: data.token
        }
      });
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Erro ao validar token');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-[rgb(var(--color-gold))] mb-1">
          Email
        </label>
        <AuthInput
          type="email"
          placeholder="seu@email.com"
          error={errors.email?.message}
          {...register('email')}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-[rgb(var(--color-gold))] mb-1">
          Token de Recuperação
        </label>
        <AuthInput
          type="text"
          placeholder="Cole seu token de recuperação aqui"
          error={errors.token?.message}
          {...register('token')}
        />
      </div>

      {error && <FormError message={error} />}

      <SubmitButton
        loading={loading}
        loadingText="Validando..."
        text="Validar Token"
      />
    </form>
  );
};
