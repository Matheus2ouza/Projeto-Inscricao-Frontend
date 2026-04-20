'use client';

import { RegisterPaymentDetailsTable } from '@/features/payments/components/registerPaymentDetails/registerPaymentDetails';
import { useRegisterPaymentDetails } from '@/features/payments/hooks/registerPaymentDetails/registerPaymentDetails';
import PageContainer from '@/shared/components/layout/PageContainer';
import { Button } from '@/shared/components/ui/button';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { useParams, useRouter } from 'next/navigation';

const PAGE_SIZE = 10;
export default function RegisterPaymentDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const rawEventId = params.eventId;
  const rawInscriptionId = params.inscriptionId;
  const eventId = Array.isArray(rawEventId) ? rawEventId[0] : rawEventId;
  const inscriptionId = Array.isArray(rawInscriptionId)
    ? rawInscriptionId[0]
    : rawInscriptionId;

  if (!eventId) {
    return null;
  }

  if (!inscriptionId) {
    return null;
  }

  const {
    inscription,
    participant,
    payments,
    allowCard,
    totalParticipant,
    totalPayment,
    page,
    pageCount,
    loading,
    error,
    setPage,
    refresh,
  } = useRegisterPaymentDetails({
    inscriptionId,
    initialPage: 1,
    pageSize: PAGE_SIZE,
  });

  const renderSkeletonGrid = () => {
    return (
      <div className="space-y-6 p-6">
        <div className="bg-muted/30 mb-6 flex flex-col items-start justify-between gap-4 rounded-lg border p-4 sm:flex-row sm:items-center">
          <div className="space-y-1">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-4 w-60" />
          </div>
          <Skeleton className="h-10 w-40" />
        </div>
        <Skeleton className="h-[420px] w-full" />
      </div>
    );
  };

  const renderContent = () => {
    if (loading) {
      return renderSkeletonGrid();
    }

    if (error) {
      return (
        <div className="flex min-h-96 items-center justify-center p-6">
          <div className="text-destructive text-center">
            <p className="mb-4">
              Erro ao carregar pagamentos pendentes: {error.message}
            </p>
            <Button onClick={refresh}>Tentar Novamente</Button>
          </div>
        </div>
      );
    }

    return (
      <RegisterPaymentDetailsTable
        eventId={eventId}
        inscriptions={inscription}
        participant={participant}
        payments={payments}
        allowCard={allowCard}
        total={totalPayment}
        page={page}
        pageCount={pageCount}
        onPageChange={setPage}
        onRegisterPaymentPix={handleRegisterPaymentPix}
        onRegisterPaymentCard={handleRegisterPaymentCard}
      />
    );
  };

  const handleRegisterPaymentPix = (payload: {
    inscriptionId: string;
    totalValue: number;
  }) => {
    const search = new URLSearchParams();
    search.set('inscriptions', payload.inscriptionId);
    search.set('totalValue', String(payload.totalValue));
    if (allowCard) search.set('allowCard', '1');
    router.push(`/user/payment/register/${eventId}/pix?${search.toString()}`);
  };

  const handleRegisterPaymentCard = (payload: {
    inscriptionId: string;
    totalValue: number;
  }) => {
    const search = new URLSearchParams();
    search.set('inscriptions', payload.inscriptionId);
    search.set('totalValue', String(payload.totalValue));
    router.push(`/user/payment/register/${eventId}/card?${search.toString()}`);
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <PageContainer
      title="Detalhes do Pagamento"
      description="Visualize os detalhes do pagamento"
      showBackButton={true}
      backButtonAction={handleBack}
    >
      {renderContent()}
    </PageContainer>
  );
}
