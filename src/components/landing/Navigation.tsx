import React, { useState, useEffect } from 'react';
import { Menu, X, Globe } from 'lucide-react';
import { motion } from 'framer-motion';
import { NavigationButtons } from '../navigation/NavigationButtons';
import { Logo } from '../brand/Logo';

export const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed w-full z-50 transition-colors duration-300 ${
        isScrolled ? 'bg-amber-950/90 backdrop-blur-sm' : 'bg-transparent'
      }`}
    >
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Logo variant="regular" />
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <NavLink href="#inicio">Início</NavLink>
            <NavLink href="#noticias">Notícias</NavLink>
            <NavLink href="/guia">Guia</NavLink>
            <NavLink href="/suporte">Suporte</NavLink>
            <NavigationButtons />
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden text-amber-400"
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
            <MobileNavLink href="#inicio">Início</MobileNavLink>
            <MobileNavLink href="#noticias">Notícias</MobileNavLink>
            <MobileNavLink href="/guia">Guia</MobileNavLink>
            <MobileNavLink href="/suporte">Suporte</MobileNavLink>
            <NavigationButtons />
          </motion.div>
        )}
      </nav>
    </motion.header>
  );
};

const NavLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <a
    href={href}
    className="text-green-50 hover:text-amber-400 transition-colors font-medium"
  >
    {children}
  </a>
);

const MobileNavLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <a
    href={href}
    className="block text-green-50 hover:text-amber-400 transition-colors font-medium py-2"
  >
    {children}
  </a>
);
