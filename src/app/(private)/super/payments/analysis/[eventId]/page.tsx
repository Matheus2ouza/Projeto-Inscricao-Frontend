'use client';

import AnalysisPayments from '@/features/payments/components/adminAnalysisPayment/AnalysisPayments';
import { useAnalysisPayment } from '@/features/payments/hooks/analysisPayment/analysisPayment';
import PageContainer from '@/shared/components/layout/PageContainer';
import { Button } from '@/shared/components/ui/button';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { useParams, useRouter } from 'next/navigation';

const PAGE_SIZE = 10;
export default function AnalysisPaymentSuperPage() {
  const params = useParams();
  const router = useRouter();
  const rawEventId = params.eventId;
  const eventId = Array.isArray(rawEventId) ? rawEventId[0] : rawEventId;

  if (!eventId) {
    return null;
  }

  const {
    event,
    payments,
    total,
    page,
    pageCount,
    loading,
    fetching,
    fetched,
    error,
    setPage,
    refresh,
  } = useAnalysisPayment({
    eventId,
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
              Erro ao carregar histórico de pagamentos: {error.message}
            </p>
            <Button onClick={refresh}>Tentar Novamente</Button>
          </div>
        </div>
      );
    }

    return (
      <AnalysisPayments
        event={event}
        payments={payments}
        total={total}
        page={page}
        pageCount={pageCount}
        pageSize={PAGE_SIZE}
        onPageChange={setPage}
        onViewDetail={handleViewDetail}
      />
    );
  };

  const handleViewDetail = (paymentId: string) => {
    router.push(`/super/payments/analysis/${eventId}/${paymentId}`);
  };

  const handleBack = () => {
    router.replace(`/super/home`);
  };

  return (
    <PageContainer
      title="Análise de Pagamentos"
      description="Visualize todos os pagamentos realizados para este evento"
      showBackButton={true}
      backButtonAction={handleBack}
    >
      {renderContent()}
    </PageContainer>
  );
}
