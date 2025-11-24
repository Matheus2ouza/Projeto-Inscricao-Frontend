"use client";

import TicketSalesDetails from "@/features/tickets/components/TicketSalesDetails";
import { useTicketSalesDetails } from "@/features/tickets/hooks/useTicketSalesDetails";
import PageContainer from "@/shared/components/layout/PageContainer";
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

  const { data, isLoading, isFetching, error, refetch, showSkeleton, hasData } =
    useTicketSalesDetails(ticketId);

  const handleBack = () => {
    router.push(`/super/tickets/analysis/${eventId}`);
  };

  return (
    <PageContainer
      title="Detalhes de Vendas"
      description={data ? `Ticket: ${data.name}` : "Nenhum ticket encontrado"}
      showBackButton
      backButtonAction={handleBack}
    >
      {error && (
        <div className="mb-4 text-red-600 text-sm">
          {error instanceof Error
            ? error.message
            : "Erro ao carregar detalhes do ticket"}
        </div>
      )}
      {showSkeleton ? (
        <div className="space-y-4">
          <div className="h-32 w-full bg-muted animate-pulse rounded-md" />
          <div className="h-64 w-full bg-muted animate-pulse rounded-md" />
        </div>
      ) : hasData && data ? (
        <TicketSalesDetails
          ticketId={ticketId}
          data={data}
          isFetching={isFetching}
          onRefresh={refetch}
        />
      ) : (
        <div className="text-sm text-muted-foreground">
          Nenhum detalhe disponível para este ticket.
        </div>
      )}
    </PageContainer>
  );
}
