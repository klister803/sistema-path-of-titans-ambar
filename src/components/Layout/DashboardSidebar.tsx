import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard,
  MessageSquare, 
  Calendar, 
  Wrench, 
  Shield,
  Menu,
  X
} from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import { motion, AnimatePresence } from 'framer-motion';

export const DashboardSidebar = () => {
  const [isCollapsed, setIsCollapsed] = React.useState(false);
  const [isMobileOpen, setIsMobileOpen] = React.useState(false);
  const user = useAuthStore(state => state.user);

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: MessageSquare, label: 'Mensagens', path: '/mensagens' },
    { icon: Calendar, label: 'Agendamento', path: '/agendamento' },
    { icon: Wrench, label: 'Ferramentas', path: '/ferramentas' },
  ];

  if (user?.isAdmin) {
    navItems.push({ icon: Shield, label: 'Admin', path: '/admin' });
  }

  const sidebarContent = (
    <nav className="space-y-2 mt-6">
      {navItems.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
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
          <item.icon size={20} />
          <span className={isCollapsed ? 'md:hidden' : ''}>
            {item.label}
          </span>
        </NavLink>
      ))}
    </nav>
  );

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-[rgba(var(--color-gold),0.1)] text-[rgb(var(--color-gold))]"
      >
        {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.aside
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            className="fixed inset-y-0 left-0 w-64 z-40 md:hidden
                     bg-[rgba(var(--color-obsidian),0.95)] backdrop-blur-md
                     border-r border-[rgba(var(--color-gold),0.2)]
                     p-4"
          >
            {sidebarContent}
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <aside className={`
        hidden md:block
        ${isCollapsed ? 'w-20' : 'w-64'}
        transition-all duration-300
        bg-[rgba(var(--color-obsidian),0.8)] backdrop-blur-md
        border-r border-[rgba(var(--color-gold),0.2)]
        p-4
      `}>
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="w-full p-2 rounded-lg
                   text-[rgb(var(--color-gold))]
                   hover:bg-[rgba(var(--color-gold),0.1)]
                   transition-colors"
        >
          <Menu size={20} className="mx-auto" />
        </button>
        {sidebarContent}
      </aside>
    </>
  );
};
