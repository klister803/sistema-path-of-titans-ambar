import React from 'react';
import { Card } from '../../components/ui/Card';
import { 
  Users, 
  Newspaper, 
  Image as ImageIcon,
  Activity 
} from 'lucide-react';

export const AdminDashboard = () => {
  const stats = [
    { title: 'Usuários Ativos', value: '1,234', icon: Users, change: '+12%' },
    { title: 'Notícias Publicadas', value: '45', icon: Newspaper, change: '+3' },
    { title: 'Arquivos de Mídia', value: '289', icon: ImageIcon, change: '+15' },
    { title: 'Taxa de Engajamento', value: '67%', icon: Activity, change: '+5%' },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-[rgb(var(--color-gold))]">
        Visão Geral
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title} className="p-6">
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
            <div className="mt-4 text-sm text-green-500">
              {stat.change} desde o último mês
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
