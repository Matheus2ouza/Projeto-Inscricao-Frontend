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
import { getFontSizeClass } from "@/shared/utils/getFontSizeClass";
import { Card, CardBody, CardFooter } from "@heroui/react";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Event } from "../types/eventTypes";

interface AnalysisPaymentTableProps {
  events: Event[];
  page: number;
  pageCount: number;
  onPageChange: (page: number) => void;
}

export default function AnalysisPaymentTable({
  events,
  page,
  pageCount,
  onPageChange,
}: AnalysisPaymentTableProps) {
  const router = useRouter();
  const [imageLoadingStates, setImageLoadingStates] = useState<
    Record<string, boolean>
  >({});

  //Vai para o app/(private)/super/payments/analysis/[id]
  const handleIndividualInscription = (eventId: string) => {
    router.push(`/super/payments/analysis/${eventId}`);
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

  // Função para determinar o status da análise
  const getAnalysisStatusInfo = (
    countPayments: number,
    countPaymentsAnalysis: number
  ) => {
    const pendingCount = countPayments - countPaymentsAnalysis;
    const inAnalysisCount = countPaymentsAnalysis;

    if (countPayments === 0) {
      return {
        label: "Sem Pagamentos",
        badgeClass: "bg-gray-500",
        disabled: true,
        count: 0,
      };
    }

    if (inAnalysisCount === 0) {
      return {
        label: "Análise Completa",
        badgeClass: "bg-green-500",
        disabled: false,
        count: 0,
      };
    }

    // Cores baseadas na quantidade de pagamentos em análise
    if (inAnalysisCount <= 5) {
      return {
        label: `${inAnalysisCount} Em Análise`,
        badgeClass: "bg-blue-500",
        disabled: false,
        count: inAnalysisCount,
      };
    } else if (inAnalysisCount <= 15) {
      return {
        label: `${inAnalysisCount} Em Análise`,
        badgeClass: "bg-blue-600",
        disabled: false,
        count: inAnalysisCount,
      };
    } else {
      return {
        label: `${inAnalysisCount} Em Análise`,
        badgeClass: "bg-blue-700",
        disabled: false,
        count: inAnalysisCount,
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

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {events.map((event) => {
          const statusInfo = getAnalysisStatusInfo(
            event.countPayments,
            event.countPaymentsAnalysis
          );

          const statusEvent = getEventStatusInfo(event.status);
          const gradientClass = generateGradient(event.name);
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
                            parent.innerHTML = `
                                <div class="w-full h-full rounded-t-xl bg-gradient-to-br ${gradientClass} flex items-center justify-center">
                                <span class="text-white font-bold text-lg text-center px-4">${event.name}</span>
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
                    ></div>
                  )}
                </div>
                <div className="absolute top-2 right-2 select-none">
                  <Badge className={`${statusEvent.badgeClass} border-0`}>
                    {statusEvent.label}
                  </Badge>
                </div>
                {/* Badge de status - só aparece após a imagem carregar */}
                {!isImageLoading && (
                  <div className="absolute top-0 right-0 translate-x-1/2 -translate-y-1/2 select-none pointer-events-none">
                    <div
                      className={`w-8 h-8 rounded-full ${statusInfo.badgeClass} border-2 border-white dark:border-zinc-900 shadow-lg flex items-center justify-center text-white font-bold text-xs`}
                    >
                      {event.countPayments === 0
                        ? "0"
                        : statusInfo.count === 0
                          ? "✓"
                          : statusInfo.count}
                    </div>
                  </div>
                )}
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

                {/* Informações sobre pagamentos */}
                <div className="flex flex-col gap-2 w-full">
                  <div className="flex justify-between items-center text-sm dark:text-white">
                    <span className="text-gray-600 dark:text-gray-400">
                      Total de Pagamentos:
                    </span>
                    <span className="font-semibold">{event.countPayments}</span>
                  </div>

                  <div className="flex justify-between items-center text-sm dark:text-white">
                    <span className="text-gray-600 dark:text-gray-400">
                      Pendentes:
                    </span>
                    <span className="font-semibold text-yellow-600 dark:text-yellow-400">
                      {event.countPaymentsAnalysis}
                    </span>
                  </div>
                </div>

                {/* Botão de Análise */}
                <div className="flex flex-col w-full gap-2 mt-2 ">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleIndividualInscription(event.id)}
                  >
                    Analisar Pagamentos
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
