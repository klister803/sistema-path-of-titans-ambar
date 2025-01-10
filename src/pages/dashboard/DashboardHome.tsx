import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '../../components/ui/Card';
import { 
  Users,
  Calendar,
  Trophy,
  Activity,
  ArrowUpRight,
  ChevronRight
} from 'lucide-react';

export const DashboardHome = () => {
  const stats = [
    { title: 'Nível', value: '32', icon: Trophy, change: '+2 níveis' },
    { title: 'Jogadores Online', value: '1,234', icon: Users, change: '+123' },
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
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
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
      </div>

      {/* Recent Activity */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-[rgb(var(--color-gold))]">
            Atividade Recente
          </h2>
          <button className="text-[rgb(var(--color-gold)] hover:text-[rgb(var(--color-gold-light))] transition-colors">
            Ver tudo
          </button>
        </div>

        <div className="space-y-4">
          {recentActivity.map((activity, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 + 0.3 }}
              className="flex items-center justify-between p-4 rounded-lg bg-[rgba(var(--color-gold),0.1)] hover:bg-[rgba(var(--color-gold),0.15)] transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="text-[rgb(var(--color-gold))]">{activity.text}</div>
              </div>
              <div className="flex items-center gap-2 text-sm text-[rgba(var(--color-gold),0.7)]">
                {activity.time}
                <ChevronRight size={16} />
              </div>
            </motion.div>
          ))}
        </div>
      </Card>
    </div>
  );
};
