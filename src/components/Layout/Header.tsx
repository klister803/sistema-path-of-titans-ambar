import React from 'react';
import { LogOut, User } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';

const Header = () => {
  const { user, logout } = useAuthStore();

  return (
    <header className="bg-white border-b border-gray-200 px-4 py-3">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <span className="text-lg font-semibold">Bem-vindo, {user?.username}</span>
        </div>
        
        <div className="flex items-center space-x-4">
          <button className="p-2 hover:bg-gray-100 rounded-full">
            <User size={20} />
          </button>
          <button 
            onClick={logout}
            className="p-2 hover:bg-gray-100 rounded-full text-red-600"
          >
            <LogOut size={20} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
