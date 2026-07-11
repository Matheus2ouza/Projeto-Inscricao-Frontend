'use client';

import { generateGradientClass } from '@/shared/utils/generateGradient';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

export function HeroSection() {
  const router = useRouter();

  const handleLoginClick = () => {
    router.push('/login');
  };

  return (
    <section
      id="hero"
      className="relative flex min-h-screen items-center justify-center px-4"
    >
      <div className="mx-auto max-w-7xl">
        <div className="text-center">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: {
                transition: { staggerChildren: 0.2, delayChildren: 0.2 },
              },
            }}
          >
            <motion.h1
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.8, ease: 'easeOut' },
                },
              }}
              className="mb-8 text-5xl leading-[0.95] font-bold tracking-[-0.04em] text-gray-900 md:text-7xl lg:text-8xl xl:text-9xl dark:text-white"
            >
              Sistema
              <br />
              <span
                className={`bg-gradient-to-r ${generateGradientClass()} bg-clip-text text-transparent`}
              >
                Inscrições
              </span>
            </motion.h1>

            <motion.p
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.8, ease: 'easeOut' },
                },
              }}
              className="mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-gray-600 md:text-xl dark:text-gray-300"
            >
              Transforme a gestão de eventos em uma experiência fluida e
              intuitiva.
              <br />
              Organize, gerencie e acompanhe inscrições com eficiência.
            </motion.p>

            <motion.div
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.8, ease: 'easeOut' },
                },
              }}
              className="flex flex-col items-center justify-center gap-4 sm:flex-row"
            >
              <button
                onClick={handleLoginClick}
                className="group relative overflow-hidden rounded-full px-8 py-4 text-lg font-semibold text-white transition-all duration-300 hover:scale-103"
              >
                <span className="relative z-10">Acessar Sistema</span>
                <div
                  className={`absolute inset-0 bg-gradient-to-r ${generateGradientClass()}`}
                />
                <div
                  className={`absolute inset-0 bg-gradient-to-r ${generateGradientClass()} scale-105 opacity-0 transition-opacity duration-300 group-hover:opacity-100`}
                />
              </button>

              <button
                onClick={() => {
                  document
                    .getElementById('eventos')
                    ?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="liquid-glass-button-light rounded-full px-8 py-4 text-lg font-semibold text-gray-900/80 transition-all duration-300 dark:text-white/80"
              >
                Ver Eventos
              </button>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
