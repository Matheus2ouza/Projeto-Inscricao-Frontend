"use client";

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
import { Card, CardBody, CardFooter } from "@heroui/react";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { Events } from "../types/participantsTypes";

interface SelectEventTableProps {
  events: Events;
  page: number;
  pageCount: number;
  onPageChange: (page: number) => void;
  onSelectEvent: (eventId: string) => void;
}

export default function SelectEventTable({
  events,
  page,
  pageCount,
  onPageChange,
  onSelectEvent,
}: SelectEventTableProps) {
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
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {events.map((event) => {
          const gradientClass = getGradientClass(event.name);
          // Se não há imagem, não está carregando. Se há imagem, verifica o estado
          const isImageLoading = event.imageUrl
            ? imageLoadingStates[event.id] !== false
            : false;

          return (
            <Card
              key={event.id}
              className="w-full hover:shadow-xl transition-all duration-300 border border-transparent shadow-md rounded-xl hover:scale-[1.02] overflow-visible bg-white dark:bg-zinc-900 dark:border-zinc-800"
            >
              <CardBody className="p-0 relative overflow-visible">
                <div className="w-full h-48 relative">
                  {event.imageUrl ? (
                    <>
                      {/* Loading overlay para a imagem */}
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
                            const fontSizeClass = getFontSizeClass(event.name);
                            parent.innerHTML = `
                                <div class="w-full h-full rounded-t-xl bg-gradient-to-br ${gradientClass} flex items-center justify-center">
                                <span class="text-white font-bold ${fontSizeClass} text-center px-4">${event.name}</span>
                                </div>
                                `;
                          }
                          // Marcar como carregado mesmo em caso de erro
                          handleImageLoad(event.id);
                        }}
                      />
                    </>
                  ) : (
                    // Gradiente quando não há imagem
                    <div
                      className={`w-full h-full rounded-t-xl bg-gradient-to-br ${gradientClass} flex items-center justify-center`}
                    >
                      <span
                        className={`text-white font-bold ${getFontSizeClass(
                          event.name
                        )} text-center px-4`}
                      >
                        {event.name}
                      </span>
                    </div>
                  )}
                </div>
              </CardBody>
              <CardFooter className="flex flex-col items-start p-4 gap-3 bg-white dark:bg-zinc-900 border-t border-gray-100 dark:border-zinc-800">
                <h3
                  className={`font-bold ${getFontSizeClass(
                    event.name,
                    true
                  )} mb-1 line-clamp-2 text-gray-900 dark:text-white`}
                >
                  {event.name}
                </h3>

                {/* Informações sobre inscrições e participantes */}
                <div className="flex flex-col gap-2 w-full">
                  <div className="flex justify-between items-center text-sm dark:text-white">
                    <span className="text-gray-600 dark:text-gray-400">
                      Total de Inscrições:
                    </span>
                    <span className="font-semibold">
                      {event.countInscriptions}
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-sm dark:text-white">
                    <span className="text-gray-600 dark:text-gray-400">
                      Total de Participantes:
                    </span>
                    <span className="font-semibold text-blue-600 dark:text-blue-400">
                      {event.countParticipants}
                    </span>
                  </div>
                </div>

                {/* Botão de Seleção */}
                <div className="flex flex-col w-full gap-2 mt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onSelectEvent(event.id)}
                  >
                    Ver Participantes
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
    </>
  );
}
