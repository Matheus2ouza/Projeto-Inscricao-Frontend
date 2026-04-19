'use client';

import { useTheme } from 'next-themes';
import { useEffect, useRef } from 'react';

interface Beam {
  x: number;
  y: number;
  width: number;
  length: number;
  angle: number;
  speed: number;
  opacity: number;
  hue: number;
  gradient?: CanvasGradient;
}

function createBeam(width: number, height: number, isDark: boolean): Beam {
  return {
    x: Math.random() * width * 1.5 - width * 0.25,
    y: Math.random() * height * 1.5 - height * 0.25,
    width: 80 + Math.random() * 120,
    length: height * 1.5,
    angle: -35 + Math.random() * 10,
    speed: 0.6 + Math.random() * 1.2,
    opacity: isDark ? 0.18 + Math.random() * 0.25 : 0.25 + Math.random() * 0.35,
    hue: isDark ? 220 + Math.random() * 80 : 200 + Math.random() * 120,
  };
}

function createGradient(ctx: CanvasRenderingContext2D, beam: Beam) {
  const gradient = ctx.createLinearGradient(0, 0, 0, beam.length);

  gradient.addColorStop(0, `hsla(${beam.hue}, 85%, 65%, 0)`);
  gradient.addColorStop(0.4, `hsla(${beam.hue}, 85%, 65%, ${beam.opacity})`);
  gradient.addColorStop(0.6, `hsla(${beam.hue}, 85%, 65%, ${beam.opacity})`);
  gradient.addColorStop(1, `hsla(${beam.hue}, 85%, 65%, 0)`);

  return gradient;
}

export default function GlobalBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const beamsRef = useRef<Beam[]>([]);
  const animationFrameRef = useRef<number>(0);

  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const updateCanvasSize = () => {
      const dpr = Math.min(window.devicePixelRatio, 1.5) || 1;

      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;

      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      beamsRef.current = Array.from({ length: 12 }, () => {
        const beam = createBeam(canvas.width, canvas.height, isDark);
        beam.gradient = createGradient(ctx, beam);
        return beam;
      });
    };

    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);

    function drawBeam(ctx: CanvasRenderingContext2D, beam: Beam) {
      ctx.save();
      ctx.translate(beam.x, beam.y);
      ctx.rotate((beam.angle * Math.PI) / 180);

      ctx.fillStyle = beam.gradient!;
      ctx.fillRect(-beam.width / 2, 0, beam.width, beam.length);

      ctx.restore();
    }

    let lastTime = 0;

    function animate(time: number) {
      if (!canvas || !ctx) {
        animationFrameRef.current = requestAnimationFrame(animate);
        return;
      }

      if (document.hidden) {
        animationFrameRef.current = requestAnimationFrame(animate);
        return;
      }

      if (time - lastTime < 33) {
        animationFrameRef.current = requestAnimationFrame(animate);
        return;
      }

      lastTime = time;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.filter = isDark ? 'blur(12px)' : 'blur(8px)';

      beamsRef.current.forEach((beam) => {
        beam.y -= beam.speed;

        if (beam.y + beam.length < -100) {
          const newBeam = createBeam(canvas.width, canvas.height, isDark);
          newBeam.gradient = createGradient(ctx, newBeam);

          Object.assign(beam, newBeam);
          beam.y = canvas.height + 100;
        }

        drawBeam(ctx, beam);
      });

      animationFrameRef.current = requestAnimationFrame(animate);
    }

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', updateCanvasSize);
      cancelAnimationFrame(animationFrameRef.current);
    };
  }, [isDark]);

  return (
    <div className="fixed inset-0 -z-10">
      {/* base */}
      <div
        className={`absolute inset-0 ${
          isDark
            ? 'bg-neutral-950'
            : 'bg-gradient-to-br from-white via-blue-50 to-purple-100'
        }`}
      />

      {/* canvas */}
      <canvas ref={canvasRef} className="absolute inset-0" />

      {/* overlay */}
      <div className="absolute inset-0 bg-white/10 backdrop-blur-[20px] dark:bg-black/10" />
    </div>
  );
}
