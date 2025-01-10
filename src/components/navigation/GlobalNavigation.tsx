import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { NavigationButtons } from './NavigationButtons';
import { Logo } from '../brand/Logo';

export const GlobalNavigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed w-full z-50 transition-colors duration-300 ${
        isScrolled ? 'bg-[rgba(var(--color-obsidian),0.9)] backdrop-blur-sm' : 'bg-transparent'
      }`}
    >
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-4">
            <Logo variant="regular" />
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <NavLink to="/">Início</NavLink>
            <NavLink to="/#noticias">Notícias</NavLink>
            <NavLink to="/guia">Guia</NavLink>
            <NavLink to="/suporte">Suporte</NavLink>
            <NavigationButtons />
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden text-[rgb(var(--color-gold))]"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden mt-4 space-y-4"
          >
            <MobileNavLink to="/">Início</MobileNavLink>
            <MobileNavLink to="/#noticias">Notícias</MobileNavLink>
            <MobileNavLink to="/guia">Guia</MobileNavLink>
            <MobileNavLink to="/suporte">Suporte</MobileNavLink>
            <div className="pt-4">
              <NavigationButtons />
            </div>
          </motion.div>
        )}
      </nav>
    </motion.header>
  );
};

interface NavLinkProps {
  to: string;
  children: React.ReactNode;
}

const NavLink = ({ to, children }: NavLinkProps) => {
  const location = useLocation();
  const isActive = location.pathname === to || (to !== '/' && location.pathname.startsWith(to));

  return (
    <Link
      to={to}
      className={`
        text-[rgb(var(--color-gold))] transition-colors font-medium
        ${isActive ? 'text-[rgb(var(--color-gold-light))]' : 'hover:text-[rgb(var(--color-gold-light))]'}
      `}
    >
      {children}
    </Link>
  );
};

const MobileNavLink = ({ to, children }: NavLinkProps) => {
  const location = useLocation();
  const isActive = location.pathname === to || (to !== '/' && location.pathname.startsWith(to));

  return (
    <Link
      to={to}
      className={`
        block py-2 text-[rgb(var(--color-gold))] transition-colors font-medium
        ${isActive ? 'text-[rgb(var(--color-gold-light))]' : 'hover:text-[rgb(var(--color-gold-light))]'}
      `}
    >
      {children}
    </Link>
  );
};
