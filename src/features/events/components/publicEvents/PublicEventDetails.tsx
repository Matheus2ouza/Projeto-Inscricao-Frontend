"use client";

import {
  PublicEventInscriptionCta,
  type SubscriptionStatus,
} from "@/features/events/components/publicEvents/PublicEventInscriptionCta";
import { Event } from "@/features/events/types/publicEvents/publicEventsTypes";
import { ImageSwatches } from "@/features/guest/hook/guestInscription/useImagePalette";
import EventMap from "@/shared/components/EventMap";
import { GuestInscriptionAlready } from "@/shared/components/GuestInscriptionAlready";
import { Button } from "@/shared/components/ui/button";
import { getGradientClass } from "@/shared/utils/getGenerateGradient";
import { getWithExpiry, setWithExpiry } from "@/shared/utils/storageWithExpiry";
import { Calendar, Loader2, MapPin, Share2 } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

type PublicEventDetailsProps = {
  event: Event | null;
  palette: string[];
  isDark: boolean;
  swatches?: ImageSwatches;
  onViewSubscription: (eventId: string) => void;
  onSubscribe: (eventId: string) => void;
  onLogin: () => void;
};

export default function PublicEventDetails({
  event,
  palette,
  isDark,
  swatches,
  onViewSubscription,
  onSubscribe,
  onLogin,
}: PublicEventDetailsProps) {
  const router = useRouter();
  const [imageLoading, setImageLoading] = useState(true);
  const [imageFailed, setImageFailed] = useState(false);
  const [alreadyDialogOpen, setAlreadyDialogOpen] = useState(false);
  const throttleKey = "guest_inscription_already_throttle_5m";

  useEffect(() => {
    if (!event?.id) {
      setAlreadyDialogOpen(false);
      return;
    }

    const cached = getWithExpiry<{
      eventId: string;
      confirmationCode: string;
      thereIsPayment?: boolean;
    }>("guest_inscription");

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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const getEventStatus = () => {
    if (!event)
      return {
        status: "loading",
        label: "Carregando...",
        color: "bg-gray-500",
      };
    const now = new Date();
    const start = new Date(event.startDate);
    const end = new Date(event.endDate);
    if (now < start)
      return { status: "soon", label: "Em Breve", color: "bg-blue-500" };
    if (now > end)
      return { status: "finalized", label: "Encerrado", color: "bg-gray-500" };
    return { status: "ongoing", label: "Ao Vivo", color: "bg-green-500" };
  };

  const getSubscriptionStatus = (): SubscriptionStatus => {
    if (!event)
      return { status: "loading", label: "Carregando...", description: "" };
    const eventStatus = getEventStatus();
    if (eventStatus.status === "finalized") {
      return {
        status: "finalized",
        label: "Inscrições Encerradas",
        description: "Este evento já foi finalizado",
      };
    }
    if (event.status === "CLOSE") {
      return {
        status: "closed",
        label: "Inscrições Fechadas",
        description: "As inscrições ainda não foram abertas",
      };
    }
    return {
      status: "open",
      label: "Inscrições Abertas",
      description: "Inscreva-se agora para participar",
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
      alert("Link copiado para a área de transferência!");
    }
  };

  const handleAddToCalendar = () => {
    if (!event) return;
    const startDate = new Date(event.startDate)
      .toISOString()
      .replace(/-|:|\.\d+/g, "");
    const endDate = new Date(event.endDate)
      .toISOString()
      .replace(/-|:|\.\d+/g, "");
    const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.name)}&dates=${startDate}/${endDate}&details=${encodeURIComponent(`Evento: ${event.name}\nLocal: ${event.location || "A definir"}`)}`;
    window.open(calendarUrl, "_blank");
  };

  const handleOpenRoute = () => {
    if (!event) return;
    const destination = `${event.latitude}, ${event.longitude}`;
    const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${destination}&travelmode=driving`;
    window.open(mapsUrl, "_blank");
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
    preferredSwatch?.titleTextColor ?? (isDark ? "#ffffff" : "#111111");
  const recommendedBodyColor =
    preferredSwatch?.bodyTextColor ??
    (isDark ? "rgba(255,255,255,0.78)" : "#374151");
  const glassSurfaceClass = isDark
    ? "bg-white/20 border-white/20"
    : "bg-black/5 border-black/10";
  const accent = palette?.[0] ?? "hsl(var(--primary))";

  if (!event) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center">
          <p className="mb-4 text-foreground">Evento não encontrado</p>
          <Button onClick={() => router.back()}>Voltar</Button>
        </div>
      </div>
    );
  }

  const gradientClass = getGradientClass(event.name);
  const subscriptionStatus = getSubscriptionStatus();
  const shouldShowImage = Boolean(event.image && !imageFailed);
  const hasCoordinates =
    typeof event.latitude === "number" &&
    typeof event.longitude === "number" &&
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
          onViewSubscription(event.id);
        }}
      />
      <div
        className={`relative w-full aspect-video rounded-2xl overflow-hidden shadow-sm backdrop-blur-md border ${glassSurfaceClass}`}
      >
        {shouldShowImage ? (
          <>
            {imageLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-muted/60 dark:bg-black/40 z-20">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
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
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none z-10" />
          </>
        ) : (
          <div
            className={`w-full h-full bg-gradient-to-br ${gradientClass} flex items-center justify-center`}
          >
            <div className="absolute inset-0 bg-black/20" />
          </div>
        )}

        <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-8 md:p-10 z-20">
          <p
            className="text-xs sm:text-xl uppercase tracking-[0.3em] mb-1 sm:mb-2 font-medium drop-shadow-md"
            style={{ color: recommendedBodyColor }}
          >
            {event.regionName || "Evento"}
          </p>
          <h1
            className="text-2xl sm:text-4xl md:text-5xl font-bold uppercase leading-tight break-words drop-shadow-lg"
            style={{ color: recommendedTitleColor }}
          >
            {event.name}
          </h1>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <Button
          variant="outline"
          className={`group relative flex-1 justify-center gap-2 py-4 overflow-hidden backdrop-blur-md shadow-sm transition-all hover:shadow-md active:scale-[0.99] ${glassSurfaceClass}`}
          onClick={handleShare}
        >
          <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-r from-white/10 via-white/0 to-white/10" />
          <span
            className="absolute inset-0 opacity-25 pointer-events-none"
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
          className={`group relative flex-1 justify-center gap-2 py-4 overflow-hidden backdrop-blur-md shadow-sm transition-all hover:shadow-md active:scale-[0.99] ${glassSurfaceClass}`}
          onClick={handleAddToCalendar}
        >
          <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-r from-white/10 via-white/0 to-white/10" />
          <span
            className="absolute inset-0 opacity-25 pointer-events-none"
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
            className={`group relative flex-1 justify-center gap-2 py-4 overflow-hidden backdrop-blur-md shadow-sm transition-all hover:shadow-md active:scale-[0.99] ${glassSurfaceClass}`}
            onClick={handleOpenRoute}
          >
            <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-r from-white/10 via-white/0 to-white/10" />
            <span
              className="absolute inset-0 opacity-25 pointer-events-none"
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
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div
            className={`relative overflow-hidden rounded-2xl border p-6 backdrop-blur-md shadow-sm transition-shadow hover:shadow-md ${glassSurfaceClass}`}
          >
            <div
              className="absolute inset-0 opacity-30 pointer-events-none"
              style={{
                background: `radial-gradient(650px circle at 15% 20%, ${accent} 0%, transparent 58%)`,
              }}
            />
            <div className="relative flex items-center gap-4">
              <div
                className="p-3 bg-primary/10 rounded-lg"
                style={{ color: accent }}
              >
                <Calendar className="h-6 w-6" />
              </div>
              <div>
                <h3
                  className="font-medium text-card-foreground"
                  style={{ color: recommendedBodyColor }}
                >
                  Data de Início
                </h3>
                <p
                  className="text-xl font-semibold text-card-foreground mt-1"
                  style={{ color: recommendedTitleColor }}
                >
                  {formatDate(event.startDate)}
                </p>
              </div>
            </div>
          </div>
          <div
            className={`relative overflow-hidden rounded-2xl border p-6 backdrop-blur-md shadow-sm transition-shadow hover:shadow-md ${glassSurfaceClass}`}
          >
            <div
              className="absolute inset-0 opacity-30 pointer-events-none"
              style={{
                background: `radial-gradient(650px circle at 15% 20%, ${accent} 0%, transparent 58%)`,
              }}
            />
            <div className="relative flex items-center gap-4">
              <div
                className="p-3 bg-primary/10 rounded-lg"
                style={{ color: accent }}
              >
                <Calendar className="h-6 w-6" />
              </div>
              <div>
                <h3
                  className="font-medium text-card-foreground"
                  style={{ color: recommendedBodyColor }}
                >
                  Data de Término
                </h3>
                <p
                  className="text-xl font-semibold text-card-foreground mt-1"
                  style={{ color: recommendedTitleColor }}
                >
                  {formatDate(event.endDate)}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div
          className={`relative overflow-hidden rounded-2xl border p-6 backdrop-blur-md shadow-sm transition-shadow hover:shadow-md ${glassSurfaceClass}`}
        >
          <div
            className="absolute inset-0 opacity-30 pointer-events-none"
            style={{
              background: `radial-gradient(750px circle at 18% 15%, ${accent} 0%, transparent 60%), radial-gradient(900px circle at 85% 45%, ${accent} 0%, transparent 65%)`,
            }}
          />
          <div className="relative flex items-center gap-4 mb-6">
            <MapPin className="h-6 w-6" style={{ color: accent }} />
            <h3
              className="font-semibold text-card-foreground text-xl"
              style={{ color: recommendedTitleColor }}
            >
              Localização
            </h3>
          </div>
          <div className="relative space-y-6">
            <div>
              <p
                className="text-card-foreground text-lg font-medium mb-2"
                style={{ color: recommendedBodyColor }}
              >
                Endereço
              </p>
              <p
                className="text-card-foreground/80"
                style={{ color: recommendedBodyColor }}
              >
                {event.location || "Local a ser definido"}
              </p>
            </div>
            {hasCoordinates && (
              <div className="h-64 rounded-2xl overflow-hidden border border-white/10">
                <EventMap
                  lat={event.latitude}
                  lng={event.longitude}
                  height="100%"
                  zoom={15}
                  markerTitle={event.name}
                />
              </div>
            )}
          </div>
        </div>

        <PublicEventInscriptionCta
          eventId={event.id}
          allowedInscriptionModes={event.allowedInscriptionModes}
          subscriptionStatus={subscriptionStatus}
          accentColor={palette?.[0]}
          titleColor={recommendedTitleColor}
          bodyColor={recommendedBodyColor}
          glassSurfaceClass={glassSurfaceClass}
          onSubscribe={onSubscribe}
          onLogin={onLogin}
          onViewSubscription={onViewSubscription}
        />
      </div>
    </div>
  );
}
