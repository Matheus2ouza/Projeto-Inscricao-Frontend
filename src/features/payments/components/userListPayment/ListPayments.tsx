'use client';

import { LocalityToAccountCombobox } from '@/features/locality/components/LocalityToAccountCombobox';
import { useActionsPayments } from '@/features/payments/hooks/listPayment/useActionsPayments';
import { useListPayment } from '@/features/payments/hooks/listPayment/useListPayment';
import { Payment } from '@/features/payments/types/listPayments/listPaymentsTypes';
import { cn } from '@/lib/utils';
import { ConfirmationDialog } from '@/shared/components/ConfirmationDialog';
import ImagePreview from '@/shared/components/ImagePreview';
import { Button } from '@/shared/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog';
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
import { formatDateTime } from '@/shared/utils/formatDate';
import { getConvertStatusPayment } from '@/shared/utils/getConvertStatus';
import { getFormatCurrency } from '@/shared/utils/getFormatCurrency';
import { getStatusColor } from '@/shared/utils/getStatusColor';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { AlertCircle, CreditCard, Eye, RefreshCw, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { ListPaymentsSkeleton } from './ListPaymentsSkeleton';

type ListPaymentsProps = {
  eventId: string;
  onViewInscription?: (inscriptionId: string) => void;
  pageSize?: number;
};

export default function ListPayments({
  eventId,
  onViewInscription,
  pageSize = 10,
}: ListPaymentsProps) {
  const [paymentToDelete, setPaymentToDelete] = useState<Payment | null>(null);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [selectedLocalityId, setSelectedLocalityId] = useState<string>('');

  const {
    payments,
    summary,
    total,
    page,
    pageCount,
    loading,
    fetching,
    fetched,
    error,
    setPage,
    refresh,
  } = useListPayment({
    eventId,
    initialPage: 1,
    pageSize,
    localityId: selectedLocalityId || undefined,
  });

  const { handleDeletePayment, isDeleting } = useActionsPayments();

  // Função para calcular o índice global
  const calculateGlobalIndex = (localIndex: number): number => {
    return (page - 1) * pageSize + localIndex + 1;
  };

  // Função para limpar o filtro de localidade
  const handleClearLocalityFilter = () => {
    setSelectedLocalityId('');
  };

  // Renderiza o estado de erro
  if (error) {
    return (
      <div className="flex min-h-96 items-center justify-center p-6">
        <div className="border-riodavida/20 bg-riodavida/5 dark:border-riodavida/20 dark:bg-riodavida/10 rounded-lg border p-8 text-center shadow-sm backdrop-blur-sm">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
            <AlertCircle className="h-8 w-8 text-red-600 dark:text-red-400" />
          </div>
          <h3 className="text-riodavida-gray-dark dark:text-riodavida-gray mb-2 text-lg font-semibold">
            Erro ao carregar pagamentos
          </h3>
          <p className="text-muted-foreground mb-4 text-sm">
            {error.message || 'Ocorreu um erro inesperado.'}
          </p>
          <Button
            onClick={refresh}
            className="bg-riodavida hover:bg-riodavida-dark text-white"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Tentar Novamente
          </Button>
        </div>
      </div>
    );
  }

  // Renderiza o estado de loading
  if (loading) {
    return <ListPaymentsSkeleton />;
  }

  // Estado vazio
  if (payments.length === 0) {
    return (
      <div className="px-4 py-12">
        <div className="mx-auto max-w-md text-center">
          <div className="mb-6 flex justify-center">
            <div className="bg-riodavida/10 flex h-20 w-20 items-center justify-center rounded-full">
              <CreditCard className="text-riodavida h-10 w-10" />
            </div>
          </div>

          <h3 className="text-riodavida-gray-dark dark:text-riodavida-gray mb-2 text-xl font-semibold">
            Nenhum pagamento registrado
          </h3>

          <p className="text-muted-foreground mb-6 text-sm">
            {selectedLocalityId
              ? 'Não foram encontrados pagamentos para esta localidade.'
              : 'Não foram encontrados pagamentos para este evento.'}
            <br />
            Os pagamentos aparecerão aqui quando forem realizados.
          </p>

          <div className="flex flex-col justify-center gap-3 sm:flex-row">
            <Button
              variant="outline"
              onClick={refresh}
              className="border-riodavida/30 text-riodavida hover:bg-riodavida/10 hover:text-riodavida-dark gap-2"
              disabled={fetching}
            >
              <RefreshCw
                className={cn('h-4 w-4', fetching && 'animate-spin')}
              />
              {fetching ? 'Atualizando...' : 'Atualizar'}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Cards de Sumário */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
        <div className="liquid-card rounded-lg p-3 sm:p-4">
          <div className="flex flex-col space-y-1">
            <span className="text-muted-foreground text-xs sm:text-sm">
              Total de Pagamentos
            </span>
            <span className="text-riodavida-gray-dark dark:text-riodavida-gray text-xl font-bold sm:text-2xl">
              {summary.totalPayments}
            </span>
          </div>
        </div>

        <div className="liquid-card rounded-lg p-3 sm:p-4">
          <div className="flex flex-col space-y-1">
            <span className="text-muted-foreground text-xs sm:text-sm">
              Valor Pago
            </span>
            <span className="text-riodavida-secondary dark:text-riodavida-muted-light text-xl font-bold sm:text-2xl">
              {getFormatCurrency(summary.totalPaidValue)}
            </span>
          </div>
        </div>

        <div className="liquid-card rounded-lg p-3 sm:p-4">
          <div className="flex flex-col space-y-1">
            <span className="text-muted-foreground text-xs sm:text-sm">
              Em Análise
            </span>
            <span className="text-xl font-bold text-amber-600 sm:text-2xl dark:text-amber-400">
              {getFormatCurrency(summary.totalUnderReviewValue)}
            </span>
          </div>
        </div>

        <div className="liquid-card rounded-lg p-3 sm:p-4">
          <div className="flex flex-col space-y-1">
            <span className="text-muted-foreground text-xs sm:text-sm">
              Recusados
            </span>
            <span className="text-xl font-bold text-red-600 sm:text-2xl dark:text-red-400">
              {getFormatCurrency(summary.totalRefusedValue)}
            </span>
          </div>
        </div>
      </div>

      {/* Filtro de localidade */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="w-full max-w-sm">
          <label className="text-riodavida-gray-dark dark:text-riodavida-gray mb-2 block text-sm font-medium">
            Filtrar por Localidade
          </label>
          <LocalityToAccountCombobox
            value={selectedLocalityId}
            onChange={setSelectedLocalityId}
            placeholder="Selecione uma localidade"
          />
          {selectedLocalityId && (
            <button
              onClick={handleClearLocalityFilter}
              className="text-riodavida hover:text-riodavida-dark mt-2 text-sm font-medium transition-colors"
            >
              Limpar filtro
            </button>
          )}
          {!selectedLocalityId && (
            <p className="text-muted-foreground mt-2 text-sm">
              Selecione uma localidade para filtrar os pagamentos.
            </p>
          )}
        </div>
        <div className="shrink-0">
          <span className="text-muted-foreground text-sm">
            {total > 0 && `${total} pagamentos encontrados`}
          </span>
        </div>
      </div>

      {/* Tabela - Versão Mobile com Cards */}
      <div className="block sm:hidden">
        {payments.length === 0 ? (
          <div className="liquid-card flex flex-col items-center justify-center rounded-lg border-0 p-12 text-center transition-colors">
            <div className="bg-riodavida/10 mb-4 flex h-16 w-16 items-center justify-center rounded-full">
              <CreditCard className="text-riodavida h-8 w-8" />
            </div>
            <h4 className="text-riodavida-gray-dark dark:text-riodavida-gray mb-1 text-base font-semibold">
              Nenhum pagamento encontrado
            </h4>
            <p className="text-muted-foreground max-w-xs text-sm">
              {selectedLocalityId
                ? 'Não há pagamentos para esta localidade.'
                : 'Não há pagamentos registrados no momento.'}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {payments.map((payment, idx) => (
              <div
                key={payment.id}
                className="liquid-card rounded-lg border-0 p-4 transition-colors hover:shadow-md"
              >
                {/* Primeira linha: Número, Status e Ações */}
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground text-sm font-medium">
                      #
                    </span>
                    <span className="text-riodavida-gray-dark dark:text-riodavida-gray font-semibold">
                      {calculateGlobalIndex(idx)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-riodavida hover:bg-riodavida/10 hover:text-riodavida-dark dark:text-riodavida dark:hover:bg-riodavida/20 h-10 w-10 p-0"
                      onClick={() => {
                        setSelectedPayment(payment);
                      }}
                      title="Visualizar Detalhes"
                    >
                      <Eye className="h-5 w-5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-10 w-10 p-0 text-red-600 hover:bg-red-50 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-900/20"
                      onClick={() => setPaymentToDelete(payment)}
                      title="Excluir Pagamento"
                    >
                      <Trash2 className="h-5 w-5" />
                    </Button>
                  </div>
                </div>

                {/* Segunda linha: ID e Valor */}
                <div className="mb-3 grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <p className="text-muted-foreground text-xs">ID</p>
                    <code className="bg-riodavida/10 dark:bg-riodavida/20 rounded px-2 py-1 font-mono text-xs">
                      {payment.id.substring(0, 8)}...
                    </code>
                  </div>
                  <div className="space-y-1">
                    <p className="text-muted-foreground text-xs">Valor</p>
                    <p className="text-riodavida-secondary dark:text-riodavida-muted-light text-base font-bold">
                      {getFormatCurrency(payment.totalValue)}
                    </p>
                  </div>
                </div>

                {/* Terceira linha: Status e Data */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <p className="text-muted-foreground text-xs">Status</p>
                    <span
                      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold ${getStatusColor(
                        payment.status,
                      )}`}
                    >
                      {getConvertStatusPayment(payment.status)}
                    </span>
                  </div>
                  <div className="space-y-1">
                    <p className="text-muted-foreground text-xs">Data</p>
                    <p className="text-riodavida-gray-dark dark:text-riodavida-gray text-sm font-medium">
                      {format(new Date(payment.createdAt), 'dd/MM/yyyy', {
                        locale: ptBR,
                      })}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Tabela - Versão Desktop */}
      <div className="liquid-card hidden overflow-hidden rounded-lg sm:block">
        {payments.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="bg-riodavida/10 mb-4 flex h-20 w-20 items-center justify-center rounded-full">
              <CreditCard className="text-riodavida h-10 w-10" />
            </div>
            <h4 className="text-riodavida-gray-dark dark:text-riodavida-gray mb-1 text-lg font-semibold">
              Nenhum pagamento encontrado
            </h4>
            <p className="text-muted-foreground max-w-sm text-sm">
              {selectedLocalityId
                ? 'Não há pagamentos para esta localidade.'
                : 'Não há pagamentos registrados no momento.'}
            </p>
          </div>
        ) : (
          <Table>
            <TableHeader className="bg-riodavida/50 dark:bg-riodavida/30">
              <TableRow>
                <TableHead className="text-riodavida-gray-dark dark:text-riodavida-gray w-[180px] min-w-[180px] pl-4">
                  ID
                </TableHead>
                <TableHead className="text-riodavida-gray-dark dark:text-riodavida-gray w-[140px] min-w-[140px]">
                  Status
                </TableHead>
                <TableHead className="text-riodavida-gray-dark dark:text-riodavida-gray w-[140px] min-w-[140px]">
                  Valor
                </TableHead>
                <TableHead className="text-riodavida-gray-dark dark:text-riodavida-gray w-[200px] min-w-[200px]">
                  Data
                </TableHead>
                <TableHead className="text-riodavida-gray-dark dark:text-riodavida-gray w-[100px] min-w-[100px] text-center">
                  Ações
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payments.map((payment) => (
                <TableRow key={payment.id} className="liquid-card">
                  <TableCell className="text-riodavida-gray-dark dark:text-riodavida-gray pl-4 align-middle font-mono text-sm">
                    {payment.id.substring(0, 8)}...
                  </TableCell>
                  <TableCell className="align-middle">
                    <span
                      className={`rounded-full border px-3 py-1 text-xs font-semibold ${getStatusColor(
                        payment.status,
                      )}`}
                    >
                      {getConvertStatusPayment(payment.status)}
                    </span>
                  </TableCell>
                  <TableCell className="text-riodavida-secondary dark:text-riodavida-muted-light align-middle font-semibold">
                    {getFormatCurrency(payment.totalValue)}
                  </TableCell>
                  <TableCell className="text-riodavida-gray-dark dark:text-riodavida-gray align-middle font-medium">
                    {formatDateTime(payment.createdAt)}
                  </TableCell>
                  <TableCell className="align-middle">
                    <div className="flex justify-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-riodavida hover:bg-riodavida/10 hover:text-riodavida-dark dark:text-riodavida dark:hover:bg-riodavida/20 h-8 w-8 p-0"
                        onClick={() => {
                          setSelectedPayment(payment);
                        }}
                        title="Visualizar Detalhes"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-red-600 hover:bg-red-50 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-900/20"
                        onClick={() => setPaymentToDelete(payment)}
                        title="Excluir Pagamento"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
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
                    onClick={() => page > 1 && setPage(page - 1)}
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
                      className="bg-riodavida hover:bg-riodavida-dark pointer-events-none text-white"
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
                        onClick={() => setPage(i + 1)}
                        className={
                          page === i + 1
                            ? 'bg-riodavida hover:bg-riodavida-dark text-white'
                            : 'text-riodavida-gray-dark dark:text-riodavida-gray hover:bg-riodavida/5 dark:hover:bg-riodavida/10'
                        }
                      >
                        {i + 1}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                </div>

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
        </div>
      )}

      <ConfirmationDialog
        open={!!paymentToDelete}
        onOpenChange={(open) => {
          if (!open) {
            setPaymentToDelete(null);
          }
        }}
        onConfirm={async () => {
          if (paymentToDelete) {
            await handleDeletePayment(paymentToDelete.id);
            setPaymentToDelete(null);
            refresh();
          }
        }}
        title="Excluir pagamento"
        message="Tem certeza que deseja excluir este pagamento? Esta ação não pode ser desfeita."
        confirmText="Excluir"
        cancelText="Cancelar"
        isLoading={isDeleting}
        variant="destructive"
      />

      <Dialog
        open={!!selectedPayment}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedPayment(null);
          }
        }}
      >
        <DialogContent className="max-h-[90vh] max-w-[95vw] overflow-y-auto sm:max-w-2xl">
          {selectedPayment && (
            <>
              <DialogHeader>
                <DialogTitle className="text-riodavida-gray-dark dark:text-riodavida-gray">
                  Detalhes do Pagamento
                </DialogTitle>
                <DialogDescription className="break-all">
                  ID: {selectedPayment.id.substring(0, 16)}...
                </DialogDescription>
              </DialogHeader>

              <div className="mt-4 space-y-4">
                {/* Linha 1: Informações principais */}
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div className="space-y-1">
                    <span className="text-muted-foreground text-xs">Valor</span>
                    <p className="text-riodavida-secondary dark:text-riodavida-muted-light text-base font-semibold sm:text-lg">
                      {getFormatCurrency(selectedPayment.totalValue)}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <span className="text-muted-foreground text-xs">
                      Status
                    </span>
                    <div className="mt-1">
                      <span
                        className={`rounded-full border px-3 py-1 text-xs font-semibold ${getStatusColor(
                          selectedPayment.status,
                        )}`}
                      >
                        {getConvertStatusPayment(selectedPayment.status)}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <span className="text-muted-foreground text-xs">
                      Data e Hora
                    </span>
                    <p className="text-riodavida-gray-dark dark:text-riodavida-gray text-sm font-medium">
                      {formatDateTime(selectedPayment.createdAt)}
                    </p>
                  </div>

                  {selectedPayment.status === 'REFUSED' ? (
                    <div className="space-y-1">
                      <span className="text-muted-foreground text-xs">
                        Motivo da Recusa
                      </span>
                      <p className="text-sm text-red-600 dark:text-red-400">
                        {selectedPayment.rejectionReason}
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <span className="text-muted-foreground text-xs">
                        Motivo da Recusa
                      </span>
                      <p className="text-muted-foreground text-sm italic">
                        Aguardando análise
                      </p>
                    </div>
                  )}
                </div>

                {/* Linha 2: Comprovante */}
                <div className="space-y-1">
                  <span className="text-muted-foreground text-xs font-medium">
                    Comprovante
                  </span>
                  <div className="border-riodavida/20 bg-riodavida/5 dark:border-riodavida/20 dark:bg-riodavida/10 overflow-hidden rounded-md border p-3 sm:p-4">
                    {selectedPayment.imageUrls &&
                    selectedPayment.imageUrls.length > 0 ? (
                      <div className="flex flex-col items-center justify-center">
                        <div className="bg-riodavida/5 dark:bg-riodavida/10 mb-3 flex w-full items-center justify-center rounded p-2">
                          <div className="w-full text-center">
                            <p className="text-muted-foreground mb-3 text-xs sm:mb-4 sm:text-sm">
                              {selectedPayment.imageUrls.length > 1
                                ? `${selectedPayment.imageUrls.length} comprovantes disponíveis`
                                : 'Comprovante disponível'}
                            </p>

                            {/* Substitua o botão "Visualizar" pelo ImagePreview */}
                            <div className="flex justify-center">
                              <ImagePreview
                                images={selectedPayment.imageUrls}
                                orientation="horizontal"
                                className="w-full max-w-md"
                                imageClassName="object-contain"
                                containerClassName="justify-center"
                                showPreview={true}
                                maxDisplay={6}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex h-20 items-center justify-center sm:h-24">
                        <p className="text-muted-foreground text-sm">
                          Nenhum comprovante enviado
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Linha 3: Pagamento referente a */}
                <div className="space-y-2">
                  <span className="text-muted-foreground text-xs font-medium">
                    Pagamento referente a
                  </span>
                  {selectedPayment.allocation &&
                  selectedPayment.allocation.length > 0 ? (
                    <div className="border-riodavida/10 rounded-md border">
                      <Table>
                        <TableHeader className="bg-riodavida/5 dark:bg-riodavida/10">
                          <TableRow>
                            <TableHead className="text-riodavida-gray-dark dark:text-riodavida-gray w-[60px]">
                              #
                            </TableHead>
                            <TableHead className="text-riodavida-gray-dark dark:text-riodavida-gray">
                              Inscrição
                            </TableHead>
                            <TableHead className="text-riodavida-gray-dark dark:text-riodavida-gray w-[140px] text-right">
                              Valor
                            </TableHead>
                            <TableHead className="text-riodavida-gray-dark dark:text-riodavida-gray w-[70px] text-center">
                              Ação
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {selectedPayment.allocation.map((alloc, index) => (
                            <TableRow
                              key={alloc.inscriptionId}
                              className="hover:bg-riodavida/5 dark:hover:bg-riodavida/10"
                            >
                              <TableCell className="text-muted-foreground text-sm">
                                {index + 1}
                              </TableCell>
                              <TableCell className="font-mono text-xs sm:text-sm">
                                {alloc.inscriptionId}
                              </TableCell>
                              <TableCell className="text-riodavida-secondary dark:text-riodavida-muted-light text-right font-semibold">
                                {getFormatCurrency(alloc.value)}
                              </TableCell>
                              <TableCell className="text-center">
                                {onViewInscription && (
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="text-riodavida hover:bg-riodavida/10 hover:text-riodavida-dark dark:text-riodavida dark:hover:bg-riodavida/20 h-9 w-9 p-0"
                                    onClick={() =>
                                      onViewInscription(alloc.inscriptionId)
                                    }
                                    title="Visualizar Inscrição"
                                  >
                                    <Eye className="h-5 w-5" />
                                  </Button>
                                )}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  ) : (
                    <div className="border-riodavida/20 bg-riodavida/5 dark:border-riodavida/20 dark:bg-riodavida/10 flex items-center justify-center rounded-md border px-4 py-3 sm:py-4">
                      <p className="text-muted-foreground text-sm">
                        Nenhuma alocação registrada.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
