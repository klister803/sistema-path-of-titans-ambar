import React from 'react';
import { AlertCircle } from 'lucide-react';

interface FormErrorProps {
  message: string;
}

export const FormError: React.FC<FormErrorProps> = ({ message }) => {
  return (
    <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 flex items-center gap-2 animate-shake">
      <AlertCircle className="text-red-500" size={20} />
      <span className="text-sm text-red-600 font-medium">{message}</span>
    </div>
  );
};
