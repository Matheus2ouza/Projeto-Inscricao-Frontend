"use client";

import { Event } from "@/features/events/types/publicEvents/publicEventsTypes";
import EventMap from "@/shared/components/EventMap";
import { Button } from "@/shared/components/ui/button";
import { getGradientClass } from "@/shared/utils/getGenerateGradient";
import { Calendar, Loader2, MapPin, Share2 } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

type PublicEventDetailsProps = {
  event: Event | null;
  onSubscribe: (eventId: string) => void;
};

export default function PublicEventDetails({
  event,
  onSubscribe,
}: PublicEventDetailsProps) {
  const router = useRouter();
  const [imageLoading, setImageLoading] = useState(true);
  const [imageFailed, setImageFailed] = useState(false);

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  const handleImageError = () => {
    setImageLoading(false);
    setImageFailed(true);
  };

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

  const getSubscriptionStatus = () => {
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
  const shouldShowImage = Boolean(event.imageUrl && !imageFailed);

  return (
    <div className="space-y-6">
      <div className="relative w-full aspect-video rounded-xl overflow-hidden shadow-lg bg-muted">
        {shouldShowImage ? (
          <>
            {imageLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-muted/60 dark:bg-black/40 z-20">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
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
          <p className="text-xs sm:text-xl uppercase tracking-[0.3em] text-white/90 mb-1 sm:mb-2 font-medium drop-shadow-md">
            {event.regionName || "Evento"}
          </p>
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold text-white uppercase leading-tight break-words drop-shadow-lg">
            {event.name}
          </h1>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <Button
          variant="outline"
          className="flex-1 justify-center gap-2 py-4"
          onClick={handleShare}
        >
          <Share2 className="h-5 w-5" />
          Compartilhar
        </Button>
        <Button
          variant="outline"
          className="flex-1 justify-center gap-2 py-4"
          onClick={handleAddToCalendar}
        >
          <Calendar className="h-5 w-5" />
          Adicionar à Agenda
        </Button>
        {event.longitude && event.latitude && (
          <Button
            variant="outline"
            className="flex-1 justify-center gap-2 py-4"
            onClick={handleOpenRoute}
          >
            <MapPin className="h-5 w-5" />
            Traçar Rota
          </Button>
        )}
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="border rounded-lg p-6 bg-card">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-muted rounded-lg">
                <Calendar className="h-6 w-6 text-muted-foreground" />
              </div>
              <div>
                <h3 className="font-medium text-card-foreground">
                  Data de Início
                </h3>
                <p className="text-xl font-semibold text-card-foreground mt-1">
                  {formatDate(event.startDate)}
                </p>
              </div>
            </div>
          </div>
          <div className="border rounded-lg p-6 bg-card">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-muted rounded-lg">
                <Calendar className="h-6 w-6 text-muted-foreground" />
              </div>
              <div>
                <h3 className="font-medium text-card-foreground">
                  Data de Término
                </h3>
                <p className="text-xl font-semibold text-card-foreground mt-1">
                  {formatDate(event.endDate)}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="border rounded-lg p-6 bg-card">
          <div className="flex items-center gap-4 mb-6">
            <MapPin className="h-6 w-6 text-card-foreground" />
            <h3 className="font-semibold text-card-foreground text-xl">
              Localização
            </h3>
          </div>
          <div className="space-y-6">
            <div>
              <p className="text-card-foreground text-lg font-medium mb-2">
                Endereço
              </p>
              <p className="text-card-foreground/80">
                {event.location || "Local a ser definido"}
              </p>
            </div>
            {event.latitude && event.longitude && (
              <div className="h-64 rounded-lg overflow-hidden border">
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

        <div className="border rounded-lg p-6 bg-card">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex-1">
              <h3 className="font-semibold text-card-foreground text-xl mb-3">
                Inscrições
              </h3>
              <p
                className={`font-medium text-lg ${subscriptionStatus.status === "open" ? "text-green-600" : subscriptionStatus.status === "closed" ? "text-yellow-600" : "text-red-600"}`}
              >
                {subscriptionStatus.label}
              </p>
              <p className="text-muted-foreground text-sm mt-1">
                {subscriptionStatus.description}
              </p>
            </div>
            <Button
              className={`font-semibold px-8 py-6 w-full sm:w-auto ${subscriptionStatus.status !== "open" ? "bg-muted text-muted-foreground hover:bg-muted cursor-not-allowed" : ""}`}
              disabled={subscriptionStatus.status !== "open"}
              onClick={() => onSubscribe(event.id)}
            >
              {subscriptionStatus.status === "finalized"
                ? "Evento Encerrado"
                : subscriptionStatus.status === "closed"
                  ? "Inscrições Fechadas"
                  : "Inscrever-se"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
