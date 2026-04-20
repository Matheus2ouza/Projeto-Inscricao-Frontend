'use client';

import RegisterPaymentCardPublicTable from '@/features/payments/components/registerPaymentPublic/RegisterPaymentCardPublicTable';
import { useRegisterPaymentPublic } from '@/features/payments/hooks/registerPaymentPublic/useRegisterPaymentPublic';
import PageContainer from '@/shared/components/layout/PageContainer';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { AlertCircle } from 'lucide-react';
import { useSearchParams } from 'next/navigation';

export default function RegisterPaymentCardPublicPage() {
  const searchParams = useSearchParams();
  const eventId = searchParams.get('eventId') || '';
  const inscriptionIds = searchParams.get('inscriptions')?.split(',') || [];
  const userId = searchParams.get('userId') || '';
  const totalValue = Number(searchParams.get('totalValue')) || 0;

  const { event, loading, error, refresh } = useRegisterPaymentPublic({
    eventId,
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
          <div className="text-red-500">
            <AlertCircle className="mr-2 inline-block h-12 w-12" />
            <span>Erro ao carregar o evento.</span>
          </div>
        </div>
      );
    }

    return (
      <RegisterPaymentCardPublicTable
        event={event}
        eventId={eventId}
        inscriptionsIds={inscriptionIds}
        userId={userId}
        totalValue={totalValue}
      />
    );
  };

  return (
    <PageContainer
      title="Detalhes do Pagamento"
      description="Visualize os detalhes do pagamento"
      showBackButton={true}
    >
      {renderContent()}
    </PageContainer>
  );
}
