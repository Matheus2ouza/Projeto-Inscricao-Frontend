"use client";

import { Event } from "@/features/events/types/publicEvents/publicEventsTypes";
import EventMap from "@/shared/components/EventMap";
import { GuestInscriptionAlready } from "@/shared/components/GuestInscriptionAlready";
import { Button } from "@/shared/components/ui/button";
import { getGradientClass } from "@/shared/utils/getGenerateGradient";
import { getWithExpiry, setWithExpiry } from "@/shared/utils/storageWithExpiry";
import { Calendar, Loader2, MapPin, Share2 } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type PublicEventDetailsProps = {
  event: Event | null;
  onViewSubscription: (eventId: string) => void;
  onSubscribe: (eventId: string) => void;
  onLogin: () => void;
};

export default function PublicEventDetails({
  event,
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

        <div className="space-y-6">
          {/* Card de status das inscrições */}
          <div className="border rounded-lg p-6 bg-card">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-semibold text-card-foreground text-xl">
                  Inscrições
                </h3>
                <p
                  className={`font-medium text-lg mt-2 ${subscriptionStatus.status === "open" ? "text-green-600" : subscriptionStatus.status === "closed" ? "text-yellow-600" : "text-red-600"}`}
                >
                  {subscriptionStatus.label}
                </p>
                <p className="text-muted-foreground text-sm mt-1">
                  {subscriptionStatus.description}
                </p>
              </div>
              {subscriptionStatus.status !== "open" && (
                <div className="text-right">
                  <Button
                    className={`font-semibold px-6 py-4 ${subscriptionStatus.status === "finalized" ? "bg-red-600 hover:bg-red-700" : "bg-muted text-muted-foreground hover:bg-muted cursor-not-allowed"}`}
                    disabled
                  >
                    {subscriptionStatus.status === "finalized"
                      ? "Evento Encerrado"
                      : "Inscrições Fechadas"}
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Se as inscrições estão abertas, mostra as opções */}
          {subscriptionStatus.status === "open" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Card de inscrição direta - só mostra se allowGuest for true */}
              {event.allowGuest && (
                <div className="border rounded-lg p-6 bg-card hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-4 mb-6">
                    <div className="p-3 bg-primary/10 rounded-lg">
                      <svg
                        className="h-6 w-6 text-primary"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-card-foreground text-lg">
                        Inscreva-se agora
                      </h3>
                      <p className="text-muted-foreground text-sm mt-1">
                        Preencha seus dados e faça sua inscrição diretamente
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Button
                        onClick={() => onViewSubscription(event.id)}
                        size="lg"
                        className="w-full h-12 text-base font-semibold"
                      >
                        Visualizar Inscrição
                      </Button>
                      <Button
                        onClick={() => onSubscribe(event.id)}
                        size="lg"
                        className="w-full h-12 text-base font-semibold"
                      >
                        Inscrever-se Agora
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* Card de login - sempre mostra quando inscrições estão abertas */}
              <div className="border rounded-lg p-6 bg-card hover:shadow-md transition-shadow">
                <div className="flex items-start gap-4 mb-6">
                  <div className="p-3 bg-blue-500/10 rounded-lg">
                    <svg
                      className="h-6 w-6 text-blue-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-card-foreground text-lg">
                      {event.allowGuest
                        ? "Já tem uma conta?"
                        : "Faça login para se inscrever"}
                    </h3>
                    <p className="text-muted-foreground text-sm mt-1">
                      {event.allowGuest
                        ? "Acesse para gerenciar suas inscrições e histórico"
                        : "Entre com sua conta para realizar a inscrição"}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <Button
                    onClick={onLogin}
                    variant={event.allowGuest ? "outline" : "default"}
                    size="lg"
                    className="w-full h-12 text-base font-semibold"
                  >
                    {event.allowGuest
                      ? "Fazer Login"
                      : "Inscrever-se com Login"}
                  </Button>

                  {!event.allowGuest && (
                    <p className="text-xs text-muted-foreground text-center mt-3">
                      É necessário ter uma conta para se inscrever neste evento
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
