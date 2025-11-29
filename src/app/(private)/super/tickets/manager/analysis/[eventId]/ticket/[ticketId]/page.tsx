"use client";

import TicketSalesDetails from "@/features/tickets/components/TicketSalesDetails";
import { useTicketSalesDetails } from "@/features/tickets/hooks/useTicketSalesDetails";
import PageContainer from "@/shared/components/layout/PageContainer";
import { Button } from "@/shared/components/ui/button";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { useParams, useRouter } from "next/navigation";

export default function TicketSalesDetailsSuperPage() {
  const params = useParams();
  const router = useRouter();
  const rawEventId = params.eventId;
  const rawTicketId = params.ticketId;
  const eventId = Array.isArray(rawEventId) ? rawEventId[0] : rawEventId;
  const ticketId = Array.isArray(rawTicketId) ? rawTicketId[0] : rawTicketId;

  if (!eventId || !ticketId) {
    return null;
  }

  const { data, isFetching, error, refetch, showSkeleton, hasData } =
    useTicketSalesDetails(ticketId);

  const handleBack = () => {
    router.push(`/super/tickets/manager/analysis/${eventId}`);
  };

  const renderLoadingState = () => (
    <div className="space-y-4">
      <Skeleton className="h-32 w-full rounded-xl" />
      <Skeleton className="h-64 w-full rounded-xl" />
    </div>
  );

  const renderErrorState = () => {
    const message =
      error instanceof Error
        ? error.message
        : "Não foi possível carregar os detalhes do ticket.";

    return (
      <div className="flex flex-col items-center justify-center gap-4 text-center py-12">
        <div>
          <p className="text-red-600 dark:text-red-400 font-semibold">
            Falha ao carregar dados.
          </p>
          <p className="text-muted-foreground mt-1 max-w-md">{message}</p>
        </div>
        <Button onClick={() => refetch()} variant="outline">
          Tentar novamente
        </Button>
      </div>
    );
  };

  const renderEmptyState = () => (
    <div className="text-sm text-muted-foreground text-center py-12">
      Nenhum detalhe disponível para este ticket.
    </div>
  );

  const renderContent = () => {
    if (showSkeleton) {
      return renderLoadingState();
    }

    if (error) {
      return renderErrorState();
    }

    if (!hasData || !data) {
      return renderEmptyState();
    }

    return (
      <TicketSalesDetails
        ticketId={ticketId}
        data={data}
        isFetching={isFetching}
        onRefresh={refetch}
      />
    );
  };

  return (
    <PageContainer
      title="Detalhes de Vendas"
      description={data ? `Ticket: ${data.name}` : "Nenhum ticket encontrado"}
      showBackButton
      backButtonAction={handleBack}
    >
      {renderContent()}
    </PageContainer>
  );
}
