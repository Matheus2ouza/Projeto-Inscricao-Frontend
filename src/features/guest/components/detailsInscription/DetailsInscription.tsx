'use client';

import {
  EventConfig,
  InscriptionDetails,
  Participant,
  Payment,
} from '@/features/guest/types/detailsInscription/detailsInscriptionType';
import { ConfirmationDialog } from '@/shared/components/ConfirmationDialog';
import ImageViewerDialog, {
  ImageViewerDownloadExtension,
} from '@/shared/components/ImageViewerDialog';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
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
  eventConfig: EventConfig;
  inscription: InscriptionDetails;
  participant: Participant;
  payments: Payment[] | null;
  onSearch: (code: string) => void;
  loading: boolean;
  onClear: () => void;
  onRegisterPaymentCard: () => void;
  onDeletePayment: (paymentId: string) => void;
  onModifyReceipt: (
    input: ModifyReceiptPaymentInput,
  ) => Promise<ModifyReceiptPaymentResponse>;
  isModifingReceipt: boolean;
}

export function DetailsInscription({
  eventId,
  confirmationCode,
  eventConfig,
  inscription,
  participant,
  payments,
  onSearch,
  loading,
  onClear,
  onRegisterPaymentCard,
  onDeletePayment,
  onModifyReceipt,
  isModifingReceipt,
}: DetailsInscriptionProps) {
  const router = useRouter();
  const [receiptViewerOpen, setReceiptViewerOpen] = useState(false);
  const [receiptViewerUrl, setReceiptViewerUrl] = useState<string | null>(null);
  const [receiptViewerFileName, setReceiptViewerFileName] = useState<
    string | undefined
  >(undefined);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [paymentIdToDelete, setPaymentIdToDelete] = useState<string | null>(
    null,
  );

  const handleRegisterPaymentPix = () => {
    const remainingValue = Math.max(
      inscription.totalValue - inscription.totalPaid,
      0,
    );

    const params = new URLSearchParams({
      inscriptions: inscription.id,
      name: inscription.guestName.trim().toLowerCase(),
      email: inscription.guestEmail.trim().toLowerCase(),
      remainingValue: String(remainingValue),
    });

    router.push(`/guest/${eventId}/payment/pix?${params.toString()}`);
  };

  const paymentsList = payments ?? inscription?.payments ?? [];

  return (
    <div className="w-full space-y-8">
      {inscription && (
        <div className="space-y-8">
          <InscriptionDetailsCard eventId={eventId} inscription={inscription} />

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-riodavida-gray-dark dark:text-riodavida-gray text-xl font-semibold">
                  Participante
                </h2>
              </div>
            </div>

            {!participant ? (
              <div className="border-riodavida/20 text-muted-foreground rounded-lg border px-4 py-8 text-center">
                Nenhum participante encontrado
              </div>
            ) : (
              <ParticipantCard
                participant={participant}
                eventId={eventId}
                participantFieldsConfig={eventConfig.participanteConfig}
                loading={loading}
              />
            )}
          </div>

          {/* PaymentSection já inclui o Resumo Financeiro e o Histórico de Pagamentos */}
          <PaymentSection
            inscriptionId={inscription.id}
            inscriptionStatus={inscription.status}
            allowedPaymentModes={eventConfig.allowedPaymentModes}
            payments={paymentsList}
            totalValue={inscription.totalValue}
            onRegisterPaymentCard={onRegisterPaymentCard}
            onRegisterPaymentPix={handleRegisterPaymentPix}
            onDeletePayment={onDeletePayment}
            onModifyReceipt={onModifyReceipt}
            isModifingReceipt={isModifingReceipt}
          />
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
