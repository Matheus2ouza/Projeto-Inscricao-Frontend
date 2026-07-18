'use client';

import {
  InscriptionStatus,
  Payment,
  PaymentInstallment,
  PaymentMode,
  StatusPayment,
} from '@/features/guest/types/detailsInscription/detailsInscriptionType';
import { ConfirmationDialog } from '@/shared/components/ConfirmationDialog';
import ImageUpdateDialog from '@/shared/components/ImageUpdateDialog';
import ImageViewerDialog, {
  ImageViewerDownloadExtension,
} from '@/shared/components/ImageViewerDialog';
import { Button } from '@/shared/components/ui/button';
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
import { Calendar, CreditCard, FileText, QrCode } from 'lucide-react';
import { useRef, useState } from 'react';
import type {
  ModifyReceiptPaymentInput,
  ModifyReceiptPaymentResponse,
} from '../../types/detailsInscription/actions/modifyReceiptPaymentTypes';

interface PaymentSectionProps {
  inscriptionId: string;
  inscriptionStatus: InscriptionStatus;
  allowedPaymentModes: PaymentMode[];
  payments: Payment[];
  totalValue: number;
  onRegisterPaymentCard: () => void;
  onRegisterPaymentPix: () => void;
  onDeletePayment: (paymentId: string) => void;
  onModifyReceipt: (
    input: ModifyReceiptPaymentInput,
  ) => Promise<ModifyReceiptPaymentResponse>;
  isModifingReceipt: boolean;
}

export function PaymentSection({
  inscriptionStatus,
  allowedPaymentModes = [],
  payments,
  totalValue,
  onRegisterPaymentCard,
  onRegisterPaymentPix,
  onDeletePayment,
  onModifyReceipt,
  isModifingReceipt,
}: PaymentSectionProps) {
  const [receiptViewerOpen, setReceiptViewerOpen] = useState(false);
  const [receiptViewerUrl, setReceiptViewerUrl] = useState<string | null>(null);
  const [receiptViewerFileName, setReceiptViewerFileName] = useState<
    string | undefined
  >(undefined);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [paymentIdToDelete, setPaymentIdToDelete] = useState<string | null>(
    null,
  );
  const [modifyDialogOpen, setModifyDialogOpen] = useState(false);
  const [paymentIdToModify, setPaymentIdToModify] = useState<string | null>(
    null,
  );
  const modifyDialogScrollRef = useRef(0);

  const paymentsList = payments ?? [];

  // Verifica se o modo de pagamento está habilitado
  const isPaymentModeAllowed = (mode: PaymentMode) => {
    return allowedPaymentModes.includes(mode);
  };

  // Verifica se o PIX está habilitado
  const isPixAllowed = isPaymentModeAllowed(PaymentMode.PIX);

  // Verifica se o Cartão está habilitado
  const isCardAllowed = isPaymentModeAllowed(PaymentMode.CARTAO);

  // variavel para armazenar o valor total pago
  const paymentTotalPaid = paymentsList.reduce((total, payment) => {
    if (payment.status !== StatusPayment.APPROVED) return total;
    const value = Number(payment.totalPaid) || 0;
    return total + Math.max(value, 0);
  }, 0);

  const paymentTotalPaidAll = paymentsList.reduce((total, payment) => {
    const value = Number(payment.totalValue) || 0;
    return total + Math.max(value, 0);
  }, 0);

  // variavel para armazenar o progresso do pagamento em porcentagem
  const paymentProgress =
    totalValue > 0
      ? Math.min(Math.round((paymentTotalPaid / totalValue) * 100), 100)
      : 0;

  // variavel para armazenar o valor restante a ser pago
  const paymentDebt = Math.max(totalValue - paymentTotalPaidAll, 0);

  const openReceiptViewer = (payment: Payment) => {
    if (!payment.imageUrl) return;
    setReceiptViewerUrl(payment.imageUrl);
    setReceiptViewerFileName(`comprovante-${payment.id}`);
    setReceiptViewerOpen(true);
  };

  return (
    <>
      <div className="space-y-6">
        <div id="guest-payment" className="liquid-card scroll-mt-24 p-6">
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
            <div className="flex-1 space-y-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-2">
                  <CreditCard className="text-riodavida h-5 w-5" />
                  <h3 className="text-riodavida-gray-dark dark:text-riodavida-gray text-lg font-semibold">
                    Resumo Financeiro
                  </h3>
                </div>
                <div className="flex flex-col gap-2">
                  {/* Botão PIX - visível apenas se habilitado */}
                  {isPixAllowed && (
                    <Button
                      type="button"
                      onClick={onRegisterPaymentPix}
                      disabled={paymentDebt <= 0}
                      className="bg-riodavida hover:bg-riodavida-dark gap-2 text-white"
                    >
                      <QrCode className="h-4 w-4" />
                      Registrar pagamento Pix
                    </Button>
                  )}

                  {/* Botão Cartão - visível apenas se habilitado */}
                  {isCardAllowed && (
                    <Button
                      type="button"
                      onClick={onRegisterPaymentCard}
                      disabled={paymentDebt <= 0}
                      variant="outline"
                      className="border-riodavida/30 text-riodavida hover:bg-riodavida/10 hover:text-riodavida-dark gap-2"
                    >
                      <CreditCard className="h-4 w-4" />
                      Registrar pagamento Cartão
                    </Button>
                  )}

                  {/* Mensagem quando nenhum método está habilitado */}
                  {!isPixAllowed && !isCardAllowed && (
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Nenhum método de pagamento disponível no momento.
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="space-y-1">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Total pago
                  </p>
                  <p
                    className={`text-2xl font-bold ${
                      paymentTotalPaid > 0
                        ? 'text-riodavida-secondary dark:text-riodavida-muted-light'
                        : 'text-riodavida-gray-dark dark:text-riodavida-gray'
                    }`}
                  >
                    {getFormatCurrency(paymentTotalPaid)}
                  </p>
                </div>

                <div className="space-y-1">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Valor total
                  </p>
                  <p className="text-riodavida-gray-dark dark:text-riodavida-gray text-2xl font-bold">
                    {getFormatCurrency(totalValue)}
                  </p>
                </div>

                {paymentDebt > 0 && (
                  <div className="space-y-1">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Saldo pendente
                    </p>
                    <p className="text-2xl font-bold text-amber-600 dark:text-amber-500">
                      {getFormatCurrency(paymentDebt)}
                    </p>
                  </div>
                )}
              </div>

              <div className="pt-2">
                <div className="mb-1 flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">
                    Progresso
                  </span>
                  <span className="font-medium text-gray-700 dark:text-gray-300">
                    {paymentProgress}%
                  </span>
                </div>
                <div className="bg-foreground/15 h-2 overflow-hidden rounded-full">
                  <div
                    className="bg-riodavida-secondary h-full rounded-full transition-all duration-300"
                    style={{ width: `${paymentProgress}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <ImageUpdateDialog
          open={modifyDialogOpen}
          onOpenChange={(open) => {
            setModifyDialogOpen(open);
            if (!open) setPaymentIdToModify(null);
          }}
          title="Modificar comprovante"
          description="Selecione ou arraste uma imagem para atualizar o comprovante."
          onSubmit={async (imageDataUrl) => {
            if (!paymentIdToModify) return;
            await onModifyReceipt({
              paymentId: paymentIdToModify,
              image: imageDataUrl,
            });
          }}
          isSubmitting={isModifingReceipt}
        />

        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-riodavida-gray-dark dark:text-riodavida-gray text-xl font-semibold">
              Histórico de Pagamentos
            </h2>
            <p className="text-muted-foreground">
              {paymentsList.length} pagamento
              {paymentsList.length !== 1 ? 's' : ''} registrado
              {paymentsList.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>

        {paymentsList.length === 0 ? (
          <div className="border-riodavida/20 text-muted-foreground rounded-lg border px-4 py-8 text-center">
            {inscriptionStatus === InscriptionStatus.UNDER_REVIEW
              ? 'Aguardando revisão'
              : 'Nenhum pagamento registrado'}
          </div>
        ) : (
          <div className="space-y-4">
            {paymentsList.map((p) => {
              const installments: PaymentInstallment[] =
                p.paymentInstallment ?? [];
              const isApproved = String(p.status).toUpperCase() === 'APPROVED';
              const installmentsTotal = Math.max(
                Number(p.installments) || 0,
                1,
              );
              const installmentsPaid = Math.min(
                Number(p.paidInstallments) || 0,
                installmentsTotal,
              );

              return (
                <div key={p.id} className="liquid-card space-y-4 p-6">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-2">
                      <FileText className="text-riodavida h-5 w-5" />
                      <h3 className="text-riodavida-gray-dark dark:text-riodavida-gray text-base font-semibold">
                        {p.id.slice(0, 12)}...
                      </h3>
                    </div>
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-end">
                      {p.status === StatusPayment.REFUSED && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            modifyDialogScrollRef.current = window.scrollY;
                            setPaymentIdToModify(p.id);
                            setModifyDialogOpen(true);
                          }}
                          className="border-riodavida/30 text-riodavida hover:bg-riodavida/10 hover:text-riodavida-dark"
                        >
                          Modificar comprovante
                        </Button>
                      )}

                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => {
                          setPaymentIdToDelete(p.id);
                          setDeleteDialogOpen(true);
                        }}
                      >
                        Deletar pagamento
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <div className="space-y-1">
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Total pago
                      </p>
                      <p
                        className={`text-xl font-bold ${
                          p.totalPaid > 0
                            ? 'text-riodavida-secondary dark:text-riodavida-muted-light'
                            : 'text-riodavida-gray-dark dark:text-riodavida-gray'
                        }`}
                      >
                        {getFormatCurrency(p.totalPaid)}
                      </p>
                    </div>

                    <div className="space-y-1">
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Valor total
                      </p>
                      <p className="text-riodavida-gray-dark dark:text-riodavida-gray text-xl font-bold">
                        {getFormatCurrency(p.totalValue)}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Status
                      </p>
                      <span
                        className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-semibold ${getStatusColor(
                          p.status,
                        )}`}
                      >
                        {getConvertStatusPayment(p.status)}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <div className="space-y-1">
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Método
                      </p>
                      <p className="text-riodavida-gray-dark dark:text-riodavida-gray text-xl font-bold">
                        {p.method}
                      </p>
                    </div>

                    {isApproved ||
                      (installmentsPaid > 0 && (
                        <div className="space-y-1">
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Parcelas
                          </p>
                          <p className="text-riodavida-gray-dark dark:text-riodavida-gray text-xl font-bold">
                            {installmentsPaid}/{installmentsTotal}
                          </p>
                        </div>
                      ))}
                  </div>

                  {p.rejectionReason && (
                    <div className="border-riodavida/10 grid grid-cols-1 gap-4 border-t sm:grid-cols-3">
                      <div className="space-y-1">
                        <p className="text-riodavida-gray-dark dark:text-riodavida-gray mt-3 text-base font-bold uppercase">
                          Motivo da recusa
                        </p>
                        <p className="text-base text-red-600">
                          {p.rejectionReason}
                        </p>
                      </div>
                    </div>
                  )}

                  {p.imageUrl && (
                    <Button
                      type="button"
                      variant="outline"
                      className="border-riodavida/30 text-riodavida hover:bg-riodavida/10 hover:text-riodavida-dark w-fit"
                      onClick={() => openReceiptViewer(p)}
                    >
                      <FileText className="h-4 w-4" />
                      Visualizar comprovante
                    </Button>
                  )}

                  {isApproved && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="text-riodavida-gray-dark dark:text-riodavida-gray text-sm font-semibold">
                          Parcelas
                        </h4>
                      </div>

                      <div className="block sm:hidden">
                        {p.paymentInstallment.length === 0 ? (
                          <div className="border-riodavida/20 text-muted-foreground rounded-lg border px-4 py-6 text-center">
                            Nenhuma parcela registrada
                          </div>
                        ) : (
                          <div className="space-y-3">
                            {p.paymentInstallment.map((installment) => (
                              <div
                                key={installment.id}
                                className="border-riodavida/20 hover:bg-riodavida/5 rounded-lg border p-4 transition-colors"
                              >
                                <div className="mb-3 flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    <span className="text-muted-foreground text-sm font-medium">
                                      #
                                    </span>
                                    <span className="font-semibold">
                                      {installment.installmentNumber}
                                    </span>
                                  </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                  <div className="space-y-1">
                                    <p className="text-muted-foreground text-xs">
                                      Valor
                                    </p>
                                    <p className="text-riodavida-secondary dark:text-riodavida-muted-light text-base font-bold">
                                      {getFormatCurrency(installment.value)}
                                    </p>
                                  </div>
                                  <div className="col-span-2 space-y-1">
                                    <p className="text-muted-foreground text-xs">
                                      Data
                                    </p>
                                    <div className="flex items-center gap-2">
                                      <Calendar className="text-riodavida h-4 w-4" />
                                      <p className="text-sm font-medium">
                                        {installment.paidAt
                                          ? formatDateTime(installment.paidAt)
                                          : 'Em aberto'}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="border-riodavida/10 hidden rounded-md border sm:block sm:w-1/2">
                        <Table>
                          <TableHeader className="bg-riodavida/5">
                            <TableRow>
                              <TableHead className="text-riodavida-gray-dark dark:text-riodavida-gray w-16">
                                #
                              </TableHead>
                              <TableHead>
                                <div className="text-riodavida-gray-dark dark:text-riodavida-gray mx-auto w-fit text-left">
                                  Valor
                                </div>
                              </TableHead>
                              <TableHead className="text-riodavida-gray-dark dark:text-riodavida-gray w-[180px]">
                                Data
                              </TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {installments.length === 0 ? (
                              <TableRow>
                                <TableCell
                                  colSpan={3}
                                  className="text-muted-foreground h-24 text-center"
                                >
                                  Nenhuma parcela registrada
                                </TableCell>
                              </TableRow>
                            ) : (
                              installments.map((installment) => (
                                <TableRow
                                  key={installment.id}
                                  className="hover:bg-riodavida/5"
                                >
                                  <TableCell className="font-medium">
                                    {installment.installmentNumber}
                                  </TableCell>
                                  <TableCell className="text-riodavida-secondary dark:text-riodavida-muted-light font-semibold">
                                    <div className="mx-auto w-fit text-left whitespace-nowrap">
                                      {getFormatCurrency(installment.value)}
                                    </div>
                                  </TableCell>
                                  <TableCell className="whitespace-nowrap">
                                    {installment.paidAt
                                      ? formatDateTime(installment.paidAt)
                                      : 'Em aberto'}
                                  </TableCell>
                                </TableRow>
                              ))
                            )}
                          </TableBody>
                        </Table>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {receiptViewerUrl && (
        <ImageViewerDialog
          isOpen={receiptViewerOpen}
          onClose={() => {
            setReceiptViewerOpen(false);
            setReceiptViewerUrl(null);
            setReceiptViewerFileName(undefined);
          }}
          imageUrl={receiptViewerUrl}
          title="Comprovante"
          downloadFileName={receiptViewerFileName}
          downloadFileExtension={ImageViewerDownloadExtension.WEBP}
        />
      )}

      <ConfirmationDialog
        open={deleteDialogOpen}
        onOpenChange={(open) => {
          setDeleteDialogOpen(open);
          if (!open) setPaymentIdToDelete(null);
        }}
        onConfirm={() => {
          if (!paymentIdToDelete) return;
          onDeletePayment(paymentIdToDelete);
          setDeleteDialogOpen(false);
          setPaymentIdToDelete(null);
        }}
        title="Deletar pagamento"
        message="Tem certeza que deseja deletar este pagamento? Essa ação não pode ser desfeita."
        confirmText="Deletar"
        variant="destructive"
      />
    </>
  );
}
