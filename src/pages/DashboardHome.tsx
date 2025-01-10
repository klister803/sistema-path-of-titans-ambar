import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Card } from '../components/ui/Card';
import { AccountPanel } from '../components/dashboard/AccountPanel';
import { 
  Users,
  Calendar,
  Trophy,
  Activity,
  ArrowUpRight,
  ChevronRight
} from 'lucide-react';
import { useRconStore } from '../stores/rconStore';
import { useDashboardStore } from '../stores/dashboardStore';
import { CharacterStats } from '../components/dashboard/CharacterStats';
import { InventoryGrid } from '../components/dashboard/InventoryGrid';
import { QuestLog } from '../components/dashboard/QuestLog';
import { SocialFeed } from '../components/dashboard/SocialFeed';
import { Gallery } from '../components/dashboard/Gallery';
import { PlayerAttributes } from '../components/dashboard/PlayerAttributes';
import { useAuthStore } from '../stores/authStore';

export const DashboardHome = () => {
  const { getServerStatus, serverStatus } = useRconStore();
  const { userLevel, userExperience, userGuild } = useDashboardStore();
  const [players, setPlayers] = useState<number | string>('N/A');
  const { isAuthenticated } = useAuthStore();
  const lastFetchTime = useRef<number>(0);
  const fetchInterval = 30 * 60 * 1000; // 30 minutes in milliseconds

  const handleUpdateStatus = async () => {
    const now = Date.now();
    if (now - lastFetchTime.current >= fetchInterval) {
      try {
        await getServerStatus();
        if (serverStatus) {
          setPlayers(serverStatus.players);
        }
        lastFetchTime.current = now;
      } catch (error) {
        console.error('Failed to fetch server status:', error);
        setPlayers('N/A');
      }
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      handleUpdateStatus();
    }
  }, [isAuthenticated]);

  const stats = [
    { title: 'Nível', value: userLevel, icon: Trophy, change: '+2 níveis' },
    { title: 'Jogadores Online', value: players, icon: Users, change: '' },
    { title: 'Próximo Evento', value: '2d 5h', icon: Calendar, change: 'Migração' },
    { title: 'XP por Hora', value: '1.2k', icon: Activity, change: '+15%' },
  ];

  const recentActivity = [
    { type: 'level_up', text: 'Você subiu para o nível 32', time: '2h atrás' },
    { type: 'achievement', text: 'Conquista desbloqueada: Caçador Ancestral', time: '5h atrás' },
    { type: 'event', text: 'Participou do evento Caçada Noturna', time: '1d atrás' },
  ];

  return (
    <div className="space-y-6">
      <AccountPanel onUpdateStatus={handleUpdateStatus} />

      {/* Stats Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delayChildren: 0.2, staggerChildren: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="p-6 hover:border-[rgb(var(--color-gold))] transition-colors">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-[rgb(var(--color-gold))]">{stat.title}</p>
                  <h3 className="text-2xl font-bold text-[rgb(var(--color-gold))] mt-1">
                    {stat.value}
                  </h3>
                </div>
                <div className="p-2 bg-[rgba(var(--color-gold),0.1)] rounded-lg">
                  <stat.icon className="text-[rgb(var(--color-gold))]" size={24} />
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2 text-sm text-green-500">
                <ArrowUpRight size={16} />
                {stat.change}
              </div>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          <CharacterStats />
          <InventoryGrid />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          <QuestLog />
          <SocialFeed />
          <Gallery />
          <PlayerAttributes />
        </motion.div>
      </div>
    </div>
  );
};
