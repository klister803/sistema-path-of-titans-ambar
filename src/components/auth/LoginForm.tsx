import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { Mail, Lock, AlertCircle } from 'lucide-react';
import { loginSchema } from '../../lib/validations/auth';
import type { LoginFormData } from '../../types/auth';
import { GoldButton } from '../ui/GoldButton';

export const LoginForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setLoading(true);
    setError(null);

    try {
      // TODO: Implement actual login logic
      await new Promise(resolve => setTimeout(resolve, 1000));
      navigate('/dashboard');
    } catch (err) {
      setError('Ocorreu um erro ao fazer login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-[rgba(var(--color-obsidian),0.8)] backdrop-blur-md p-8 rounded-lg border border-[rgba(var(--color-gold),0.3)]"
    >
      <h1 className="text-3xl font-bold text-center mb-8 text-gold-gradient">
        Entrar
      </h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-[rgb(var(--color-gold))] mb-1">
            Email
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-[rgb(var(--color-gold))]" size={20} />
            <input
              type="email"
              {...register('email')}
              className="w-full bg-[rgba(var(--color-obsidian),0.5)] border border-[rgba(var(--color-gold),0.3)] rounded-lg py-2 pl-10 pr-4 text-white placeholder-gray-400 focus:outline-none focus:border-[rgb(var(--color-gold))] transition-colors"
              placeholder="seu@email.com"
            />
          </div>
          {errors.email && (
            <span className="text-sm text-red-500 mt-1 flex items-center gap-1">
              <AlertCircle size={16} />
              {errors.email.message}
            </span>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-[rgb(var(--color-gold))] mb-1">
            Senha
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-[rgb(var(--color-gold))]" size={20} />
            <input
              type="password"
              {...register('password')}
              className="w-full bg-[rgba(var(--color-obsidian),0.5)] border border-[rgba(var(--color-gold),0.3)] rounded-lg py-2 pl-10 pr-4 text-white placeholder-gray-400 focus:outline-none focus:border-[rgb(var(--color-gold))] transition-colors"
              placeholder="••••••••"
            />
          </div>
          {errors.password && (
            <span className="text-sm text-red-500 mt-1 flex items-center gap-1">
              <AlertCircle size={16} />
              {errors.password.message}
            </span>
          )}
        </div>

        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              {...register('rememberMe')}
              className="w-4 h-4 rounded border-[rgba(var(--color-gold),0.3)] bg-[rgba(var(--color-obsidian),0.5)] checked:bg-[rgb(var(--color-gold))] checked:border-[rgb(var(--color-gold))] focus:ring-[rgb(var(--color-gold))]"
            />
            <span className="text-sm text-[rgb(var(--color-gold))]">Lembrar-me</span>
          </label>
          <a href="#" className="text-sm text-[rgb(var(--color-gold))] hover:text-[rgb(var(--color-gold-light))] transition-colors">
            Esqueceu a senha?
          </a>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 flex items-center gap-2 text-red-500">
            <AlertCircle size={20} />
            <span className="text-sm">{error}</span>
          </div>
        )}

        <GoldButton className="w-full">
          {loading ? 'Entrando...' : 'Entrar'}
        </GoldButton>

        <p className="text-center text-[rgb(var(--color-gold))]">
          Não tem uma conta?{' '}
          <a href="#" className="text-[rgb(var(--color-gold-light))] hover:underline">
            Criar conta
          </a>
        </p>
      </form>
    </motion.div>
  );
};
