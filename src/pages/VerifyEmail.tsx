import React from 'react';
import { useLocation, Navigate } from 'react-router-dom';
import { Mail } from 'lucide-react';

export const VerifyEmail = () => {
  const location = useLocation();
  const email = location.state?.email;

  if (!email) {
    return <Navigate to="/register" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-800 to-amber-600 
                    flex items-center justify-center px-4">
      <div className="bg-white/95 p-8 rounded-lg shadow-xl backdrop-blur-sm w-full max-w-md">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 
                         rounded-full bg-amber-100 mb-4">
            <Mail className="h-6 w-6 text-amber-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Verifique seu email
          </h2>
          <p className="text-gray-600 mb-4">
            Enviamos um link de confirmação para:
          </p>
          <p className="text-amber-600 font-medium mb-6">
            {email}
          </p>
          <p className="text-sm text-gray-500">
            Clique no link enviado para seu email para ativar sua conta. 
            Se não encontrar o email, verifique sua caixa de spam.
          </p>
        </div>
      </div>
    </div>
  );
};
