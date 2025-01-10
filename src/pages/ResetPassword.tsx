import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { resetPasswordSchema } from '../lib/validations/auth';
import { AuthLayout } from '../components/auth/AuthLayout';
import { AuthInput } from '../components/auth/AuthInput';
import { FormError } from '../components/auth/FormError';
import { SubmitButton } from '../components/auth/SubmitButton';
import { useAuthStore } from '../stores/authStore';

interface ResetPasswordForm {
  email: string;
}

export const ResetPassword = () => {
  const navigate = useNavigate();
  const resetPassword = useAuthStore(state => state.resetPassword);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<ResetPasswordForm>({
    resolver: zodResolver(resetPasswordSchema)
  });

  const onSubmit = async (data: ResetPasswordForm) => {
    setLoading(true);
    setError(null);

    try {
      await resetPassword(data.email);
      setSuccess(true);
    } catch (err) {
      setError('Erro ao enviar email de recuperação');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <AuthLayout title="Email Enviado">
        <div className="text-center">
          <p className="text-[rgb(var(--color-gold))] mb-4">
            Enviamos instruções de recuperação de senha para seu email.
          </p>
          <button
            onClick={() => navigate('/login')}
            className="text-[rgb(var(--color-gold-light))] hover:underline"
          >
            Voltar para login
          </button>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout title="Recuperar Senha">
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

        {error && <FormError message={error} />}

        <SubmitButton
          loading={loading}
          loadingText="Enviando..."
          text="Enviar Email de Recuperação"
        />

        <p className="text-center text-[rgb(var(--color-gold))]">
          Lembrou sua senha?{' '}
          <a href="/login" className="text-[rgb(var(--color-gold-light))] hover:underline">
            Voltar para login
          </a>
        </p>
      </form>
    </AuthLayout>
  );
};
