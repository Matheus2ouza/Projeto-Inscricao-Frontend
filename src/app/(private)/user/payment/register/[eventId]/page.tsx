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
      <div className="space-y-6">
        {/* Cards de Sumário - Skeleton */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="liquid-card rounded-lg p-3 sm:p-4">
              <div className="flex flex-col space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-8 w-16" />
              </div>
            </div>
          ))}
        </div>

        {/* Filtro de localidade - Skeleton */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="w-full max-w-sm space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-10 w-full rounded-md" />
          </div>
          <Skeleton className="h-4 w-40" />
        </div>

        {/* Tabela - Skeleton */}
        <div className="liquid-card hidden overflow-hidden rounded-lg border-0 sm:block">
          <div className="p-4">
            {/* Header da tabela */}
            <div className="bg-riodavida/50 dark:bg-riodavida/30 -mx-4 -mt-4 mb-4 px-4 py-3">
              <div className="flex items-center gap-4">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-5 w-20" />
              </div>
            </div>

            {/* Linhas da tabela */}
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center gap-4">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-6 w-20" />
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-32" />
                  <div className="flex gap-2">
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <Skeleton className="h-8 w-8 rounded-full" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Versão mobile do skeleton */}
        <div className="block sm:hidden">
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="liquid-card rounded-lg border-0 p-4">
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-4 w-8" />
                    <Skeleton className="h-4 w-8" />
                  </div>
                  <div className="flex gap-2">
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <Skeleton className="h-8 w-8 rounded-full" />
                  </div>
                </div>
                <div className="mb-3 grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Skeleton className="h-3 w-12" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                  <div className="space-y-1">
                    <Skeleton className="h-3 w-12" />
                    <Skeleton className="h-5 w-16" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Skeleton className="h-3 w-12" />
                    <Skeleton className="h-5 w-16" />
                  </div>
                  <div className="space-y-1">
                    <Skeleton className="h-3 w-12" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Paginação - Skeleton */}
        <div className="flex flex-col items-center justify-between gap-4 py-4 sm:flex-row">
          <Skeleton className="h-4 w-40" />
          <div className="flex items-center gap-2">
            <Skeleton className="h-9 w-20" />
            <Skeleton className="h-9 w-9" />
            <Skeleton className="h-9 w-9" />
            <Skeleton className="h-9 w-9" />
            <Skeleton className="h-9 w-20" />
          </div>
        </div>
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
