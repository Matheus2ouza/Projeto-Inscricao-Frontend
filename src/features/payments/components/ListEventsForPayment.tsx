'use client';

import { Event } from '@/features/payments/types/listEventsTypes';
import EventSPaymentStatusFilter from '@/shared/components/EventSPaymentStatusFilter';
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
import { getFontSizeClass } from '@/shared/utils/getFontSizeClass';
import { getGradientClass } from '@/shared/utils/getGenerateGradient';
import { getInitial } from '@/shared/utils/getInitials';
import { getPaymentStatusInfo } from '@/shared/utils/getPaymentStatusInfo';
import { Card, CardBody, CardFooter } from '@heroui/react';
import { AspectRatio } from '@radix-ui/react-aspect-ratio';
import { Calendar, Frown, Loader2, MapPin } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

type InfoRow = {
  label: string;
  value: number | string;
};

interface ListEventsForPaymentProps {
  buttonLabel: string;
  events: Event[];
  disableWhenPaymentDisabled?: boolean;
  statusFilter: boolean[];
  onStatusFilterChange: (value: boolean[]) => void;
  onApplyStatusFilter: () => void;
  onClearStatusFilter: () => void;
  showDateLocation?: boolean;
  total: number;
  page: number;
  pageCount: number;
  setPage: (page: number) => void;
  onSelectEvent: (eventId: string) => void;
  getInfoRows?: (event: Event) => InfoRow[];
}

export default function ListEventsForPayment({
  buttonLabel,
  events,
  total,
  page,
  pageCount,
  disableWhenPaymentDisabled,
  statusFilter,
  onStatusFilterChange,
  onApplyStatusFilter,
  onClearStatusFilter,
  showDateLocation = true,
  setPage,
  onSelectEvent,
  getInfoRows,
}: ListEventsForPaymentProps) {
  const { user } = useCurrentUser();
  const [imageLoadingStates, setImageLoadingStates] = useState<
    Record<string, boolean>
  >({});
  const [imageErrorStates, setImageErrorStates] = useState<
    Record<string, boolean>
  >({});

  const handleImageLoad = (eventId: string) => {
    setImageLoadingStates((prev) => ({
      ...prev,
      [eventId]: false,
    }));
  };

  const initializeImageLoading = (eventId: string) => {
    setImageLoadingStates((prev) => ({
      ...prev,
      [eventId]: true,
    }));
    setImageErrorStates((prev) => ({
      ...prev,
      [eventId]: false,
    }));
  };

  const handleImageError = (eventId: string) => {
    setImageErrorStates((prev) => ({
      ...prev,
      [eventId]: true,
    }));
    handleImageLoad(eventId);
  };

  const normalizeImageUrl = (rawUrl: unknown): string | null => {
    if (typeof rawUrl !== 'string') return null;
    let url = rawUrl.trim();
    if (!url) return null;

    const wrappers: Array<[string, string]> = [
      ['`', '`'],
      ['"', '"'],
      ["'", "'"],
    ];

    for (const [start, end] of wrappers) {
      if (url.startsWith(start) && url.endsWith(end)) {
        url = url.slice(start.length, url.length - end.length).trim();
      }
    }

    if (!url) return null;

    try {
      const parsed = new URL(url);
      if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:')
        return null;
      return parsed.toString();
    } catch {
      return null;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <EventSPaymentStatusFilter
            value={statusFilter}
            onChange={onStatusFilterChange}
            onClear={onClearStatusFilter}
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
          const statusInfo = getPaymentStatusInfo(event.paymentEnabled);
          const gradientClass = getGradientClass(event.name);
          const normalizedImageUrl = normalizeImageUrl(event.imageUrl);
          const hasImage =
            Boolean(normalizedImageUrl) && imageErrorStates[event.id] !== true;
          const isImageLoading = hasImage
            ? imageLoadingStates[event.id] !== false
            : false;
          const isDisabled =
            disableWhenPaymentDisabled !== undefined
              ? disableWhenPaymentDisabled
              : !event.paymentEnabled;

          return (
            <Card
              key={event.id}
              className="w-full overflow-hidden rounded-xl border border-transparent bg-white shadow-md transition-all duration-300 hover:scale-[1.02] hover:shadow-xl dark:bg-zinc-900"
            >
              <CardBody className="relative overflow-visible p-0">
                <AspectRatio ratio={16 / 9} className="w-full">
                  <div className="relative h-full w-full">
                    {hasImage && normalizedImageUrl ? (
                      <>
                        {isImageLoading && (
                          <div className="bg-muted/80 dark:bg-muted/40 absolute inset-0 z-10 flex items-center justify-center">
                            <Loader2 className="text-muted-foreground h-8 w-8 animate-spin" />
                          </div>
                        )}
                        <Image
                          src={normalizedImageUrl}
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
                          onError={() => handleImageError(event.id)}
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
                    disabled={isDisabled}
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
