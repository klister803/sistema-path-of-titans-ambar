import React from 'react';
import { Bell, Settings, Search } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import { Logo } from '../brand/Logo';

export const DashboardHeader = () => {
  const user = useAuthStore(state => state.user);

  return (
    <header className="sticky top-0 z-20 bg-[rgba(var(--color-obsidian),0.8)] backdrop-blur-md border-b border-[rgba(var(--color-gold),0.2)]">
      <div className="px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Logo variant="regular" />
          
          <div className="hidden md:flex relative">
            <input
              type="text"
              placeholder="Buscar..."
              className="
                w-64 py-2 px-4 pl-10
                bg-[rgba(var(--color-gold),0.1)]
                border border-[rgba(var(--color-gold),0.2)]
                rounded-lg text-[rgb(var(--color-gold))]
                placeholder-[rgba(var(--color-gold),0.5)]
                focus:outline-none focus:border-[rgb(var(--color-gold))]
                transition-colors
              "
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[rgb(var(--color-gold))]" size={18} />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button className="p-2 text-[rgb(var(--color-gold))] hover:bg-[rgba(var(--color-gold),0.1)] rounded-lg transition-colors">
            <Bell size={20} />
          </button>
          <button className="p-2 text-[rgb(var(--color-gold))] hover:bg-[rgba(var(--color-gold),0.1)] rounded-lg transition-colors">
            <Settings size={20} />
          </button>
          
          <div className="flex items-center gap-3 pl-4 border-l border-[rgba(var(--color-gold),0.2)]">
            <div className="w-8 h-8 rounded-full bg-[rgba(var(--color-gold),0.2)] flex items-center justify-center">
              <span className="text-[rgb(var(--color-gold))] font-medium">
                {user?.username?.[0].toUpperCase()}
              </span>
            </div>
            <span className="text-[rgb(var(--color-gold))] font-medium hidden md:block">
              {user?.username}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
