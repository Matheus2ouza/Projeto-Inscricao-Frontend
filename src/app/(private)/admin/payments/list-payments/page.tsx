"use client";

import SelectedEventForPayments from "@/features/payments/components/SelectEventForPayments";
import { useSelectEvents } from "@/features/payments/hooks/useSelectEvents";
import { Event, StatusEvent } from "@/features/payments/types/selectEvent";
import PageContainer from "@/shared/components/layout/PageContainer";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SelectEventForListPaymentSuperPage() {
  const router = useRouter();
  const [pendingFilter, setPendingFilter] = useState<StatusEvent[]>([]);
  const [appliedFilter, setAppliedFilter] = useState<StatusEvent[]>([]);
  const { events, page, pageCount, setPage, loading, error } = useSelectEvents({
    initialPage: 1,
    pageSize: 8,
    status: appliedFilter.length > 0 ? appliedFilter : undefined,
  });

  const getInfoRows = (event: Event) => [
    {
      label: "Total de Pagamentos",
      value: event.totalPayments,
    },
    {
      label: "Total em Debito",
      value: event.totalDebt,
    },
  ];

  const handleStatusChange = (value: StatusEvent[]) => {
    setPendingFilter(value);
  };

  const handleApplyStatusFilter = () => {
    setAppliedFilter(pendingFilter);
    setPage(1);
  };

  const renderSkeletonGrid = () => {
    return (
      <div className="flex justify-center items-center min-h-96">
        <Loader2 className="h-10 w-10 animate-spin text-muted-foreground" />
      </div>
    );
  };

  const renderContent = () => {
    if (loading) {
      return renderSkeletonGrid();
    }

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

    return (
      <SelectedEventForPayments
        events={events}
        buttonLabel="Visualizar Gastos"
        page={page}
        pageCount={pageCount}
        onPageChange={setPage}
        onViewEvent={handleViewEvent}
        statusFilter={pendingFilter}
        onStatusFilterChange={handleStatusChange}
        onApplyStatusFilter={handleApplyStatusFilter}
        getInfoRows={getInfoRows}
      />
    );
  };

  const handleViewEvent = (eventId: string) => {
    router.push(`/admin/payments/list-payments/${eventId}`);
  };

  const handleBack = () => {
    router.push("/admin/home");
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
