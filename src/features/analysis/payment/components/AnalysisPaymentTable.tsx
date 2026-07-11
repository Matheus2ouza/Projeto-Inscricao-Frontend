'use client';

import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/shared/components/ui/pagination';
import { generateGradientClass } from '@/shared/utils/generateGradient';
import { getEventStatusInfo } from '@/shared/utils/getEventStatusInfo';
import { getFontSizeClass } from '@/shared/utils/getFontSizeClass';
import { getInitial } from '@/shared/utils/getInitials';
import { Card, CardBody, CardFooter } from '@heroui/react';
import { AspectRatio } from '@radix-ui/react-aspect-ratio';
import { Loader2 } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import { Event } from '../types/eventTypes';

interface AnalysisPaymentTableProps {
  events: Event[];
  page: number;
  pageCount: number;
  onPageChange: (page: number) => void;
  onIndividualInscription: (eventid: string) => void;
}

export default function AnalysisPaymentTable({
  events,
  page,
  pageCount,
  onPageChange,
  onIndividualInscription,
}: AnalysisPaymentTableProps) {
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

  // Função para determinar o status da análise
  const getAnalysisStatusInfo = (
    countPayments: number,
    countPaymentsAnalysis: number,
  ) => {
    const inAnalysisCount = countPaymentsAnalysis;

    if (countPayments === 0) {
      return {
        label: 'Sem Pagamentos',
        badgeClass: 'bg-gray-500',
        disabled: true,
        count: 0,
      };
    }

    if (inAnalysisCount === 0) {
      return {
        label: 'Análise Completa',
        badgeClass: 'bg-green-500',
        disabled: false,
        count: 0,
      };
    }

    // Cores baseadas na quantidade de pagamentos em análise
    if (inAnalysisCount <= 5) {
      return {
        label: `${inAnalysisCount} Em Análise`,
        badgeClass: 'bg-blue-500',
        disabled: false,
        count: inAnalysisCount,
      };
    } else if (inAnalysisCount <= 15) {
      return {
        label: `${inAnalysisCount} Em Análise`,
        badgeClass: 'bg-blue-600',
        disabled: false,
        count: inAnalysisCount,
      };
    } else {
      return {
        label: `${inAnalysisCount} Em Análise`,
        badgeClass: 'bg-blue-700',
        disabled: false,
        count: inAnalysisCount,
      };
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {events.map((event) => {
          const statusInfo = getAnalysisStatusInfo(
            event.countPayments,
            event.countPaymentsAnalysis,
          );

          const statusEvent = getEventStatusInfo(event.status);
          const gradientClass = generateGradientClass();
          // Se não há imagem, não está carregando. Se há imagem, verifica o estado
          const isImageLoading = event.imageUrl
            ? imageLoadingStates[event.id] !== false
            : false;

          return (
            <Card
              key={event.id}
              className="w-full overflow-visible rounded-xl border border-transparent bg-white shadow-md transition-all duration-300 hover:scale-[1.02] hover:shadow-xl dark:border-zinc-800 dark:bg-zinc-900"
            >
              <CardBody className="relative overflow-visible p-0">
                <div className="relative w-full">
                  <AspectRatio ratio={16 / 9} className="w-full">
                    {event.imageUrl ? (
                      <>
                        {/* Loading overlay para a imagem */}
                        {isImageLoading && (
                          <div className="bg-muted/80 dark:bg-muted/40 absolute inset-0 z-10 flex items-center justify-center">
                            <Loader2 className="text-muted-foreground h-8 w-8 animate-spin" />
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
                          className="rounded-t-xl object-cover"
                          onLoad={() => handleImageLoad(event.id)}
                          onLoadStart={() => initializeImageLoading(event.id)}
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
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
                        className={`h-full w-full rounded-t-xl bg-gradient-to-br ${gradientClass} flex items-center justify-center`}
                      >
                        <h3 className="px-4 text-center text-5xl font-semibold tracking-wide text-white sm:text-6xl md:text-7xl">
                          {getInitial(event.name)}
                        </h3>
                      </div>
                    )}
                  </AspectRatio>
                </div>
                <div className="absolute top-2 right-2 select-none">
                  <Badge className={`${statusEvent.badgeClass} border-0`}>
                    {statusEvent.label}
                  </Badge>
                </div>
                {/* Badge de status - só aparece após a imagem carregar */}
                {!isImageLoading && (
                  <div className="pointer-events-none absolute top-0 right-0 translate-x-1/2 -translate-y-1/2 select-none">
                    <div
                      className={`h-8 w-8 rounded-full ${statusInfo.badgeClass} flex items-center justify-center border-2 border-white text-xs font-bold text-white shadow-lg dark:border-zinc-900`}
                    >
                      {event.countPayments === 0
                        ? '0'
                        : statusInfo.count === 0
                          ? '✓'
                          : statusInfo.count}
                    </div>
                  </div>
                )}
              </CardBody>
              <CardFooter className="flex flex-col items-start gap-3 border-t border-gray-100 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
                <h3
                  className={`font-bold ${getFontSizeClass(
                    event.name,
                  )} mb-1 line-clamp-2 text-gray-900 dark:text-white`}
                >
                  {event.name}
                </h3>

                {/* Informações sobre pagamentos */}
                <div className="flex w-full flex-col gap-2">
                  <div className="flex items-center justify-between text-sm dark:text-white">
                    <span className="text-gray-600 dark:text-gray-400">
                      Total de Pagamentos:
                    </span>
                    <span className="font-semibold">{event.countPayments}</span>
                  </div>

                  <div className="flex items-center justify-between text-sm dark:text-white">
                    <span className="text-gray-600 dark:text-gray-400">
                      Pendentes:
                    </span>
                    <span className="font-semibold text-yellow-600 dark:text-yellow-400">
                      {event.countPaymentsAnalysis}
                    </span>
                  </div>
                </div>

                {/* Botão de Análise */}
                <div className="mt-2 flex w-full flex-col gap-2">
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => onIndividualInscription(event.id)}
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
        <div className="py-12 text-center">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            Nenhum evento encontrado
          </h3>
          <p className="mt-2 text-gray-500 dark:text-gray-400">
            Não há eventos disponíveis no momento.
          </p>
        </div>
      )}

      {pageCount > 1 && (
        <div className="mt-8 flex justify-center">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => page > 1 && onPageChange(page - 1)}
                  href={page > 1 ? '#' : undefined}
                  className={page === 1 ? 'pointer-events-none opacity-50' : ''}
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
                  href={page < pageCount ? '#' : undefined}
                  className={
                    page === pageCount ? 'pointer-events-none opacity-50' : ''
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
