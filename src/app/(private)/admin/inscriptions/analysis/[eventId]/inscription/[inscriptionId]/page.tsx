'use client';

import InscriptionDetailAnalysis from '@/features/inscriptions/components/analysis/inscription/InscriptionDetailAnalysis';
import { useInscriptionActions } from '@/features/inscriptions/hooks/analysis/inscription/actions/useInscriptionActions';
import { useInscriptionDetails } from '@/features/inscriptions/hooks/analysis/inscription/useInscriptionDetails';
import PageContainer from '@/shared/components/layout/PageContainer';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { useParams, useRouter } from 'next/navigation';

export default function InscriptionDetailInsideAnalysisAdminPage() {
  const params = useParams();
  const router = useRouter();
  const rawEventId = params.eventId;
  const eventId = Array.isArray(rawEventId) ? rawEventId[0] : rawEventId;
  const rawInscriptionId = params.inscriptionId;
  const inscriptionId = Array.isArray(rawInscriptionId)
    ? rawInscriptionId[0]
    : rawInscriptionId;

  if (!eventId || !inscriptionId) {
    return null;
  }

  const {
    approveInscription,
    cancelInscription,
    deleteInscription,
    isApproving,
    isCancelling,
    isDeleting,
  } = useInscriptionActions();

  const {
    inscriptionDetails,
    participants,
    loading,
    error,
    page,
    pageCount,
    total,
    setPage,
    refetch,
  } = useInscriptionDetails({
    inscriptionId,
    initialPage: 1,
    pageSize: 10,
  });

  const renderSkeletonGrid = () => {
    return (
      <div className="space-y-6">
        <Card className="border-0 shadow-md">
          <CardContent className="p-8">
            <div className="space-y-4">
              <Skeleton className="h-8 w-1/3" />
              <Skeleton className="h-4 w-1/2" />
              <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
                <Skeleton className="h-20" />
                <Skeleton className="h-20" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, index) => (
                <Skeleton key={index} className="h-16 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderContent = () => {
    if (loading) {
      return renderSkeletonGrid();
    }

    if (error) {
      <div className="flex flex-col items-center justify-center gap-4 py-12 text-center">
        <div>
          <p className="font-semibold text-red-600 dark:text-red-400">
            Não foi possível carregar os eventos.
          </p>
          <p className="text-muted-foreground mt-1 max-w-md">
            {error || 'Tente novamente em instantes.'}
          </p>
        </div>
        <Button onClick={() => refetch()} variant="outline">
          Tentar novamente
        </Button>
      </div>;
    }

    return (
      <InscriptionDetailAnalysis
        inscriptionId={inscriptionId}
        inscriptionDetails={inscriptionDetails}
        participants={participants}
        page={page}
        pageCount={pageCount}
        total={total}
        setPage={setPage}
        approveInscription={approveInscription}
        cancelInscription={cancelInscription}
        deleteInscription={deleteInscription}
        isApproving={isApproving}
        isCancelling={isCancelling}
        isDeleting={isDeleting}
      />
    );
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <PageContainer
      title="Análise da Inscrição"
      description={inscriptionDetails?.responsible || 'Detalhes da inscrição'}
      showBackButton={true}
      backButtonAction={handleBack}
    >
      {renderContent()}
    </PageContainer>
  );
}
