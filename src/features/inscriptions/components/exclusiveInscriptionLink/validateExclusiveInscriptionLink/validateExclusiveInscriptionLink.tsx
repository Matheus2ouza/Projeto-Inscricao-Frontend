'use client';

import { ImageSwatches } from '@/features/guest/hook/guestInscription/useImagePalette';
import {
  ExclusiveInscriptionCta,
  type SubscriptionStatus,
} from '@/features/inscriptions/components/exclusiveInscriptionLink/validateExclusiveInscriptionLink/ExclusiveInscriptionCta';
import {
  Event,
  ExclusiveInscriptionLink,
} from '@/features/inscriptions/types/exclusiveInscriptionLink/validateExclusiveInscriptionLink/validateExclusiveInscriptionLinkTypes';
import { GuestInscriptionAlready } from '@/shared/components/GuestInscriptionAlready';
import { Button } from '@/shared/components/ui/button';
import { getGradientClass } from '@/shared/utils/getGenerateGradient';
import { getWithExpiry, setWithExpiry } from '@/shared/utils/storageWithExpiry';
import { AlertTriangle, Calendar, Loader2, MapPin, Share2 } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

type ValidateExclusiveInscriptionLinkProps = {
  event: Event | null;
  exclusiveInscriptionLink: ExclusiveInscriptionLink | null;
  status: 'valid' | 'inactive' | 'expired';
  canInscribe: boolean;
  palette: string[];
  isDark: boolean;
  swatches?: ImageSwatches;
  onViewSubscription: (eventId: string) => void;
  onSubscribe: (token: string) => void;
};

export default function ValidateExclusiveInscriptionLink({
  event,
  exclusiveInscriptionLink,
  status,
  canInscribe,
  palette,
  isDark,
  swatches,
  onViewSubscription,
  onSubscribe,
}: ValidateExclusiveInscriptionLinkProps) {
  const router = useRouter();
  const [imageLoading, setImageLoading] = useState(true);
  const [imageFailed, setImageFailed] = useState(false);
  const [alreadyDialogOpen, setAlreadyDialogOpen] = useState(false);
  const throttleKey = 'guest_inscription_already_throttle_5m';

  const token = exclusiveInscriptionLink?.token || '';

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

  const formatDate = (date: Date | string) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  };

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
    if (status === 'expired') {
      return {
        status: 'finalized',
        label: 'Link Expirado',
        description: 'Este link de inscrição exclusiva expirou',
      };
    }
    if (status === 'inactive') {
      return {
        status: 'closed',
        label: 'Link Inativo',
        description: 'Este link de inscrição não está ativo',
      };
    }
    const eventStatus = getEventStatus();
    if (eventStatus.status === 'finalized') {
      return {
        status: 'finalized',
        label: 'Inscrições Encerradas',
        description: 'Este evento já foi finalizado',
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
    const destination = event.location || 'Local não informado';
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
    preferredSwatch?.titleTextColor ?? (isDark ? '#ffffff' : '#111111');
  const recommendedBodyColor =
    preferredSwatch?.bodyTextColor ??
    (isDark ? 'rgba(255,255,255,0.78)' : '#374151');
  const glassSurfaceClass = isDark
    ? 'bg-white/20 border-white/20'
    : 'bg-black/5 border-black/10';
  const accent = palette?.[0] ?? 'hsl(var(--primary))';

  if (!exclusiveInscriptionLink || !event) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="text-muted-foreground mx-auto mb-4 h-16 w-16" />
          <h3 className="mb-2 text-lg font-semibold">Link Inválido</h3>
          <p className="text-muted-foreground mb-4">
            Este link de inscrição não é válido ou expirou.
          </p>
          <Button onClick={() => router.back()}>Voltar</Button>
        </div>
      </div>
    );
  }

  const gradientClass = getGradientClass(event.name);
  const subscriptionStatus = getSubscriptionStatus();
  const shouldShowImage = Boolean(event.image && !imageFailed);
  const hasCoordinates = !!event.location;

  return (
    <div className="space-y-6">
      {status !== 'valid' && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-950/30">
          <div className="flex items-start gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 flex-shrink-0 text-amber-600 dark:text-amber-400" />
            <div className="flex-1">
              <p className="mb-1 text-sm font-medium text-amber-800 dark:text-amber-300">
                {subscriptionStatus.label}
              </p>
              <p className="text-sm text-amber-700 dark:text-amber-400">
                {subscriptionStatus.description}
              </p>
            </div>
          </div>
        </div>
      )}

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
          onViewSubscription(event.id);
        }}
      />
      <div
        className={`relative aspect-video w-full overflow-hidden rounded-2xl border shadow-sm backdrop-blur-md ${glassSurfaceClass}`}
      >
        {shouldShowImage ? (
          <>
            {imageLoading && (
              <div className="bg-muted/60 absolute inset-0 z-20 flex items-center justify-center dark:bg-black/40">
                <Loader2 className="text-muted-foreground h-8 w-8 animate-spin" />
              </div>
            )}
            <Image
              src={event.image as string}
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
          <p
            className="mb-1 text-xs font-medium tracking-[0.3em] uppercase drop-shadow-md sm:mb-2 sm:text-xl"
            style={{ color: recommendedBodyColor }}
          >
            Inscrição Exclusiva
          </p>
          <h1
            className="text-2xl leading-tight font-bold break-words uppercase drop-shadow-lg sm:text-4xl md:text-5xl"
            style={{ color: recommendedTitleColor }}
          >
            {event.name}
          </h1>
        </div>
      </div>

      <div className="mb-6 flex flex-col gap-3 sm:flex-row">
        <Button
          variant="outline"
          className={`group relative flex-1 justify-center gap-2 overflow-hidden py-4 shadow-sm backdrop-blur-md transition-all hover:shadow-md active:scale-[0.99] ${glassSurfaceClass}`}
          onClick={handleShare}
        >
          <span className="absolute inset-0 bg-gradient-to-r from-white/10 via-white/0 to-white/10 opacity-0 transition-opacity group-hover:opacity-100" />
          <span
            className="pointer-events-none absolute inset-0 opacity-25"
            style={{
              background: `radial-gradient(550px circle at 20% 30%, ${accent} 0%, transparent 60%)`,
            }}
          />
          <span className="relative inline-flex items-center justify-center gap-2">
            <Share2 className="h-5 w-5" style={{ color: accent }} />
            <span style={{ color: recommendedTitleColor }}>Compartilhar</span>
          </span>
        </Button>
        <Button
          variant="outline"
          className={`group relative flex-1 justify-center gap-2 overflow-hidden py-4 shadow-sm backdrop-blur-md transition-all hover:shadow-md active:scale-[0.99] ${glassSurfaceClass}`}
          onClick={handleAddToCalendar}
        >
          <span className="absolute inset-0 bg-gradient-to-r from-white/10 via-white/0 to-white/10 opacity-0 transition-opacity group-hover:opacity-100" />
          <span
            className="pointer-events-none absolute inset-0 opacity-25"
            style={{
              background: `radial-gradient(550px circle at 20% 30%, ${accent} 0%, transparent 60%)`,
            }}
          />
          <span className="relative inline-flex items-center justify-center gap-2">
            <Calendar className="h-5 w-5" style={{ color: accent }} />
            <span style={{ color: recommendedTitleColor }}>
              Adicionar à Agenda
            </span>
          </span>
        </Button>
        {hasCoordinates && (
          <Button
            variant="outline"
            className={`group relative flex-1 justify-center gap-2 overflow-hidden py-4 shadow-sm backdrop-blur-md transition-all hover:shadow-md active:scale-[0.99] ${glassSurfaceClass}`}
            onClick={handleOpenRoute}
          >
            <span className="absolute inset-0 bg-gradient-to-r from-white/10 via-white/0 to-white/10 opacity-0 transition-opacity group-hover:opacity-100" />
            <span
              className="pointer-events-none absolute inset-0 opacity-25"
              style={{
                background: `radial-gradient(550px circle at 20% 30%, ${accent} 0%, transparent 60%)`,
              }}
            />
            <span className="relative inline-flex items-center justify-center gap-2">
              <MapPin className="h-5 w-5" style={{ color: accent }} />
              <span style={{ color: recommendedTitleColor }}>Traçar Rota</span>
            </span>
          </Button>
        )}
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div
            className={`relative overflow-hidden rounded-2xl border p-6 shadow-sm backdrop-blur-md transition-shadow hover:shadow-md ${glassSurfaceClass}`}
          >
            <div
              className="pointer-events-none absolute inset-0 opacity-30"
              style={{
                background: `radial-gradient(650px circle at 15% 20%, ${accent} 0%, transparent 58%)`,
              }}
            />
            <div className="relative flex items-center gap-4">
              <div
                className="bg-primary/10 rounded-lg p-3"
                style={{ color: accent }}
              >
                <Calendar className="h-6 w-6" />
              </div>
              <div>
                <h3
                  className="text-card-foreground font-medium"
                  style={{ color: recommendedBodyColor }}
                >
                  Data de Início
                </h3>
                <p
                  className="text-card-foreground mt-1 text-xl font-semibold"
                  style={{ color: recommendedTitleColor }}
                >
                  {formatDate(event.startDate)}
                </p>
              </div>
            </div>
          </div>
          <div
            className={`relative overflow-hidden rounded-2xl border p-6 shadow-sm backdrop-blur-md transition-shadow hover:shadow-md ${glassSurfaceClass}`}
          >
            <div
              className="pointer-events-none absolute inset-0 opacity-30"
              style={{
                background: `radial-gradient(650px circle at 15% 20%, ${accent} 0%, transparent 58%)`,
              }}
            />
            <div className="relative flex items-center gap-4">
              <div
                className="bg-primary/10 rounded-lg p-3"
                style={{ color: accent }}
              >
                <Calendar className="h-6 w-6" />
              </div>
              <div>
                <h3
                  className="text-card-foreground font-medium"
                  style={{ color: recommendedBodyColor }}
                >
                  Data de Término
                </h3>
                <p
                  className="text-card-foreground mt-1 text-xl font-semibold"
                  style={{ color: recommendedTitleColor }}
                >
                  {formatDate(event.endDate)}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div
          className={`relative overflow-hidden rounded-2xl border p-6 shadow-sm backdrop-blur-md transition-shadow hover:shadow-md ${glassSurfaceClass}`}
        >
          <div
            className="pointer-events-none absolute inset-0 opacity-30"
            style={{
              background: `radial-gradient(750px circle at 18% 15%, ${accent} 0%, transparent 60%), radial-gradient(900px circle at 85% 45%, ${accent} 0%, transparent 65%)`,
            }}
          />
          <div className="relative mb-6 flex items-center gap-4">
            <MapPin className="h-6 w-6" style={{ color: accent }} />
            <h3
              className="text-card-foreground text-xl font-semibold"
              style={{ color: recommendedTitleColor }}
            >
              Localização
            </h3>
          </div>
          <div className="relative space-y-6">
            <div>
              <p
                className="text-card-foreground mb-2 text-lg font-medium"
                style={{ color: recommendedBodyColor }}
              >
                Endereço
              </p>
              <p
                className="text-card-foreground/80"
                style={{ color: recommendedBodyColor }}
              >
                {event.location || 'Local a ser definido'}
              </p>
            </div>
          </div>
        </div>

        <ExclusiveInscriptionCta
          token={token}
          eventId={event.id}
          allowedInscriptionModes={[]}
          subscriptionStatus={subscriptionStatus}
          accentColor={palette?.[0]}
          titleColor={recommendedTitleColor}
          bodyColor={recommendedBodyColor}
          glassSurfaceClass={glassSurfaceClass}
          onSubscribe={onSubscribe}
          onViewSubscription={onViewSubscription}
        />
      </div>
    </div>
  );
}
