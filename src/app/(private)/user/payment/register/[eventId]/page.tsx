'use client';

import RegisterPaymentTable from '@/features/payments/components/registerPayment/RegisterPayment';
import { useListPaymentPending } from '@/features/payments/hooks/registerPayment/useListPaymentPending';
import PageContainer from '@/shared/components/layout/PageContainer';
import { Button } from '@/shared/components/ui/button';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { useParams, useRouter } from 'next/navigation';

const PAGE_SIZE = 10;
export default function RegisterPaymentPage() {
  const params = useParams();
  const router = useRouter();
  const rawEventId = params.eventId;
  const eventId = Array.isArray(rawEventId) ? rawEventId[0] : rawEventId;

  if (!eventId) {
    return null;
  }

  const {
    inscriptions,
    allowCard,
    page,
    pageCount,
    loading,
    error,
    setPage,
    refresh,
  } = useListPaymentPending({
    eventId,
    initialPage: 1,
    pageSize: PAGE_SIZE,
  });

  const handleViewPaymentDetails = (paymentId: string) => {
    router.push(`/user/payment/register/${eventId}/${paymentId}`);
  };

  const handleRegisterPaymentPix = (ids: string[], totalValue: number) => {
    const search = new URLSearchParams();
    if (ids.length > 0) search.set('inscriptions', ids.join(','));
    search.set('remainingValue', String(totalValue));
    if (allowCard) search.set('allowCard', '1');
    router.push(`/user/payment/register/${eventId}/pix?${search}`);
  };

  const handleRegisterPaymentCard = (ids: string[], totalValue: number) => {
    const search = new URLSearchParams();
    if (ids.length > 0) search.set('inscriptions', ids.join(','));
    search.set('totalValue', String(totalValue));
    router.push(`/user/payment/register/${eventId}/card?${search.toString()}`);
  };

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
      <RegisterPaymentTable
        inscriptions={inscriptions}
        allowCard={allowCard}
        page={page}
        pageCount={pageCount}
        onPageChange={setPage}
        pageSize={PAGE_SIZE}
        onViewPaymentDetails={handleViewPaymentDetails}
        onRegisterPaymentPix={handleRegisterPaymentPix}
        onRegisterPaymentCard={handleRegisterPaymentCard}
      />
    );
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <PageContainer
      title="Registrar Pagamento"
      description="Selecione as inscrições pendentes para realizar o pagamento"
      showBackButton={true}
      backButtonAction={handleBack}
    >
      {renderContent()}
    </PageContainer>
  );
}
