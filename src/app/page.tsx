'use client';

import { usePublicEvents } from '@/features/events/hooks/publicEvents/usePublicEvents';
import PublicNavbar from '@/shared/components/layout/public-navbar';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent } from '@/shared/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/shared/components/ui/carousel';
import { getGradientClass } from '@/shared/utils/getGenerateGradient';
import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  const {
    events,
    loading: eventsLoading,
    error: eventsError,
    refetch: refetchEvents,
  } = usePublicEvents();

  const handleLoginClick = () => {
    router.push('/login');
  };

  const handleEventClick = (eventId: string) => {
    router.push(`/events/${eventId}`);
  };

  return (
    <div className="min-h-screen">
      {/* Navbar */}
      <PublicNavbar />

      {/* Hero Section */}
      <section
        id="hero"
        className="relative flex min-h-screen items-center justify-center px-4"
      >
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
              className="mb-8 text-5xl leading-[0.95] font-bold tracking-[-0.04em] text-gray-900 md:text-7xl lg:text-8xl xl:text-9xl dark:text-white"
            >
              Sistema
              <br />
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Inscrições
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4, ease: 'easeOut' }}
              className="mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-gray-600 md:text-xl dark:text-gray-300"
            >
              Transforme a gestão de eventos em uma experiência fluida e
              intuitiva.
              <br />
              Organize, gerencie e acompanhe inscrições com eficiência.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6, ease: 'easeOut' }}
              className="flex flex-col items-center justify-center gap-4 sm:flex-row"
            >
              {/* Primary */}
              <button
                onClick={handleLoginClick}
                className="group relative overflow-hidden rounded-full px-8 py-4 text-lg font-semibold text-white transition-all duration-300 hover:scale-103"
              >
                <span className="relative z-10">Acessar Sistema</span>

                {/* Gradiente base */}
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600" />

                {/* Hover glow */}
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              </button>

              {/* Secondary */}
              <button
                onClick={() => {
                  const element = document.getElementById('eventos');
                  if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="liquid-glass-button-light rounded-full px-8 py-4 text-lg font-semibold text-gray-900/80 transition-all duration-300 dark:text-white/80"
              >
                Ver Eventos
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Eventos Section */}
      <section id="eventos" className="min-h-screen w-full px-4 py-20">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="mb-8 max-w-3xl"
          >
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-2 text-5xl leading-tight font-bold tracking-[-0.02em] text-gray-900 md:text-6xl lg:text-7xl dark:text-white"
            >
              Próximos Eventos
            </motion.h2>
            <motion.div
              initial={{ opacity: 0, width: 0 }}
              whileInView={{ opacity: 1, width: '100px' }}
              viewport={{ once: true }}
              className="h-1 rounded-full bg-gradient-to-r from-blue-500 to-purple-500"
            />

            <p className="text-base leading-relaxed text-gray-600 md:text-lg dark:text-gray-300">
              Explore os eventos em destaque e descubra novas oportunidades para
              participar e se conectar.
            </p>
          </motion.div>

          {eventsLoading ? (
            <div className="flex min-h-96 items-center justify-center">
              <div className="text-center">
                <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-indigo-600"></div>
                <p className="text-gray-600 dark:text-gray-400">
                  Carregando eventos...
                </p>
              </div>
            </div>
          ) : eventsError ? (
            <div className="flex min-h-96 items-center justify-center">
              <div className="text-center">
                <h3 className="mb-2 text-xl font-semibold text-red-600">
                  Erro ao carregar eventos
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Não foi possível carregar os eventos no momento.
                </p>
              </div>
            </div>
          ) : events && events.length > 0 ? (
            <div className="w-full">
              <Carousel
                opts={{
                  align: 'start',
                  loop: true,
                }}
                className="w-full"
              >
                <CarouselContent className="">
                  {events.map((event) => {
                    const gradientClass = getGradientClass(event.name);
                    return (
                      <CarouselItem
                        key={event.id}
                        className="basis-[85%] pl-2 md:basis-[60%] md:pl-4 lg:basis-[45%]"
                      >
                        <Card
                          className="liquid-glass-light h-full cursor-pointer p-0 transition-all duration-300 hover:scale-[1.02]"
                          onClick={() => handleEventClick(event.id)}
                        >
                          <CardContent className="p-0">
                            <div className="relative h-62 w-full overflow-hidden rounded-t-lg">
                              {event.image ? (
                                <Image
                                  src={event.image}
                                  alt={event.name}
                                  fill
                                  className="object-cover object-center"
                                />
                              ) : (
                                <div
                                  className={`h-full w-full bg-gradient-to-br ${gradientClass} flex items-end justify-start p-4`}
                                >
                                  <span className="text-left text-lg font-bold text-white uppercase">
                                    {event.name}
                                  </span>
                                </div>
                              )}
                            </div>
                            <div className="p-4">
                              <h3 className="mb-2 line-clamp-2 text-lg font-bold uppercase">
                                {event.name}
                              </h3>
                              <div className="mb-2 flex items-center text-sm text-gray-600 dark:text-gray-400">
                                <MapPin className="mr-2 h-4 w-4 flex-shrink-0" />
                                <span className="line-clamp-1">
                                  {event.location}
                                </span>
                              </div>
                              <Button
                                size="sm"
                                className="liquid-glass-button-light mt-3 w-full border-blue-400/40 bg-blue-500/10 font-medium text-blue-600 hover:bg-blue-500/20 dark:text-blue-300"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleEventClick(event.id);
                                }}
                              >
                                Ver Detalhes
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      </CarouselItem>
                    );
                  })}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
              </Carousel>
            </div>
          ) : (
            <div className="py-12 text-center">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Nenhum evento encontrado
              </h3>
              <p className="mt-2 text-gray-500 dark:text-gray-400">
                Não há eventos disponíveis no momento.
              </p>
            </div>
          )}
        </div>
      </section>
      {/*
      <section
        id="sobre"
        className="flex min-h-screen items-center justify-center bg-white/50 px-4 backdrop-blur-sm dark:bg-gray-800/50"
      >
        <div className="mx-auto max-w-7xl">
          <div className="mb-16 text-center">
            <h2 className="mb-6 text-4xl font-bold text-gray-900 md:text-5xl dark:text-white">
              Sobre o Sistema
            </h2>
            <p className="mx-auto max-w-3xl text-xl text-gray-600 dark:text-gray-300">
              Uma solução completa para gerenciamento de eventos e inscrições
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            <div className="rounded-2xl bg-white/80 p-6 text-center shadow-lg transition-all duration-300 hover:shadow-xl dark:bg-gray-900/80">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-indigo-500 to-purple-500">
                <i className="bi bi-people text-2xl text-white"></i>
              </div>
              <h3 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
                Gestão de Participantes
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Controle completo de inscrições, dados dos participantes e
                confirmações de presença.
              </p>
            </div>

            <div className="rounded-2xl bg-white/80 p-6 text-center shadow-lg transition-all duration-300 hover:shadow-xl dark:bg-gray-900/80">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-green-500 to-blue-500">
                <i className="bi bi-calendar-event text-2xl text-white"></i>
              </div>
              <h3 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
                Organização de Eventos
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Crie e gerencie eventos com facilidade, definindo datas, locais
                e muito mais.
              </p>
            </div>

            <div className="rounded-2xl bg-white/80 p-6 text-center shadow-lg transition-all duration-300 hover:shadow-xl dark:bg-gray-900/80">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-orange-500 to-red-500">
                <i className="bi bi-graph-up text-2xl text-white"></i>
              </div>
              <h3 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
                Relatórios e Analytics
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Acompanhe métricas importantes e gere relatórios detalhados dos
                seus eventos.
              </p>
            </div>
          </div>
        </div>
      </section> */}

      {/* Footer */}
      <footer className="bg-gray-900 px-4 py-12 text-white dark:bg-gray-950">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 md:grid-cols-4">
            <div className="md:col-span-2">
              <h3 className="mb-4 text-2xl font-bold">Sistema de Inscrição</h3>
              <p className="mb-4 text-gray-400">
                Uma plataforma completa para gerenciamento de eventos e
                inscrições, desenvolvida para facilitar a organização e
                participação em Conferência.
              </p>
              <div className="flex space-x-4">
                <a
                  href="#"
                  className="text-gray-400 transition-colors hover:text-white"
                >
                  <i className="bi bi-facebook text-xl"></i>
                </a>
                <a
                  href="#"
                  className="text-gray-400 transition-colors hover:text-white"
                >
                  <i className="bi bi-twitter text-xl"></i>
                </a>
                <a
                  href="#"
                  className="text-gray-400 transition-colors hover:text-white"
                >
                  <i className="bi bi-linkedin text-xl"></i>
                </a>
                <a
                  href="#"
                  className="text-gray-400 transition-colors hover:text-white"
                >
                  <i className="bi bi-instagram text-xl"></i>
                </a>
              </div>
            </div>

            <div>
              <h4 className="mb-4 text-lg font-semibold">Links Úteis</h4>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#eventos"
                    className="text-gray-400 transition-colors hover:text-white"
                  >
                    Eventos
                  </a>
                </li>
                <li>
                  <a
                    href="#sobre"
                    className="text-gray-400 transition-colors hover:text-white"
                  >
                    Sobre
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 transition-colors hover:text-white"
                  >
                    Contato
                  </a>
                </li>
                <li>
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href="/documentation"
                    className="text-gray-400 transition-colors hover:text-white"
                  >
                    Suporte
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="mb-4 text-lg font-semibold">Contato</h4>
              <div className="space-y-2 text-gray-400">
                <div className="flex items-center">
                  <i className="bi bi-phone mr-2"></i>
                  <span>(91) 99258-7483</span>
                </div>
                <div className="flex items-center">
                  <i className="bi bi-geo-alt mr-2"></i>
                  <span>Belém, PA - Brasil</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>
              &copy; 2025 Sistema de Inscrição. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
