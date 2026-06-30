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
      thickness: number;

      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.speed = 6 + Math.random() * 14;
        this.length = 30 + Math.random() * 120;
        this.thickness = 0.8 + Math.random() * 1.2;
        
        // Match MKA branding: Rose, Blue, Violet, or trans white
        const rand = Math.random();
        if (rand < 0.3) this.color = 'rgba(244, 63, 94, 0.35)'; // Rose
        else if (rand < 0.6) this.color = 'rgba(56, 189, 248, 0.35)'; // Blue
        else if (rand < 0.85) this.color = 'rgba(139, 92, 246, 0.35)'; // Violet
        else this.color = 'rgba(255, 255, 255, 0.16)';
      }

      update() {
        this.x -= this.speed;
        if (this.x < -this.length) {
          this.x = width + this.length;
          this.y = Math.random() * height;
          this.speed = 6 + Math.random() * 14;
        }
      }

      draw(c: CanvasRenderingContext2D) {
        c.strokeStyle = this.color;
        c.lineWidth = this.thickness;
        c.beginPath();
        c.moveTo(this.x, this.y);
        c.lineTo(this.x - this.length, this.y);
        c.stroke();
      }
    }

    const particles: Particle[] = Array.from({ length: 65 }, () => new Particle());

    // Shifting color mesh grid
    let gridOffset = 0;

    const resizeHandler = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', resizeHandler);

    // Draw high-tech dashboard HUD rings (tachometer / speedometer vibe)
    const drawDashboardHUD = (c: CanvasRenderingContext2D, t: number) => {
      c.save();
      c.globalAlpha = 0.035;
      
      // Placed top-right corner on PC
      const hudX = width - 150;
      const hudY = 120;
      
      c.translate(hudX, hudY);
      
      // Outer telemetry circle
      c.strokeStyle = '#38bdf8';
      c.lineWidth = 1.5;
      c.beginPath();
      c.arc(0, 0, 70, 0, Math.PI * 2);
      c.stroke();

      // Dashed sweep ring
      c.strokeStyle = '#8b5cf6';
      c.setLineDash([4, 6]);
      c.beginPath();
      c.arc(0, 0, 60, t * 0.05, t * 0.05 + Math.PI * 1.5);
      c.stroke();
      c.setLineDash([]);

      // Inner gauge speed value indicator
      c.strokeStyle = '#f43f5e';
      c.lineWidth = 3;
      c.beginPath();
      const endAngle = (Math.sin(t * 0.08) + 1) * Math.PI;
      c.arc(0, 0, 45, 0, endAngle);
      c.stroke();

      c.restore();
    };

    // Drawing a highly polished futuristic motorcycle moving silhouette in the background bottom-right corner
    const drawBackgroundBikeSilhouette = (c: CanvasRenderingContext2D, t: number) => {
      // Place the bike in the bottom right corner, scaled down and translucent
      const bikeX = width - 280;
      const bikeY = height - 180;
      
      c.save();
      c.globalAlpha = 0.07; // Slightly enhanced visibility for better "video" feel
      c.translate(bikeX, bikeY + Math.sin(t * 0.15) * 4); // Speed vibration

      // Draw glowing wheels with rotating spokes
      const wheelRotation = t * 0.4;
      
      // Front Wheel
      c.save();
      c.translate(140, 40);
      c.rotate(wheelRotation);
      c.strokeStyle = '#f43f5e'; // Rose Glow
      c.lineWidth = 4.5;
      c.beginPath();
      c.arc(0, 0, 32, 0, Math.PI * 2);
      c.stroke();
      // spokes
      c.strokeStyle = 'rgba(244, 63, 94, 0.4)';
      c.lineWidth = 1.5;
      for (let i = 0; i < 4; i++) {
        c.rotate(Math.PI / 2);
        c.beginPath();
        c.moveTo(-32, 0);
        c.lineTo(32, 0);
        c.stroke();
      }
      c.restore();

      // Rear Wheel
      c.save();
      c.translate(0, 40);
      c.rotate(wheelRotation);
      c.strokeStyle = '#38bdf8'; // Blue Glow
      c.lineWidth = 4.5;
      c.beginPath();
      c.arc(0, 0, 32, 0, Math.PI * 2);
      c.stroke();
      // spokes
      c.strokeStyle = 'rgba(56, 189, 248, 0.4)';
      c.lineWidth = 1.5;
      for (let i = 0; i < 4; i++) {
        c.rotate(Math.PI / 2);
        c.beginPath();
        c.moveTo(-32, 0);
        c.lineTo(32, 0);
        c.stroke();
      }
      c.restore();

      // Draw Chassis tubes
      c.strokeStyle = '#ffffff';
      c.lineWidth = 3.5;
      c.beginPath();
      c.moveTo(0, 40);
      c.lineTo(45, 8);
      c.lineTo(90, 8);
      c.lineTo(140, 40);
      c.lineTo(70, 40);
      c.closePath();
      c.stroke();

      // Draw fuel tank & sport bike cover
      c.fillStyle = '#8b5cf6';
      c.beginPath();
      c.moveTo(40, 8);
      c.lineTo(60, -14);
      c.lineTo(105, -8);
      c.lineTo(90, 8);
      c.closePath();
      c.fill();

      // Rider silhouette leaning forward
      c.fillStyle = 'rgba(255, 255, 255, 0.45)';
      c.beginPath();
      c.arc(85, -24, 10, 0, Math.PI * 2); // helmet
      c.fill();
      
      c.strokeStyle = 'rgba(255, 255, 255, 0.35)';
      c.lineWidth = 5;
      c.beginPath();
      c.moveTo(85, -14);
      c.lineTo(65, -2); // torso leaning
      c.lineTo(48, 20); // thigh
      c.stroke();

      // Exhaust tail flame spark
      const sparkLen = 22 + Math.sin(t * 0.8) * 14;
      c.strokeStyle = '#f43f5e';
      c.lineWidth = 3.5;
      c.beginPath();
      c.moveTo(-35, 45);
      c.lineTo(-35 - sparkLen, 48 + Math.sin(t * 1.2) * 5);
      c.stroke();

      c.restore();
    };

    const render = () => {
      // Semi-clear for smooth trailing/blur effects
      ctx.fillStyle = 'rgba(7, 5, 13, 0.22)';
      ctx.fillRect(0, 0, width, height);

      gridOffset = (gridOffset + 2.5) % 40;

      // Draw subtle background road perspective lines
      ctx.strokeStyle = 'rgba(139, 92, 246, 0.04)';
      ctx.lineWidth = 1;
      const roadY = height - 120;
      
      // Draw grid horizon line
      ctx.beginPath();
      ctx.moveTo(0, roadY);
      ctx.lineTo(width, roadY);
      ctx.stroke();

      // Perspective grid lines
      for (let i = -40; i < width + 100; i += 60) {
        ctx.beginPath();
        ctx.moveTo(i - gridOffset, roadY);
        ctx.lineTo(i - gridOffset - 180, height);
        ctx.stroke();
      }

      // Draw moving speed particles
      particles.forEach(p => {
        p.update();
        p.draw(ctx);
      });

      const now = Date.now() / 15;

      // Draw HUD
      drawDashboardHUD(ctx, now);

      // Draw the background bike silhouette
      drawBackgroundBikeSilhouette(ctx, now);

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

