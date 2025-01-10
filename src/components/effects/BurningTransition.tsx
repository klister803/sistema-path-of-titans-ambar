import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface BurningTransitionProps {
  isActive: boolean;
  onComplete: () => void;
}

export const BurningTransition: React.FC<BurningTransitionProps> = ({
  isActive,
  onComplete,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!isActive) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: Particle[] = [];
    const particleCount = 200;

    class Particle {
      x: number;
      y: number;
      size: number;
      speedY: number;
      life: number;
      maxLife: number;

      constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 3 + 2;
        this.speedY = -Math.random() * 3 - 1;
        this.life = 1;
        this.maxLife = Math.random() * 0.5 + 0.5;
      }

      update() {
        this.y += this.speedY;
        this.life -= 0.01;
        this.size *= 0.99;
      }

      draw() {
        if (!ctx) return;
        const gradient = ctx.createRadialGradient(
          this.x, this.y, 0,
          this.x, this.y, this.size
        );
        gradient.addColorStop(0, `rgba(255, 150, 0, ${this.life})`);
        gradient.addColorStop(0.5, `rgba(255, 50, 0, ${this.life * 0.5})`);
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
      }
    }

    let animationFrame: number;
    let startTime = performance.now();
    const duration = 1000; // 1 second

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Add new particles
      if (progress < 0.8) {
        for (let i = 0; i < 5; i++) {
          const x = Math.random() * canvas.width;
          const y = canvas.height - Math.random() * 20;
          particles.push(new Particle(x, y));
        }
      }

      // Update and draw particles
      for (let i = particles.length - 1; i >= 0; i--) {
        particles[i].update();
        particles[i].draw();

        if (particles[i].life <= 0) {
          particles.splice(i, 1);
        }
      }

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      } else {
        onComplete();
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrame);
    };
  }, [isActive, onComplete]);

  return (
    <AnimatePresence>
      {isActive && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50"
        >
          <canvas
            ref={canvasRef}
            className="w-full h-full"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};
