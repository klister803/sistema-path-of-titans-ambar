import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Home, 
  MessageSquare, 
  Calendar, 
  Wrench, 
  Settings, 
  Users, 
  BarChart,
  Shield
} from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';

const Sidebar = () => {
  const { user } = useAuthStore();
  const isAdmin = user?.role === 'admin';

  return (
    <aside className="bg-gray-800 text-white w-64 min-h-screen p-4">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Path of Titans</h1>
      </div>
      
      <nav className="space-y-2">
        <NavLink to="/" className={({ isActive }) => 
          `flex items-center space-x-2 p-2 rounded hover:bg-gray-700 ${isActive ? 'bg-gray-700' : ''}`
        }>
          <Home size={20} />
          <span>Início</span>
        </NavLink>

        <NavLink to="/mensagens" className={({ isActive }) => 
          `flex items-center space-x-2 p-2 rounded hover:bg-gray-700 ${isActive ? 'bg-gray-700' : ''}`
        }>
          <MessageSquare size={20} />
          <span>Mensagens</span>
        </NavLink>

        <NavLink to="/agendamento" className={({ isActive }) => 
          `flex items-center space-x-2 p-2 rounded hover:bg-gray-700 ${isActive ? 'bg-gray-700' : ''}`
        }>
          <Calendar size={20} />
          <span>Agendamento</span>
        </NavLink>

        <NavLink to="/ferramentas" className={({ isActive }) => 
          `flex items-center space-x-2 p-2 rounded hover:bg-gray-700 ${isActive ? 'bg-gray-700' : ''}`
        }>
          <Wrench size={20} />
          <span>Ferramentas</span>
        </NavLink>

        {user?.isAdmin && (
          <NavLink to="/admin" className={({ isActive }) => 
            `flex items-center space-x-2 p-2 rounded hover:bg-gray-700 ${isActive ? 'bg-gray-700' : ''}`
          }>
            <Shield size={20} />
            <span>Painel Admin</span>
          </NavLink>
        )}

        {isAdmin && (
          <>
            <div className="pt-4 pb-2 border-t border-gray-700">
              <span className="text-sm text-gray-400">Administração</span>
            </div>

            <NavLink to="/comandos" className={({ isActive }) => 
              `flex items-center space-x-2 p-2 rounded hover:bg-gray-700 ${isActive ? 'bg-gray-700' : ''}`
            }>
              <Settings size={20} />
              <span>Comandos</span>
            </NavLink>

            <NavLink to="/usuarios" className={({ isActive }) => 
              `flex items-center space-x-2 p-2 rounded hover:bg-gray-700 ${isActive ? 'bg-gray-700' : ''}`
            }>
              <Users size={20} />
              <span>Usuários</span>
            </NavLink>

            <NavLink to="/analytics" className={({ isActive }) => 
              `flex items-center space-x-2 p-2 rounded hover:bg-gray-700 ${isActive ? 'bg-gray-700' : ''}`
            }>
              <BarChart size={20} />
              <span>Analytics</span>
            </NavLink>
          </>
        )}
      </nav>
    </aside>
  );
};

export default Sidebar;
