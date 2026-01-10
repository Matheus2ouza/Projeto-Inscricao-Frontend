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
import { Loader2 } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import type { StatusEvent } from "../types/selectEvent";
import { Event, EVENT_STATUS_OPTIONS } from "../types/selectEvent";

type InfoRow = {
  label: string;
  value: number | string;
};

interface AnalysisInscriptionTableProps {
  events: Event[];
  page: number;
  pageCount: number;
  onPageChange: (page: number) => void;
  onViewEvent: (eventId: string) => void;
  statusFilter: StatusEvent[];
  onStatusFilterChange: (value: StatusEvent[]) => void;
  onApplyStatusFilter: () => void;
  getInfoRows?: (event: Event) => InfoRow[];
}

export default function SelectedEventForInscription({
  events,
  page,
  pageCount,
  statusFilter,
  onPageChange,
  onViewEvent,
  onStatusFilterChange,
  onApplyStatusFilter,
  getInfoRows,
}: AnalysisInscriptionTableProps) {
  const [imageLoadingStates, setImageLoadingStates] = useState<
    Record<string, boolean>
  >({});

  const handleIndividualInscription = (eventId: string) => {
    onViewEvent(eventId);
  };

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

  // Função para determinar o status da análise
  const getAnalysisStatusInfo = (countInscritpionsAnalysis: number) => {
    if (countInscritpionsAnalysis === 0) {
      return { badgeClass: "bg-green-500", count: 0 };
    }

    const badgeClass =
      countInscritpionsAnalysis <= 5
        ? "bg-blue-500"
        : countInscritpionsAnalysis <= 15
          ? "bg-blue-600"
          : "bg-blue-700";

    return { badgeClass, count: countInscritpionsAnalysis };
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
          const statusInfo = getAnalysisStatusInfo(
            event.countInscriptionsAnalysis
          );
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
                {!isImageLoading && (
                  <div className="absolute top-0 right-0 translate-x-1/2 -translate-y-1/2 select-none pointer-events-none">
                    <div
                      className={`w-8 h-8 rounded-full ${statusInfo.badgeClass} border-2 border-white dark:border-zinc-900 shadow-lg flex items-center justify-center text-white font-bold text-xs`}
                    >
                      {statusInfo.count === 0 ? "✓" : statusInfo.count}
                    </div>
                  </div>
                )}
              </CardBody>
              <CardFooter className="flex flex-col items-start p-4 gap-3 rounded-b-xl">
                <h3
                  className={`font-bold ${getFontSizeClass(event.name)} line-clamp-2 text-gray-900 dark:text-white`}
                >
                  {event.name}
                </h3>

                <div className="flex flex-col gap-2 w-full">
                  {(
                    getInfoRows?.(event) ?? [
                      {
                        label: "Total de Inscrições",
                        value: event.countInscriptions,
                      },
                      {
                        label: "Pendentes",
                        value: event.countInscriptionsAnalysis,
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
                    variant="default"
                    size="sm"
                    onClick={() => handleIndividualInscription(event.id)}
                    disabled={event.countInscriptions === 0}
                    className="dark: text-white"
                  >
                    {event.countInscriptions === 0
                      ? "Sem Inscrições"
                      : "Analisar Inscrições"}
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
