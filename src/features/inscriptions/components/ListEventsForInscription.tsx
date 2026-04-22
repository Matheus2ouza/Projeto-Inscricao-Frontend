'use client';

import type { Event } from '@/features/inscriptions/types/listEventsTypes';
import EventStatusFilter from '@/shared/components/EventStatusFilter';
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
import { useCurrentUser } from '@/shared/context/user-context';
import { getEventStatusInfo } from '@/shared/utils/getEventStatusInfo';
import { getFontSizeClass } from '@/shared/utils/getFontSizeClass';
import { getGradientClass } from '@/shared/utils/getGenerateGradient';
import { getInitial } from '@/shared/utils/getInitials';
import { Card, CardBody, CardFooter } from '@heroui/react';
import { AspectRatio } from '@radix-ui/react-aspect-ratio';
import { Calendar, Frown, Loader2, MapPin } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import {
  EVENT_STATUS_OPTIONS,
  InscriptionMode,
  StatusEvent,
} from '../types/listEventsTypes';

type InfoRow = {
  label: string;
  value: number | string;
};

interface ListEventsForInscriptionProps {
  events: Event[];
  total: number;

  // UI options
  showDateLocation?: boolean;
  buttonLabel?: string;

  // Paginção
  page: number;
  pageCount: number;
  setPage: (page: number) => void;
  onSelectEvent: (eventId: string) => void;

  // Filtro
  statusFilter: StatusEvent[];
  onStatusFilterChange: (value: StatusEvent[]) => void;
  onApplyStatusFilter: () => void;

  // Info
  getInfoRows?: (event: Event) => InfoRow[];

  onClickEventAllowed?: boolean;
}

export default function ListEventsForInscription({
  events,
  total,
  page,
  pageCount,
  buttonLabel = 'Realizar Inscrição',
  statusFilter,
  showDateLocation = true,
  onStatusFilterChange,
  onApplyStatusFilter,
  setPage,
  onSelectEvent,
  getInfoRows,
  onClickEventAllowed = false,
}: ListEventsForInscriptionProps) {
  const { user } = useCurrentUser();
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
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
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {events.map((event) => {
          const isInscriptionNotAllowed =
            !event.allowedInscriptionModes.includes(InscriptionMode.NORMAL);
          const statusInfo = getEventStatusInfo(event.status);
          const gradientClass = getGradientClass(event.name);
          const isImageLoading = event.imageUrl
            ? imageLoadingStates[event.id] !== false
            : false;

          return (
            <Card
              key={event.id}
              className="w-full overflow-hidden rounded-xl border border-transparent bg-white shadow-md transition-all duration-300 hover:scale-[1.02] hover:shadow-xl dark:bg-zinc-900"
            >
              <CardBody className="relative overflow-visible p-0">
                <AspectRatio ratio={16 / 9} className="w-full">
                  <div className="relative h-full w-full">
                    {event.imageUrl ? (
                      <>
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
                        className={`h-full w-full rounded-t-xl bg-gradient-to-br ${gradientClass} flex items-center justify-center`}
                      >
                        <h3 className="px-4 text-center text-5xl font-semibold tracking-wide text-white sm:text-6xl md:text-7xl">
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
              <CardFooter className="flex flex-col items-start gap-3 rounded-b-xl border-t border-gray-100 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
                <h3
                  className={`font-bold ${getFontSizeClass(event.name)} mb-1 line-clamp-2 text-gray-900 dark:text-white`}
                >
                  {event.name}
                </h3>

                {showDateLocation && (
                  <>
                    <div className="mb-1 flex items-center text-sm text-gray-700 dark:text-gray-300">
                      <Calendar className="mr-2 h-4 w-4 flex-shrink-0 text-gray-600 dark:text-gray-400" />
                      {event.startDate && event.endDate ? (
                        <span className="line-clamp-1">
                          {formatDate(event.startDate)} -{' '}
                          {formatDate(event.endDate)}
                        </span>
                      ) : (
                        <span className="line-clamp-1">Data não informada</span>
                      )}
                    </div>

                    <div className="flex items-center text-sm text-gray-700 dark:text-gray-300">
                      <MapPin className="mr-2 h-4 w-4 flex-shrink-0 text-gray-600 dark:text-gray-400" />
                      <span className="line-clamp-1">
                        {event.location || 'Local não informado'}
                      </span>
                    </div>
                  </>
                )}

                <div className="flex w-full flex-col gap-2">
                  {getInfoRows?.(event)?.map(({ label, value }) => (
                    <div
                      key={label}
                      className="flex items-center justify-between text-sm dark:text-white"
                    >
                      <span className="text-gray-600 dark:text-gray-400">
                        {label}
                      </span>
                      <span className="font-semibold">{value}</span>
                    </div>
                  ))}
                </div>

                <div className="flex w-full flex-col gap-2">
                  <Button
                    size="sm"
                    className="w-full rounded-lg dark:text-white"
                    onClick={() => onSelectEvent(event.id)}
                    disabled={
                      onClickEventAllowed
                        ? false
                        : statusInfo.disabled ||
                          (isInscriptionNotAllowed && user.role === 'USER')
                    }
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
        <div className="text-muted-foreground flex flex-col items-center gap-2 py-12 text-center">
          <Frown className="h-10 w-10" />
          <p>Nenhum evento disponível no momento.</p>
        </div>
      )}

      {pageCount > 1 && (
        <div className="mt-8 flex justify-center">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => page > 1 && setPage(page - 1)}
                  href={page > 1 ? '#' : undefined}
                  className={page === 1 ? 'pointer-events-none opacity-50' : ''}
                />
              </PaginationItem>

              {Array.from({ length: pageCount }, (_, i) => (
                <PaginationItem key={i}>
                  <PaginationLink
                    isActive={page === i + 1}
                    href="#"
                    onClick={() => setPage(i + 1)}
                  >
                    {i + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}

              <PaginationItem>
                <PaginationNext
                  onClick={() => page < pageCount && setPage(page + 1)}
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

      {pageCount > 1 && (
        <div className="text-muted-foreground text-right text-sm">
          <p>
            Mostrando {events.length} de {total} evento{total !== 1 ? 's' : ''}
          </p>
          <p className="text-xs">
            Página {page} de {pageCount}
          </p>
        </div>
      )}
    </div>
  );
}
