"use client";

import SelectEventForUsers from "@/features/events/components/SelectEventForUsers";
import { useEventsAll } from "@/features/events/hooks/manager/useEventsAll";
import { StatusEvent } from "@/features/events/types/eventTypes";
import PageContainer from "@/shared/components/layout/PageContainer";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { Card, CardBody, CardFooter } from "@heroui/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function EventsPage() {
  const router = useRouter();
  const [pendingFilter, setPendingFilter] = useState<StatusEvent[]>([]);
  const [appliedFilter, setAppliedFilter] = useState<StatusEvent[]>([]);
  const { events, total, page, pageCount, loading, error, setPage, refetch } =
    useEventsAll({
      initialPage: 1,
      pageSize: 4,
      status: appliedFilter.length > 0 ? appliedFilter : undefined,
    });

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
            className="w-full border border-transparent shadow-md rounded-xl bg-white dark:bg-zinc-900 dark:border-zinc-800"
          >
            <CardBody className="p-0">
              <Skeleton className="w-full h-48 rounded-t-xl" />
            </CardBody>
            <CardFooter className="flex flex-col items-start p-4 bg-white dark:bg-zinc-900 border-t border-gray-100 dark:border-zinc-800 rounded-b-xl">
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
      <SelectEventForUsers
        events={events}
        buttonLabel="Começar Check-In"
        page={page}
        pageCount={pageCount}
        onPageChange={setPage}
        onViewEvent={handleDetailsEvent}
        statusFilter={pendingFilter}
        onStatusFilterChange={handleStatusChange}
        onApplyStatusFilter={handleApplyStatusFilter}
      />
    )
  }

  const handleDetailsEvent = (eventId: string) => {
    router.push(`/user/events/${eventId}`);
  };

  const handleBack = () => {
    router.push("/user/home");
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
  )
}
