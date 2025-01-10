import { z } from 'zod';

import { passwordValidationSchema } from '../utils/passwordUtils';

// Login password has simpler requirements than registration
const loginPasswordSchema = z.string()
  .min(8, 'Senha inválida');

export const loginSchema = z.object({
  email: z.string()
    .email('Email inválido')
    .transform(val => val.toLowerCase()),
  password: loginPasswordSchema,
  rememberMe: z.boolean().optional()
});

export const registerSchema = z.object({
  fullName: z.string()
    .min(3, 'O nome completo deve ter no mínimo 3 caracteres')
    .max(100, 'O nome completo deve ter no máximo 100 caracteres')
    .regex(/^[a-zA-ZÀ-ÿ\s]*$/, 'O nome deve conter apenas letras'),
  username: z.string()
    .min(3, 'O nome de usuário deve ter no mínimo 3 caracteres')
    .max(20, 'O nome de usuário deve ter no máximo 20 caracteres')
    .regex(/^[a-zA-Z0-9]+$/, 'O nome de usuário deve conter apenas letras e números'),
  email: z.string()
    .email('Email inválido')
    .transform(val => val.toLowerCase()),
  password: passwordValidationSchema,
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "As senhas não conferem",
  path: ["confirmPassword"],
});

export const resetPasswordSchema = z.object({
  email: z.string()
    .email('Email inválido')
    .transform(val => val.toLowerCase())
});

export const updatePasswordSchema = z.object({
  password: passwordValidationSchema,
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "As senhas não conferem",
  path: ["confirmPassword"],
});
