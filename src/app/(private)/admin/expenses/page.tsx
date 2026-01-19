"use client";

import SelectedEventForExpenses from "@/features/expenses/components/SelectEventForExpenses";
import { useSelectEvents } from "@/features/expenses/hooks/useSelectEvents";
import { Event, StatusEvent } from "@/features/expenses/types/selectEvent";
import PageContainer from "@/shared/components/layout/PageContainer";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { Card, CardBody, CardFooter } from "@heroui/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ExpensesSuperPage() {
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
      label: "Total de Localidades",
      value: event.countExpenses,
    },
    {
      label: "Total de Participantes",
      value: event.countTotalExpenses,
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, index) => (
          <Card key={index} className="w-full border-0 shadow-md">
            <CardBody className="p-0">
              <Skeleton className="w-full h-48 rounded-t-xl" />
            </CardBody>
            <CardFooter className="flex flex-col items-start p-4">
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2 mb-2" />
              <Skeleton className="h-4 w-1/2" />
            </CardFooter>
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
      <SelectedEventForExpenses
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
    router.push(`/admin/expenses/${eventId}`);
  };

  const handleBack = () => {
    router.push("/admin/home");
  };

  return (
    <PageContainer
      title="Gastos"
      description="Acompanhe e registre os gastos vinculados aos eventos."
      showBackButton
      backButtonAction={handleBack}
    >
      {renderContent()}
    </PageContainer>
  );
}
