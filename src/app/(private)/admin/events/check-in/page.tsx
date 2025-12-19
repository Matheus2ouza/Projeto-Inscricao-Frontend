"use client";

import SelectEventForCheckin from "@/features/events/components/check-in/SelectEventForCheckin";
import { useSelectEvents } from "@/features/events/hooks/check-in/useSelectEvents";
import { Event, StatusEvent } from "@/features/events/types/check-in/selectEvent";
import PageContainer from "@/shared/components/layout/PageContainer";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { Card, CardBody, CardFooter } from "@heroui/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SelectedEventForCheckInSuperPage() {
  const router = useRouter();
  const [pendingFilter, setPendingFilter] = useState<StatusEvent[]>([]);
  const [appliedFilter, setAppliedFilter] = useState<StatusEvent[]>([]);
  const { events, loading, error, page, pageCount, setPage } =
    useSelectEvents({
      initialPage: 1,
      pageSize: 8,
      status: appliedFilter.length > 0 ? appliedFilter : undefined,
    });

  const getInfoRows = (event: Event) => [
    {
      label: "Total de Localidades",
      value: event.countAccounts
    },
    {
      label: "Total de Participantes",
      value: event.countParticipants
    }
  ]

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
          <Card
            key={index}
            className="w-full border border-transparent shadow-md bg-white dark:bg-zinc-900 dark:border-zinc-800"
          >
            <CardBody className="p-0">
              <Skeleton className="w-full h-48 rounded-t-xl" />
            </CardBody>
            <CardFooter className="flex flex-col items-start p-4 bg-white dark:bg-zinc-900 border-t border-gray-100 dark:border-zinc-800">
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2 mb-2" />
              <Skeleton className="h-4 w-1/2" />
            </CardFooter>
          </Card>
        ))}
      </div>
    )
  }

  const renderContent = () => {
    if (loading) {
      return renderSkeletonGrid()
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
      <SelectEventForCheckin
        events={events}
        buttonLabel="Começar Check-In"
        page={page}
        pageCount={pageCount}
        onPageChange={setPage}
        onViewEvent={handleSelectEvent}
        statusFilter={pendingFilter}
        onStatusFilterChange={handleStatusChange}
        onApplyStatusFilter={handleApplyStatusFilter}
        getInfoRows={getInfoRows}
      />
    )
  }

  const handleSelectEvent = (eventId: string) => {
    router.push(`/admin/events/check-in/${eventId}`);
  };

  const handleBack = () => {
    router.push("/admin/home");
  };

  return (
    <PageContainer
      title="Selecionar Evento"
      description="Escolha um evento para começar a fazer Check-in"
      showBackButton={true}
      backButtonAction={handleBack}
    >
      {renderContent()}
    </PageContainer>
  );
}
