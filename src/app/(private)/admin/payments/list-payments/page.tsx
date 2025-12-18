"use client";

import { useEventsWithPaymentsAll } from "@/features/payments/hooks/useEventsWithPaymentsAll";
import TicketsTable from "@/features/tickets/components/SelectedEvent";
import PageContainer from "@/shared/components/layout/PageContainer";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function SelectEventForListPaymentAdminPage() {
  const router = useRouter();
  const { events, page, pageCount, setPage, loading, error } =
    useEventsWithPaymentsAll({
      initialPage: 1,
      pageSize: 8,
    });

  const handleViewEvent = (eventId: string) => {
    router.push(`/admin/payments/list-payments/${eventId}`);
  };

  const handleBack = () => {
    router.push("/admin/home");
  };

  const renderContent = () => {
    if (error) {
      return (
        <div className="flex justify-center items-center min-h-96">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-red-600 mb-2">
              Erro ao carregar eventos
            </h2>
            <p className="text-gray-600">{error}</p>
          </div>
        </div>
      );
    }

    if (loading) {
      return (
        <div className="flex justify-center items-center min-h-96">
          <Loader2 className="h-10 w-10 animate-spin text-muted-foreground" />
        </div>
      );
    }

    return (
      <TicketsTable
        events={events}
        buttonLabel="Ver Pagamentos"
        error={error}
        page={page}
        pageCount={pageCount}
        onPageChange={setPage}
        onViewEvent={handleViewEvent}
      />
    );
  };

  return (
    <PageContainer
      title="Lista de Pagamentos"
      description="Lista de Pagamentos referentes as Inscrições"
      showBackButton
      backButtonAction={handleBack}
    >
      {renderContent()}
    </PageContainer>
  );
}
