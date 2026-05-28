'use client';

import {
  Event,
  Inscription,
} from '@/features/inscriptions/types/listInscriptions/listInscriptionsTypes';
import { Badge } from '@/shared/components/ui/badge';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/shared/components/ui/popover';
import { Skeleton } from '@/shared/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/components/ui/table';
import { calculateGlobalIndex } from '@/shared/utils/calculateGlobalIndex';
import { formatDate } from '@/shared/utils/formatDate';
import { getConvertStatusInscription } from '@/shared/utils/getConvertStatus';
import { getFormatCurrency } from '@/shared/utils/getFormatCurrency';
import { getStatusColor } from '@/shared/utils/getStatusColor';
import { Button, Pagination } from 'antd';
import {
  Calendar,
  Download,
  Filter,
  Image as ImageIcon,
  Info,
  User,
  Users,
} from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import {
  GeneratelistInscriptionsPdfInput,
  GeneratelistInscriptionsPdfResponse,
} from '../../types/actions/reports/generateListInscriptionsPdfTypes';
import {
  GeneratelistInscriptionsXlsxInput,
  GeneratelistInscriptionsXlsxResponse,
} from '../../types/actions/reports/generateListInscriptionsXlsxTypes';
import InscriptionsFilters, {
  InscriptionsFiltersValue,
} from './filters/InscriptionsFilters';
import InscriptionsNameSearch from './filters/InscriptionsNameSearch';
import SheetListInscriptions from './pdf/SheetListInscriptions';

interface listInscriptionsTableProps {
  pageSize: number;
  event: Event | null;
  inscriptions: Inscription[];
  total: number;
  page: number;
  pageCount: number;
  loadingInscriptions?: boolean;
  onPageChange: (page: number) => void;
  onSelectInscription: (id: string) => void;
  filters: InscriptionsFiltersValue;
  onApplyFilters: (filters: InscriptionsFiltersValue) => void;
  onClearFilters: () => void;
  onSearchResponsible?: (responsible: string | undefined) => void;

  //pdf
  onDownloadPdf: ({
    eventId,
    participants,
    payment,
    status,
    statusPayment,
    methodPayment,
    isGuest,
    startDate,
    endDate,
  }: GeneratelistInscriptionsPdfInput) => Promise<GeneratelistInscriptionsPdfResponse>;

  onDownloadXlsx: (
    input: GeneratelistInscriptionsXlsxInput,
  ) => Promise<GeneratelistInscriptionsXlsxResponse>;

  isGeneratingPdf?: boolean;
  isGeneratingXlsx?: boolean;
}

export default function ListInscriptionsTable({
  pageSize,
  event,
  inscriptions,
  total,
  page,
  pageCount,
  loadingInscriptions = false,
  onPageChange,
  onSelectInscription,
  filters,
  onApplyFilters,
  onClearFilters,
  onSearchResponsible,
  onDownloadPdf,
  onDownloadXlsx,
  isGeneratingPdf = false,
  isGeneratingXlsx = false,
}: listInscriptionsTableProps) {
  const [imageError, setImageError] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [reportsDrawerOpen, setReportsDrawerOpen] = useState(false);
  const generatingReport = isGeneratingPdf || isGeneratingXlsx;

  if (!event) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center p-8 text-center">
        <div className="bg-muted mb-4 flex h-16 w-16 items-center justify-center rounded-full">
          <Users className="text-muted-foreground h-8 w-8" />
        </div>
        <h3 className="mb-2 text-lg font-semibold">Nenhum evento encontrado</h3>
        <p className="text-muted-foreground">
          Não há inscrições disponíveis para visualização.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="glass-surface overflow-hidden rounded-xl">
        <div className="p-6">
          <div className="flex flex-col gap-6 sm:flex-row">
            <div className="bg-muted relative h-48 w-full flex-shrink-0 overflow-hidden rounded-lg sm:w-70">
              {event.image && !imageError ? (
                <Image
                  src={event.image}
                  alt={event.name}
                  fill
                  className="object-cover"
                  onError={() => setImageError(true)}
                  sizes="(max-width: 640px) 100vw, 192px"
                />
              ) : (
                <div className="bg-muted flex h-full w-full items-center justify-center">
                  <ImageIcon className="text-muted-foreground h-12 w-12" />
                </div>
              )}
            </div>

            <div className="flex-1 space-y-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 uppercase dark:text-white">
                  {event.name}
                </h1>

                <div className="mt-3 flex flex-wrap gap-4">
                  <div className="text-muted-foreground flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4" />
                    <span>
                      {formatDate(event.startDate)} -{' '}
                      {formatDate(event.endDate)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                <div className="glass-surface-strong rounded-lg p-4">
                  <div className="flex flex-col space-y-1">
                    <span className="text-muted-foreground text-sm">
                      Total de Inscrições
                    </span>
                    <span className="text-2xl font-bold">
                      {event.totalInscription}
                    </span>
                  </div>
                </div>

                <div className="glass-surface-strong rounded-lg p-4">
                  <div className="flex flex-col space-y-1">
                    <span className="text-muted-foreground text-sm">
                      Participantes
                    </span>
                    <span className="text-2xl font-bold">
                      {event.totalParticipants}
                    </span>
                  </div>
                </div>

                <div className="glass-surface-strong rounded-lg p-4">
                  <div className="flex flex-col space-y-1">
                    <span className="text-muted-foreground text-sm">
                      Total Pago
                    </span>
                    <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                      {getFormatCurrency(event.totalPaid)}
                    </span>
                  </div>
                </div>

                <div className="glass-surface-strong rounded-lg p-4">
                  <div className="flex flex-col space-y-1">
                    <span className="text-muted-foreground text-sm">
                      Total Pendente
                    </span>
                    <span className="text-2xl font-bold text-red-600 dark:text-red-400">
                      {getFormatCurrency(event.totalDue)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="glass-surface overflow-hidden rounded-xl">
        <div className="space-y-4 p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Lista de Inscrições
          </h2>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <InscriptionsNameSearch
              eventId={event.id}
              onSearch={onSearchResponsible}
            />
            <div className="flex items-center gap-2">
              <Button
                type="primary"
                icon={<Download className="h-4 w-4" />}
                onClick={() => setReportsDrawerOpen(true)}
                disabled={generatingReport}
              >
                {generatingReport ? 'Gerando...' : 'Gerar Relatório'}
              </Button>

              <Popover
                open={filtersOpen}
                onOpenChange={(open) => {
                  setFiltersOpen(open);
                }}
              >
                <PopoverTrigger asChild>
                  <Button type="primary" icon={<Filter className="h-4 w-4" />}>
                    Filtros
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  align="end"
                  className="w-[980px] max-w-[calc(100vw-2rem)] rounded-2xl p-0"
                >
                  <InscriptionsFilters
                    value={filters}
                    onApply={(next) => {
                      onApplyFilters(next);
                      setFiltersOpen(false);
                    }}
                    onClear={() => {
                      onClearFilters();
                      setFiltersOpen(false);
                    }}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>

        <SheetListInscriptions
          open={reportsDrawerOpen}
          onOpenChange={setReportsDrawerOpen}
          eventId={event.id}
          onDownloadPdf={onDownloadPdf}
          onDownloadXlsx={onDownloadXlsx}
          generatingPdf={isGeneratingPdf}
          generatingXlsx={isGeneratingXlsx}
        />

        <div className="px-6 pb-6">
          <div className="block sm:hidden">
            {loadingInscriptions ? (
              <div className="space-y-3">
                {Array.from({ length: 6 }).map((_, idx) => (
                  <div key={idx} className="space-y-3 rounded-lg border p-4">
                    <div className="flex items-center justify-between">
                      <Skeleton className="h-4 w-16" />
                      <Skeleton className="h-6 w-6 rounded-lg" />
                    </div>
                    <Skeleton className="h-5 w-28 rounded-full" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-4 w-40" />
                      <Skeleton className="h-4 w-32" />
                    </div>
                    <div className="flex items-center justify-between border-t pt-3">
                      <Skeleton className="h-4 w-28" />
                      <Skeleton className="h-6 w-10" />
                    </div>
                  </div>
                ))}
              </div>
            ) : inscriptions.length === 0 ? (
              <div className="glass-surface text-muted-foreground rounded-lg px-4 py-8 text-center">
                Nenhuma inscrição encontrada
              </div>
            ) : (
              <div className="space-y-3">
                {inscriptions.map((inscription, idx) => (
                  <div
                    key={inscription.id}
                    className="glass-surface hover:glass-surface-strong rounded-lg p-4 transition-colors"
                  >
                    <div className="mb-3 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground text-sm font-medium">
                          #
                        </span>
                        <span className="font-semibold">
                          {calculateGlobalIndex(idx)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          className="flex h-6 w-6 cursor-pointer items-center justify-center rounded-lg bg-emerald-500 p-0 text-white hover:bg-emerald-600"
                          onClick={() => onSelectInscription(inscription.id)}
                          aria-label="Detalhes"
                        >
                          <Info className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    <div className="mb-3">
                      <span
                        className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold ${getStatusColor(
                          inscription.status,
                        )}`}
                      >
                        {getConvertStatusInscription(inscription.status)}
                      </span>
                    </div>

                    <div className="mb-3 grid grid-cols-1 gap-3">
                      <div className="space-y-1">
                        <p className="text-muted-foreground text-xs">
                          Responsável
                        </p>
                        <div className="flex items-center gap-2">
                          <User className="text-muted-foreground h-4 w-4" />
                          <p className="font-medium">
                            {inscription.responsible || '-'}
                          </p>
                          {inscription.isGuest && (
                            <Badge
                              variant="secondary"
                              className="h-5 px-2 text-[10px]"
                            >
                              N/ Alocado
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="space-y-1">
                        <p className="text-muted-foreground text-xs">ID</p>
                        <code className="bg-muted rounded px-2 py-1 font-mono text-xs">
                          {inscription.id.substring(0, 12)}...
                        </code>
                      </div>
                    </div>

                    <div className="border-t pt-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Users className="text-muted-foreground h-4 w-4" />
                          <span className="text-sm font-medium">
                            Participantes
                          </span>
                        </div>
                        <span className="text-lg font-bold">
                          {inscription.totalParticipant}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="glass-surface hidden rounded-lg sm:block">
            {loadingInscriptions ? (
              <div className="space-y-4 p-6">
                {Array.from({ length: 8 }).map((_, idx) => (
                  <div key={idx} className="flex items-center gap-4">
                    <Skeleton className="h-5 w-10" />
                    <Skeleton className="h-5 w-24" />
                    <Skeleton className="h-5 flex-1" />
                    <Skeleton className="h-6 w-24" />
                    <Skeleton className="h-5 w-20" />
                    <Skeleton className="h-8 w-10" />
                  </div>
                ))}
              </div>
            ) : inscriptions.length === 0 ? (
              <div className="text-muted-foreground px-6 py-12 text-center">
                Nenhuma inscrição encontrada
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-16">#</TableHead>
                    <TableHead className="w-[200px]">ID</TableHead>
                    <TableHead>Responsável</TableHead>
                    <TableHead className="w-[140px]">Status</TableHead>
                    <TableHead className="w-[140px] text-right">
                      Participantes
                    </TableHead>
                    <TableHead className="w-[100px] text-center">
                      Ações
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {inscriptions.map((inscription, idx) => (
                    <TableRow
                      key={inscription.id}
                      className="hover:bg-muted/50"
                    >
                      <TableCell className="font-medium">
                        {calculateGlobalIndex(idx)}
                      </TableCell>
                      <TableCell className="font-mono text-sm">
                        {inscription.id.substring(0, 8)}...
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <User className="text-muted-foreground h-4 w-4" />
                          {inscription.responsible || '-'}
                          {inscription.isGuest && (
                            <Badge
                              variant="secondary"
                              className="h-5 px-2 text-[10px]"
                            >
                              N/ Alocado
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span
                          className={`rounded-full border px-3 py-1 text-xs font-semibold ${getStatusColor(
                            inscription.status,
                          )}`}
                        >
                          {getConvertStatusInscription(inscription.status)}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Users className="text-muted-foreground h-4 w-4" />
                          <span className="font-semibold">
                            {inscription.totalParticipant}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex justify-center gap-1">
                          <button
                            type="button"
                            className="flex h-6 w-6 items-center justify-center rounded-lg bg-emerald-500 p-0 text-white"
                            onClick={() => onSelectInscription(inscription.id)}
                            aria-label="Detalhes"
                          >
                            <Info className="h-4 w-4" />
                          </button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>

          {pageCount > 1 && (
            <div className="py-4">
              <div className="flex flex-col items-center gap-3">
                <Pagination
                  current={page}
                  total={total}
                  pageSize={pageSize}
                  showSizeChanger={false}
                  onChange={(next) => onPageChange(next)}
                  responsive
                  size="small"
                />
                <div className="text-foreground text-sm font-semibold">
                  Página <span className="font-bold">{page}</span> de{' '}
                  <span className="font-bold">{pageCount}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
