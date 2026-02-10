import { useActionsPayments } from "@/features/payment/hooks/listPayment/useActionsPayments";
import {
  Payment,
  PaymentsSummary,
} from "@/features/payment/types/listPayment/listPaymentTypes";
import { ConfirmationDialog } from "@/shared/components/ConfirmationDialog";
import ImageViewerDialog from "@/shared/components/ImageViewerDialog";
import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/shared/components/ui/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import { formatDateTime } from "@/shared/utils/formatDate";
import { getConvertStatusPayment } from "@/shared/utils/getConvertStatus";
import { getFormatCurrency } from "@/shared/utils/getFormatCurrency";
import { getStatusColor } from "@/shared/utils/getStatusColor";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Eye, Trash2 } from "lucide-react";
import { useState } from "react";

type ListPaymentsProps = {
  payments: Payment[];
  summary: PaymentsSummary;
  total: number;
  page: number;
  pageCount: number;
  onPageChange: (page: number) => void;
  onViewPayment?: (payment: Payment) => void;
  onViewInscription?: (inscriptionId: string) => void;
  pageSize?: number;
};

export default function ListPayments({
  payments,
  summary,
  total,
  page,
  pageCount,
  onPageChange,
  onViewPayment,
  onViewInscription,
  pageSize = 10,
}: ListPaymentsProps) {
  const [paymentToDelete, setPaymentToDelete] = useState<Payment | null>(null);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [isImageViewerOpen, setIsImageViewerOpen] = useState(false);
  const { handleDeletePayment, isDeleting } = useActionsPayments();

  // Função para calcular o índice global
  const calculateGlobalIndex = (localIndex: number): number => {
    return (page - 1) * pageSize + localIndex + 1;
  };

  return (
    <div className="space-y-6">
      {/* Cards de Sumário */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white dark:bg-gray-800 p-3 sm:p-4 rounded-lg border shadow-sm">
          <div className="flex flex-col space-y-1">
            <span className="text-xs sm:text-sm text-muted-foreground">
              Total de Pagamentos
            </span>
            <span className="text-xl sm:text-2xl font-bold">
              {summary.totalPayments}
            </span>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-3 sm:p-4 rounded-lg border shadow-sm">
          <div className="flex flex-col space-y-1">
            <span className="text-xs sm:text-sm text-muted-foreground">
              Valor Pago
            </span>
            <span className="text-xl sm:text-2xl font-bold text-green-600 dark:text-green-400">
              {getFormatCurrency(summary.totalPaidValue)}
            </span>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-3 sm:p-4 rounded-lg border shadow-sm">
          <div className="flex flex-col space-y-1">
            <span className="text-xs sm:text-sm text-muted-foreground">
              Em Análise
            </span>
            <span className="text-xl sm:text-2xl font-bold text-amber-600 dark:text-amber-400">
              {getFormatCurrency(summary.totalUnderReviewValue)}
            </span>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-3 sm:p-4 rounded-lg border shadow-sm">
          <div className="flex flex-col space-y-1">
            <span className="text-xs sm:text-sm text-muted-foreground">
              Recusados
            </span>
            <span className="text-xl sm:text-2xl font-bold text-red-600 dark:text-red-400">
              {getFormatCurrency(summary.totalRefusedValue)}
            </span>
          </div>
        </div>
      </div>

      {/* Tabela - Versão Mobile com Cards */}
      <div className="block sm:hidden">
        {payments.length === 0 ? (
          <div className="px-4 py-8 text-center text-muted-foreground border rounded-lg">
            Nenhum pagamento encontrado
          </div>
        ) : (
          <div className="space-y-3">
            {payments.map((payment, idx) => (
              <div
                key={payment.id}
                className="p-4 border rounded-lg hover:bg-muted/30 transition-colors"
              >
                {/* Primeira linha: Número, Status e Ações */}
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
                      variant="ghost"
                      size="icon"
                      className="h-10 w-10 p-0 text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/20"
                      onClick={() => {
                        setSelectedPayment(payment);
                        if (onViewPayment) {
                          onViewPayment(payment);
                        }
                      }}
                      title="Visualizar Detalhes"
                    >
                      <Eye className="h-5 w-5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-10 w-10 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                      onClick={() => setPaymentToDelete(payment)}
                      title="Excluir Pagamento"
                    >
                      <Trash2 className="h-5 w-5" />
                    </Button>
                  </div>
                </div>

                {/* Segunda linha: ID e Valor */}
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">ID</p>
                    <code className="font-mono text-xs bg-muted px-2 py-1 rounded">
                      {payment.id.substring(0, 8)}...
                    </code>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Valor</p>
                    <p className="text-base font-bold text-green-600 dark:text-green-400">
                      {getFormatCurrency(payment.totalValue)}
                    </p>
                  </div>
                </div>

                {/* Terceira linha: Status e Data */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Status</p>
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${getStatusColor(
                        payment.status,
                      )}`}
                    >
                      {getConvertStatusPayment(payment.status)}
                    </span>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Data</p>
                    <p className="text-sm font-medium">
                      {format(new Date(payment.createdAt), "dd/MM/yyyy", {
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
      <div className="hidden sm:block rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[180px] min-w-[180px] pl-4">ID</TableHead>
              <TableHead className="w-[140px] min-w-[140px]">Status</TableHead>
              <TableHead className="w-[140px] min-w-[140px]">Valor</TableHead>
              <TableHead className="w-[200px] min-w-[200px]">Data</TableHead>
              <TableHead className="w-[100px] min-w-[100px] text-center">
                Ações
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {payments.map((payment) => (
              <TableRow key={payment.id} className="hover:bg-muted/50">
                <TableCell className="font-mono text-sm pl-4 align-middle">
                  {payment.id.substring(0, 8)}...
                </TableCell>
                <TableCell className="align-middle">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(
                      payment.status,
                    )}`}
                  >
                    {getConvertStatusPayment(payment.status)}
                  </span>
                </TableCell>
                <TableCell className="font-semibold text-green-600 dark:text-green-400 align-middle">
                  {getFormatCurrency(payment.totalValue)}
                </TableCell>
                <TableCell className="font-medium align-middle">
                  {formatDateTime(payment.createdAt)}
                </TableCell>
                <TableCell className="align-middle">
                  <div className="flex justify-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/20"
                      onClick={() => {
                        setSelectedPayment(payment);
                        if (onViewPayment) {
                          onViewPayment(payment);
                        }
                      }}
                      title="Visualizar Detalhes"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
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
      </div>

      {/* Paginação */}
      {pageCount > 1 && (
        <div className="py-4">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="text-sm text-muted-foreground">
              Página {page} de {pageCount}
            </div>

            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => page > 1 && onPageChange(page - 1)}
                    href={page > 1 ? "#" : undefined}
                    className={
                      page === 1 ? "pointer-events-none opacity-50" : ""
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
                    href={page < pageCount ? "#" : undefined}
                    className={
                      page === pageCount ? "pointer-events-none opacity-50" : ""
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
        <DialogContent className="max-w-[95vw] sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          {selectedPayment && (
            <>
              <DialogHeader>
                <DialogTitle>Detalhes do Pagamento</DialogTitle>
                <DialogDescription className="break-all">
                  ID: {selectedPayment.id.substring(0, 16)}...
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 mt-4">
                {/* Linha 1: Informações principais */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <span className="text-xs text-muted-foreground">Valor</span>
                    <p className="text-base sm:text-lg font-semibold text-green-600 dark:text-green-400">
                      {getFormatCurrency(selectedPayment.totalValue)}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <span className="text-xs text-muted-foreground">
                      Status
                    </span>
                    <div className="mt-1">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(
                          selectedPayment.status,
                        )}`}
                      >
                        {getConvertStatusPayment(selectedPayment.status)}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <span className="text-xs text-muted-foreground">
                      Data e Hora
                    </span>
                    <p className="text-sm font-medium">
                      {formatDateTime(selectedPayment.createdAt)}
                    </p>
                  </div>

                  {selectedPayment.status === "REFUSED" ? (
                    <div className="space-y-1">
                      <span className="text-xs text-muted-foreground">
                        Motivo da Recusa
                      </span>
                      <p className="text-sm text-red-600 dark:text-red-400">
                        {selectedPayment.rejectionReason}
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <span className="text-xs text-muted-foreground">
                        Motivo da Recusa
                      </span>
                      <p className="text-sm text-muted-foreground italic">
                        Aguardando análise
                      </p>
                    </div>
                  )}
                </div>

                {/* Linha 2: Comprovante */}
                <div className="space-y-1">
                  <span className="text-xs font-medium text-muted-foreground">
                    Comprovante
                  </span>
                  <div className="border rounded-md overflow-hidden bg-muted p-3 sm:p-4">
                    {selectedPayment.imageUrl ? (
                      <div className="flex flex-col items-center justify-center">
                        <div className="w-full h-20 sm:h-25 bg-gray-100 dark:bg-gray-800 rounded flex items-center justify-center mb-3">
                          <div className="text-center p-2">
                            <p className="text-xs sm:text-sm text-muted-foreground mb-2 sm:mb-3">
                              Comprovante disponível
                            </p>
                            <Button
                              type="button"
                              size="sm"
                              onClick={() => setIsImageViewerOpen(true)}
                              className="w-full sm:w-auto"
                            >
                              Visualizar
                            </Button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center h-20 sm:h-24">
                        <p className="text-sm text-muted-foreground">
                          Nenhum comprovante enviado
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Linha 3: Pagamento referente a */}
                <div className="space-y-2">
                  <span className="text-xs font-medium text-muted-foreground">
                    Pagamento referente a
                  </span>
                  {selectedPayment.allocation &&
                  selectedPayment.allocation.length > 0 ? (
                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-[60px]">#</TableHead>
                            <TableHead>Inscrição</TableHead>
                            <TableHead className="w-[140px] text-right">
                              Valor
                            </TableHead>
                            <TableHead className="w-[70px] text-center">
                              Ação
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {selectedPayment.allocation.map((alloc, index) => (
                            <TableRow
                              key={alloc.inscriptionId}
                              className="hover:bg-muted/50"
                            >
                              <TableCell className="text-sm text-muted-foreground">
                                {index + 1}
                              </TableCell>
                              <TableCell className="font-mono text-xs sm:text-sm">
                                {alloc.inscriptionId}
                              </TableCell>
                              <TableCell className="text-right font-semibold text-green-600 dark:text-green-400">
                                {getFormatCurrency(alloc.value)}
                              </TableCell>
                              <TableCell className="text-center">
                                {onViewInscription && (
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="h-9 w-9 p-0 text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/20"
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
                    <div className="border rounded-md bg-muted/30 px-4 py-3 sm:py-4 flex items-center justify-center">
                      <p className="text-sm text-muted-foreground">
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

      {selectedPayment && selectedPayment.imageUrl && (
        <ImageViewerDialog
          isOpen={isImageViewerOpen}
          onClose={() => setIsImageViewerOpen(false)}
          imageUrl={selectedPayment.imageUrl}
          title={`Comprovante do pagamento ${selectedPayment.id}`}
          description={formatDateTime(selectedPayment.createdAt)}
        />
      )}
    </div>
  );
}
