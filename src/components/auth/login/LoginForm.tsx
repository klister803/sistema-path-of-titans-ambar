import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, Lock } from 'lucide-react';
import { LoginFormData } from '../../../types/auth';
import { loginSchema } from '../../../lib/validations/auth';
import { useAuthStore } from '../../../stores/authStore';
import { EmailField } from './fields/EmailField';
import { PasswordField } from './fields/PasswordField';
import { RememberMeField } from './fields/RememberMeField';
import { LoginActions } from './LoginActions';
import { LoginError } from './LoginError';

export const LoginForm = () => {
  const navigate = useNavigate();
  const login = useAuthStore(state => state.login);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema)
  });

  const onSubmit = async (data: LoginFormData) => {
    setLoading(true);
    setError(null);

    try {
      await login(data.email, data.password);
      navigate('/dashboard');
    } catch (err) {
      setError('Credenciais inválidas');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <EmailField register={register} error={errors.email?.message} />
      <PasswordField register={register} error={errors.password?.message} />
      <RememberMeField register={register} />
      {error && <LoginError message={error} />}
      <LoginActions loading={loading} />
    </form>
  );
};
