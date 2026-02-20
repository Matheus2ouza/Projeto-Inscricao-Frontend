"use client";

import ListInscriptionsTable from "@/features/inscriptions/components/list-inscriptions/listInscriptions";
import { useListInscriptions } from "@/features/inscriptions/hooks/list-inscriptions/useListInscriptions";
import PageContainer from "@/shared/components/layout/PageContainer";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { useParams, useRouter } from "next/navigation";

const PAGE_SIZE = 10;

export default function ListInscriptionsAdminPage() {
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
    fetching,
    fetched,
    error,
    setPage,
    refresh,
  } = useListInscriptions({
    eventId,
    initialPage: 1,
    pageSize: PAGE_SIZE,
    isGuest: undefined,
    orderBy: "asc",
  });

  const renderSkeletonGrid = () => {
    return (
      <div className="space-y-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl border shadow-sm overflow-hidden">
          <div className="p-6">
            <div className="flex flex-col sm:flex-row gap-6">
              <Skeleton className="w-full sm:w-48 h-48 rounded-lg flex-shrink-0" />

              <div className="flex-1 space-y-4">
                <div className="space-y-3">
                  <Skeleton className="h-8 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {Array.from({ length: 4 }).map((_, index) => (
                    <div
                      key={index}
                      className="bg-muted/30 p-4 rounded-lg space-y-2"
                    >
                      <Skeleton className="h-4 w-2/3" />
                      <Skeleton className="h-7 w-1/3" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-4">
          <Skeleton className="h-7 w-64" />
        </div>

        <Card className="border-0 shadow-sm">
          <CardContent className="p-0">
            <div className="p-6 space-y-4">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="flex items-center gap-4">
                  <Skeleton className="h-5 w-10" />
                  <Skeleton className="h-5 w-24" />
                  <Skeleton className="h-5 flex-1" />
                  <Skeleton className="h-6 w-24" />
                  <Skeleton className="h-5 w-20" />
                  <Skeleton className="h-8 w-10" />
                </div>
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
      return (
        <div className="flex flex-col items-center justify-center py-12 gap-4 text-center">
          <div>
            <p className="text-red-600 dark:text-red-400 font-semibold">
              Não foi possível carregar os eventos.
            </p>
            <p className="text-muted-foreground mt-1 max-w-md">
              {error.message || "Tente novamente em instantes."}
            </p>
          </div>
          <Button onClick={() => refresh()} variant="outline">
            Tentar novamente
          </Button>
        </div>
      );
    }

    return (
      <ListInscriptionsTable
        pageSize={PAGE_SIZE}
        event={event}
        inscriptions={inscriptions}
        total={total}
        page={page}
        pageCount={pageCount}
        onPageChange={setPage}
        onSelectInscription={handleViewInscription}
      />
    );
  };

  const handleBack = () => {
    router.replace("/admin/inscriptions/list-inscriptions");
  };

  const handleViewInscription = (inscriptionId: string) => {
    router.push(
      `/admin/inscriptions/list-inscriptions/${eventId}/inscription/${inscriptionId}`,
    );
  };

  return (
    <PageContainer
      title={loading ? "Carregando..." : `${event?.name} - Lista de Inscrições`}
      description={
        loading
          ? "Carregando..."
          : `Abaixo estão listadas todas as inscrições referentes ao evento ${event?.name}`
      }
      showBackButton
      backButtonAction={handleBack}
    >
      {renderContent()}
    </PageContainer>
  );
}
