import React from 'react';
import { AuthLayout } from '../components/auth/AuthLayout';
import { LoginForm } from '../components/auth/login/LoginForm';

const LoginUsuario = () => {
  return (
    <AuthLayout title="Entrar na sua conta">
      <LoginForm />
    </AuthLayout>
  );
};

export default LoginUsuario;
