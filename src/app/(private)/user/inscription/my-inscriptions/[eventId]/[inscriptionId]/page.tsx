'use client';

import DetailsInscriptionTable from '@/features/inscriptions/components/myInscriptions/DetailsInscription';
import { useDetailsInscription } from '@/features/inscriptions/hooks/myInscriptions/detailsInscription/useDetailsInscription';
import PageContainer from '@/shared/components/layout/PageContainer';
import { Button } from '@/shared/components/ui/button';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { useParams, useRouter } from 'next/navigation';

export default function MyInscriptionDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const rawEventId = params.eventId;
  const eventId = Array.isArray(rawEventId) ? rawEventId[0] : rawEventId;
  const rawInscriptionId = params.inscriptionId;
  const inscriptionId = Array.isArray(rawInscriptionId)
    ? rawInscriptionId[0]
    : rawInscriptionId;

  if (!inscriptionId) {
    return null;
  }

  const {
    inscription,
    participants,
    payments,
    loading,
    fetching,
    fetched,
    error,
    refresh,
  } = useDetailsInscription({ inscriptionId });

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

  const handleRegisterPayment = () => {
    router.push(`/user/payment/register/${eventId}`);
  };

  const handleViewPayment = () => {
    router.push(`/user/payment/list-payments/${eventId}`);
  };

  const handleDeleted = () => {
    router.back();
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
      <DetailsInscriptionTable
        inscription={inscription}
        participants={participants}
        payments={payments}
        onDeleted={handleDeleted}
        onRegisterPayment={handleRegisterPayment}
        onViewPayment={handleViewPayment}
      />
    );
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <PageContainer
      title="Detalhes da Inscrição"
      description="Visualize os detalhes da inscrição"
      showBackButton={true}
      backButtonAction={handleBack}
    >
      {renderContent()}
    </PageContainer>
  );
}
