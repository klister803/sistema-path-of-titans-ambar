import React, { useEffect, useRef } from 'react';

export const MagmaEffect = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const magmaParticles: MagmaParticle[] = [];
    const particleCount = 30;

    class MagmaParticle {
      x: number;
      y: number;
      size: number;
      speedY: number;
      hue: number;
      opacity: number;

      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = canvas.height + Math.random() * 100;
        this.size = Math.random() * 3 + 2;
        this.speedY = Math.random() * -1 - 0.5;
        this.hue = Math.random() * 30 + 30; // Golden hues
        this.opacity = Math.random() * 0.5 + 0.3;
      }

      update() {
        this.y += this.speedY;
        this.opacity -= 0.003;

        if (this.y < 0 || this.opacity <= 0) {
          this.y = canvas.height + Math.random() * 100;
          this.opacity = Math.random() * 0.5 + 0.3;
        }
      }

      draw() {
        if (!ctx) return;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${this.hue}, 100%, 50%, ${this.opacity})`;
        ctx.fill();
      }
    }

    for (let i = 0; i < particleCount; i++) {
      magmaParticles.push(new MagmaParticle());
    }

    const animate = () => {
      if (!ctx) return;
      ctx.fillStyle = 'rgba(15, 15, 15, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      magmaParticles.forEach((particle) => {
        particle.update();
        particle.draw();
      });

      requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none opacity-50"
      style={{ zIndex: 0 }}
    />
  );
};
