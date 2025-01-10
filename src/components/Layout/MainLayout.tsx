import React from 'react';
import { Outlet } from 'react-router-dom';
import { DashboardHeader } from './DashboardHeader';
import { DashboardSidebar } from './DashboardSidebar';
import { MagmaEffect } from '../effects/MagmaEffect';
import { ParticleBackground } from '../ui/ParticleBackground';

const MainLayout = () => {
  return (
    <div className="min-h-screen bg-[rgb(var(--color-obsidian))] relative">
      <MagmaEffect />
      <ParticleBackground />
      <div className="absolute inset-0 bg-gradient-to-b from-[rgba(var(--color-obsidian),0.9)] to-[rgba(var(--color-magma),0.1)]" />
      
      <div className="relative z-10 flex">
        <DashboardSidebar />
        <div className="flex-1">
          <DashboardHeader />
          <main className="p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
