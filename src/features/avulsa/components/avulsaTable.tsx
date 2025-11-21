"use client";

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
import { Calendar, Loader2, MapPin } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

import type { Event } from "@/features/events/types/eventTypes";

interface AvulsaTableProps {
  events: Event[];
  loading: boolean;
  error: string | null;
  page: number;
  pageCount: number;
  onPageChange: (page: number) => void;
  onViewEvent: (eventId: string) => void;
}

export default function AvulsaTable({
  events,
  loading,
  error,
  page,
  pageCount,
  onPageChange,
  onViewEvent,
}: AvulsaTableProps) {
  const [imageLoading, setImageLoading] = useState(true);

  const handleIndividualInscription = (eventId: string) => {
    onViewEvent(eventId);
  };

  const handlePageChange = (newPage: number) => {
    onPageChange(newPage);
  };

  // Função para quando a imagem carregar
  const handleImageLoad = () => {
    setImageLoading(false);
  };

  // Função para determinar o status do evento
  const getEventStatusInfo = (status: string) => {
    switch (status) {
      case "OPEN":
        return {
          label: "Inscrições Abertas",
          badgeClass: "bg-green-500 hover:bg-green-600 text-white",
          disabled: false,
        };
      case "CLOSE":
        return {
          label: "Inscrições Fechadas",
          badgeClass: "bg-red-500 hover:bg-red-600 text-white",
          disabled: true,
        };
      case "FINALIZED":
        return {
          label: "Evento Finalizado",
          badgeClass: "bg-gray-500 hover:bg-gray-600 text-white",
          disabled: true,
        };
      default:
        return {
          label: "Status Desconhecido",
          badgeClass: "bg-gray-500 hover:bg-gray-600 text-white",
          disabled: true,
        };
    }
  };

  // Função para gerar gradiente baseado no nome do evento
  const generateGradient = (eventName: string) => {
    // Gerar cores baseadas no nome do evento para consistência
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

    // Gerar índice baseado no nome do evento
    let hash = 0;
    for (let i = 0; i < eventName.length; i++) {
      hash = eventName.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % colors.length;

    return colors[index];
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
    <div className="container mx-auto px-4">
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, index) => (
            <Card key={index} className="w-full border-0 shadow-md">
              <CardBody className="p-0">
                <Skeleton className="w-full h-48 rounded-t-xl" />
              </CardBody>
              <CardFooter className="flex flex-col items-start p-4">
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2 mb-2" />
                <Skeleton className="h-4 w-1/2" />
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

              return (
                <Card
                  key={event.id}
                  className="w-full hover:shadow-xl transition-all duration-300 border-0 shadow-md rounded-xl overflow-hidden hover:scale-[1.02]"
                >
                  <CardBody className="p-0 relative">
                    <div className="w-full h-48 relative">
                      {event.imageUrl ? (
                        <>
                          {/* Loading overlay para a imagem */}
                          {imageLoading && (
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
                        </>
                      ) : (
                        // Gradiente quando não há imagem
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
                  <CardFooter className="flex flex-col items-start p-4 gap-3">
                    <h3
                      className={`font-bold ${getFontSizeClass(
                        event.name,
                        true
                      )} mb-1 line-clamp-2 text-gray-900 dark:text-white`}
                    >
                      {event.name}
                    </h3>

                    <div className="flex items-center text-sm dark:text-white mb-1">
                      <Calendar className="w-4 h-4 mr-2 flex-shrink-0" />
                      <span className="line-clamp-1">
                        {new Date(event.startDate).toLocaleDateString("pt-BR")}{" "}
                        - {new Date(event.endDate).toLocaleDateString("pt-BR")}
                      </span>
                    </div>

                    <div className="flex items-center text-sm dark:text-white">
                      <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
                      <span className="line-clamp-1">{event.location}</span>
                    </div>

                    {/* Botões de Inscrição */}
                    <div className="flex flex-col w-full gap-2 mt-2">
                      <Button
                        size="sm"
                        className="w-full dark:text-white rounded-lg"
                        onClick={() => handleIndividualInscription(event.id)}
                        disabled={statusInfo.disabled}
                      >
                        Visualizar Inscrições
                      </Button>
                    </div>

                    {event.typesInscriptions &&
                      event.typesInscriptions.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1">
                          {event.typesInscriptions.slice(0, 3).map((type) => (
                            <Badge
                              key={type.id}
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
