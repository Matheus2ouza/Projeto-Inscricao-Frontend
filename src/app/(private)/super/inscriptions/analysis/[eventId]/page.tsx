"use client";

import InscriptionsAnalysisTable from "@/features/inscriptions/components/analysis/InscriptionsAnalysisTable";
import { useInscriptionsForAnalysis } from "@/features/inscriptions/hooks/analysis/useInscriptionsForAnalysis";
import PageContainer from "@/shared/components/layout/PageContainer";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { useParams, useRouter } from "next/navigation";

export default function EventInscriptionsAnalysisSuperPage() {
  const params = useParams();
  const router = useRouter();
  const rawEventId = params.eventId;
  const eventId = Array.isArray(rawEventId) ? rawEventId[0] : rawEventId;

  if (!eventId) {
    return null;
  }
  const {
    analysisData,
    loading,
    error,
    page,
    pageCount,
    total,
    setPage,
    refetch,
  } = useInscriptionsForAnalysis({
    eventId,
    initialPage: 1,
    pageSize: 15,
  });

  const handleBack = () => {
    router.push("/super/inscriptions/analysis");
  };

  const handleViewInscription = (inscriptionId: string) => {
    router.push(
      `/super/inscriptions/analysis/${eventId}/inscription/${inscriptionId}`,
    );
  };

  const renderSkeletonGrid = () => {
    return (
      <div className="space-y-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Card key={index} className="border-0 shadow-sm">
            <CardContent className="">
              <div className="space-y-4">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-8 w-full" />
              </div>
            </CardContent>
          </Card>
        ))}
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
              {error || "Tente novamente em instantes."}
            </p>
          </div>
          <Button onClick={() => refetch()} variant="outline">
            Tentar novamente
          </Button>
        </div>
      );
    }

    return (
      <InscriptionsAnalysisTable
        analysisData={analysisData}
        page={page}
        pageCount={pageCount}
        total={total}
        onPageChange={setPage}
        onViewInscription={handleViewInscription}
      />
    );
  };

  return (
    <PageContainer
      title="Inscrições do Evento"
      description="Veja os detalhes das inscrições e avance na análise."
      showBackButton
      backButtonAction={handleBack}
    >
      {renderContent()}
    </PageContainer>
  );
}
