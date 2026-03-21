"use client";

import EventStatusFilter from "@/shared/components/EventStatusFilter";
import { AspectRatio } from "@/shared/components/ui/aspect-ratio";
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
import { Card, CardBody, CardFooter } from "@heroui/react";
import { Calendar, Loader2, MapPin } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import type { Event } from "../types/listEventsForParticipantsTypes";
import {
  EVENT_STATUS_OPTIONS,
  StatusEvent,
} from "../types/listEventsForParticipantsTypes";

type InfoRow = {
  label: string;
  value: number | string;
};

interface ListEventsForParticipantsProps {
  events: Event[];

  // UI options
  showDateLocation?: boolean;
  buttonLabel?: string;

  // Paginção
  page: number;
  pageCount: number;
  onPageChange: (page: number) => void;
  onSelectEvent: (eventId: string) => void;

  // Filtro
  statusFilter: StatusEvent[];
  onStatusFilterChange: (value: StatusEvent[]) => void;
  onApplyStatusFilter: () => void;

  // Info
  getInfoRows?: (event: Event) => InfoRow[];
}

export default function ListEventsForParticipants({
  buttonLabel,
  events,
  page,
  pageCount,
  statusFilter,
  showDateLocation = true,
  onPageChange,
  onSelectEvent,
  onStatusFilterChange,
  onApplyStatusFilter,
  getInfoRows,
}: ListEventsForParticipantsProps) {
  const [imageLoadingStates, setImageLoadingStates] = useState<
    Record<string, boolean>
  >({});

  const handlePageChange = (newPage: number) => {
    onPageChange(newPage);
  };

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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR");
  };

  return (
    <div className="space-y-6">
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
          const gradientClass = getGradientClass(event.name);
          const isImageLoading = event.imageUrl
            ? imageLoadingStates[event.id] !== false
            : false;

          return (
            <Card
              key={event.id}
              className="w-full hover:shadow-xl transition-all duration-300 border border-transparent shadow-md rounded-xl hover:scale-[1.02] overflow-visible bg-white dark:bg-zinc-900"
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
              </CardBody>
              <CardFooter className="flex flex-col items-start p-4 gap-3 rounded-b-xl">
                <h3
                  className={`font-bold ${getFontSizeClass(event.name)} line-clamp-2 text-gray-900 dark:text-white`}
                >
                  {event.name}
                </h3>

                {showDateLocation && (
                  <>
                    <div className="flex items-center text-sm text-gray-700 dark:text-gray-300 mb-1">
                      <Calendar className="w-4 h-4 mr-2 flex-shrink-0 text-gray-600 dark:text-gray-400" />
                      {event.startDate && event.endDate ? (
                        <span className="line-clamp-1">
                          {formatDate(event.startDate)} -{" "}
                          {formatDate(event.endDate)}
                        </span>
                      ) : (
                        <span className="line-clamp-1">Data não informada</span>
                      )}
                    </div>

                    <div className="flex items-center text-sm text-gray-700 dark:text-gray-300">
                      <MapPin className="w-4 h-4 mr-2 flex-shrink-0 text-gray-600 dark:text-gray-400" />
                      <span className="line-clamp-1">
                        {event.location || "Local não informado"}
                      </span>
                    </div>
                  </>
                )}

                <div className="flex flex-col gap-2 w-full">
                  {getInfoRows?.(event)?.map(({ label, value }) => (
                    <div
                      key={label}
                      className="flex justify-between items-center text-sm dark:text-white"
                    >
                      <span className="text-gray-600 dark:text-gray-400">
                        {label}
                      </span>
                      <span className="font-semibold">{value}</span>
                    </div>
                  ))}
                </div>

                <div className="flex flex-col w-full gap-2 mt-2">
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => onSelectEvent(event.id)}
                    className="dark: text-white"
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
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            Nenhum evento encontrado
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            Não há eventos disponíveis no momento.
          </p>
        </div>
      )}

      {pageCount > 1 && (
        <div className="flex justify-center mt-8">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => page > 1 && handlePageChange(page - 1)}
                  href={page > 1 ? "#" : undefined}
                  className={page === 1 ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>

              {Array.from({ length: pageCount }, (_, i) => (
                <PaginationItem key={i}>
                  <PaginationLink
                    isActive={page === i + 1}
                    href="#"
                    onClick={() => handlePageChange(i + 1)}
                  >
                    {i + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}

              <PaginationItem>
                <PaginationNext
                  onClick={() => page < pageCount && handlePageChange(page + 1)}
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
    </div>
  );
}
