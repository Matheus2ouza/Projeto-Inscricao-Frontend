"use client";

import TicketsByEvent from "@/features/tickets/components/TicketsByEvent";
import { useCreateTicket } from "@/features/tickets/hooks/useCreateTicket";
import { useTicketsByEvent } from "@/features/tickets/hooks/useTicketsByEvent";
import PageContainer from "@/shared/components/layout/PageContainer";
import { useParams, useRouter } from "next/navigation";

export default function TicketsAnalysisByEventSuperPage() {
  const params = useParams();
  const router = useRouter();
  const rawEventId = params.eventId;
  const eventId = Array.isArray(rawEventId) ? rawEventId[0] : rawEventId;

  if (!eventId) {
    return null;
  }

  const { data: tickets, isLoading, error } = useTicketsByEvent(eventId);
  const { form, onSubmit, submitting } = useCreateTicket(eventId);

  const handleBack = () => {
    router.push("/super/tickets");
  };

  const handleViewSales = (ticketId: string) => {
    router.push(`/super/tickets/analysis/${eventId}/ticket/${ticketId}`);
  };

  return (
    <PageContainer
      title="Tickets do Evento"
      description="Gerencie os tickets e acompanhe como estão as vendas do evento."
      showBackButton
      backButtonAction={handleBack}
    >
      <TicketsByEvent
        tickets={tickets}
        loading={isLoading}
        form={form}
        onSubmit={onSubmit}
        submitting={submitting}
        onViewSales={handleViewSales}
      />
    </PageContainer>
  );
}
