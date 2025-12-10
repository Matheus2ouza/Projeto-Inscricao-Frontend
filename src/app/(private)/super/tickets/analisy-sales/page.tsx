"use client";

import { Loader2 } from "lucide-react";
import { useEventsAll } from "@/features/events/hooks/useEventsAll";
import TicketsTable from "@/features/tickets/components/TicketsTable";
import PageContainer from "@/shared/components/layout/PageContainer";
import { useRouter } from "next/navigation";

export default function TicketSalesSuperPage() {
  const router = useRouter();
  const { events, page, pageCount, setPage, loading, error } = useEventsAll({
    initialPage: 1,
    pageSize: 8,
  });

  const handleViewEvent = (eventId: string) => {
    router.push(`/super/tickets/sales/${eventId}`);
  };

  const handleBack = () => {
    router.push("/super/home");
  };

  return (
    <PageContainer
      title="Tickets"
      description="Analise as vendas de tickets de alimentação."
      showBackButton
      backButtonAction={handleBack}
    >
      {loading ? (
        <div className="flex justify-center items-center min-h-96">
          <Loader2 className="h-10 w-10 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <TicketsTable
          events={events}
          buttonLabel="Analisar Vendas"
          error={error}
          page={page}
          pageCount={pageCount}
          onPageChange={setPage}
          onViewEvent={handleViewEvent}
        />
      )}
    </PageContainer>
  );
}
