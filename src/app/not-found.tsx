"use client";

import { Button } from "@/shared/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";

const cosmicMessages = [
  "A galáxia não tem registro desse URL.",
  "O mapa mostra um buraco negro. Provavelmente não há rota aqui.",
  "O evento fugiu de pista. Essa página não existe.",
  "Os alienígenas sequestraram essa rota. Nada para ver aqui.",
  "Este ponto do universo ainda está em construção.",
  "Tentamos rastrear o caminho, mas só encontramos poeira estelar.",
  "Você navegou para fora da órbita. Página não identificada.",
  "Os satélites perderam o sinal deste endereço.",
  "Essa coordenada espacial não consta nos mapas intergalácticos.",
  "Você encontrou um vazio cósmico. Nada existe por aqui.",
  "Esta página evaporou em um supernova.",
  "O hiper-salto falhou. Destino inexistente.",
  "A estrela-guia não ilumina esse caminho.",
  "Os robôs exploradores não acharam nenhum conteúdo por aqui.",
  "Essa página caiu em um loop temporal e desapareceu.",
];

function StarryBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    if (!canvas) return;

    const ctx = canvas.getContext("2d")!;
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    class Star {
      x: number;
      y: number;
      radius: number;
      vx: number;
      vy: number;
      opacity: number;
      twinkleSpeed: number;

      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.radius = Math.random() * 2;
        this.vx = (Math.random() - 0.5) * 0.3;
        this.vy = (Math.random() - 0.5) * 0.3;
        this.opacity = Math.random();
        this.twinkleSpeed = Math.random() * 0.02 + 0.01;
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
        ctx.fill();
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0) this.x = canvas.width;
        if (this.x > canvas.width) this.x = 0;
        if (this.y < 0) this.y = canvas.height;
        if (this.y > canvas.height) this.y = 0;

        this.opacity += this.twinkleSpeed;
        if (this.opacity > 1 || this.opacity < 0.3) {
          this.twinkleSpeed = -this.twinkleSpeed;
        }

        this.draw();
      }
    }

    const stars: Star[] = [];
    const starCount = 200;
    for (let i = 0; i < starCount; i++) {
      stars.push(new Star());
    }

    const animate = () => {
      ctx.fillStyle = "rgba(10, 10, 30, 1)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      stars.forEach((star) => star.update());
      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  return (
    <div className="absolute inset-0">
      <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  );
}

export default function NotFound() {
  const message =
    cosmicMessages[Math.floor(Math.random() * cosmicMessages.length)];

  return (
    <div className="relative min-h-screen overflow-hidden">
      <StarryBackground />
      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-12">
        <div className="max-w-4xl text-center space-y-6">
          <div className="relative w-full h-64 sm:h-72 lg:h-56">
            <Image
              src="/images/img_404.png"
              alt="Ilustração divertida de 404"
              fill
              className="object-contain"
              priority
            />
          </div>
          <div className="text-9xl font-black tracking-tight text-white drop-shadow-lg">
            404
          </div>
          <h1 className="text-3xl font-bold text-white">
            Página não encontrada
          </h1>
          <p className="text-lg text-slate-200">{message}</p>
          <p className="text-sm text-slate-300">
            Parece que você entrou numa sala secreta, mas não há portas aqui.
            Vamos voltar para o começo antes que a nave decole sem aviso.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Button asChild variant="outline">
              <Link href="/">Voltar ao Dashboard</Link>
            </Button>
            <Button
              variant="ghost"
              className="text-white"
              onClick={() => window.location.reload()}
            >
              Recarregar (vai que funciona)
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
