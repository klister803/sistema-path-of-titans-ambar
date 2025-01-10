import React from 'react';
import { MagmaEffect } from '../effects/MagmaEffect';
import { ParticleBackground } from '../ui/ParticleBackground';
import { Navigation } from '../landing/Navigation';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children, title }) => {
  return (
    <div className="min-h-screen bg-[rgb(var(--color-obsidian))] relative overflow-hidden">
      <MagmaEffect />
      <ParticleBackground />
      <div className="absolute inset-0 bg-gradient-to-b from-[rgba(var(--color-obsidian),0.9)] to-[rgba(var(--color-magma),0.1)]" />
      
      <Navigation />
      
      <main className="relative z-10 min-h-screen flex items-center justify-center px-4 py-20">
        <div className="w-full max-w-md">
          <div className="bg-[rgba(var(--color-obsidian),0.8)] backdrop-blur-md p-8 rounded-lg border border-[rgba(var(--color-gold),0.3)]">
            <h1 className="text-3xl font-bold text-center mb-8 text-gold-gradient">
              {title}
            </h1>
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};
