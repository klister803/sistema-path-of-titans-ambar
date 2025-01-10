import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Shield, Gamepad, Terminal, RefreshCw } from 'lucide-react';
import { Card } from '../ui/Card';
import { useAuthStore } from '../../stores/authStore';
import { AccountLinking } from '../account/AccountLinking';
import { RconConsole } from '../admin/rcon/RconConsole';

interface AccountPanelProps {
  onUpdateStatus: () => void;
}

export const AccountPanel: React.FC<AccountPanelProps> = ({ onUpdateStatus }) => {
  const user = useAuthStore(state => state.user);
  const [showLinking, setShowLinking] = useState(false);
  const [showRcon, setShowRcon] = useState(false);

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-xl font-bold text-[rgb(var(--color-gold))] mb-2">
              Informações da Conta
            </h2>
            <div className="space-y-2 text-[rgba(var(--color-gold),0.8)]">
              <p className="flex items-center gap-2">
                <User size={16} />
                {user?.fullName}
              </p>
              <p className="flex items-center gap-2">
                <Shield size={16} />
                {user?.isAdmin ? 'Administrador' : 'Usuário'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowLinking(!showLinking)}
              className="flex items-center gap-2 bg-[rgba(var(--color-gold),0.1)]
                       text-[rgb(var(--color-gold))] px-4 py-2 rounded-lg
                       hover:bg-[rgba(var(--color-gold),0.2)] transition-colors"
            >
              <Gamepad size={20} />
              Vincular Conta do Jogo
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowRcon(!showRcon)}
              className="flex items-center gap-2 bg-[rgba(var(--color-magma),0.1)]
                       text-[rgb(var(--color-magma))] px-4 py-2 rounded-lg
                       hover:bg-[rgba(var(--color-magma),0.2)] transition-colors"
            >
              <Terminal size={20} />
              Console RCON
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onUpdateStatus}
              className="flex items-center gap-2 bg-[rgba(var(--color-gold),0.1)]
                       text-[rgb(var(--color-gold))] px-4 py-2 rounded-lg
                       hover:bg-[rgba(var(--color-gold),0.2)] transition-colors"
            >
              <RefreshCw size={20} />
              Atualizar Status
            </motion.button>
          </div>
        </div>
      </Card>

      {showLinking && <AccountLinking />}
      {showRcon && <RconConsole />}
    </div>
  );
};
