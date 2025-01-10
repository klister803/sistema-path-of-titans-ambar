import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, User, Lock } from 'lucide-react';
import { registerSchema } from '../../lib/validations/auth';
import { supabase } from '../../lib/supabase';
import type { RegisterFormData } from '../../types/auth';
import { AuthInput } from './AuthInput';
import { FormError } from './FormError';
import { SubmitButton } from './SubmitButton';
import { BurningTransition } from '../effects/BurningTransition';
import { PasswordStrengthIndicator } from './password/PasswordStrengthIndicator';
import { PasswordGenerator } from './password/PasswordGenerator';

export const RegisterForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [isTransitioning, setIsTransitioning] = React.useState(false);

  const { register, handleSubmit, getValues, setValue, watch, formState: { errors } } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const password = watch('password', '');

  const handlePasswordGeneration = (generatedPassword: string) => {
    setValue('password', generatedPassword);
    setValue('confirmPassword', generatedPassword);
  };

  const handleTransitionComplete = () => {
    navigate('/verify-email', { 
      state: { email: getValues().email }
    });
  };

  const onSubmit = async (data: RegisterFormData) => {
    setLoading(true);
    setError(null);
    console.log('Starting registration process...');
    console.log('Iniciando processo de registro:', { ...data, password: '[REDACTED]' });

    try {
      console.log('Checking username availability...');
      console.log('Verificando disponibilidade do username...');
      const { data: existingUsers, error: queryError } = await supabase
        .from('users')
        .select('id')
        .eq('username', data.username);

      if (queryError) {
        console.error('Username check error:', queryError);
        console.error('Erro ao verificar username:', queryError);
        throw new Error('database_error');
      }

      if (existingUsers && existingUsers.length > 0) {
        console.log('Username already exists');
        console.log('Username já existe:', data.username);
        throw new Error('username_exists');
      }

      console.log('Creating auth user...');
      // Criar usuário no Auth
      console.log('Criando usuário no Auth...');
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            username: data.username,
            full_name: data.fullName,
            role: 'user'
          },
        },
      });

      if (signUpError) {
        console.error('Auth signup error:', signUpError);
        console.error('Erro no signup:', signUpError);
        if (signUpError.message.includes('Password should be')) {
          throw new Error('weak_password');
        }
        throw signUpError;
      }
      
      console.log('Usuário criado com sucesso:', { 
        id: authData.user?.id,
        email: authData.user?.email,
        username: data.username 
      });

      // Criar registro na tabela users
      console.log('Criando registro na tabela users...');
      console.log('Creating user profile...');
      const { error: insertError } = await supabase
        .from('users')
        .insert([
          {
            id: authData.user?.id,
            username: data.username,
            email: data.email,
            full_name: data.fullName,
            status: 'active',
            preferences: {},
            activity_log: []
          }
        ]);

      if (insertError) {
        console.error('Erro ao inserir usuário:', insertError);
        console.error('Profile creation error:', insertError);
        throw insertError;
      }

      console.log('Registration successful!');
      console.log('Registro concluído com sucesso!');
      setIsTransitioning(true);
    } catch (err) {
      console.error('Registration error:', err);
      console.error('Erro durante o registro:', err);
      if (err instanceof Error) {
        switch (err.message) {
          case 'username_exists':
            console.log('Erro: Username já em uso');
            setError('Este nome de usuário já está em uso');
            break;
          case 'weak_password':
            setError('A senha deve ter no mínimo 8 caracteres');
            break;
          case 'database_error':
            setError('Erro ao acessar o banco de dados. Tente novamente.');
            break;
          case 'User already registered':
            console.log('Erro: Email já registrado');
            setError('Este email já está registrado');
            break;
          default:
            console.log('Erro desconhecido:', err.message);
            setError('Ocorreu um erro ao criar sua conta. Tente novamente.');
        }
      }
    } finally {
      setLoading(false);
      console.log('Processo de registro finalizado');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-[rgb(var(--color-gold))] mb-1">
          Nome Completo
        </label>
        <AuthInput
          type="text"
          icon={<User size={20} />}
          placeholder="Seu nome completo"
          error={errors.fullName?.message}
          {...register('fullName')}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-[rgb(var(--color-gold))] mb-1">
          Nome de Usuário
        </label>
        <AuthInput
          type="text"
          icon={<User size={20} />}
          placeholder="seu_username"
          error={errors.username?.message}
          {...register('username')}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-[rgb(var(--color-gold))] mb-1">
          Email
        </label>
        <AuthInput
          type="email"
          icon={<Mail size={20} />}
          placeholder="seu@email.com"
          error={errors.email?.message}
          {...register('email')}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-[rgb(var(--color-gold))] mb-1">
          Senha
        </label>
        <AuthInput
          type="password"
          icon={<Lock size={20} />}
          placeholder="••••••••"
          error={errors.password?.message}
          {...register('password')}
        />
        <PasswordStrengthIndicator password={password} />
        <PasswordGenerator onSelect={handlePasswordGeneration} />
      </div>

      <div>
        <label className="block text-sm font-medium text-[rgb(var(--color-gold))] mb-1">
          Confirmar Senha
        </label>
        <AuthInput
          type="password"
          icon={<Lock size={20} />}
          placeholder="••••••••"
          error={errors.confirmPassword?.message}
          {...register('confirmPassword')}
        />
      </div>

      {error && <FormError message={error} />}

      <SubmitButton
        loading={loading}
        loadingText="Criando conta..."
        text="Criar Conta"
      />

      <p className="text-center text-[rgb(var(--color-gold))]">
        Já tem uma conta?{' '}
        <a href="/login" className="text-[rgb(var(--color-gold-light))] hover:underline">
          Entrar
        </a>
      </p>

      <BurningTransition
        isActive={isTransitioning}
        onComplete={handleTransitionComplete}
      />
    </form>
  );
};
