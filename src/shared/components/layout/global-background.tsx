"use client";

import { useTheme } from "next-themes";
import { useEffect, useRef } from "react";

interface Beam {
  x: number;
  y: number;
  width: number;
  length: number;
  angle: number;
  speed: number;
  opacity: number;
  hue: number;
  pulse: number;
  pulseSpeed: number;
}

function createBeam(width: number, height: number, isDark: boolean): Beam {
  return {
    x: Math.random() * width * 1.5 - width * 0.25,
    y: Math.random() * height * 1.5 - height * 0.25,
    width: 80 + Math.random() * 120,
    length: height * 2.5,
    angle: -35 + Math.random() * 10,
    speed: 0.6 + Math.random() * 1.2,
    opacity: isDark ? 0.18 + Math.random() * 0.25 : 0.25 + Math.random() * 0.35,
    hue: isDark
      ? 220 + Math.random() * 80 // azul/roxo (ok)
      : 200 + Math.random() * 120, // adiciona rosa/roxo
    pulse: Math.random() * Math.PI * 2,
    pulseSpeed: 0.02 + Math.random() * 0.03,
  };
}

export default function GlobalBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const beamsRef = useRef<Beam[]>([]);
  const animationFrameRef = useRef<number>(0);

  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const updateCanvasSize = () => {
      const dpr = window.devicePixelRatio || 1;

      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;

      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      beamsRef.current = Array.from({ length: 30 }, () =>
        createBeam(canvas.width, canvas.height, isDark),
      );
    };

    updateCanvasSize();
    window.addEventListener("resize", updateCanvasSize);

    function drawBeam(ctx: CanvasRenderingContext2D, beam: Beam) {
      ctx.save();
      ctx.translate(beam.x, beam.y);
      ctx.rotate((beam.angle * Math.PI) / 180);

      const opacity = beam.opacity * (0.8 + Math.sin(beam.pulse) * 0.2);

      const gradient = ctx.createLinearGradient(0, 0, 0, beam.length);

      gradient.addColorStop(0, `hsla(${beam.hue}, 85%, 65%, 0)`);
      gradient.addColorStop(0.4, `hsla(${beam.hue}, 85%, 65%, ${opacity})`);
      gradient.addColorStop(0.6, `hsla(${beam.hue}, 85%, 65%, ${opacity})`);
      gradient.addColorStop(1, `hsla(${beam.hue}, 85%, 65%, 0)`);

      ctx.fillStyle = gradient;
      ctx.fillRect(-beam.width / 2, 0, beam.width, beam.length);
      ctx.restore();
    }

    function animate() {
      if (!canvas || !ctx) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.filter = isDark ? "blur(25px)" : "blur(20px)";

      beamsRef.current.forEach((beam) => {
        beam.y -= beam.speed;
        beam.pulse += beam.pulseSpeed;

        if (beam.y + beam.length < -100) {
          Object.assign(beam, createBeam(canvas.width, canvas.height, isDark));
          beam.y = canvas.height + 100;
        }

        drawBeam(ctx, beam);
      });

      animationFrameRef.current = requestAnimationFrame(animate);
    }

    animate();

    return () => {
      window.removeEventListener("resize", updateCanvasSize);
      cancelAnimationFrame(animationFrameRef.current);
    };
  }, [isDark]);

  return (
    <div className="fixed inset-0 -z-10">
      {/* base color (muda com tema) */}
      <div
        className={`absolute inset-0 ${
          isDark
            ? "bg-neutral-950"
            : "bg-gradient-to-br from-white via-blue-50 to-purple-100"
        }`}
      />

      {/* canvas */}
      <canvas ref={canvasRef} className="absolute inset-0" />

      {/* glass overlay */}
      <div className="absolute inset-0 backdrop-blur-[40px] bg-white/10 dark:bg-black/10" />
    </div>
  );
}
