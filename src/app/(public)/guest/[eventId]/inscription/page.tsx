'use client';

import { DetailsInscription } from '@/features/guest/components/detailsInscription/detailsInscription';
import { useDeletePayment } from '@/features/guest/hook/detailsInscription/actions/useDeletePayment';
import { useModifyReceiptPayment } from '@/features/guest/hook/detailsInscription/actions/useModifyReceiptPayment';
import { useUpdateGuestInscription } from '@/features/guest/hook/detailsInscription/actions/useUpdateInscription';
import { useUpdateGuestParticipant } from '@/features/guest/hook/detailsInscription/actions/useUpdateParticipant';
import { useDetailsInscription } from '@/features/guest/hook/detailsInscription/useDetailsInscription';
import PageContainer from '@/shared/components/layout/PageContainer';
import { Button } from '@/shared/components/ui/button';
import { getWithExpiry } from '@/shared/utils/storageWithExpiry';
import { Frown } from 'lucide-react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

export default function GuestInscriptionPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const rawEventId = params.eventId;
  const eventId = Array.isArray(rawEventId) ? rawEventId[0] : rawEventId;
  const [confirmationCode, setConfirmationCode] = useState<string | null>(null);
  const hasAutoScrolledRef = useRef(false);
  const persistKey = 'guest_inscription_persist';
  const [isEditingInscription, setIsEditingInscription] = useState(false);
  const [editingParticipantId, setEditingParticipantId] = useState<
    string | null
  >(null);

  if (!eventId) {
    return null;
  }

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlCode = searchParams.get('confirmationCode');
      if (urlCode) {
        setConfirmationCode(urlCode);
        return;
      }

      const cached = getWithExpiry<{
        eventId: string;
        confirmationCode: string;
      }>('guest_inscription');
      if (cached?.eventId === eventId && cached.confirmationCode) {
        setConfirmationCode(cached.confirmationCode);
        return;
      }

      const persistedRaw = window.localStorage.getItem(persistKey);
      if (persistedRaw) {
        try {
          const persisted = JSON.parse(persistedRaw) as {
            eventId?: string;
            confirmationCode?: string;
          };
          if (persisted?.eventId === eventId && persisted.confirmationCode) {
            setConfirmationCode(persisted.confirmationCode);
            return;
          }
        } catch {
          window.localStorage.removeItem(persistKey);
        }
      }

      setConfirmationCode(null);
    }
  }, [eventId, searchParams]);

  const { inscription, participants, payments, loading, error, refetch } =
    useDetailsInscription({
      confirmationCode: confirmationCode ?? '',
    });

  const { form: updateInscriptionForm, handleUpdateInscription } =
    useUpdateGuestInscription({
      inscriptionId: inscription?.id ?? '',
      initialValues: inscription
        ? {
            guestName: inscription.guestName,
            guestEmail: inscription.guestEmail,
            guestLocality: inscription.guestLocality,
            phone: inscription.phone,
          }
        : undefined,
      onSuccess: () => {
        setIsEditingInscription(false);
      },
    });

  const handleStartEditInscription = () => {
    if (!inscription) return;
    setIsEditingInscription(true);
  };

  const handleCancelEditInscription = () => {
    setIsEditingInscription(false);
    updateInscriptionForm.reset({
      guestName: inscription?.guestName ?? '',
      guestEmail: inscription?.guestEmail ?? '',
      guestLocality: inscription?.guestLocality ?? '',
      phone: inscription?.phone ?? '',
    });
  };

  const toDateInputValue = (value: string | Date | null | undefined) => {
    if (!value) return '';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '';
    return date.toISOString().slice(0, 10);
  };

  const participantBeingEdited =
    participants?.find((p) => p.id === editingParticipantId) ?? null;

  const { form: updateParticipantForm, handleUpdateParticipant } =
    useUpdateGuestParticipant({
      participantId: editingParticipantId ?? '',
      initialValues: participantBeingEdited
        ? {
            name: participantBeingEdited.name ?? '',
            preferredName: participantBeingEdited.preferredName ?? '',
            birthDate: toDateInputValue(participantBeingEdited.birthDate),
            gender: String(participantBeingEdited.gender ?? ''),
            shirtSize: String(participantBeingEdited.shirtSize ?? ''),
            shirtType: String(participantBeingEdited.shirtType ?? ''),
          }
        : undefined,
      onSuccess: () => {
        setEditingParticipantId(null);
      },
    });

  const handleStartEditParticipant = (participantId: string) => {
    if (!participants?.length) return;
    const exists = participants.some((p) => p.id === participantId);
    if (!exists) return;
    setEditingParticipantId(participantId);
  };

  const handleCancelEditParticipant = () => {
    const current = participants?.find((p) => p.id === editingParticipantId);
    updateParticipantForm.reset({
      name: current?.name ?? '',
      preferredName: current?.preferredName ?? '',
      birthDate: toDateInputValue(current?.birthDate),
      gender: String(current?.gender ?? ''),
      shirtSize: String(current?.shirtSize ?? ''),
      shirtType: String(current?.shirtType ?? ''),
    });
    setEditingParticipantId(null);
  };

  const { deletePaymentMutation } = useDeletePayment();

  useEffect(() => {
    if (hasAutoScrolledRef.current) return;
    if (searchParams.get('scroll') !== 'payment') return;
    if (loading) return;
    if (!inscription) return;
    if (error) return;

    requestAnimationFrame(() => {
      const el = document.getElementById('guest-payment');
      if (!el) return;
      const top = el.getBoundingClientRect().top + window.scrollY - 96;
      window.scrollTo({ top, behavior: 'smooth' });
      hasAutoScrolledRef.current = true;
    });
  }, [searchParams, loading, inscription, error]);

  const handleRegisterPaymentCard = () => {
    if (!inscription || !eventId || !participants) return;

    const participantsTotal = participants.reduce(
      (total, participant) => total + participant.typeInscription.price,
      0,
    );
    const payment = payments?.[0];
    const totalValue = payment?.totalValue ?? participantsTotal;
    const totalPaid = payment?.totalPaid ?? 0;
    const remainingTotal = Math.max(totalValue - totalPaid, 0);
    const search = new URLSearchParams();
    search.set('inscriptions', inscription.id);
    search.set('totalValue', String(remainingTotal));
    router.push(`/guest/${eventId}/payment/card?${search.toString()}`);
  };

  const handleRegisterPaymentPix = () => {
    if (!inscription || !eventId || !participants) return;

    const participantsTotal = participants.reduce(
      (total, participant) => total + participant.typeInscription.price,
      0,
    );
    const payment = payments?.[0];
    const totalValue = payment?.totalValue ?? participantsTotal;
    const totalPaid = payment?.totalPaid ?? 0;
    const remainingTotal = Math.max(totalValue - totalPaid, 0);
    const search = new URLSearchParams();
    search.set('inscriptions', inscription.id);
    search.set('confirmationCode', confirmationCode ?? '');
    search.set('guestName', inscription.guestName ?? '');
    search.set('guestEmail', inscription.guestEmail ?? '');
    search.set('totalValue', String(remainingTotal));
    router.push(`/guest/${eventId}/payment/pix?${search.toString()}`);
  };

  const { handleModifyReceiptPayment, isModifingReceiptPayment } =
    useModifyReceiptPayment();

  const renderContent = () => {
    return (
      <div className="space-y-6">
        <DetailsInscription
          confirmationCode={confirmationCode}
          inscription={inscription}
          participants={participants}
          payments={payments}
          loading={loading}
          inscriptionEdit={{
            isEditing: isEditingInscription,
            form: updateInscriptionForm,
            onStart: handleStartEditInscription,
            onCancel: handleCancelEditInscription,
            onSubmit: handleUpdateInscription,
          }}
          participantEdit={{
            editingParticipantId,
            form: updateParticipantForm,
            onStart: handleStartEditParticipant,
            onCancel: handleCancelEditParticipant,
            onSubmit: handleUpdateParticipant,
          }}
          onSearch={(code) => setConfirmationCode(code)}
          onClear={() => setConfirmationCode(null)}
          onRegisterPaymentCard={handleRegisterPaymentCard}
          onRegisterPaymentPix={handleRegisterPaymentPix}
          onDeletePayment={deletePaymentMutation.mutate}
          onModifyReceipt={handleModifyReceiptPayment}
          isModifingReceipt={isModifingReceiptPayment}
        />
        {error && (
          <div className="flex min-h-[160px] items-center justify-center">
            <div className="w-full max-w-xl rounded-xl border border-gray-200 p-6 text-center shadow-sm dark:border-gray-800 dark:bg-gray-900/50">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400">
                <Frown className="h-9 w-9" />
              </div>
              <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                Não foi possível carregar sua inscrição
              </p>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                {error}
              </p>
              <Button className="mt-4" onClick={() => refetch()}>
                Tentar Novamente
              </Button>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <PageContainer
      title="Minha Inscrição"
      description="Acompanhe o status da sua inscrição"
    >
      {renderContent()}
    </PageContainer>
  );
}
