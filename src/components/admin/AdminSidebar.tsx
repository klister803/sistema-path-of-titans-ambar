import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Newspaper,
  Image as ImageIcon,
  Users,
  Settings,
  LayoutDashboard
} from 'lucide-react';
import { Logo } from '../brand/Logo';

export const AdminSidebar = () => {
  return (
    <aside className="w-64 bg-[rgba(var(--color-gold),0.1)] border-r border-[rgba(var(--color-gold),0.2)] p-4">
      <div className="mb-8">
        <Logo variant="regular" />
      </div>
      
      <nav className="space-y-2">
        <NavItem to="/admin" icon={<LayoutDashboard size={20} />} end>
          Dashboard
        </NavItem>
        <NavItem to="/admin/noticias" icon={<Newspaper size={20} />}>
          Notícias
        </NavItem>
        <NavItem to="/admin/media" icon={<ImageIcon size={20} />}>
          Mídia
        </NavItem>
        <NavItem to="/admin/usuarios" icon={<Users size={20} />}>
          Usuários
        </NavItem>
        <NavItem to="/admin/configuracoes" icon={<Settings size={20} />}>
          Configurações
        </NavItem>
      </nav>
    </aside>
  );
};

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  end?: boolean;
}

const NavItem = ({ to, icon, children, end }: NavItemProps) => (
  <NavLink
    to={to}
    end={end}
    className={({ isActive }) => `
      flex items-center gap-3 px-4 py-2 rounded-lg
      text-[rgb(var(--color-gold))]
      transition-colors duration-200
      ${isActive 
        ? 'bg-[rgba(var(--color-gold),0.2)] font-medium' 
        : 'hover:bg-[rgba(var(--color-gold),0.1)]'
      }
    `}
  >
    {icon}
    <span>{children}</span>
  </NavLink>
);
