import {
  Event,
  Payment,
} from '@/features/payments/types/analysisPayment/analysisPayment';
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/components/ui/table';
import { calculateGlobalIndex } from '@/shared/utils/calculateGlobalIndex';
import { formatDateTime } from '@/shared/utils/formatDate';
import { getConvertStatusPayment } from '@/shared/utils/getConvertStatus';
import { getFormatCurrency } from '@/shared/utils/getFormatCurrency';
import { getPaymentStatusInfo } from '@/shared/utils/getPaymentStatusInfo';
import { getStatusColor } from '@/shared/utils/getStatusColor';
import {
  AlertCircle,
  Calendar,
  DollarSign,
  ImageIcon,
  Info,
  User,
  Users,
} from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

interface AnalysisPaymentsProps {
  event?: Event;
  payments: Payment[];
  total: number;
  page: number;
  pageCount: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onViewDetail: (paymentId: string) => void;
}

export default function AnalysisPayments({
  event,
  payments,
  total,
  page,
  pageCount,
  pageSize,
  onPageChange,
  onViewDetail,
}: AnalysisPaymentsProps) {
  const [imageError, setImageError] = useState(false);

  if (!event) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center p-8 text-center">
        <div className="bg-muted mb-4 flex h-16 w-16 items-center justify-center rounded-full">
          <AlertCircle className="text-muted-foreground h-8 w-8" />
        </div>
        <h3 className="mb-2 text-lg font-semibold">Evento não encontrado</h3>
        <p className="text-muted-foreground">
          Não foi possível carregar os dados do evento.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Card do Evento */}
      <div className="overflow-hidden rounded-xl border bg-white shadow-sm dark:bg-gray-800">
        <div className="p-6">
          <div className="flex flex-col gap-6 sm:flex-row">
            {/* Imagem do Evento */}
            <div className="bg-muted relative h-48 w-full flex-shrink-0 overflow-hidden rounded-lg sm:w-72">
              {event.imageUrl && !imageError ? (
                <Image
                  src={event.imageUrl}
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

            {/* Informações do Evento */}
            <div className="flex-1 space-y-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {event.name}
                </h1>
                <p className="text-muted-foreground mt-1">
                  Análise de pagamentos pendentes
                </p>
              </div>

              {/* Estatísticas do Evento */}
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div className="bg-muted/30 rounded-lg p-4">
                  <div className="flex flex-col space-y-1">
                    <span className="text-muted-foreground text-sm">
                      Pagamentos em Análise
                    </span>
                    <div className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-amber-600 dark:text-amber-500" />
                      <span className="text-2xl font-bold">
                        {event.totalPaymentInAnalysis}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-muted/30 rounded-lg p-4">
                  <div className="flex flex-col space-y-1">
                    <span className="text-muted-foreground text-sm">
                      Valor Total em Análise
                    </span>
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-5 w-5 text-amber-600 dark:text-amber-500" />
                      <span className="text-2xl font-bold text-amber-600 dark:text-amber-500">
                        {getFormatCurrency(event.totalAmountInAnalysis)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-muted/30 rounded-lg p-4">
                  <div className="flex flex-col space-y-1">
                    <span className="text-muted-foreground text-sm">
                      Status do Evento
                    </span>
                    <Badge
                      className={`${getPaymentStatusInfo(event.paymentEnabled).badgeClass} w-fit border-0`}
                    >
                      {getPaymentStatusInfo(event.paymentEnabled).label}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Título da Tabela */}
      <div className="pt-4">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Pagamentos em Análise
        </h2>
        <p className="text-muted-foreground">
          {total} pagamento{total !== 1 ? 's' : ''} em análise no total
        </p>
      </div>

      {/* Tabela de Pagamentos - Versão Mobile com Cards */}
      <div className="block sm:hidden">
        {payments.length === 0 ? (
          <div className="text-muted-foreground rounded-lg border px-4 py-8 text-center">
            Nenhum pagamento em análise encontrado
          </div>
        ) : (
          <div className="space-y-3">
            {payments.map((payment, idx) => (
              <div
                key={payment.id}
                className={`hover:bg-muted/30 rounded-lg border p-4 transition-colors ${
                  payment.isGuest
                    ? 'border-amber-200 dark:border-amber-900/40'
                    : ''
                }`}
              >
                {/* Primeira linha: Número e Status */}
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground text-sm font-medium">
                      #
                    </span>
                    <span className="font-semibold">
                      {calculateGlobalIndex(idx, page, pageSize)}
                    </span>
                  </div>
                  <Badge className={getStatusColor(payment.status)}>
                    {getConvertStatusPayment(payment.status)}
                  </Badge>
                </div>

                {/* Responsável */}
                <div className="mb-3">
                  <div className="flex items-center gap-2">
                    <User className="text-muted-foreground h-4 w-4" />
                    <p className="font-medium">{payment.responsible || '-'}</p>
                    {payment.isGuest && (
                      <Badge
                        variant="secondary"
                        className="h-5 px-2 text-[10px]"
                      >
                        Convidado
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Segunda linha: Valor e Data */}
                <div className="mb-3 grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <p className="text-muted-foreground text-xs">Valor</p>
                    <p className="text-lg font-bold text-green-600 dark:text-green-400">
                      {getFormatCurrency(payment.value)}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-muted-foreground text-xs">Data</p>
                    <div className="flex items-center gap-2">
                      <Calendar className="text-muted-foreground h-4 w-4" />
                      <p className="text-sm font-medium">
                        {formatDateTime(payment.createdAt)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Terceira linha: ID e Ações */}
                <div className="border-t pt-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-muted-foreground mb-1 text-xs">
                        ID do Pagamento
                      </p>
                      <code className="bg-muted rounded px-2 py-1 font-mono text-xs">
                        {payment.id.substring(0, 12)}...
                      </code>
                    </div>
                    <Button
                      variant="link"
                      size="sm"
                      className="flex h-6 w-6 items-center justify-center rounded-lg bg-emerald-500 p-0 text-white"
                      aria-label="Detalhes"
                      onClick={() => onViewDetail(payment.id)}
                    >
                      <Info className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Tabela de Pagamentos - Versão Desktop */}
      <div className="hidden rounded-md border sm:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16">#</TableHead>
              <TableHead className="w-[150px]">Responsável</TableHead>
              <TableHead className="w-[150px]">Status</TableHead>
              <TableHead className="w-[120px]">Valor</TableHead>
              <TableHead className="w-[160px]">Data</TableHead>
              <TableHead className="w-[100px] text-center">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {payments.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-muted-foreground px-4 py-8 text-center"
                >
                  Nenhum pagamento em análise encontrado
                </TableCell>
              </TableRow>
            ) : (
              payments.map((payment, idx) => (
                <TableRow
                  key={payment.id}
                  className={`hover:bg-muted/50 ${
                    payment.isGuest ? 'bg-amber-50/40 dark:bg-amber-900/10' : ''
                  }`}
                >
                  <TableCell className="font-medium">
                    {calculateGlobalIndex(idx, page, pageSize)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <User className="text-muted-foreground h-4 w-4" />
                      <span className="truncate">
                        {payment.responsible || '-'}
                      </span>
                      {payment.isGuest && (
                        <Badge
                          variant="secondary"
                          className="h-5 px-2 text-[10px]"
                        >
                          N/ Associado
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(payment.status)}>
                      {getConvertStatusPayment(payment.status)}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-semibold text-green-600 dark:text-green-400">
                    {getFormatCurrency(payment.value)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Calendar className="text-muted-foreground h-4 w-4" />
                      {formatDateTime(payment.createdAt)}
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex justify-center gap-1">
                      <Button
                        variant="link"
                        size="sm"
                        className="flex h-6 w-6 items-center justify-center rounded-lg bg-emerald-500 p-0 text-white"
                        aria-label="Detalhes"
                        onClick={() => onViewDetail(payment.id)}
                      >
                        <Info className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Paginação */}
      {pageCount > 1 && (
        <div className="py-4">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="text-muted-foreground text-sm">
              Página {page} de {pageCount} • Total: {total} pagamentos
            </div>

            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => page > 1 && onPageChange(page - 1)}
                    href={page > 1 ? '#' : undefined}
                    className={
                      page === 1 ? 'pointer-events-none opacity-50' : ''
                    }
                  />
                </PaginationItem>

                {/* Versão mobile - apenas página atual */}
                <div className="sm:hidden">
                  <PaginationItem>
                    <PaginationLink
                      isActive={true}
                      href="#"
                      className="pointer-events-none"
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                </div>

                {/* Versão desktop - todas as páginas */}
                <div className="hidden sm:flex">
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
                </div>

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
        </div>
      )}
    </div>
  );
}
