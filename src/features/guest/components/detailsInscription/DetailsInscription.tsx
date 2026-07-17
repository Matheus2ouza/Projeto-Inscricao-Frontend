'use client';

import type { UpdateGuestParticipantFormInputs } from '@/features/guest/schema/actions/updateGuestParticipantSchema';
import {
  InscriptionDetails,
  InscriptionStatus,
  Participant,
  Payment,
  PaymentInstallment,
  StatusPayment,
} from '@/features/guest/types/detailsInscription/detailsInscriptionType';
import { ConfirmationDialog } from '@/shared/components/ConfirmationDialog';
import ImageUpdateDialog from '@/shared/components/ImageUpdateDialog';
import ImageViewerDialog, {
  ImageViewerDownloadExtension,
} from '@/shared/components/ImageViewerDialog';
import { Button } from '@/shared/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/card';
import { Input } from '@/shared/components/ui/input';
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
import { Calendar, FileText, HelpCircle, Search } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import type { UseFormReturn } from 'react-hook-form';
import type {
  ModifyReceiptPaymentInput,
  ModifyReceiptPaymentResponse,
} from '../../types/detailsInscription/actions/modifyReceiptPaymentTypes';
import { InscriptionDetailsCard } from './InscriptionDetailsCard';
import { ParticipantCard } from './ParticipantCard';
import { PaymentSection } from './PaymentSection';

interface DetailsInscriptionProps {
  eventId: string;
  confirmationCode: string | null;
  inscription: InscriptionDetails | null;
  participant: Participant | null;
  payments: Payment[] | null;
  participantEdit?: {
    editingParticipantId: string | null;
    form: UseFormReturn<UpdateGuestParticipantFormInputs>;
    onStart: (participantId: string) => void;
    onCancel: () => void;
    onSubmit: () => void;
  };
  onSearch: (code: string) => void;
  loading: boolean;
  onClear: () => void;
  onRegisterPaymentCard: () => void;
  onRegisterPaymentPix: () => void;
  isRegisteringPix: boolean;
  onDeletePayment: (paymentId: string) => void;
  onModifyReceipt: (
    input: ModifyReceiptPaymentInput,
  ) => Promise<ModifyReceiptPaymentResponse>;
  isModifingReceipt: boolean;
}

export function DetailsInscription({
  eventId,
  confirmationCode,
  inscription,
  participant,
  payments,
  participantEdit,
  onSearch,
  loading,
  onClear,
  onRegisterPaymentCard,
  onRegisterPaymentPix,
  isRegisteringPix,
  onDeletePayment,
  onModifyReceipt,
  isModifingReceipt,
}: DetailsInscriptionProps) {
  const [searchCode, setSearchCode] = useState(confirmationCode || '');
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

  const formatSearchCode = (value: string) => {
    const normalized = value
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, '')
      .slice(0, 12);

    if (normalized.length <= 4) return normalized;
    if (normalized.length <= 8)
      return `${normalized.slice(0, 4)}-${normalized.slice(4)}`;
    return `${normalized.slice(0, 4)}-${normalized.slice(4, 8)}-${normalized.slice(8)}`;
  };

  const searchCodeNormalized = searchCode.replace(/[^A-Z0-9]/g, '');

  useEffect(() => {
    if (confirmationCode) {
      setSearchCode(formatSearchCode(confirmationCode));
    }
  }, [confirmationCode]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchCodeNormalized.trim()) return;
    if (searchCodeNormalized.length !== 12) return;
    onSearch(formatSearchCode(searchCodeNormalized));
  };

  const openReceiptViewer = (payment: Payment) => {
    if (!payment.imageUrl) return;
    setReceiptViewerUrl(payment.imageUrl);
    setReceiptViewerFileName(`comprovante-${payment.id}`);
    setReceiptViewerOpen(true);
  };

  const paymentsList = payments ?? inscription?.payments ?? [];

  return (
    <div className="w-full space-y-8">
      <div className="w-full">
        <Card className="liquid-panel w-full gap-2">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
              Buscar por código
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSearch} className="w-full space-y-4">
              <div className="w-full space-y-4">
                <div className="flex w-full flex-col gap-3 lg:flex-row lg:items-center">
                  <div className="relative w-full">
                    <div className="absolute top-1/2 left-4 -translate-y-1/2 transform">
                      <Search className="h-4 w-4 text-gray-400" />
                    </div>
                    <Input
                      type="text"
                      value={searchCode}
                      onChange={(e) =>
                        setSearchCode(formatSearchCode(e.target.value))
                      }
                      placeholder="Digite o código (ex: N4LJ-3QTT-ECGL)"
                      className="h-10 w-full rounded-md border border-gray-300 pr-16 pl-10 font-mono text-sm tracking-wider focus:border-blue-500 focus:ring-blue-500 dark:border-gray-700"
                      disabled={loading}
                      maxLength={14}
                    />
                    <div className="absolute top-1/2 right-4 -translate-y-1/2 transform">
                      <div className="flex items-center gap-2">
                        <div className="text-[11px] font-medium text-gray-500 dark:text-gray-400">
                          {searchCodeNormalized.length}/12
                        </div>
                        {searchCodeNormalized.length === 12 && (
                          <div className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex w-full flex-col gap-3 lg:w-auto lg:flex-row">
                    <Button
                      type="submit"
                      disabled={
                        !searchCodeNormalized.trim() ||
                        loading ||
                        searchCodeNormalized.length !== 12
                      }
                      className="h-10 w-full rounded-md bg-blue-600 text-sm font-semibold hover:bg-blue-700 lg:w-36"
                    >
                      {loading ? (
                        <div className="flex items-center justify-center gap-2">
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                          <span>Buscando</span>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center gap-2">
                          <Search className="h-4 w-4" />
                          <span>Consultar</span>
                        </div>
                      )}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      disabled={loading || !searchCode.trim()}
                      onClick={() => {
                        setSearchCode('');
                        onClear();
                      }}
                      className="h-10 w-full rounded-md text-sm font-semibold lg:w-28"
                    >
                      Limpar
                    </Button>
                  </div>
                </div>
                <div className="liquid-panel-strong flex items-start gap-2 rounded-md border-blue-300/70 px-4 py-2 text-sm text-blue-700 dark:text-blue-200">
                  <HelpCircle className="h-5 w-5 flex-shrink-0 text-blue-500 dark:text-blue-300" />
                  <span className="leading-normal">
                    O código foi enviado para o e-mail inserido no ato da
                    inscrição. Seu formato é parecido com{' '}
                    <strong className="underline underline-offset-auto">
                      NBDT-5Y3Y-RA4M
                    </strong>
                  </span>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>

      {inscription && (
        <div className="space-y-8">
          <InscriptionDetailsCard eventId={eventId} inscription={inscription} />

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Participante
                </h2>
              </div>
            </div>

            {!participant ? (
              <div className="text-muted-foreground rounded-lg border px-4 py-8 text-center">
                Nenhum participante encontrado
              </div>
            ) : (
              <ParticipantCard
                participant={participant}
                participantEdit={participantEdit}
                loading={loading}
              />
            )}
          </div>

          <PaymentSection
            inscriptionId={inscription.id}
            inscriptionStatus={inscription.status}
            payments={paymentsList}
            totalValue={inscription.totalValue}
            onRegisterPaymentCard={onRegisterPaymentCard}
            onRegisterPaymentPix={onRegisterPaymentPix}
            isRegisteringPix={isRegisteringPix}
            onDeletePayment={onDeletePayment}
            onModifyReceipt={onModifyReceipt}
            isModifingReceipt={isModifingReceipt}
          />

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
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
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
              <div className="text-muted-foreground rounded-lg border px-4 py-8 text-center">
                {inscription.status === InscriptionStatus.UNDER_REVIEW
                  ? 'Aguardando revisão'
                  : 'Nenhum pagamento registrado'}
              </div>
            ) : (
              <div className="space-y-4">
                {paymentsList.map((p) => {
                  const installments: PaymentInstallment[] =
                    p.paymentInstallment ?? [];
                  const isApproved =
                    String(p.status).toUpperCase() === 'APPROVED';
                  const installmentsTotal = Math.max(
                    Number(p.installments) || 0,
                    1,
                  );
                  const installmentsPaid = Math.min(
                    Number(p.paidInstallments) || 0,
                    installmentsTotal,
                  );

                  return (
                    <div key={p.id} className="liquid-panel space-y-4 p-6">
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-2">
                          <FileText className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                          <h3 className="text-base font-semibold text-gray-900 dark:text-white">
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
                                ? 'text-green-600 dark:text-green-400'
                                : 'text-gray-900 dark:text-white'
                            }`}
                          >
                            {getFormatCurrency(p.totalPaid)}
                          </p>
                        </div>

                        <div className="space-y-1">
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Valor total
                          </p>
                          <p className="text-xl font-bold text-gray-900 dark:text-white">
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
                          <p className="text-xl font-bold text-gray-900 dark:text-white">
                            {p.method}
                          </p>
                        </div>

                        {isApproved ||
                          (installmentsPaid > 0 && (
                            <div className="space-y-1">
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                Parcelas
                              </p>
                              <p className="text-xl font-bold text-gray-900 dark:text-white">
                                {installmentsPaid}/{installmentsTotal}
                              </p>
                            </div>
                          ))}
                      </div>

                      {p.rejectionReason && (
                        <div className="grid grid-cols-1 gap-4 border-t sm:grid-cols-3">
                          <div className="space-y-1">
                            <p className="mt-3 text-base font-bold text-gray-900 uppercase dark:text-gray-400">
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
                          className="w-fit"
                          onClick={() => openReceiptViewer(p)}
                        >
                          <FileText className="h-4 w-4" />
                          Visualizar comprovante
                        </Button>
                      )}

                      {isApproved && (
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
                              Parcelas
                            </h4>
                          </div>

                          <div className="block sm:hidden">
                            {p.paymentInstallment.length === 0 ? (
                              <div className="text-muted-foreground rounded-lg border px-4 py-6 text-center">
                                Nenhuma parcela registrada
                              </div>
                            ) : (
                              <div className="space-y-3">
                                {p.paymentInstallment.map((installment) => (
                                  <div
                                    key={installment.id}
                                    className="hover:bg-muted/30 rounded-lg border p-4 transition-colors"
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
                                        <p className="text-base font-bold text-green-600 dark:text-green-400">
                                          {getFormatCurrency(installment.value)}
                                        </p>
                                      </div>
                                      <div className="col-span-2 space-y-1">
                                        <p className="text-muted-foreground text-xs">
                                          Data
                                        </p>
                                        <div className="flex items-center gap-2">
                                          <Calendar className="text-muted-foreground h-4 w-4" />
                                          <p className="text-sm font-medium">
                                            {installment.paidAt
                                              ? formatDateTime(
                                                  installment.paidAt,
                                                )
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

                          <div className="hidden rounded-md border sm:block sm:w-1/2">
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead className="w-16">#</TableHead>
                                  <TableHead>
                                    <div className="mx-auto w-fit text-left">
                                      Valor
                                    </div>
                                  </TableHead>
                                  <TableHead className="w-[180px]">
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
                                      className="hover:bg-muted/50"
                                    >
                                      <TableCell className="font-medium">
                                        {installment.installmentNumber}
                                      </TableCell>
                                      <TableCell className="font-semibold text-green-600 dark:text-green-400">
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
        </div>
      )}
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
    </div>
  );
}
