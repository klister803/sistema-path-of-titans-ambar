import { z } from 'zod';
import { format } from 'date-fns';
import fs from 'fs';

// Password validation schema
export const passwordValidationSchema = z.string()
  .min(12, 'A senha deve ter no mínimo 12 caracteres')
  .regex(/[A-Z]/, 'Deve conter pelo menos uma letra maiúscula')
  .regex(/[a-z]/, 'Deve conter pelo menos uma letra minúscula')
  .regex(/[0-9]/, 'Deve conter pelo menos um número')
  .regex(/[@#$%&*]/, 'Deve conter pelo menos um caractere especial (@#$%&*)')
  .refine(
    (password) => !hasObviousSequences(password),
    'Não pode conter sequências óbvias (123, abc) ou repetições'
  );

// Check for obvious sequences and repetitions
const hasObviousSequences = (password: string): boolean => {
  const sequences = ['123', '234', '345', 'abc', 'bcd', 'cde'];
  const hasSequence = sequences.some(seq => password.toLowerCase().includes(seq));
  const hasRepetition = /(.)\1{2,}/.test(password);
  return hasSequence || hasRepetition;
};

// Generate a strong password
export const generateStrongPassword = (): string => {
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lowercase = 'abcdefghijklmnopqrstuvwxyz';
  const numbers = '0123456789';
  const specials = '@#$%&*';
  
  const allChars = uppercase + lowercase + numbers + specials;
  let password = '';
  
  // Ensure at least one of each required character type
  password += uppercase[Math.floor(Math.random() * uppercase.length)];
  password += lowercase[Math.floor(Math.random() * lowercase.length)];
  password += numbers[Math.floor(Math.random() * numbers.length)];
  password += specials[Math.floor(Math.random() * specials.length)];
  
  // Fill remaining length with random characters
  while (password.length < 16) {
    password += allChars[Math.floor(Math.random() * allChars.length)];
  }
  
  // Shuffle the password
  return password.split('').sort(() => Math.random() - 0.5).join('');
};

// Calculate password strength
export const calculatePasswordStrength = (password: string): {
  score: number;
  feedback: string[];
} => {
  const feedback: string[] = [];
  let score = 0;
  
  // Length check
  if (password.length >= 12) score += 20;
  else feedback.push('Aumente o tamanho da senha para 12 caracteres ou mais');
  
  // Character type checks
  if (/[A-Z]/.test(password)) score += 20;
  else feedback.push('Adicione letras maiúsculas');
  
  if (/[a-z]/.test(password)) score += 20;
  else feedback.push('Adicione letras minúsculas');
  
  if (/[0-9]/.test(password)) score += 20;
  else feedback.push('Adicione números');
  
  if (/[@#$%&*]/.test(password)) score += 20;
  else feedback.push('Adicione caracteres especiais (@#$%&*)');
  
  // Sequence and repetition check
  if (hasObviousSequences(password)) {
    score -= 20;
    feedback.push('Evite sequências óbvias e repetições');
  }
  
  return { score: Math.max(0, Math.min(100, score)), feedback };
};
