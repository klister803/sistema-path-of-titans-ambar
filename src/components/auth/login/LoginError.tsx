import React from 'react';
import { FormError } from '../FormError';

interface LoginErrorProps {
  message: string;
}

export const LoginError: React.FC<LoginErrorProps> = ({ message }) => {
  return <FormError message={message} />;
};
