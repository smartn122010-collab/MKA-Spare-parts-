import React, { useEffect, useRef } from 'react';

export function SuperbikeCanvasBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Particle class for futuristic speed lines and dust
    class Particle {
      x: number;
      y: number;
      speed: number;
      length: number;
      color: string;

      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.speed = 4 + Math.random() * 8;
        this.length = 20 + Math.random() * 80;
        
        // Match MKA branding: Rose, Blue, Violet, or trans white
        const rand = Math.random();
        if (rand < 0.25) this.color = 'rgba(244, 63, 94, 0.25)'; // Rose
        else if (rand < 0.5) this.color = 'rgba(56, 189, 248, 0.25)'; // Blue
        else if (rand < 0.75) this.color = 'rgba(139, 92, 246, 0.25)'; // Violet
        else this.color = 'rgba(255, 255, 255, 0.12)';
      }

      update() {
        this.x -= this.speed;
        if (this.x < -this.length) {
          this.x = width + this.length;
          this.y = Math.random() * height;
          this.speed = 4 + Math.random() * 8;
        }
      }

      draw(c: CanvasRenderingContext2D) {
        c.strokeStyle = this.color;
        c.lineWidth = 1.2;
        c.beginPath();
        c.moveTo(this.x, this.y);
        c.lineTo(this.x - this.length, this.y);
        c.stroke();
      }
    }

    const particles: Particle[] = Array.from({ length: 45 }, () => new Particle());

    // Shifting color mesh grid
    let gridOffset = 0;
    let colorAngle = 0;

    const resizeHandler = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', resizeHandler);

    // Drawing a highly polished futuristic motorcycle moving silhouette in the background bottom-right corner
    const drawBackgroundBikeSilhouette = (c: CanvasRenderingContext2D, t: number) => {
      // Place the bike in the bottom right corner, scaled down and translucent
      const bikeX = width - 260;
      const bikeY = height - 160;
      
      c.save();
      c.globalAlpha = 0.045; // Subtle, elegant watermark-like integration
      c.translate(bikeX, bikeY + Math.sin(t * 0.1) * 3); // Mild speed vibration

      // Draw glowing wheels
      c.strokeStyle = '#38bdf8'; // Blue Glow
      c.lineWidth = 4;
      c.beginPath();
      c.arc(0, 40, 30, 0, Math.PI * 2);
      c.stroke();

      c.strokeStyle = '#f43f5e'; // Rose Glow
      c.beginPath();
      c.arc(120, 40, 30, 0, Math.PI * 2);
      c.stroke();

      // Draw Chassis tubes
      c.strokeStyle = '#ffffff';
      c.lineWidth = 3;
      c.beginPath();
      c.moveTo(0, 40);
      c.lineTo(40, 10);
      c.lineTo(80, 10);
      c.lineTo(120, 40);
      c.lineTo(60, 40);
      c.closePath();
      c.stroke();

      // Draw fuel tank
      c.fillStyle = '#8b5cf6';
      c.beginPath();
      c.moveTo(35, 10);
      c.lineTo(55, -10);
      c.lineTo(90, -5);
      c.lineTo(80, 10);
      c.closePath();
      c.fill();

      // Exhaust tail flame spark
      const sparkLen = 15 + Math.sin(t * 0.5) * 10;
      c.strokeStyle = '#f43f5e';
      c.lineWidth = 2.5;
      c.beginPath();
      c.moveTo(-35, 45);
      c.lineTo(-35 - sparkLen, 50 + Math.sin(t * 0.8) * 3);
      c.stroke();

      c.restore();
    };

    const render = () => {
      // Semi-clear for smooth trailing/blur effects
      ctx.fillStyle = 'rgba(7, 5, 13, 0.28)';
      ctx.fillRect(0, 0, width, height);

      colorAngle += 0.002;
      gridOffset = (gridOffset + 1.8) % 40;

      // Draw subtle background road perspective lines
      ctx.strokeStyle = 'rgba(139, 92, 246, 0.035)';
      ctx.lineWidth = 1;
      const roadY = height - 120;
      
      // Draw grid horizon line
      ctx.beginPath();
      ctx.moveTo(0, roadY);
      ctx.lineTo(width, roadY);
      ctx.stroke();

      // Perspective grid lines
      for (let i = -20; i < width + 100; i += 60) {
        ctx.beginPath();
        ctx.moveTo(i - gridOffset, roadY);
        ctx.lineTo(i - gridOffset - 150, height);
        ctx.stroke();
      }

      // Draw moving speed particles
      particles.forEach(p => {
        p.update();
        p.draw(ctx);
      });

      // Draw the background bike silhouette
      drawBackgroundBikeSilhouette(ctx, Date.now() / 15);

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resizeHandler);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none -z-20 block bg-[#07050d]"
      id="superbike-video-background"
    />
  );
}
