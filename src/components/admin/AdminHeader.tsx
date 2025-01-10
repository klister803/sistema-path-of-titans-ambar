import React from 'react';
import { useAuthStore } from '../../stores/authStore';
import { Settings, Bell } from 'lucide-react';

export const AdminHeader = () => {
  const user = useAuthStore(state => state.user);

  return (
    <header className="bg-[rgba(var(--color-gold),0.1)] border-b border-[rgba(var(--color-gold),0.2)] px-6 py-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-[rgb(var(--color-gold))]">
          Painel Administrativo
        </h1>
        
        <div className="flex items-center gap-4">
          <button className="p-2 text-[rgb(var(--color-gold))] hover:bg-[rgba(var(--color-gold),0.1)] rounded-full">
            <Bell size={20} />
          </button>
          <button className="p-2 text-[rgb(var(--color-gold))] hover:bg-[rgba(var(--color-gold),0.1)] rounded-full">
            <Settings size={20} />
          </button>
          <div className="text-[rgb(var(--color-gold))]">
            {user?.username}
          </div>
        </div>
      </div>
    </header>
  );
};
