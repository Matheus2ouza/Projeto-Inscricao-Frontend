'use client';

import { Event } from '@/features/events/types/publicEvents/publicEventsTypes';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent } from '@/shared/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/shared/components/ui/carousel';
import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';
import { useRouter } from 'next/navigation';
import EventImage from './EventImage';

interface EventsSectionProps {
  events: Event[];
}

export default function EventsSection({ events }: EventsSectionProps) {
  const router = useRouter();

  const handleEventClick = (eventId: string) => {
    router.push(`/events/${eventId}`);
  };

  return (
    <section id="eventos" className="min-h-screen w-full px-4 py-20">
      <div className="mx-auto max-w-7xl">
        {/* CONTAINER PRINCIPAL COM STAGGER */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{
            visible: {
              transition: {
                staggerChildren: 0.2,
              },
            },
          }}
        >
          {/* HEADER */}
          <motion.div
            className="mb-8 max-w-3xl"
            variants={{
              hidden: { opacity: 0, y: 30 },
              visible: { opacity: 1, y: 0 },
            }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            <h2 className="mb-2 text-5xl leading-tight font-bold tracking-[-0.02em] text-gray-900 md:text-6xl lg:text-7xl dark:text-white">
              Próximos Eventos
            </h2>

            <motion.div
              className="h-1 rounded-full bg-gradient-to-r from-blue-500 to-purple-500"
              variants={{
                hidden: { width: 0, opacity: 0 },
                visible: { width: 100, opacity: 1 },
              }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            />

            <p className="mt-2 text-base leading-relaxed text-gray-600 md:text-lg dark:text-gray-300">
              Explore os eventos em destaque e descubra novas oportunidades para
              participar e se conectar.
            </p>
          </motion.div>

          {/* CAROUSEL */}
          {events.length > 0 ? (
            <motion.div
              className="w-full"
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            >
              <Carousel
                opts={{ align: 'start', loop: true }}
                className="w-full"
              >
                <CarouselContent>
                  {events.map((event) => (
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
                            <EventImage image={event.image} name={event.name} />
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
                  ))}
                </CarouselContent>

                <CarouselPrevious />
                <CarouselNext />
              </Carousel>
            </motion.div>
          ) : (
            <motion.div
              className="py-12 text-center"
              variants={{
                hidden: { opacity: 0 },
                visible: { opacity: 1 },
              }}
            >
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Nenhum evento encontrado
              </h3>
              <p className="mt-2 text-gray-500 dark:text-gray-400">
                Não há eventos disponíveis no momento.
              </p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
