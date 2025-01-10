import React from 'react';
import { motion } from 'framer-motion';
import { Tooltip } from '../ui/Tooltip';

interface Item {
  id: string;
  name: string;
  icon: string;
  description: string;
}

export const InventoryGrid = () => {
  const items: Item[] = [
    {
      id: 'item1',
      name: 'Espada Ancestral',
      icon: '/images/sword.png',
      description: 'Uma espada poderosa forjada por antigos guerreiros.',
    },
    {
      id: 'item2',
      name: 'Poção de Cura',
      icon: '/images/potion.png',
      description: 'Uma poção que restaura sua saúde.',
    },
    {
      id: 'item3',
      name: 'Amuleto da Sorte',
      icon: '/images/amulet.png',
      description: 'Um amuleto que aumenta sua sorte.',
    },
    {
      id: 'item4',
      name: 'Armadura de Escamas',
      icon: '/images/armor.png',
      description: 'Uma armadura feita de escamas de dragão.',
    },
    {
      id: 'item5',
      name: 'Elmo de Ferro',
      icon: '/images/helmet.png',
      description: 'Um elmo resistente feito de ferro.',
    },
    {
      id: 'item6',
      name: 'Botas de Couro',
      icon: '/images/boots.png',
      description: 'Botas confortáveis feitas de couro.',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-[rgba(var(--color-obsidian),0.8)] border border-[rgba(var(--color-gold),0.2)] rounded-lg p-6"
    >
      <h2 className="text-xl font-bold text-[rgb(var(--color-gold))] mb-4">
        Inventário
      </h2>
      <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {items.map((item) => (
          <Tooltip key={item.id} content={item.description}>
            <div className="p-2 rounded-lg bg-[rgba(var(--color-gold),0.1)] flex items-center justify-center">
              <img src={item.icon} alt={item.name} className="w-10 h-10 object-contain" />
            </div>
          </Tooltip>
        ))}
      </div>
    </motion.div>
  );
};
