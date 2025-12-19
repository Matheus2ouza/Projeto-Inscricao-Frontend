"use client";

import TicketSalesAnalysisContent from "@/features/tickets/components/analisy-sales/TicketSalesAnalysisContent";
import { useTicketSalesAnalysis } from "@/features/tickets/hooks/analisy-sales/useTicketSalesAnalysis";
import PageContainer from "@/shared/components/layout/PageContainer";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { AlertCircle } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

export default function AnalyzeTicketSalesSuperEventPage() {
  const params = useParams();
  const router = useRouter();
  const rawEventId = params.eventId;
  const eventId = Array.isArray(rawEventId) ? rawEventId[0] : rawEventId;

  if (!eventId) {
    return null;
  }

  const {
    event,
    ticketSales,
    total,
    page,
    pageCount,
    setPage,
    isLoading,
    isFetching,
    error,
    refetch,
  } = useTicketSalesAnalysis(eventId, { initialPage: 1, pageSize: 10 });

  const errorMessage =
    error instanceof Error
      ? error.message
      : typeof error === "string"
        ? error
        : null;

  const renderSkeletonGrid = () => {
    return (
      <div className="space-y-6">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-6 flex flex-col gap-6 md:flex-row">
            <Skeleton className="h-48 w-full rounded-xl md:w-1/3" />
            <div className="flex-1 space-y-4">
              <Skeleton className="h-6 w-1/2" />
              <Skeleton className="h-4 w-2/3" />
              <div className="grid grid-cols-2 gap-4">
                <Skeleton className="h-20 rounded-lg" />
                <Skeleton className="h-20 rounded-lg" />
              </div>
              <Skeleton className="h-10 w-40" />
            </div>
          </CardContent>
        </Card>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array.from({ length: 2 }).map((_, index) => (
            <Card key={index} className="border border-border/40 shadow-sm">
              <CardContent className="p-6 space-y-4">
                <Skeleton className="h-6 w-1/2" />
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  const renderContent = () => {
    if (isLoading) {
      return renderSkeletonGrid();
    }

    if (error) {
      return (
        <div className="flex flex-col items-center gap-4 text-center py-12 border rounded-2xl bg-rose-50 dark:bg-rose-950/30">
          <AlertCircle className="h-10 w-10 text-rose-500" />
          <div>
            <p className="font-semibold text-rose-600 dark:text-rose-400">
              Falha ao carregar as vendas do evento.
            </p>
            <p className="text-muted-foreground mt-1 max-w-md">
              {errorMessage || "Tente novamente em instantes."}
            </p>
          </div>
          <Button variant="outline" onClick={() => refetch()}>
            Tentar novamente
          </Button>
        </div>
      )
    }

    return (
      <TicketSalesAnalysisContent
        event={event}
        ticketSales={ticketSales}
        total={total}
        isFetching={isFetching}
        page={page}
        pageCount={pageCount}
        onPageChange={setPage}
        onRefresh={refetch}
      />
    )
  }

  const handleBack = () => {
    router.push("/super/tickets/analisy-sales");
  };

  return (
    <PageContainer
      title="Análise das Vendas"
      description="Monitore as vendas de tickets aprovadas para este evento."
      showBackButton
      backButtonAction={handleBack}
    >
      {renderContent()}
    </PageContainer>
  );
}
