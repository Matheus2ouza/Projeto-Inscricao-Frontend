'use client';

import EventMap from '@/shared/components/EventMap';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { generateGradientClass } from '@/shared/utils/generateGradient';
import { getEventStatusInfo } from '@/shared/utils/getEventStatusInfo';
import { getFormatCurrency } from '@/shared/utils/getFormatCurrency';
import { Calendar, Car, Clock, Loader2, MapPin, Share2 } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import { EventManager } from '../types/eventTypes';

interface DetailsEventProps {
  event: EventManager | null;
  individualInscriptionClick: () => void;
  groupInscriptionClick: () => void;
}

const getDateDetails = (date: string | Date) => {
  const parsedDate = new Date(date);

  const rawDate = parsedDate.toLocaleDateString('pt-BR', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  return {
    weekday: parsedDate.toLocaleDateString('pt-BR', { weekday: 'long' }),
    date: rawDate.replace('.', ''),
    time: parsedDate.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
    }),
  };
};

const getEventCountdownLabel = (start: string | Date) => {
  const now = new Date();
  const startDate = new Date(start);
  const normalizedNow = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
  );
  const normalizedStart = new Date(
    startDate.getFullYear(),
    startDate.getMonth(),
    startDate.getDate(),
  );
  const diffMs = normalizedStart.getTime() - normalizedNow.getTime();
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays > 1) {
    return `Faltam ${diffDays} dias para o evento`;
  }

  if (diffDays === 1) {
    return 'Evento começa amanhã';
  }

  if (diffDays === 0) {
    return 'Evento começa hoje';
  }

  return 'Evento já começou';
};

export default function DetailsEvent({
  event,
  individualInscriptionClick,
  groupInscriptionClick,
}: DetailsEventProps) {
  const router = useRouter();
  const [imageLoading, setImageLoading] = useState(true);
  const [imageFailed, setImageFailed] = useState(false);

  const handleShare = () => {
    if (event && navigator.share) {
      navigator.share({
        title: event.name,
        text: `Confira o evento: ${event.name}`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.info('Copiado com Sucesso', {
        description: `Link do evento: ${event?.name.toUpperCase()} copiado com sucesso`,
      });
    }
  };

  const handleAddToCalendar = () => {
    if (!event) return;

    const startDate = new Date(event.startDate)
      .toISOString()
      .replace(/-|:|\.\d+/g, '');
    const endDate = new Date(event.endDate)
      .toISOString()
      .replace(/-|:|\.\d+/g, '');

    const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
      event.name,
    )}&dates=${startDate}/${endDate}&details=${encodeURIComponent(
      `Evento: ${event.name}\nLocal: ${event.location || 'A definir'}`,
    )}`;

    window.open(calendarUrl, '_blank');
  };

  const handleOpenRoute = () => {
    if (!event) return;

    const destination = `${event.latitude}, ${event.longitude}`;
    const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${destination}&travelmode=driving`;

    window.open(mapsUrl, '_blank');
  };

  if (!event) {
    return (
      <div className="rounded-2xl border border-gray-200/80 bg-white/90 p-10 text-center backdrop-blur-md dark:border-white/10 dark:bg-white/5">
        <h2 className="mb-2 text-2xl font-semibold text-gray-900 dark:text-white">
          Evento não encontrado
        </h2>
        <p className="text-muted-foreground">
          O evento solicitado não está disponível.
        </p>
      </div>
    );
  }

  const statusInfo = getEventStatusInfo(event.status);
  const gradientClass = generateGradientClass();
  const shouldShowImage = Boolean(event.imageUrl && !imageFailed);
  const hasCoordinates =
    typeof event.latitude === 'number' &&
    typeof event.longitude === 'number' &&
    typeof event.location;
  const startDetails = getDateDetails(event.startDate);
  const endDetails = getDateDetails(event.endDate);
  const countdownLabel = getEventCountdownLabel(event.startDate);

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="bg-muted relative aspect-video w-full overflow-hidden rounded-3xl shadow-lg">
        {shouldShowImage ? (
          <>
            {imageLoading && (
              <div className="bg-muted/60 absolute inset-0 z-20 flex items-center justify-center dark:bg-black/40">
                <Loader2 className="text-muted-foreground h-8 w-8 animate-spin" />
              </div>
            )}
            <Image
              src={event.imageUrl as string}
              alt={event.name}
              fill
              priority
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
              className="object-cover"
              onLoad={() => setImageLoading(false)}
              onError={() => {
                setImageFailed(true);
                setImageLoading(false);
              }}
            />
            {/* Gradient Overlay for Text Readability */}
            <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
          </>
        ) : (
          <div
            className={`h-full w-full bg-gradient-to-br ${gradientClass} flex items-center justify-center`}
          >
            <div className="absolute inset-0 bg-black/20" />
          </div>
        )}

        <div className="absolute right-0 bottom-0 left-0 z-20 p-4 sm:p-8 md:p-10">
          <p className="mb-1 text-xs font-medium tracking-[0.3em] text-white/90 uppercase drop-shadow-md sm:mb-2 sm:text-xl">
            Evento
          </p>
          <h1 className="text-2xl leading-tight font-bold break-words text-white uppercase drop-shadow-lg sm:text-4xl md:text-5xl">
            {event.name}
          </h1>
        </div>
      </div>

      <div className="space-y-6">
        <section className="space-y-6 rounded-2xl border border-gray-200/80 bg-white/95 p-4 shadow-sm backdrop-blur-md sm:space-y-8 sm:p-6 dark:border-white/10 dark:bg-white/5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 sm:text-2xl dark:text-white">
                Agenda do Evento
              </h2>
              <p className="text-muted-foreground text-sm">
                Veja a data e o local em que o evento será realizado.
              </p>
            </div>
            <div className="bg-primary/10 text-primary inline-flex w-full items-center justify-center gap-2 rounded-full px-3 py-1 text-xs font-semibold sm:w-auto sm:justify-start sm:px-4 sm:text-sm">
              <Clock className="h-4 w-4" />
              {countdownLabel}
            </div>
          </div>

          <div className="space-y-6 rounded-2xl border border-gray-200/70 bg-white/80 p-4 sm:p-6 dark:border-white/10 dark:bg-white/5">
            <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <p className="text-muted-foreground text-xs tracking-[0.2em] uppercase">
                  Início
                </p>
                <p className="text-xl leading-tight font-semibold text-gray-900 sm:text-2xl dark:text-white">
                  {startDetails.date}
                </p>
              </div>

              <div className="space-y-2">
                <p className="text-muted-foreground text-xs tracking-[0.2em] uppercase">
                  Encerramento
                </p>
                <p className="text-xl leading-tight font-semibold text-gray-900 sm:text-2xl dark:text-white">
                  {endDetails.date}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Localização
                </h2>
                {event.location && (
                  <div className="mt-2 flex items-center gap-2 text-gray-700 dark:text-gray-200">
                    <MapPin className="text-primary h-5 w-5 shrink-0" />
                    <p className="text-base font-medium sm:text-lg">
                      {event.location}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {hasCoordinates ? (
              <>
                <div className="overflow-hidden rounded-2xl border border-gray-200/70 dark:border-white/10">
                  <EventMap
                    lat={event.latitude as number}
                    lng={event.longitude as number}
                    height="300px"
                    markerTitle={event.name}
                  />
                </div>
                <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:gap-4 lg:mb-8">
                  <Button
                    variant="outline"
                    className="flex-1 justify-center gap-2 py-4 text-sm sm:gap-3 sm:py-6 sm:text-base"
                    onClick={handleShare}
                  >
                    <Share2 className="h-4 w-4 sm:h-5 sm:w-5" />
                    Compartilhar
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1 justify-center gap-2 py-4 text-sm sm:gap-3 sm:py-6 sm:text-base"
                    onClick={handleAddToCalendar}
                  >
                    <Calendar className="h-4 w-4 sm:h-5 sm:w-5" />
                    Adicionar à Agenda
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1 justify-center gap-2 py-4 text-sm sm:gap-3 sm:py-6 sm:text-base"
                    onClick={handleOpenRoute}
                  >
                    <Car className="size-5" />
                    Traçar Rota
                  </Button>
                </div>
              </>
            ) : (
              <div className="flex h-48 items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-gray-50/70 text-center dark:border-white/10 dark:bg-white/5">
                <p className="text-muted-foreground px-6 text-sm">
                  Os organizadores ainda não compartilharam o ponto no mapa.
                </p>
              </div>
            )}
          </div>
        </section>

        <section className="space-y-6 rounded-2xl border border-gray-200/80 bg-white/95 p-4 shadow-sm backdrop-blur-md sm:p-6 dark:border-white/10 dark:bg-white/5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 sm:text-2xl dark:text-white">
                Inscrições
              </h2>
              <p className="text-muted-foreground text-sm">
                Esses são os tipos de inscrições disponíveis para o evento:{' '}
                {event.name}.
              </p>
            </div>

            <Badge className={`${statusInfo.badgeClass} border-0`}>
              {statusInfo.label}
            </Badge>
          </div>

          {statusInfo.disabled && (
            <div className="bg-muted/40 border-muted/60 text-muted-foreground rounded-xl border p-4 text-sm dark:border-white/10 dark:bg-white/5">
              {event.status === 'FINALIZED'
                ? 'Este evento já foi finalizado. Consulte futuras edições com os organizadores.'
                : 'As inscrições estão indisponíveis no momento. Fique atento às próximas atualizações.'}
            </div>
          )}

          <div className="space-y-3">
            {event.typeInscriptions && event.typeInscriptions.length > 0 ? (
              <div className="space-y-3">
                {event.typeInscriptions.map((type, index) => (
                  <div
                    key={`${type.description}-${index}`}
                    className="flex flex-col gap-2 rounded-xl border border-gray-200/80 bg-gray-50/80 p-4 backdrop-blur dark:border-white/10 dark:bg-white/5"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-sm font-semibold text-gray-900 sm:text-base dark:text-white">
                        {type.description}
                      </span>
                      <span className="text-primary text-base font-bold whitespace-nowrap sm:text-lg">
                        {type.value > 0
                          ? getFormatCurrency(type.value)
                          : 'Gratuito'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-sm">
                As modalidades serão divulgadas em breve.
              </p>
            )}
          </div>

          {event.status === 'FINALIZED' && (
            <div className="border-primary/40 bg-primary/5 text-primary/80 rounded-xl border border-dashed p-4 text-sm">
              {event.status === 'FINALIZED'
                ? 'Inscrições encerradas porque o evento já aconteceu.'
                : 'Assim que o evento for aberto, os botões de inscrição ficarão disponíveis automaticamente.'}
            </div>
          )}

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button
              size="lg"
              className="w-full rounded-xl py-6 text-base sm:flex-1 dark:text-white"
              onClick={individualInscriptionClick}
              disabled={statusInfo.disabled}
            >
              Inscrição Individual
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="w-full rounded-xl py-6 text-base sm:flex-1"
              onClick={groupInscriptionClick}
              disabled={statusInfo.disabled}
            >
              Inscrição em Grupo
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
}
