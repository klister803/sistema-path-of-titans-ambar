import React from 'react';
import { SubmitButton } from '../SubmitButton';

interface LoginActionsProps {
  loading: boolean;
}

export const LoginActions: React.FC<LoginActionsProps> = ({ loading }) => {
  return (
    <>
      <SubmitButton
        loading={loading}
        loadingText="Entrando..."
        text="Entrar"
      />

      <p className="text-center text-[rgb(var(--color-gold))]">
        Não tem uma conta?{' '}
        <a href="/register" className="text-[rgb(var(--color-gold-light))] hover:underline">
          Criar conta
        </a>
      </p>
    </>
  );
};
