import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link2, AlertCircle, Check, Loader } from 'lucide-react';
import { AccountLinkingService } from '../../lib/accountLinking';
import { Card } from '../ui/Card';
import { AuthInput } from '../auth/AuthInput';
import { FormError } from '../auth/FormError';
import { useAuthStore } from '../../stores/authStore';

export const AccountLinking = () => {
  const [gameUsername, setGameUsername] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [step, setStep] = useState<'username' | 'verification'>('username');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedCode, setGeneratedCode] = useState<string | null>(null);
  const user = useAuthStore(state => state.user);
  const [showLinking, setShowLinking] = useState(true);

  const handleSendCode = async () => {
    if (!gameUsername.trim()) {
      setError('Digite seu nome de usuário do jogo');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const code = await AccountLinkingService.createLinkingAttempt(user!.id, gameUsername);
      setGeneratedCode(code);
      setStep('verification');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao enviar código');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    if (!verificationCode.trim()) {
      setError('Digite o código de verificação');
      return;
    }

    if (verificationCode !== generatedCode) {
      setError('Código inválido');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await AccountLinkingService.verifyAndLink(user!.id, gameUsername, verificationCode);
      setShowLinking(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao vincular conta');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-6 max-w-md mx-auto">
      <div className="text-center mb-6">
        <div className="w-12 h-12 bg-[rgba(var(--color-gold),0.1)] rounded-full flex items-center justify-center mx-auto mb-4">
          <Link2 className="text-[rgb(var(--color-gold))]" size={24} />
        </div>
        <h2 className="text-2xl font-bold text-[rgb(var(--color-gold))]">
          Vincular Conta do Jogo
        </h2>
        <p className="text-[rgba(var(--color-gold),0.8)] mt-2">
          {step === 'username' 
            ? 'Digite seu nome de usuário do jogo para receber um código de verificação'
            : 'Digite o código enviado para você no jogo'
          }
        </p>
      </div>

      <div className="space-y-4">
        {step === 'username' ? (
          <>
            <div>
              <label className="block text-sm font-medium text-[rgb(var(--color-gold))] mb-1">
                Nome de Usuário do Jogo
              </label>
              <AuthInput
                value={gameUsername}
                onChange={(e) => setGameUsername(e.target.value)}
                placeholder="Seu nome no jogo"
                disabled={loading}
              />
            </div>

            {error && <FormError message={error} />}

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSendCode}
              disabled={loading}
              className="w-full bg-[rgb(var(--color-gold))] text-[rgb(var(--color-obsidian))]
                       py-2 px-4 rounded-lg font-medium flex items-center justify-center gap-2
                       hover:bg-[rgb(var(--color-gold-light))] disabled:opacity-50
                       transition-colors"
            >
              {loading ? (
                <>
                  <Loader className="animate-spin" size={20} />
                  Enviando código...
                </>
              ) : (
                'Enviar Código de Verificação'
              )}
            </motion.button>
          </>
        ) : (
          <>
            <div>
              <label className="block text-sm font-medium text-[rgb(var(--color-gold))] mb-1">
                Código de Verificação
              </label>
              <AuthInput
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                placeholder="Digite o código recebido"
                disabled={loading}
              />
            </div>

            {error && <FormError message={error} />}

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleVerifyCode}
              disabled={loading}
              className="w-full bg-[rgb(var(--color-gold))] text-[rgb(var(--color-obsidian))]
                       py-2 px-4 rounded-lg font-medium flex items-center justify-center gap-2
                       hover:bg-[rgb(var(--color-gold-light))] disabled:opacity-50
                       transition-colors"
            >
              {loading ? (
                <>
                  <Loader className="animate-spin" size={20} />
                  Verificando...
                </>
              ) : (
                'Verificar Código'
              )}
            </motion.button>

            <button
              onClick={() => setStep('username')}
              className="w-full text-[rgb(var(--color-gold))] hover:text-[rgb(var(--color-gold-light))]
                       transition-colors text-sm"
            >
              Voltar
            </button>
          </>
        )}
      </div>
    </Card>
  );
};
