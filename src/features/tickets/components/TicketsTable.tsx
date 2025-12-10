"use client";

import type { Event } from "@/features/events/types/eventTypes";
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
import { getTicketStatusInfo } from "@/shared/utils/getTicketStatusInfo";
import { Card, CardBody, CardFooter } from "@heroui/react";
import { AspectRatio } from "@radix-ui/react-aspect-ratio";
import { Calendar, Frown, Loader2 } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

interface TicketsTableProps {
  events: Event[];
  buttonLabel: string;
  error: string | null;
  page: number;
  pageCount: number;
  onPageChange: (page: number) => void;
  onViewEvent: (eventId: string) => void;
}

export default function TicketsTable({
  events,
  buttonLabel,
  error,
  page,
  pageCount,
  onPageChange,
  onViewEvent,
}: TicketsTableProps) {
  const [imageLoading, setImageLoading] = useState(true);

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR");
  };

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-red-600 mb-2">
            Erro ao carregar eventos
          </h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {events.map((event) => {
          const statusInfo = getTicketStatusInfo(event.ticketEnabled);
          const gradientClass = getGradientClass(event.name);

          return (
            <Card
              key={event.id}
              className="w-full hover:shadow-xl transition-all duration-300 border border-transparent shadow-md rounded-xl overflow-hidden hover:scale-[1.02] bg-white dark:bg-zinc-900"
            >
              <CardBody className="p-0 relative">
                <div className="w-full relative">
                  {event.imageUrl ? (
                    <>
                      {event.imageUrl && imageLoading && (
                        <div className="absolute inset-0 flex items-center justify-center bg-muted/80 dark:bg-muted/40 z-10">
                          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                        </div>
                      )}
                      <AspectRatio ratio={16 / 9} className="w-full">
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
                          onLoad={handleImageLoad}
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = "none";
                            const parent = target.parentElement;
                            if (parent) {
                              parent.innerHTML = `
                                <div class="w-full h-full rounded-t-xl bg-gradient-to-br ${gradientClass} flex items-center justify-center">
                                <span class="text-white font-bold text-lg text-center px-4">${event.name}</span>
                                </div>
                                `;
                            }
                          }}
                        />
                      </AspectRatio>
                    </>
                  ) : (
                    <div
                      className={`w-full h-full rounded-t-xl bg-gradient-to-br ${gradientClass} flex items-center justify-center`}
                    ></div>
                  )}
                </div>
                <div className="absolute top-2 right-2 select-none">
                  <Badge className={`${statusInfo.badgeClass} border-0`}>
                    {statusInfo.label}
                  </Badge>
                </div>
              </CardBody>
              <CardFooter className="flex flex-col items-start p-4 gap-3 bg-white dark:bg-zinc-900 border-t border-gray-100 dark:border-zinc-800 rounded-b-xl">
                <h3
                  className={`font-bold ${getFontSizeClass(
                    event.name,
                    true
                  )} mb-1 line-clamp-2 text-gray-900 dark:text-white`}
                >
                  {event.name}
                </h3>

                <div className="flex items-center text-sm text-gray-700 dark:text-gray-300 mb-1">
                  <Calendar className="w-4 h-4 mr-2 flex-shrink-0 text-gray-600 dark:text-gray-400" />
                  <span className="line-clamp-1">
                    {formatDate(event.startDate)} - {formatDate(event.endDate)}
                  </span>
                </div>

                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                  {statusInfo.description}
                </p>

                <div className="flex flex-col w-full gap-2 mt-2">
                  <Button
                    size="sm"
                    className="w-full dark:text-white rounded-lg"
                    onClick={() => onViewEvent(event.id)}
                    disabled={statusInfo.disabled}
                    variant={statusInfo.disabled ? "outline" : "default"}
                  >
                    {statusInfo.disabled ? "Em breve" : buttonLabel}
                  </Button>
                </div>

                {event.typesInscriptions &&
                  event.typesInscriptions.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {event.typesInscriptions.slice(0, 3).map((type) => (
                        <Badge
                          key={type.id}
                          variant="outline"
                          className="text-xs rounded-md border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-zinc-800"
                        >
                          {type.description}
                        </Badge>
                      ))}
                      {event.typesInscriptions.length > 3 && (
                        <Badge
                          variant="outline"
                          className="text-xs rounded-md border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-zinc-800"
                        >
                          +{event.typesInscriptions.length - 3}
                        </Badge>
                      )}
                    </div>
                  )}
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
