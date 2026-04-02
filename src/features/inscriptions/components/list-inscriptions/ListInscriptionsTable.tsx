"use client";

import {
  Event,
  Inscription,
} from "@/features/inscriptions/types/list-inscriptions/listInscriptionsTypes";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/components/ui/popover";
import { Skeleton } from "@/shared/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import { formatDate } from "@/shared/utils/formatDate";
import { getConvertStatusInscription } from "@/shared/utils/getConvertStatus";
import { getFormatCurrency } from "@/shared/utils/getFormatCurrency";
import { getStatusColor } from "@/shared/utils/getStatusColor";
import { Pagination } from "antd";
import {
  Calendar,
  ChevronDown,
  Download,
  Filter,
  Image as ImageIcon,
  Info,
  User,
  Users,
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { DownloadListInscriptionsPdfInput } from "../../types/actions/reports/generateListInscriptionsPdfTypes";
import { DownloadListInscriptionsXlsxInput } from "../../types/actions/reports/generateListInscriptionsXlsxTypes";
import InscriptionsFilters, {
  InscriptionsFiltersValue,
} from "./filters/InscriptionsFilters";
import InscriptionsNameSearch from "./filters/InscriptionsNameSearch";
import SheetListInscriptions from "./pdf/SheetListInscriptions";

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
  }: DownloadListInscriptionsPdfInput) => Promise<{
    fileBase64?: string;
    filename?: string;
    contentType?: string;
  }>;

  onDownloadXlsx: (input: DownloadListInscriptionsXlsxInput) => Promise<{
    fileBase64?: string;
    filename?: string;
    contentType?: string;
  }>;

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

  const calculateGlobalIndex = (localIndex: number): number => {
    return (page - 1) * pageSize + localIndex + 1;
  };

  if (!event) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] p-8 text-center">
        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
          <Users className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold mb-2">Nenhum evento encontrado</h3>
        <p className="text-muted-foreground">
          Não há inscrições disponíveis para visualização.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-xl border shadow-sm overflow-hidden">
        <div className="p-6">
          <div className="flex flex-col sm:flex-row gap-6">
            <div className="relative w-full sm:w-70 h-48 rounded-lg overflow-hidden bg-muted flex-shrink-0">
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
                <div className="w-full h-full flex items-center justify-center bg-muted">
                  <ImageIcon className="h-12 w-12 text-muted-foreground" />
                </div>
              )}
            </div>

            <div className="flex-1 space-y-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white uppercase">
                  {event.name}
                </h1>

                <div className="flex flex-wrap gap-4 mt-3">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>
                      {formatDate(event.startDate)} -{" "}
                      {formatDate(event.endDate)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                <div className="bg-muted/30 p-4 rounded-lg">
                  <div className="flex flex-col space-y-1">
                    <span className="text-sm text-muted-foreground">
                      Total de Inscrições
                    </span>
                    <span className="text-2xl font-bold">
                      {event.totalInscription}
                    </span>
                  </div>
                </div>

                <div className="bg-muted/30 p-4 rounded-lg">
                  <div className="flex flex-col space-y-1">
                    <span className="text-sm text-muted-foreground">
                      Participantes
                    </span>
                    <span className="text-2xl font-bold">
                      {event.totalParticipants}
                    </span>
                  </div>
                </div>

                <div className="bg-muted/30 p-4 rounded-lg">
                  <div className="flex flex-col space-y-1">
                    <span className="text-sm text-muted-foreground">
                      Participantes Não Alocados
                    </span>
                    <span className="text-2xl font-bold">
                      {event.totalGuestInscription || 0}
                    </span>
                  </div>
                </div>

                <div className="bg-muted/30 p-4 rounded-lg">
                  <div className="flex flex-col space-y-1">
                    <span className="text-sm text-muted-foreground">
                      Total Pago
                    </span>
                    <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                      {getFormatCurrency(event.totalPaid)}
                    </span>
                  </div>
                </div>

                <div className="bg-muted/30 p-4 rounded-lg">
                  <div className="flex flex-col space-y-1">
                    <span className="text-sm text-muted-foreground">
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

      <div className="bg-white dark:bg-gray-800 rounded-xl border shadow-sm overflow-hidden">
        <div className="p-6 space-y-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Lista de Inscrições
          </h2>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <InscriptionsNameSearch
              eventId={event.id}
              onSearch={onSearchResponsible}
            />
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                className="inline-flex items-center gap-2"
                onClick={() => setReportsDrawerOpen(true)}
                disabled={generatingReport}
              >
                <Download className="w-4 h-4" />
                {generatingReport ? "Gerando..." : "Gerar Relatório"}
              </Button>

              <Popover
                open={filtersOpen}
                onOpenChange={(open) => {
                  setFiltersOpen(open);
                }}
              >
                <PopoverTrigger asChild>
                  <button
                    type="button"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-blue-600 text-blue-700 hover:bg-blue-50 dark:text-blue-400 dark:border-blue-400 dark:hover:bg-blue-900/20 text-sm font-semibold transition-colors"
                  >
                    <Filter className="w-4 h-4" />
                    Filtros
                    <ChevronDown className="w-4 h-4" />
                  </button>
                </PopoverTrigger>
                <PopoverContent
                  align="end"
                  className="w-[980px] max-w-[calc(100vw-2rem)] rounded-2xl shadow-lg border bg-white dark:bg-gray-900 p-0"
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
                  <div key={idx} className="p-4 border rounded-lg space-y-3">
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
                    <div className="pt-3 border-t flex items-center justify-between">
                      <Skeleton className="h-4 w-28" />
                      <Skeleton className="h-6 w-10" />
                    </div>
                  </div>
                ))}
              </div>
            ) : inscriptions.length === 0 ? (
              <div className="px-4 py-8 text-center text-muted-foreground border rounded-lg">
                Nenhuma inscrição encontrada
              </div>
            ) : (
              <div className="space-y-3">
                {inscriptions.map((inscription, idx) => (
                  <div
                    key={inscription.id}
                    className="p-4 border rounded-lg hover:bg-muted/30 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-muted-foreground">
                          #
                        </span>
                        <span className="font-semibold">
                          {calculateGlobalIndex(idx)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="link"
                          size="sm"
                          className="h-6 w-6 rounded-lg bg-emerald-500 text-white p-0 flex items-center justify-center"
                          onClick={() => onSelectInscription(inscription.id)}
                          aria-label="Detalhes"
                        >
                          <Info className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="mb-3">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${getStatusColor(
                          inscription.status,
                        )}`}
                      >
                        {getConvertStatusInscription(inscription.status)}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 gap-3 mb-3">
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground">
                          Responsável
                        </p>
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <p className="font-medium">
                            {inscription.responsible || "-"}
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
                        <p className="text-xs text-muted-foreground">ID</p>
                        <code className="font-mono text-xs bg-muted px-2 py-1 rounded">
                          {inscription.id.substring(0, 12)}...
                        </code>
                      </div>
                    </div>

                    <div className="pt-3 border-t">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-muted-foreground" />
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

          <div className="hidden sm:block rounded-md border">
            {loadingInscriptions ? (
              <div className="p-6 space-y-4">
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
              <div className="px-6 py-12 text-center text-muted-foreground">
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
                          <User className="h-4 w-4 text-muted-foreground" />
                          {inscription.responsible || "-"}
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
                          className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(
                            inscription.status,
                          )}`}
                        >
                          {getConvertStatusInscription(inscription.status)}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span className="font-semibold">
                            {inscription.totalParticipant}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex justify-center gap-1">
                          <Button
                            variant="link"
                            size="sm"
                            className="h-6 w-6 rounded-lg bg-emerald-500 text-white p-0 flex items-center justify-center"
                            onClick={() => onSelectInscription(inscription.id)}
                            aria-label="Detalhes"
                          >
                            <Info className="h-4 w-4" />
                          </Button>
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
                <div className="text-sm font-semibold text-foreground">
                  Página <span className="font-bold">{page}</span> de{" "}
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
