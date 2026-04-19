'use client';

import PaymentListTable from '@/features/payments/components/adminListPaymant/PaymentListTable';
import { usePaymentList } from '@/features/payments/hooks/adminListPaymants/usePaymentList';
import PageContainer from '@/shared/components/layout/PageContainer';
import { Button } from '@/shared/components/ui/button';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { AlertTriangle } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';

export default function PaymentListAdminPage() {
  const params = useParams();
  const router = useRouter();
  const rawEventId = params.eventId;
  const eventId = Array.isArray(rawEventId) ? rawEventId[0] : rawEventId;

  if (!eventId) {
    return null;
  }

  const {
    summary,
    payments,
    total,
    page,
    pageCount,
    loading,
    error,
    setPage,
    refetch,
  } = usePaymentList({
    eventId: eventId,
    initialPage: 1,
    pageSize: 12,
  });

  const handleBack = () => {
    router.push('/admin/payments/list-payments');
  };

  const handleDetails = (paymentId: string) => {
    router.push(
      `/admin/payments/list-payments/${eventId}/details/${paymentId}`,
    );
  };

  const renderSkeletonGrid = () => {
    return (
      <div className="space-y-4">
        <Skeleton className="h-24 w-full" />
        <div className="space-y-2 rounded-xl border p-6">
          {Array.from({ length: 5 }).map((_, index) => (
            <Skeleton key={index} className="h-10 w-full" />
          ))}
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
        <div className="flex min-h-96 items-center justify-center text-center">
          <div className="max-w-sm space-y-4">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-950/40">
              <AlertTriangle className="h-8 w-8 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <p className="text-foreground text-lg font-semibold">
                Erro ao carregar os pagamentos
              </p>
              <p className="text-muted-foreground text-sm">{error}</p>
            </div>
            <Button onClick={() => refetch()}>Tentar novamente</Button>
          </div>
        </div>
      );
    }

    return (
      <PaymentListTable
        summary={summary}
        payments={payments}
        total={total}
        page={page}
        pageCount={pageCount}
        onPageChange={setPage}
        onViewDetails={handleDetails}
      />
    );
  };

  return (
    <PageContainer
      title="Pagamentos por Inscrição"
      description="Acompanhe os comprovantes enviados para o evento"
      showBackButton={true}
      backButtonAction={handleBack}
    >
      {renderContent()}
    </PageContainer>
  );
}
