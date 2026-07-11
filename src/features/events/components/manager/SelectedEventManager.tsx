'use client';

import { cn } from '@/lib/utils';
import EventStatusFilter from '@/shared/components/EventStatusFilter';
import { AspectRatio } from '@/shared/components/ui/aspect-ratio';
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
import { getEventStatusInfo } from '@/shared/utils/getEventStatusInfo';
import { getFormatCurrency } from '@/shared/utils/getFormatCurrency';
import { getInitialFormat } from '@/shared/utils/getInitialsFormat';
import {
  AlertTriangle,
  Calendar,
  Check,
  Copy,
  DollarSign,
  ExternalLink,
  Eye,
  EyeClosed,
  MapPin,
  Users,
} from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import { Event, StatusEvent } from '../../types/eventTypes';
import { EVENT_STATUS_OPTIONS } from '../../types/selectEvent';

type EventsTableProps = {
  events: Event[];
  total: number;
  page: number;
  pageCount: number;
  pageSize?: number;
  onPageChange: (page: number) => void;
  onCreateEvent: () => void;
  onManagerEvent: (eventId: string) => void;
  onListInscriptions: (eventId: string) => void;
  statusFilter: StatusEvent[];
  onStatusFilterChange: (value: StatusEvent[]) => void;
  onApplyStatusFilter: () => void;
};

export default function SelectedEventManager({
  events,
  total,
  page,
  pageCount,
  onPageChange,
  onCreateEvent,
  onManagerEvent,
  onListInscriptions,
  statusFilter,
  onStatusFilterChange,
  onApplyStatusFilter,
}: EventsTableProps) {
  const [showAmount, setShowAmount] = useState<{ [key: string]: boolean }>({});
  const [copiedEventId, setCopiedEventId] = useState<string | null>(null);

  const toggleAmountVisibility = (eventId: string) => {
    setShowAmount((prev) => ({
      ...prev,
      [eventId]: !prev[eventId],
    }));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const handlePageChange = (newPage: number) => {
    onPageChange(newPage);
  };

  const copyToClipboard = async (text: string, eventId: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedEventId(eventId);

      // Resetar o estado após 2 segundos
      setTimeout(() => {
        setCopiedEventId(null);
      }, 2000);
    } catch (err) {
      console.error('Falha ao copiar texto: ', err);
    }
  };

  const openEventPage = (url: string) => {
    window.open(url, '_blank');
  };

  const currentPageSize = 4;
  const startIndex = (page - 1) * currentPageSize;

  return (
    <div className="relative">
      <div className="mb-4 flex flex-col gap-2 sm:gap-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
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
          <Button
            onClick={onCreateEvent}
            variant="default"
            className="text-xs sm:text-sm"
          >
            Criar Evento
          </Button>
        </div>
      </div>
      {/* Grid de Cards */}
      <div className="relative mb-6 grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-2">
        {events.map((event) => {
          const statusInfo = getEventStatusInfo(event.status);
          const { initials, fontSize } = getInitialFormat(event.name);
          const isCopied = copiedEventId === event.id;
          const hasTypeInscriptions = (event?.countTypeInscriptions ?? 0) > 0;

          return (
            <div
              key={event.id}
              className={cn('relative transition-all duration-300 ease-in-out')}
            >
              {/* Card personalizado sem bordas do shadcn */}
              <div
                className={cn(
                  'bg-card text-card-foreground flex w-full cursor-pointer flex-col overflow-hidden rounded-xl shadow-sm transition-all duration-300 ease-in-out hover:shadow-md',
                )}
              >
                {/* Imagem do Evento - Ocupando toda a parte superior */}
                <AspectRatio ratio={16 / 8} className="w-full">
                  <div className="relative h-full w-full overflow-hidden rounded-t-xl">
                    {event.imageUrl ? (
                      <Image
                        src={event.imageUrl}
                        alt={event.name}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                        priority={events.indexOf(event) < 2}
                        className="object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 h-full w-full bg-gradient-to-r from-blue-500 to-purple-500" />
                    )}
                    <div className="absolute inset-0 bg-black/20" />
                    <Badge
                      className={`absolute top-3 right-3 ${statusInfo.badgeClass} flex min-w-[100px] items-center justify-center text-sm`}
                    >
                      {statusInfo.label}
                    </Badge>
                  </div>
                </AspectRatio>

                {/* Conteúdo do Card */}
                <div className="flex flex-col gap-3 p-4 sm:gap-4 sm:p-5">
                  {/* Header do Card */}
                  <div className="flex items-start justify-between">
                    <div className="flex w-full items-center gap-3 sm:gap-4">
                      {/* Sigla do Evento */}
                      <div className="flex-shrink-0">
                        <div
                          className={cn(
                            'flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-pink-600 font-bold text-white shadow-lg sm:h-12 sm:w-12',
                            fontSize,
                          )}
                        >
                          {initials}
                        </div>
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="mb-1 line-clamp-2 text-lg font-semibold sm:mb-2 sm:text-xl">
                          {event.name}
                        </h3>
                        <div className="flex items-center gap-2">
                          <Badge
                            variant="secondary"
                            className="flex items-center gap-1 text-xs"
                          >
                            <MapPin className="h-3 w-3" />
                            {event.regionName}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Estatísticas - Responsivas */}
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {/* Participantes */}
                    <div className="flex items-center gap-3 rounded-lg bg-blue-50 p-2.5 dark:bg-blue-950/30">
                      <div className="rounded-lg bg-blue-100 p-2 dark:bg-blue-900">
                        <Users className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div className="flex-1">
                        <p className="text-lg font-bold text-blue-600 sm:text-xl dark:text-blue-400">
                          {event.quantityParticipants}
                        </p>
                        <p className="text-muted-foreground text-xs">
                          Participantes
                        </p>
                      </div>
                    </div>

                    {/* Arrecadado */}
                    <div className="flex items-center gap-3 rounded-lg bg-green-50 p-2.5 dark:bg-green-950/30">
                      <div className="rounded-lg bg-green-100 p-2 dark:bg-green-900">
                        <DollarSign className="h-4 w-4 text-green-600 dark:text-green-400" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <p className="text-lg font-bold text-green-600 sm:text-xl dark:text-green-400">
                              {showAmount[event.id]
                                ? getFormatCurrency(event.amountCollected)
                                : '****'}
                            </p>
                            <p className="text-muted-foreground text-xs">
                              Arrecadado
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleAmountVisibility(event.id);
                            }}
                            className="ml-2 flex-shrink-0 focus:outline-none"
                          >
                            {showAmount[event.id] ? (
                              <Eye className="h-5 w-5 text-green-600 sm:h-6 sm:w-6 dark:text-green-400" />
                            ) : (
                              <EyeClosed className="h-5 w-5 text-green-600 sm:h-6 sm:w-6 dark:text-green-400" />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Informações Básicas */}
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    <div className="flex items-center justify-between rounded-lg bg-gray-50 p-2 dark:bg-gray-800">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-3 w-3 text-blue-500 sm:h-4 sm:w-4" />
                        <span className="text-xs sm:text-sm">
                          Data de Início:
                        </span>
                      </div>
                      <span className="text-xs font-medium sm:text-sm">
                        {formatDate(event.startDate)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between rounded-lg bg-gray-50 p-2 dark:bg-gray-800">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-3 w-3 text-green-500 sm:h-4 sm:w-4" />
                        <span className="text-xs sm:text-sm">
                          Data de Término:
                        </span>
                      </div>
                      <span className="text-xs font-medium sm:text-sm">
                        {formatDate(event.endDate)}
                      </span>
                    </div>
                  </div>

                  {/* Alerta para eventos sem tipos de inscrição */}
                  {!hasTypeInscriptions && (
                    <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 dark:border-amber-800 dark:bg-amber-950/30">
                      <div className="flex items-start gap-3">
                        <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0 text-amber-600 sm:h-5 sm:w-5 dark:text-amber-400" />
                        <div className="flex-1">
                          <p className="mb-1 text-sm font-medium text-amber-800 dark:text-amber-300">
                            Configuração Pendente
                          </p>
                          <p className="text-xs text-amber-700 dark:text-amber-400">
                            Este evento ainda não tem Tipos de Inscrições
                            configurados. Configure clicando em{' '}
                            <strong>Gerenciar Evento</strong>.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Link público do evento */}
                  <div className="border-t pt-3 sm:pt-4">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-muted-foreground text-xs">
                        URL pública:
                      </span>
                      <div className="min-w-0 flex-1">
                        <input
                          readOnly
                          className="w-full truncate rounded border bg-transparent px-2 py-1 text-xs"
                          value={`${event.url}`}
                        />
                      </div>
                      <div className="flex gap-1 sm:gap-2">
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          className={cn(
                            'h-7 w-7 p-1 transition-all duration-300 sm:h-8 sm:w-8',
                            isCopied
                              ? 'border-green-200 bg-green-50 text-green-600'
                              : 'border-blue-200 bg-blue-50 text-blue-600 hover:bg-blue-100',
                          )}
                          onClick={() =>
                            copyToClipboard(`${event.url}`, event.url)
                          }
                          title={isCopied ? 'Copiado!' : 'Copiar URL'}
                        >
                          {isCopied ? (
                            <Check className="h-3 w-3" />
                          ) : (
                            <Copy className="h-3 w-3" />
                          )}
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          className="h-7 w-7 border-green-200 bg-green-50 p-1 text-green-600 hover:bg-green-100 sm:h-8 sm:w-8"
                          onClick={() => openEventPage(event.url)}
                          title="Visualizar Evento"
                        >
                          <ExternalLink className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Footer do Card */}
                  <div className="flex items-center justify-end gap-3 pt-3 sm:pt-4">
                    <Button
                      variant="outline"
                      className="flex items-center gap-2 text-xs sm:text-sm dark:text-white"
                      onClick={() => onListInscriptions(event.id)}
                    >
                      Lista de Inscrições
                    </Button>
                    <Button
                      onClick={() => onManagerEvent(event.id)}
                      variant="default"
                      className="flex items-center gap-2 text-xs sm:text-sm dark:text-white"
                    >
                      Gerenciar Evento
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Mensagem quando não há eventos */}
      {events.length === 0 && (
        <div className="py-12 text-center sm:py-16">
          <div className="text-muted-foreground mb-6">
            <Calendar className="mx-auto mb-4 h-16 w-16 opacity-30 sm:h-20 sm:w-20" />
            <h3 className="mb-2 text-lg font-medium sm:text-xl">
              Nenhum evento encontrado
            </h3>
            <p className="mx-auto max-w-md text-sm sm:text-base">
              Não há eventos cadastrados no momento. Comece criando o primeiro
              evento.
            </p>
          </div>
          <Button
            size="lg"
            asChild
            className="w-full sm:w-auto"
            onClick={onCreateEvent}
          >
            Criar Primeiro Evento
          </Button>
        </div>
      )}

      {/* Paginação */}
      {startIndex < 1 && (
        <div className="mt-6 flex flex-col gap-4 border-t pt-4 sm:mt-8 sm:flex-row sm:items-center sm:justify-between sm:pt-6">
          <div className="text-muted-foreground text-center text-sm sm:text-left">
            Mostrando {startIndex + 1}-
            {Math.min(startIndex + currentPageSize, total)} de {total} eventos
          </div>

          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => page > 1 && handlePageChange(page - 1)}
                  href={page > 1 ? '#' : undefined}
                  className={page === 1 ? 'pointer-events-none opacity-50' : ''}
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
    </div>
  );
}
