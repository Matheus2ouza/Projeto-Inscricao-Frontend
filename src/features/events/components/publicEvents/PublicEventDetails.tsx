'use client';

import {
  PublicEventInscriptionCta,
  type SubscriptionStatus,
} from '@/features/events/components/publicEvents/PublicEventInscriptionCta';
import { Event } from '@/features/events/types/publicEvents/publicEventsTypes';
import { GuestInscriptionAlready } from '@/shared/components/GuestInscriptionAlready';
import { Button } from '@/shared/components/ui/button';
import { ImageSwatches } from '@/shared/hooks/useImagePalette';
import { formatInput } from '@/shared/utils/format';
import { generateGradientClass } from '@/shared/utils/generateGradient';
import { getWithExpiry, setWithExpiry } from '@/shared/utils/storageWithExpiry';
import { Calendar, Loader2, MapPin, Share2 } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

type PublicEventDetailsProps = {
  event: Event | null;
  palette: string[];
  isDark: boolean;
  swatches?: ImageSwatches;
};

export function PublicEventDetails({
  event,
  palette,
  isDark,
  swatches,
}: PublicEventDetailsProps) {
  const router = useRouter();
  const [imageLoading, setImageLoading] = useState(true);
  const [imageFailed, setImageFailed] = useState(false);
  const [alreadyDialogOpen, setAlreadyDialogOpen] = useState(false);
  const throttleKey = 'guest_inscription_already_throttle_5m';

  const handleViewSubscription = (eventId: string) => {
    router.push(`/guest/${eventId}/inscription`);
  };

  useEffect(() => {
    if (!event?.id) {
      setAlreadyDialogOpen(false);
      return;
    }

    const cached = getWithExpiry<{
      eventId: string;
      confirmationCode: string;
      thereIsPayment?: boolean;
    }>('guest_inscription');

    if (
      !cached ||
      cached.eventId !== event.id ||
      !cached.confirmationCode ||
      cached.thereIsPayment
    ) {
      setAlreadyDialogOpen(false);
      return;
    }

    const throttled = getWithExpiry<boolean>(throttleKey);
    if (throttled) {
      setAlreadyDialogOpen(false);
      return;
    }

    setAlreadyDialogOpen(true);
  }, [event?.id]);

  const getEventStatus = () => {
    if (!event)
      return {
        status: 'loading',
        label: 'Carregando...',
        color: 'bg-gray-500',
      };
    const now = new Date();
    const start = new Date(event.startDate);
    const end = new Date(event.endDate);
    if (now < start)
      return { status: 'soon', label: 'Em Breve', color: 'bg-blue-500' };
    if (now > end)
      return { status: 'finalized', label: 'Encerrado', color: 'bg-gray-500' };
    return { status: 'ongoing', label: 'Ao Vivo', color: 'bg-green-500' };
  };

  const getSubscriptionStatus = (): SubscriptionStatus => {
    if (!event)
      return { status: 'loading', label: 'Carregando...', description: '' };
    const eventStatus = getEventStatus();
    if (eventStatus.status === 'finalized') {
      return {
        status: 'finalized',
        label: 'Inscrições Encerradas',
        description: 'Este evento já foi finalizado',
      };
    }
    if (event.status === 'CLOSE') {
      return {
        status: 'closed',
        label: 'Inscrições Fechadas',
        description: 'As inscrições ainda não foram abertas',
      };
    }
    return {
      status: 'open',
      label: 'Inscrições Abertas',
      description: 'Inscreva-se agora para participar',
    };
  };

  const handleShare = () => {
    if (event && navigator.share) {
      navigator.share({
        title: event.name,
        text: `Confira o evento: ${event.name}`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copiado para a área de transferência!');
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
    const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.name)}&dates=${startDate}/${endDate}&details=${encodeURIComponent(`Evento: ${event.name}\nLocal: ${event.location || 'A definir'}`)}`;
    window.open(calendarUrl, '_blank');
  };

  const handleOpenRoute = () => {
    if (!event) return;
    const destination = `${event.latitude}, ${event.longitude}`;
    const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${destination}&travelmode=driving`;
    window.open(mapsUrl, '_blank');
  };

  const preferredSwatch = useMemo(() => {
    if (!swatches) return null;

    return (
      (isDark ? swatches.DarkVibrant : swatches.LightVibrant) ??
      swatches.Vibrant ??
      swatches.Muted ??
      swatches.DarkMuted ??
      swatches.LightMuted
    );
  }, [isDark, swatches]);

  const recommendedTitleColor =
    preferredSwatch?.titleTextColor ?? (isDark ? '#FFFFFF' : '#1F2937');
  const recommendedBodyColor =
    preferredSwatch?.bodyTextColor ?? (isDark ? '#B0BEC5' : '#374151');

  // ✅ Glass surface adaptado ao tema
  const glassSurfaceClass = isDark
    ? 'bg-white/10 border-white/10'
    : 'bg-black/5 border-black/10';

  const accent = palette?.[0] ?? (isDark ? '#2A8A85' : '#3FB5AE');

  if (!event) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <p className="text-foreground mb-4">Evento não encontrado</p>
          <Button onClick={() => router.back()}>Voltar</Button>
        </div>
      </div>
    );
  }

  const gradientClass = generateGradientClass();
  const subscriptionStatus = getSubscriptionStatus();
  const shouldShowImage = Boolean(event.image && !imageFailed);
  const hasCoordinates =
    typeof event.latitude === 'number' &&
    typeof event.longitude === 'number' &&
    event.latitude !== 0 &&
    event.longitude !== 0;

  return (
    <div className="space-y-6">
      <GuestInscriptionAlready
        open={alreadyDialogOpen}
        onOpenChange={(open: boolean) => {
          if (!open) {
            setWithExpiry(throttleKey, true, 5 * 60 * 1000);
          }
          setAlreadyDialogOpen(open);
        }}
        onView={() => {
          setWithExpiry(throttleKey, true, 5 * 60 * 1000);
          setAlreadyDialogOpen(false);
          handleViewSubscription(event.id);
        }}
      />

      {/* Card principal */}
      <div
        className={`relative flex flex-col gap-4 overflow-hidden rounded-2xl border p-4 shadow-sm backdrop-blur-md sm:flex-row sm:p-6 ${glassSurfaceClass}`}
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-20"
          style={{
            background: `radial-gradient(750px circle at 18% 15%, ${accent} 0%, transparent 60%)`,
          }}
        />

        {/* Imagem */}
        <div className="relative flex-shrink-0">
          <div className="relative h-32 w-32 overflow-hidden rounded-2xl sm:h-40 md:h-48 md:w-48">
            {shouldShowImage && event.image ? (
              <>
                {imageLoading && (
                  <div className="bg-muted/60 absolute inset-0 z-20 flex items-center justify-center dark:bg-black/40">
                    <Loader2 className="text-muted-foreground h-6 w-6 animate-spin" />
                  </div>
                )}
                <Image
                  src={event.image}
                  alt={event.name}
                  fill
                  priority
                  sizes="(max-width: 768px) 128px, 192px"
                  className="object-cover"
                  onLoad={() => setImageLoading(false)}
                  onError={() => {
                    setImageFailed(true);
                    setImageLoading(false);
                  }}
                />
              </>
            ) : (
              <div
                className={`h-full w-full bg-gradient-to-br ${gradientClass} flex items-center justify-center`}
              >
                <div className="absolute inset-0 bg-black/20" />
              </div>
            )}
          </div>
        </div>

        {/* Informações */}
        <div className="flex flex-1 flex-col justify-between space-y-3">
          <div className="space-y-2">
            {/* Tags */}
            <div className="flex flex-wrap items-center gap-2">
              <span
                className="inline-flex items-center rounded-full border border-white/10 bg-black/30 px-2.5 py-0.5 text-[10px] font-medium tracking-wider uppercase backdrop-blur-sm sm:text-xs"
                style={{ color: recommendedBodyColor }}
              >
                {event.regionName || 'Evento'}
              </span>
              <span className="h-3 w-px bg-white/20" />
              <span
                className="inline-flex items-center rounded-full border border-white/10 bg-black/30 px-2.5 py-0.5 text-[10px] font-medium backdrop-blur-sm sm:text-xs"
                style={{ color: recommendedBodyColor }}
              >
                {formatInput(event.startDate, 'date', {
                  month: 'short',
                  year: 'numeric',
                })}
              </span>
            </div>

            {/* Título do evento */}
            <h1
              className="text-xl leading-tight font-bold tracking-tight sm:text-2xl md:text-3xl"
              style={{ color: recommendedTitleColor }}
            >
              {event.name}
            </h1>

            {/* Localização resumida */}
            {event.location && (
              <div
                className="flex items-center gap-1.5 text-xs opacity-70 sm:text-sm"
                style={{ color: recommendedBodyColor }}
              >
                <MapPin
                  className="h-3 w-3 sm:h-4 sm:w-4"
                  style={{ color: accent }}
                />
                <span>{event.location}</span>
              </div>
            )}
          </div>

          {/* Botões de ação */}
          <div className="flex flex-wrap gap-2">
            <Button
              variant="ghost"
              size="sm"
              className={`group gap-1.5 rounded-xl border bg-white/5 px-3 py-2 text-xs backdrop-blur-md transition-all hover:scale-[1.02] hover:bg-white/10 active:scale-[0.98] sm:gap-2 sm:px-4 sm:text-sm ${glassSurfaceClass}`}
              onClick={handleShare}
            >
              <Share2
                className="h-3 w-3 sm:h-4 sm:w-4"
                style={{ color: accent }}
              />
              <span style={{ color: recommendedTitleColor }}>Compartilhar</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={`group gap-1.5 rounded-xl border bg-white/5 px-3 py-2 text-xs backdrop-blur-md transition-all hover:scale-[1.02] hover:bg-white/10 active:scale-[0.98] sm:gap-2 sm:px-4 sm:text-sm ${glassSurfaceClass}`}
              onClick={handleAddToCalendar}
            >
              <Calendar
                className="h-3 w-3 sm:h-4 sm:w-4"
                style={{ color: accent }}
              />
              <span style={{ color: recommendedTitleColor }}>Agenda</span>
            </Button>
            {hasCoordinates && (
              <Button
                variant="ghost"
                size="sm"
                className={`group gap-1.5 rounded-xl border bg-white/5 px-3 py-2 text-xs backdrop-blur-md transition-all hover:scale-[1.02] hover:bg-white/10 active:scale-[0.98] sm:gap-2 sm:px-4 sm:text-sm ${glassSurfaceClass}`}
                onClick={handleOpenRoute}
              >
                <MapPin
                  className="h-3 w-3 sm:h-4 sm:w-4"
                  style={{ color: accent }}
                />
                <span style={{ color: recommendedTitleColor }}>Rota</span>
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <PublicEventInscriptionCta
          eventId={event.id}
          allowedInscriptionModes={event.allowedInscriptionModes}
          subscriptionStatus={subscriptionStatus}
          eventDate={event.startDate}
          accentColor={accent}
          titleColor={recommendedTitleColor}
          bodyColor={recommendedBodyColor}
          glassSurfaceClass={glassSurfaceClass}
        />
      </div>
    </div>
  );
}
