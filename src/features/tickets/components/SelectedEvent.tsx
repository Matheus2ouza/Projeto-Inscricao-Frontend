"use client";

import { UserRole } from "@/features/auth/types/loginTypes";
import type { StatusEvent } from "@/features/tickets/types/selectEvent";
import {
  Event,
  EVENT_STATUS_OPTIONS,
} from "@/features/tickets/types/selectEvent";
import EventStatusFilter from "@/shared/components/EventStatusFilter";
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
import { getFontSizeClass } from "@/shared/utils/getFontSizeClass";
import { getGradientClass } from "@/shared/utils/getGenerateGradient";
import { getInitial } from "@/shared/utils/getInitials";
import { getTicketStatusInfo } from "@/shared/utils/getTicketStatusInfo";
import { Card, CardBody, CardFooter } from "@heroui/react";
import { AspectRatio } from "@radix-ui/react-aspect-ratio";
import { Frown, Loader2 } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

type InfoRow = {
  label: string;
  value: number | string;
};

interface TicketsTableProps {
  events: Event[];
  role?: UserRole;
  buttonLabel: string;
  page: number;
  pageCount: number;
  statusFilter: StatusEvent[];
  getInfoRows?: (event: Event) => InfoRow[];
  onPageChange: (page: number) => void;
  onViewEvent?: (eventId: string) => void;
  onStatusFilterChange: (value: StatusEvent[]) => void;
  onApplyStatusFilter: () => void;
}

export default function SelectedEvent({
  events,
  role,
  buttonLabel,
  page,
  pageCount,
  statusFilter,
  onPageChange,
  onViewEvent,
  onStatusFilterChange,
  onApplyStatusFilter,
  getInfoRows,
}: TicketsTableProps) {
  const [imageLoadingStates, setImageLoadingStates] = useState<
    Record<string, boolean>
  >({});

  // Função para quando a imagem carregar
  const handleImageLoad = (eventId: string) => {
    setImageLoadingStates((prev) => ({
      ...prev,
      [eventId]: false,
    }));
  };

  // Função para inicializar o estado de loading da imagem
  const initializeImageLoading = (eventId: string) => {
    setImageLoadingStates((prev) => ({
      ...prev,
      [eventId]: true,
    }));
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <EventStatusFilter
            options={EVENT_STATUS_OPTIONS}
            value={statusFilter}
            onChange={onStatusFilterChange}
            className="w-full sm:w-[220px]"
          />
          <Button
            size="sm"
            variant="outline"
            className="text-xs"
            onClick={onApplyStatusFilter}
          >
            Aplicar
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {events.map((event) => {
          const statusInfo = getTicketStatusInfo(event.ticketEnabled);
          const gradientClass = getGradientClass(event.name);
          const isImageLoading = event.imageUrl
            ? imageLoadingStates[event.id] !== false
            : false;

          return (
            <Card
              key={event.id}
              className="w-full hover:shadow-xl transition-all duration-300 border border-transparent shadow-md rounded-xl overflow-hidden hover:scale-[1.02] bg-white dark:bg-zinc-900"
            >
              <CardBody className="p-0 relative overflow-visible">
                <AspectRatio ratio={16 / 9} className="w-full">
                  <div className="relative h-full w-full">
                    {event.imageUrl ? (
                      <>
                        {isImageLoading && (
                          <div className="absolute inset-0 flex items-center justify-center bg-muted/80 dark:bg-muted/40 z-10">
                            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                          </div>
                        )}
                        <Image
                          src={event.imageUrl}
                          alt={event.name}
                          fill
                          sizes="(max-width: 768px) 100vw,
                                (max-width: 1200px) 50vw,
                                25vw"
                          priority={true}
                          loading="eager"
                          decoding="async"
                          className="object-cover rounded-t-xl"
                          onLoad={() => handleImageLoad(event.id)}
                          onLoadStart={() => initializeImageLoading(event.id)}
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = "none";
                            const parent = target.parentElement;
                            if (parent) {
                              parent.innerHTML = `
                                <div class="w-full h-full rounded-t-xl bg-gradient-to-br ${gradientClass} flex items-center justify-center">
                                <span class="text-white text-5xl sm:text-6xl md:text-7xl font-semibold tracking-wide text-center px-4">${event.name}</span>
                                </div>
                                `;
                            }
                            handleImageLoad(event.id);
                          }}
                        />
                      </>
                    ) : (
                      <div
                        className={`w-full h-full rounded-t-xl bg-gradient-to-br ${gradientClass} flex items-center justify-center`}
                      >
                        <h3 className="text-white text-5xl sm:text-6xl md:text-7xl font-semibold tracking-wide text-center px-4">
                          {getInitial(event.name)}
                        </h3>
                      </div>
                    )}
                  </div>
                </AspectRatio>
                {!isImageLoading && (
                  <div className="absolute top-2 right-2 select-none">
                    <Badge className={`${statusInfo.badgeClass} border-0`}>
                      {statusInfo.label}
                    </Badge>
                  </div>
                )}
              </CardBody>
              <CardFooter className="flex flex-col items-start p-4 gap-3 bg-white dark:bg-zinc-900 border-t border-gray-100 dark:border-zinc-800 rounded-b-xl">
                <h3
                  className={`font-bold ${getFontSizeClass(event.name)} line-clamp-2 text-gray-900 dark:text-white`}
                >
                  {event.name}
                </h3>

                <div className="flex flex-col gap-2 w-full">
                  {(
                    getInfoRows?.(event) ?? [
                      {
                        label: "Total de tickets",
                        value: event.countTickets,
                      },
                      {
                        label: "total de vendas",
                        value: event.countSaleTickets,
                      },
                    ]
                  ).map(({ label, value }) => (
                    <div
                      key={label}
                      className="flex justify-between items-center text-sm dark:text-white"
                    >
                      <span className="text-gray-600 dark:text-gray-400">
                        {label}
                      </span>
                      <span
                        className={`font-semibold ${
                          label.toLowerCase().includes("pendentes")
                            ? "text-yellow-600 dark:text-yellow-400"
                            : ""
                        }`}
                      >
                        {value}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="flex flex-col w-full gap-2 mt-2">
                  <Button
                    size="sm"
                    className="w-full dark:text-white rounded-lg"
                    onClick={() => onViewEvent?.(event.id)}
                    variant={
                      !event.ticketEnabled && role === "USER"
                        ? "outline"
                        : "default"
                    }
                    disabled={!event.ticketEnabled && role === "USER"}
                  >
                    {buttonLabel}
                  </Button>
                </div>
              </CardFooter>
            </Card>
          );
        })}
      </div>

      {events.length === 0 && (
        <div className="text-center py-12 text-muted-foreground flex flex-col items-center gap-2">
          <Frown className="w-10 h-10" />
          <p>Nenhum evento disponível no momento.</p>
        </div>
      )}

      {pageCount > 1 && (
        <div className="flex justify-center mt-8">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => page > 1 && onPageChange(page - 1)}
                  href={page > 1 ? "#" : undefined}
                  className={page === 1 ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>

              {Array.from({ length: pageCount }, (_, i) => (
                <PaginationItem key={i}>
                  <PaginationLink
                    isActive={page === i + 1}
                    href="#"
                    onClick={() => onPageChange(i + 1)}
                  >
                    {i + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}

              <PaginationItem>
                <PaginationNext
                  onClick={() => page < pageCount && onPageChange(page + 1)}
                  href={page < pageCount ? "#" : undefined}
                  className={
                    page === pageCount ? "pointer-events-none opacity-50" : ""
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}

      {pageCount > 1 && (
        <div className="text-sm text-muted-foreground text-right">
          <p>
            Mostrando {events.length} de {pageCount} evento
            {pageCount !== 1 ? "s" : ""}
          </p>
          <p className="text-xs">
            Página {page} de {pageCount}
          </p>
        </div>
      )}
    </div>
  );
}
