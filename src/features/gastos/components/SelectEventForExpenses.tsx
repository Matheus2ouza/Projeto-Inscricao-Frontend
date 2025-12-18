"use client";

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
import { Event } from "../types/selectEvent";

type InfoRow = {
  label: string;
  value: number | string;
};

interface SpensTableProps {
  events: Event[];
  page: number;
  pageCount: number;
  onPageChange: (page: number) => void;
  onViewEvent: (eventId: string) => void;
  getInfoRows?: (event: Event) => InfoRow[];
}

export default function SelectedEventForExpenses({
  events,
  page,
  pageCount,
  onPageChange,
  onViewEvent,
  getInfoRows,
}: SpensTableProps) {
  const [imageLoading, setImageLoading] = useState(true);
  const [imageLoadingStates, setImageLoadingStates] = useState<
    Record<string, boolean>
  >({});

  const handleViewExpenses = (eventId: string) => {
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

  return (
    <div className="container mx-auto px-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {events.map((event) => {
          const gradientClass = getGradientClass(event.name);
          const isImageLoading = event.imageUrl
            ? imageLoadingStates[event.id] !== false
            : false;
          return (
            <Card
              key={event.id}
              className="w-full hover:shadow-xl transition-all duration-300 border-0 shadow-md rounded-xl overflow-hidden hover:scale-[1.02]"
            >
              <CardBody className="p-0 relative">
                <AspectRatio ratio={16 / 9} className="w-full">
                  <div className="relative h-full w-full">
                    {event.imageUrl ? (
                      <>
                        {/* Loading overlay para a imagem */}
                        {isImageLoading && (
                          <div className="absolute inset-0 flex items-center justify-center bg-muted z-10">
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
                                <span class="text-white font-bold text-lg text-center px-4">${event.name}</span>
                                </div>
                                `;
                            }
                          }}
                        />
                      </>
                    ) : (
                      // Gradiente quando não há imagem
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
              <CardFooter className="flex flex-col items-start p-4 gap-3">
                <h3
                  className={`font-bold ${getFontSizeClass(event.name)} line-clamp-2 text-gray-900 dark:text-white`}
                >
                  {event.name}
                </h3>

                <div className="flex flex-col gap-2 w-full">
                  {(
                    getInfoRows?.(event) ?? [
                      {
                        label: "Gastos Registrados",
                        value: event.countExpenses,
                      },
                      {
                        label: "Total de Gastos",
                        value: event.countTotalExpenses,
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

                {/* Botões de Inscrição */}
                <div className="flex flex-col w-full gap-2 mt-2">
                  <Button
                    size="sm"
                    className="w-full dark:text-white rounded-lg"
                    onClick={() => handleViewExpenses(event.id)}
                  >
                    Visualizar Gastos
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
