import { createHash, randomBytes } from 'crypto';

// Generate a secure recovery token
export const generateRecoveryToken = (): string => {
  return randomBytes(32).toString('hex');
};

// Hash token for storage
export const hashToken = (token: string): string => {
  return createHash('sha256').update(token).digest('hex');
};

// Generate recovery token file content
export const generateTokenFile = (token: string, email: string): string => {
  const timestamp = new Date().toISOString();
  return `RECOVERY TOKEN - MANTENHA ESTE ARQUIVO SEGURO!
Data de Geração: ${timestamp}
Email: ${email}
Token: ${token}

INSTRUÇÕES IMPORTANTES:
1. Este token é a ÚNICA forma de recuperar sua conta se você perder sua senha
2. Guarde este arquivo em um local seguro
3. Faça backup deste arquivo
4. Nunca compartilhe este token com ninguém
5. O token é válido por 24 horas após ser usado para recuperação

Como usar:
1. Acesse a página de recuperação de senha
2. Digite seu email
3. Cole o token quando solicitado
4. Defina sua nova senha

AVISO: Se você perder este token E sua senha, não será possível recuperar sua conta!`;
};

// Create and trigger download of token file
export const downloadTokenFile = (token: string, email: string) => {
  const content = generateTokenFile(token, email);
  const blob = new Blob([content], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `recovery-token-${email.split('@')[0]}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};
