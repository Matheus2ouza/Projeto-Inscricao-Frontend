"use client";

import EventMap from "@/shared/components/EventMap";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { getEventStatusInfo } from "@/shared/utils/getEventStatusInfo";
import { getFormatCurrency } from "@/shared/utils/getFormatCurrency";
import { getGradientClass } from "@/shared/utils/getGenerateGradient";
import { Calendar, Car, Clock, Loader2, MapPin, Share2 } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { EventManager } from "../types/eventTypes";

interface DetailsEventProps {
  event: EventManager | null;
  individualInscriptionClick: () => void;
  groupInscriptionClick: () => void;
}

const getDateDetails = (date: string | Date) => {
  const parsedDate = new Date(date);

  const rawDate = parsedDate.toLocaleDateString("pt-BR", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return {
    weekday: parsedDate.toLocaleDateString("pt-BR", { weekday: "long" }),
    date: rawDate.replace(".", ""),
    time: parsedDate.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
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
    return "Evento começa amanhã";
  }

  if (diffDays === 0) {
    return "Evento começa hoje";
  }

  return "Evento já começou";
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
      toast.info("Copiado com Sucesso", {
        description: `Link do evento: ${event?.name.toUpperCase()} copiado com sucesso`,
      });
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

    const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
      event.name,
    )}&dates=${startDate}/${endDate}&details=${encodeURIComponent(
      `Evento: ${event.name}\nLocal: ${event.location || "A definir"}`,
    )}`;

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
      <div className="rounded-2xl border border-gray-200/80 dark:border-white/10 bg-white/90 dark:bg-white/5 backdrop-blur-md p-10 text-center">
        <h2 className="text-2xl font-semibold mb-2 text-gray-900 dark:text-white">
          Evento não encontrado
        </h2>
        <p className="text-muted-foreground">
          O evento solicitado não está disponível.
        </p>
      </div>
    );
  }

  const statusInfo = getEventStatusInfo(event.status);
  const gradientClass = getGradientClass(event.name);
  const shouldShowImage = Boolean(event.imageUrl && !imageFailed);
  const hasCoordinates =
    typeof event.latitude === "number" &&
    typeof event.longitude === "number" &&
    typeof event.location;
  const startDetails = getDateDetails(event.startDate);
  const endDetails = getDateDetails(event.endDate);
  const countdownLabel = getEventCountdownLabel(event.startDate);

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="relative w-full aspect-video rounded-3xl overflow-hidden shadow-lg bg-muted">
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
            Evento
          </p>
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold text-white uppercase leading-tight break-words drop-shadow-lg">
            {event.name}
          </h1>
        </div>
      </div>

      <div className="space-y-6">
        <section className="rounded-2xl border border-gray-200/80 dark:border-white/10 bg-white/95 dark:bg-white/5 backdrop-blur-md p-4 sm:p-6 shadow-sm space-y-6 sm:space-y-8">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white">
                Agenda do Evento
              </h2>
              <p className="text-sm text-muted-foreground">
                Veja a data e o local em que o evento será realizado.
              </p>
            </div>
            <div className="inline-flex items-center justify-center sm:justify-start gap-2 rounded-full bg-primary/10 text-primary px-3 sm:px-4 py-1 text-xs sm:text-sm font-semibold w-full sm:w-auto">
              <Clock className="h-4 w-4" />
              {countdownLabel}
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200/70 dark:border-white/10 bg-white/80 dark:bg-white/5 p-4 sm:p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <div className="space-y-2">
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  Início
                </p>
                <p className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white leading-tight">
                  {startDetails.date}
                </p>
              </div>

              <div className="space-y-2">
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  Encerramento
                </p>
                <p className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white leading-tight">
                  {endDetails.date}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Localização
                </h2>
                {event.location && (
                  <div className="flex items-center gap-2 mt-2 text-gray-700 dark:text-gray-200">
                    <MapPin className="h-5 w-5 text-primary shrink-0" />
                    <p className="text-base sm:text-lg font-medium">
                      {event.location}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {hasCoordinates ? (
              <>
                <div className="rounded-2xl overflow-hidden border border-gray-200/70 dark:border-white/10">
                  <EventMap
                    lat={event.latitude as number}
                    lng={event.longitude as number}
                    height="300px"
                    markerTitle={event.name}
                  />
                </div>
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-6 lg:mb-8">
                  <Button
                    variant="outline"
                    className="flex-1 justify-center gap-2 sm:gap-3 py-4 sm:py-6 text-sm sm:text-base"
                    onClick={handleShare}
                  >
                    <Share2 className="h-4 w-4 sm:h-5 sm:w-5" />
                    Compartilhar
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1 justify-center gap-2 sm:gap-3 py-4 sm:py-6 text-sm sm:text-base"
                    onClick={handleAddToCalendar}
                  >
                    <Calendar className="h-4 w-4 sm:h-5 sm:w-5" />
                    Adicionar à Agenda
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1 justify-center gap-2 sm:gap-3 py-4 sm:py-6 text-sm sm:text-base"
                    onClick={handleOpenRoute}
                  >
                    <Car className="size-5" />
                    Traçar Rota
                  </Button>
                </div>
              </>
            ) : (
              <div className="h-48 rounded-2xl border border-dashed border-gray-300 dark:border-white/10 bg-gray-50/70 dark:bg-white/5 flex items-center justify-center text-center">
                <p className="text-sm text-muted-foreground px-6">
                  Os organizadores ainda não compartilharam o ponto no mapa.
                </p>
              </div>
            )}
          </div>
        </section>

        <section className="rounded-2xl border border-gray-200/80 dark:border-white/10 bg-white/95 dark:bg-white/5 backdrop-blur-md p-4 sm:p-6 shadow-sm space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white">
                Inscrições
              </h2>
              <p className="text-sm text-muted-foreground">
                Esses são os tipos de inscrições disponíveis para o evento:{" "}
                {event.name}.
              </p>
            </div>

            <Badge className={`${statusInfo.badgeClass} border-0`}>
              {statusInfo.label}
            </Badge>
          </div>

          {statusInfo.disabled && (
            <div className="rounded-xl bg-muted/40 dark:bg-white/5 border border-muted/60 dark:border-white/10 p-4 text-sm text-muted-foreground">
              {event.status === "FINALIZED"
                ? "Este evento já foi finalizado. Consulte futuras edições com os organizadores."
                : "As inscrições estão indisponíveis no momento. Fique atento às próximas atualizações."}
            </div>
          )}

          <div className="space-y-3">
            {event.typeInscriptions && event.typeInscriptions.length > 0 ? (
              <div className="space-y-3">
                {event.typeInscriptions.map((type, index) => (
                  <div
                    key={`${type.description}-${index}`}
                    className="rounded-xl border border-gray-200/80 dark:border-white/10 bg-gray-50/80 dark:bg-white/5 backdrop-blur p-4 flex flex-col gap-2"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <span className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base">
                        {type.description}
                      </span>
                      <span className="text-base sm:text-lg font-bold text-primary whitespace-nowrap">
                        {type.value > 0
                          ? getFormatCurrency(type.value)
                          : "Gratuito"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                As modalidades serão divulgadas em breve.
              </p>
            )}
          </div>

          {event.status === "FINALIZED" && (
            <div className="rounded-xl border border-dashed border-primary/40 bg-primary/5 p-4 text-sm text-primary/80">
              {event.status === "FINALIZED"
                ? "Inscrições encerradas porque o evento já aconteceu."
                : "Assim que o evento for aberto, os botões de inscrição ficarão disponíveis automaticamente."}
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              size="lg"
              className="w-full sm:flex-1 rounded-xl dark:text-white py-6 text-base"
              onClick={individualInscriptionClick}
              disabled={statusInfo.disabled}
            >
              Inscrição Individual
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="w-full sm:flex-1 rounded-xl py-6 text-base"
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
