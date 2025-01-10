import React from 'react';
import { Hero } from '../components/landing/Hero';
import { NewsSection } from '../components/landing/NewsSection';
import { GlobalNavigation } from '../components/navigation/GlobalNavigation';
import { MagmaEffect } from '../components/effects/MagmaEffect';

const Landing = () => {
  return (
    <div className="min-h-screen bg-[rgb(var(--color-obsidian))] relative overflow-hidden">
      <MagmaEffect />
      <div className="absolute inset-0 bg-gradient-to-b from-[rgba(var(--color-obsidian),0.9)] to-[rgba(var(--color-magma),0.1)]" />
      <GlobalNavigation />
      <Hero />
      <NewsSection />
    </div>
  );
};

export default Landing;
