import React from 'react';

export const GuidesSkeleton = () => {
  return (
    <div className="animate-pulse space-y-4">
      <div className="h-8 bg-[rgba(var(--color-gold),0.1)] rounded-lg w-3/4" />
      <div className="space-y-2">
        <div className="h-4 bg-[rgba(var(--color-gold),0.1)] rounded w-full" />
        <div className="h-4 bg-[rgba(var(--color-gold),0.1)] rounded w-5/6" />
        <div className="h-4 bg-[rgba(var(--color-gold),0.1)] rounded w-4/6" />
      </div>
    </div>
  );
};
