"use client";

import { TypeInscriptions } from "@/features/typeInscription/types/typesInscriptionsTypes";
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
import { Skeleton } from "@/shared/components/ui/skeleton";
import { getFontSizeClass } from "@/shared/utils/getFontSizeClass";
import { Card, CardBody, CardFooter } from "@heroui/react";
import { AspectRatio } from "@radix-ui/react-aspect-ratio";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

export type TicketsTableEvent = {
  id: string;
  name: string;
  imageUrl?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
  location?: string;
  quantityParticipants?: number;
  amountCollected?: number;
  totalPayments?: number;
  totalDebt?: number;
  typesInscriptions?: TypeInscriptions[];
};

interface TicketsTableProps {
  events: TicketsTableEvent[];
  loading: boolean;
  error: string | null;
  page: number;
  pageCount: number;
  onPageChange: (page: number) => void;
  onViewEvent: (eventId: string) => void;
}

const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

const formatDateRange = (start?: string, end?: string) => {
  if (!start) return undefined;
  const startDate = new Date(start);
  if (isNaN(startDate.getTime())) return undefined;
  if (!end) {
    return startDate.toLocaleDateString("pt-BR");
  }
  const endDate = new Date(end);
  if (isNaN(endDate.getTime())) return startDate.toLocaleDateString("pt-BR");
  return `${startDate.toLocaleDateString("pt-BR")} - ${endDate.toLocaleDateString("pt-BR")}`;
};

const getEventStatusInfo = (status?: string) => {
  switch (status) {
    case "OPEN":
      return {
        label: "Inscrições Abertas",
        badgeClass: "bg-green-500 text-white",
        disabled: false,
      };
    case "CLOSE":
      return {
        label: "Inscrições Fechadas",
        badgeClass: "bg-red-500 text-white",
        disabled: true,
      };
    case "FINALIZED":
      return {
        label: "Evento Finalizado",
        badgeClass: "bg-gray-500 text-white",
        disabled: true,
      };
    default:
      return {
        label: "Status Desconhecido",
        badgeClass: "bg-gray-500 text-white",
        disabled: true,
      };
  }
};

export default function TicketsTable({
  events,
  loading,
  error,
  page,
  pageCount,
  onPageChange,
  onViewEvent,
}: TicketsTableProps) {
  const [imageLoadingStates, setImageLoadingStates] = useState<
    Record<string, boolean>
  >({});

  const handleImageLoad = (eventId: string) => {
    setImageLoadingStates((prev) => ({ ...prev, [eventId]: false }));
  };

  const initializeImageLoading = (eventId: string) => {
    setImageLoadingStates((prev) => ({ ...prev, [eventId]: true }));
  };

  const handleViewEvent = (eventId: string) => {
    onViewEvent(eventId);
  };

  const handlePageChange = (newPage: number) => {
    onPageChange(newPage);
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

  const generateGradient = (eventName: string) => {
    const colors = [
      "from-purple-500 to-pink-500",
      "from-blue-500 to-cyan-500",
      "from-green-500 to-emerald-500",
      "from-orange-500 to-red-500",
      "from-indigo-500 to-purple-500",
      "from-teal-500 to-blue-500",
      "from-yellow-500 to-orange-500",
      "from-pink-500 to-rose-500",
    ];
    let hash = 0;
    for (let i = 0; i < eventName.length; i++) {
      hash = eventName.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % colors.length;
    return colors[index];
  };

  return (
    <div className="container mx-auto px-4">
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, index) => (
            <Card
              key={index}
              className="w-full h-full hover:shadow-xl transition-all duration-300 border border-transparent shadow-md rounded-xl hover:scale-[1.02] overflow-visible bg-white dark:bg-zinc-900 dark:border-zinc-800 flex flex-col"
            >
              <CardBody className="p-0 relative overflow-visible flex-shrink-0">
                <Skeleton className="w-full h-48 rounded-t-xl" />
              </CardBody>
              <CardFooter className="flex flex-col items-start p-4 gap-2 bg-white dark:bg-zinc-900 border-t border-gray-100 dark:border-zinc-800 flex-1">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-1/3" />
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {events.map((event) => {
              const statusInfo = getEventStatusInfo(event.status);
              const gradientClass = generateGradient(event.name);
              const isImageLoading = event.imageUrl
                ? imageLoadingStates[event.id] !== false
                : false;
              const periodLabel = formatDateRange(
                event.startDate,
                event.endDate
              );
              const typesCount = event.typesInscriptions?.length ?? 0;

              return (
                <Card
                  key={event.id}
                  className="w-full h-full hover:shadow-xl transition-all duration-300 border border-transparent shadow-md rounded-xl hover:scale-[1.02] overflow-visible bg-white dark:bg-zinc-900 dark:border-zinc-800 flex flex-col"
                >
                  <CardBody className="p-0 relative overflow-visible flex-shrink-0">
                    <div className="w-full relative">
                      <AspectRatio ratio={16 / 9} className="w-full">
                        {event.imageUrl ? (
                          <>
                            {isImageLoading && (
                              <div className="absolute inset-0 flex items-center justify-center bg-muted/80 dark:bg-muted/60 z-10">
                                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                              </div>
                            )}
                            <Image
                              src={event.imageUrl}
                              alt={event.name}
                              fill
                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                              priority={true}
                              loading="eager"
                              decoding="async"
                              className="object-cover rounded-t-xl"
                              onLoadStart={() =>
                                initializeImageLoading(event.id)
                              }
                              onLoad={() => handleImageLoad(event.id)}
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
                                handleImageLoad(event.id);
                              }}
                            />
                          </>
                        ) : (
                          <div
                            className={`w-full h-full rounded-t-xl bg-gradient-to-br ${gradientClass} flex items-center justify-center`}
                          ></div>
                        )}
                      </AspectRatio>
                    </div>
                    <div className="absolute top-2 right-2 select-none">
                      <Badge className={`${statusInfo.badgeClass} border-0`}>
                        {statusInfo.label}
                      </Badge>
                    </div>
                    {!isImageLoading && typesCount > 0 && (
                      <div className="absolute top-0 right-0 translate-x-1/2 -translate-y-1/2 select-none pointer-events-none">
                        <div className="w-8 h-8 rounded-full bg-blue-500 border-2 border-white dark:border-zinc-900 shadow-lg flex items-center justify-center text-white font-bold text-xs">
                          {typesCount}
                        </div>
                      </div>
                    )}
                  </CardBody>
                  <CardFooter className="flex flex-col items-start p-4 gap-4 bg-white dark:bg-zinc-900 border-t border-gray-100 dark:border-zinc-800 flex-1">
                    <div className="flex flex-col w-full gap-2">
                      <h3
                        className={`font-bold ${getFontSizeClass(
                          event.name,
                          true
                        )} mb-1 line-clamp-2 text-gray-900 dark:text-white`}
                      >
                        {event.name}
                      </h3>
                      {periodLabel && (
                        <p className="text-xs uppercase tracking-wider text-muted-foreground">
                          Período:{" "}
                          <span className="text-foreground font-semibold capitalize">
                            {periodLabel}
                          </span>
                        </p>
                      )}
                    </div>

                    {/* Informações sobre pagamentos */}
                    <div className="flex flex-col gap-2 w-full">
                      <div className="flex justify-between items-center text-sm dark:text-white">
                        <span className="text-gray-600 dark:text-gray-400">
                          Total de Pagamentos:
                        </span>
                        <span className="font-semibold">
                          {event.totalPayments}
                        </span>
                      </div>

                      <div className="flex justify-between items-center text-sm dark:text-white">
                        <span className="text-gray-600 dark:text-gray-400">
                          Total em Aberto:
                        </span>
                        <span className="font-semibold text-yellow-600 dark:text-yellow-400">
                          {currencyFormatter.format(event.totalDebt || 0)}
                        </span>
                      </div>
                    </div>

                    <div className="grid gap-2 w-full text-sm text-gray-600 dark:text-gray-300">
                      {event.location && (
                        <div className="flex justify-between items-center">
                          <span className="text-xs uppercase tracking-wider text-muted-foreground">
                            Local
                          </span>
                          <span className="font-semibold text-gray-900 dark:text-white text-right line-clamp-1">
                            {event.location}
                          </span>
                        </div>
                      )}
                      {event.quantityParticipants != null && (
                        <div className="flex justify-between items-center">
                          <span className="text-xs uppercase tracking-wider text-muted-foreground">
                            Participantes
                          </span>
                          <span className="font-semibold text-gray-900 dark:text-white">
                            {event.quantityParticipants}
                          </span>
                        </div>
                      )}
                      {event.amountCollected != null && (
                        <div className="flex justify-between items-center">
                          <span className="text-xs uppercase tracking-wider text-muted-foreground">
                            Valor arrecadado
                          </span>
                          <span className="font-semibold text-gray-900 dark:text-white">
                            {currencyFormatter.format(event.amountCollected)}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col w-full gap-2 mt-2">
                      <Button
                        size="sm"
                        className="w-full dark:text-white rounded-lg"
                        onClick={() => handleViewEvent(event.id)}
                        disabled={statusInfo.disabled}
                      >
                        Visualizar
                      </Button>
                    </div>

                    {event.typesInscriptions &&
                      event.typesInscriptions.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1">
                          {event.typesInscriptions.slice(0, 3).map((type) => (
                            <Badge
                              key={type.description}
                              variant="outline"
                              className="text-xs rounded-md border"
                            >
                              {type.description}
                            </Badge>
                          ))}
                          {event.typesInscriptions.length > 3 && (
                            <Badge
                              variant="outline"
                              className="text-xs rounded-md border"
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

          {events.length === 0 && !loading && (
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
                      className={
                        page === 1 ? "pointer-events-none opacity-50" : ""
                      }
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
                      onClick={() =>
                        page < pageCount && handlePageChange(page + 1)
                      }
                      href={page < pageCount ? "#" : undefined}
                      className={
                        page === pageCount
                          ? "pointer-events-none opacity-50"
                          : ""
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </>
      )}
    </div>
  );
}
