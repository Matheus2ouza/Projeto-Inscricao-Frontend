"use client";

import type { Events } from "@/features/tickets/types/saleTicketsTypes";
import { AspectRatio } from "@/shared/components/ui/aspect-ratio";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/shared/components/ui/pagination";
import { Calendar, Eye, Ticket } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface TicketsEventsTableProps {
  events: Events;
  total: number;
  page: number;
  pageCount: number;
  error: string | null;
  setPage: (page: number) => void;
  refetch: () => Promise<void>;
}

const getEventInitials = (eventName: string): string => {
  return eventName.trim().substring(0, 2).toUpperCase();
};

// Função para gerar gradiente baseado no nome do evento (para consistência)
const getEventGradient = (eventName: string): string => {
  const gradients = [
    "from-purple-500 to-pink-500",
    "from-blue-500 to-cyan-500",
    "from-green-500 to-emerald-500",
    "from-orange-500 to-red-500",
    "from-indigo-500 to-purple-500",
    "from-teal-500 to-blue-500",
    "from-yellow-500 to-orange-500",
    "from-pink-500 to-rose-500",
    "from-violet-500 to-purple-500",
    "from-cyan-500 to-teal-500",
    "from-rose-500 to-pink-500",
    "from-amber-500 to-yellow-500",
    "from-lime-500 to-green-500",
    "from-sky-500 to-blue-500",
    "from-fuchsia-500 to-pink-500",
    "from-emerald-500 to-teal-500",
  ];

  // Gerar índice baseado no nome do evento para consistência
  let hash = 0;
  for (let i = 0; i < eventName.length; i++) {
    hash = eventName.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % gradients.length;
  return gradients[index];
};

const getTicketStatusInfo = (ticketEnabled: boolean) => {
  if (ticketEnabled) {
    return {
      label: "Tickets disponíveis",
      badgeClass:
        "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/40 dark:text-emerald-200",
      description: "As vendas estão liberadas para este evento.",
    };
  }

  return {
    label: "Venda indisponível",
    badgeClass:
      "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-200",
    description: "Este evento ainda não habilitou a venda de tickets.",
  };
};

export default function TicketsByEventTable({
  events,
  total,
  page,
  pageCount,
  error,
  setPage,
  refetch,
}: TicketsEventsTableProps) {
  const router = useRouter();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR");
  };

  // Mostrar erro se houver
  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
        <Button onClick={refetch} variant="outline">
          Tentar novamente
        </Button>
      </div>
    );
  }

  return (
    <div>
      {/* Lista de Eventos */}
      <div className="space-y-6">
        {events.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            Nenhum evento encontrado.
          </div>
        ) : (
          events.map((event) => {
            const ticketStatus = getTicketStatusInfo(event.ticketEnabled);
            return (
              <div
                key={event.id}
                className="border rounded-lg overflow-hidden bg-card shadow-sm"
              >
                <div className="bg-gradient-to-r from-muted to-muted/50 p-6 border-b">
                  <div className="flex flex-col sm:flex-row gap-6">
                    {/* Imagem ou Gradiente com Sigla do Evento */}
                    <div className="w-full sm:w-32 flex-shrink-0">
                      <AspectRatio
                        ratio={5 / 4}
                        className="rounded-lg overflow-hidden shadow-md relative"
                      >
                        {event.image ? (
                          <Image
                            src={event.image}
                            alt={event.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div
                            className={`absolute inset-0 bg-gradient-to-br ${getEventGradient(
                              event.name,
                            )} flex items-center justify-center`}
                          >
                            <span className="lg:text-7xl text-8xl sm:text-7xl font-bold text-white drop-shadow-lg">
                              {getEventInitials(event.name)}
                            </span>
                          </div>
                        )}
                      </AspectRatio>
                    </div>

                    {/* Informações do Evento */}
                    <div className="flex-1 space-y-4">
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <h3 className="text-2xl font-bold mb-1 uppercase">
                            {event.name}
                          </h3>
                          <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4" />
                              <span>
                                {formatDate(event.startDate)} -{" "}
                                {formatDate(event.endDate)}
                              </span>
                            </div>
                          </div>
                        </div>
                        <Badge
                          variant="outline"
                          className={`gap-2 text-xs px-3 py-1 rounded-full border ${ticketStatus.badgeClass}`}
                        >
                          <Ticket className="h-3.5 w-3.5" />
                          {ticketStatus.label}
                        </Badge>
                      </div>

                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {ticketStatus.description}
                      </p>

                      <div className="flex justify-end">
                        <Button
                          type="button"
                          variant={event.ticketEnabled ? "default" : "outline"}
                          size="sm"
                          disabled={!event.ticketEnabled}
                          onClick={() => {
                            router.push(`/user/tickets/${event.id}`);
                          }}
                          className="gap-2"
                        >
                          <Eye className="h-4 w-4" />
                          {event.ticketEnabled
                            ? "Comprar tickets"
                            : "Ver detalhes"}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Paginação */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 mt-6 sm:relative">
        {/* Informações de paginação - Esconder no desktop */}
        <div className="text-center sm:text-left text-xs sm:text-sm text-muted-foreground order-2 sm:order-1 sm:hidden">
          <span className="block sm:inline">
            Página {page} de {pageCount}
          </span>
          <span className="hidden sm:inline mx-2">-</span>
          <span className="block sm:inline">
            {events.length} de {total} evento(s)
          </span>
        </div>

        {/* Controles de paginação - Centralizado em todas as telas */}
        <div className="order-1 sm:order-1 w-full flex justify-center sm:absolute sm:left-1/2 sm:-translate-x-1/2">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => setPage(Math.max(1, page - 1))}
                  href="#"
                  className="text-xs"
                />
              </PaginationItem>
              {Array.from({ length: Math.min(pageCount, 5) }, (_, i) => (
                <PaginationItem key={i}>
                  <PaginationLink
                    isActive={page === i + 1}
                    href="#"
                    onClick={() => setPage(i + 1)}
                    className="text-xs"
                  >
                    {i + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext
                  onClick={() => setPage(Math.min(pageCount, page + 1))}
                  href="#"
                  className="text-xs"
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>

        {/* Informações de paginação - Mostrar apenas no desktop */}
        <div className="hidden sm:flex sm:flex-col sm:min-w-[14rem] text-sm text-muted-foreground order-3 text-right sm:ml-auto">
          <p className="mb-1">
            Mostrando {events.length} de {total} evento{total !== 1 ? "s" : ""}
          </p>
          <p className="text-xs">
            Página {page} de {pageCount}
          </p>
        </div>
      </div>
    </div>
  );
}
