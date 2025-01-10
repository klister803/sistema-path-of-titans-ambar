import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Clock } from 'lucide-react';

interface Quest {
  id: string;
  title: string;
  description: string;
  reward: string;
  status: 'active' | 'completed';
}

export const QuestLog = () => {
  const quests: Quest[] = [
    {
      id: 'quest1',
      title: 'A Caçada Inicial',
      description: 'Derrote 5 dinossauros selvagens.',
      reward: '100 XP',
      status: 'active',
    },
    {
      id: 'quest2',
      title: 'A Busca por Fósseis',
      description: 'Encontre 3 fósseis antigos.',
      reward: '200 XP',
      status: 'active',
    },
    {
      id: 'quest3',
      title: 'O Resgate da Aldeia',
      description: 'Resgate os aldeões sequestrados.',
      reward: '300 XP',
      status: 'completed',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-[rgba(var(--color-obsidian),0.8)] border border-[rgba(var(--color-gold),0.2)] rounded-lg p-6"
    >
      <h2 className="text-xl font-bold text-[rgb(var(--color-gold))] mb-4">
        Registro de Missões
      </h2>
      <div className="space-y-2">
        {quests.map((quest) => (
          <div key={quest.id} className="flex items-center justify-between p-3 rounded-lg bg-[rgba(var(--color-gold),0.1)]">
            <div>
              <h3 className="font-medium text-[rgb(var(--color-gold))]">{quest.title}</h3>
              <p className="text-sm text-[rgba(var(--color-gold),0.8)]">{quest.description}</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-[rgba(var(--color-gold),0.7)]">{quest.reward}</span>
              {quest.status === 'completed' ? (
                <CheckCircle size={20} className="text-green-500" />
              ) : (
                <Clock size={20} className="text-amber-500" />
              )}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};
