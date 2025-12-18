"use client";

import { useEventsWithPaymentsAll } from "@/features/payments/hooks/useEventsWithPaymentsAll";
import TicketsTable from "@/features/tickets/components/SelectedEvent";
import PageContainer from "@/shared/components/layout/PageContainer";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function SelectEventForListPaymentSuperPage() {
  const router = useRouter();
  const { events, page, pageCount, setPage, loading, error } =
    useEventsWithPaymentsAll({
      initialPage: 1,
      pageSize: 8,
    });

  const handleViewEvent = (eventId: string) => {
    router.push(`/super/payments/list-payments/${eventId}`);
  };

  const handleBack = () => {
    router.push("/super/home");
  };

  return (
    <PageContainer
      title="Lista de Pagamentos"
      description="Lista de Pagamentos referentes as Inscrições"
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
          buttonLabel="Ver Pagamentos"
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
