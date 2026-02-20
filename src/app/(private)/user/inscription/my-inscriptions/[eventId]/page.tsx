"use client";

import MyInscriptionsTable from "@/features/inscriptions/components/myInscriptions/myInscriptions";
import { useMyInscriptions } from "@/features/inscriptions/hooks/myInscriptions/useMyInscriptions";
import PageContainer from "@/shared/components/layout/PageContainer";
import { Button } from "@/shared/components/ui/button";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { useParams, useRouter } from "next/navigation";

const PAGE_SIZE = 10;
export default function MyInscriptionsPage() {
  const params = useParams();
  const router = useRouter();
  const rawEventId = params.eventId;
  const eventId = Array.isArray(rawEventId) ? rawEventId[0] : rawEventId;

  if (!eventId) {
    return null;
  }

  const {
    event,
    inscriptions,
    total,
    page,
    pageCount,
    loading,
    error,
    setPage,
    refresh,
  } = useMyInscriptions({ eventId, initialPage: 1, pageSize: PAGE_SIZE });

  const renderSkeletonGrid = () => {
    return (
      <div className="p-6 space-y-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl border shadow-sm overflow-hidden">
          <div className="p-6">
            <div className="flex flex-col sm:flex-row gap-6">
              <div className="relative w-full sm:w-48 h-48 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                <Skeleton className="h-full w-full" />
              </div>
              <div className="flex-1 space-y-4">
                <div className="space-y-2">
                  <Skeleton className="h-7 w-64" />
                  <div className="flex flex-wrap gap-4 mt-1">
                    <Skeleton className="h-4 w-40" />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="bg-muted/30 p-4 rounded-lg">
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-6 w-16" />
                    </div>
                  </div>
                  <div className="bg-muted/30 p-4 rounded-lg">
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-6 w-24" />
                    </div>
                  </div>
                  <div className="bg-muted/30 p-4 rounded-lg">
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-28" />
                      <Skeleton className="h-6 w-12" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-4">
          <Skeleton className="h-6 w-48" />
        </div>

        <div className="space-y-4">
          <div className="hidden sm:block rounded-md border">
            <div className="border-b px-4 py-3 grid grid-cols-6 gap-4">
              <Skeleton className="h-4 w-6" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-16 justify-self-end" />
              <Skeleton className="h-4 w-16 justify-self-center" />
            </div>
            {[1, 2, 3].map((row) => (
              <div
                key={row}
                className="px-4 py-3 grid grid-cols-6 gap-4 border-t items-center"
              >
                <Skeleton className="h-4 w-6" />
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-10 justify-self-end" />
                <Skeleton className="h-8 w-16 justify-self-center" />
              </div>
            ))}
          </div>

          <div className="block sm:hidden space-y-3">
            {[1, 2, 3].map((card) => (
              <div key={card} className="p-4 border rounded-lg space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-4 w-4" />
                    <Skeleton className="h-4 w-8" />
                  </div>
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <Skeleton className="h-10 w-10 rounded-full" />
                  </div>
                </div>
                <div>
                  <Skeleton className="h-5 w-24 mb-2" />
                  <Skeleton className="h-4 w-40" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Skeleton className="h-4 w-16 mb-2" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                  <div>
                    <Skeleton className="h-4 w-10 mb-2" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                </div>
                <div className="pt-3 border-t flex items-center justify-between">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-5 w-8" />
                </div>
              </div>
            ))}
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
        <div className="p-6 flex items-center justify-center min-h-96">
          <div className="text-center text-destructive">
            <p className="mb-4">Erro ao carregar inscrições: {error.message}</p>
            <Button onClick={refresh}>Tentar Novamente</Button>
          </div>
        </div>
      );
    }

    return (
      <MyInscriptionsTable
        event={event}
        inscriptions={inscriptions}
        total={total}
        page={page}
        pageCount={pageCount}
        onPageChange={setPage}
        onSelectInscription={handleSelectInscription}
        onInscriptionDeleted={refresh}
      />
    );
  };

  const handleSelectInscription = (inscriptionId: string) => {
    router.push(
      `/user/inscription/my-inscriptions/${eventId}/${inscriptionId}`,
    );
  };

  const handleBack = () => {
    router.replace(`/user/home`);
  };

  return (
    <PageContainer
      title="Minhas Inscrições"
      description="Visualize o histórico de inscrições realizadas"
      showBackButton={true}
      backButtonAction={handleBack}
    >
      {renderContent()}
    </PageContainer>
  );
}
