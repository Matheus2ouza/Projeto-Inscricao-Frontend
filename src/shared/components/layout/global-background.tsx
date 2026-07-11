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

// Paleta Riodavida Eventos - Cores em HSL para os beams
const RIODAVIDA_COLORS = {
  light: {
    primary: { h: 174, s: 65, l: 48 }, // #3FB5AE
    secondary: { h: 72, s: 52, l: 49 }, // #A8BE3C
    teal: { h: 174, s: 55, l: 38 }, // #2E8F8A
    olive: { h: 72, s: 52, l: 40 }, // #8AA02E
  },
  dark: {
    primary: { h: 174, s: 55, l: 35 }, // #2A8A85 (escurecido)
    secondary: { h: 72, s: 52, l: 38 }, // #8A9E2E (escurecido)
    teal: { h: 174, s: 55, l: 28 }, // #1F6B66 (escurecido)
    olive: { h: 72, s: 52, l: 32 }, // #6E821E (escurecido)
  },
};

function createBeam(width: number, height: number, isDark: boolean): Beam {
  const colors = isDark ? RIODAVIDA_COLORS.dark : RIODAVIDA_COLORS.light;
  const colorKeys = Object.keys(colors) as Array<keyof typeof colors>;
  const selectedColor =
    colors[colorKeys[Math.floor(Math.random() * colorKeys.length)]];

  return {
    x: Math.random() * width * 1.5 - width * 0.25,
    y: Math.random() * height * 1.5 - height * 0.25,
    width: 80 + Math.random() * 120,
    length: height * 1.5,
    angle: -35 + Math.random() * 10,
    speed: 0.6 + Math.random() * 1.2,
    opacity: isDark ? 0.15 + Math.random() * 0.2 : 0.2 + Math.random() * 0.3,
    hue:
      selectedColor.h +
      (isDark ? -10 + Math.random() * 20 : -15 + Math.random() * 30),
  };
}

function createGradient(
  ctx: CanvasRenderingContext2D,
  beam: Beam,
  isDark: boolean,
) {
  const gradient = ctx.createLinearGradient(0, 0, 0, beam.length);

  const saturation = isDark ? 70 : 75;
  const lightness = isDark ? 55 : 65;

  gradient.addColorStop(
    0,
    `hsla(${beam.hue}, ${saturation}%, ${lightness}%, 0)`,
  );
  gradient.addColorStop(
    0.4,
    `hsla(${beam.hue}, ${saturation}%, ${lightness}%, ${beam.opacity})`,
  );
  gradient.addColorStop(
    0.6,
    `hsla(${beam.hue}, ${saturation}%, ${lightness}%, ${beam.opacity})`,
  );
  gradient.addColorStop(
    1,
    `hsla(${beam.hue}, ${saturation}%, ${lightness}%, 0)`,
  );

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
        beam.gradient = createGradient(ctx, beam, isDark);
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
      ctx.filter = isDark ? 'blur(8px)' : 'blur(8px)';

      beamsRef.current.forEach((beam) => {
        beam.y -= beam.speed;

        if (beam.y + beam.length < -100) {
          const newBeam = createBeam(canvas.width, canvas.height, isDark);
          newBeam.gradient = createGradient(ctx, newBeam, isDark);

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
    <div className="fixed inset-0 -z-10 h-full w-full">
      {/* base - usando cores da paleta Riodavida */}
      <div
        className={`absolute inset-0 ${
          isDark
            ? 'bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#0A0F1A]'
            : 'bg-gradient-to-br from-[#F0F9F8] via-[#E8F5F4] to-[#F5F8E8]'
        }`}
      />

      {/* canvas */}
      <canvas ref={canvasRef} className="absolute inset-0" />

      {/* overlay - mais sutil para destacar os beams */}
      <div
        className={`absolute inset-0 ${
          isDark
            ? 'bg-black/5 backdrop-blur-[20px]'
            : 'bg-white/5 backdrop-blur-[20px]'
        }`}
      />
    </div>
  );
}
