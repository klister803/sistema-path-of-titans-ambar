import React from 'react';
import { motion } from 'framer-motion';

interface FeedItem {
  id: string;
  user: string;
  activity: string;
  time: string;
}

export const SocialFeed = () => {
  const feedItems: FeedItem[] = [
    {
      id: 'feed1',
      user: 'KnustVI',
      activity: 'alcançou o nível 32',
      time: '2 horas atrás',
    },
    {
      id: 'feed2',
      user: 'AmbarWarrior',
      activity: 'concluiu a missão "A Caçada Inicial"',
      time: '5 horas atrás',
    },
    {
      id: 'feed3',
      user: 'DinoMaster',
      activity: 'encontrou um fóssil raro',
      time: '1 dia atrás',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-[rgba(var(--color-obsidian),0.8)] border border-[rgba(var(--color-gold),0.2)] rounded-lg p-6"
    >
      <h2 className="text-xl font-bold text-[rgb(var(--color-gold))] mb-4">
        Feed Social
      </h2>
      <div className="space-y-3">
        {feedItems.map((item) => (
          <div key={item.id} className="flex items-center justify-between p-3 rounded-lg bg-[rgba(var(--color-gold),0.1)]">
            <div>
              <p className="font-medium text-[rgb(var(--color-gold))]">{item.user}</p>
              <p className="text-sm text-[rgba(var(--color-gold),0.8)]">{item.activity}</p>
            </div>
            <span className="text-sm text-[rgba(var(--color-gold),0.7)]">{item.time}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
};
