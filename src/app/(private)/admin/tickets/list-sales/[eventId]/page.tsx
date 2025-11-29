"use client";

import TicketSalesListContent from "@/features/tickets/components/TicketSalesListContent";
import { useListPreSales } from "@/features/tickets/hooks/useListPreSales";
import PageContainer from "@/shared/components/layout/PageContainer";
import { Button } from "@/shared/components/ui/button";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { useParams, useRouter } from "next/navigation";

export default function ListSalesAdminPage() {
  const params = useParams();
  const router = useRouter();
  const rawEventId = params.eventId;
  const eventId = Array.isArray(rawEventId) ? rawEventId[0] : rawEventId;

  const {
    sales,
    event,
    total,
    page,
    pageCount,
    isLoading,
    isFetching,
    error,
    refetch,
    setPage,
  } = useListPreSales(eventId ?? "", { initialPage: 1, pageSize: 10 });

  if (!eventId) {
    return null;
  }

  const handleBack = () => {
    router.push("/admin/tickets/list-sales");
  };

  const renderLoadingState = () => (
    <div className="space-y-6">
      <Skeleton className="h-32 w-full rounded-xl" />
      {Array.from({ length: 2 }).map((_, index) => (
        <Skeleton key={index} className="h-64 w-full rounded-2xl" />
      ))}
    </div>
  );

  const renderErrorState = () => {
    const message =
      error instanceof Error
        ? error.message
        : "Não foi possível carregar as vendas deste evento.";

    return (
      <div className="flex flex-col items-center justify-center gap-4 text-center py-12">
        <div>
          <p className="text-red-600 dark:text-red-400 font-semibold">
            Falha ao carregar lista de vendas.
          </p>
          <p className="text-muted-foreground mt-1 max-w-md">{message}</p>
        </div>
        <Button onClick={() => refetch()} variant="outline">
          Tentar novamente
        </Button>
      </div>
    );
  };

  const renderContent = () => {
    if (isLoading) {
      return renderLoadingState();
    }

    if (error) {
      return renderErrorState();
    }

    return (
      <TicketSalesListContent
        event={event}
        sales={sales}
        total={total}
        page={page}
        pageCount={pageCount}
        isFetching={isFetching}
        onRefresh={refetch}
        onPageChange={setPage}
      />
    );
  };

  return (
    <PageContainer
      title="Lista de vendas"
      description="Acompanhe todas as solicitações e vendas de tickets deste evento."
      showBackButton
      backButtonAction={handleBack}
    >
      {renderContent()}
    </PageContainer>
  );
}
