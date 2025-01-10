import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { BurningTransition } from '../effects/BurningTransition';

export const PageTransition = () => {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [nextLocation, setNextLocation] = useState<string | null>(null);
  const location = useLocation();

  useEffect(() => {
    if (nextLocation !== location.pathname) {
      setIsTransitioning(true);
      setNextLocation(location.pathname);
    }
  }, [location, nextLocation]);

  const handleTransitionComplete = () => {
    setIsTransitioning(false);
  };

  return (
    <BurningTransition
      isActive={isTransitioning}
      onComplete={handleTransitionComplete}
    />
  );
};
