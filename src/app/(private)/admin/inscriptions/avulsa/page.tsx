"use client";

import type { Event } from "@/features/events/types/selectEvent";
import SelectedEvent from "@/features/inscriptions/components/SelectedEvent";
import { useEventsForAnalysis } from "@/features/inscriptions/hooks/useSelectEvent";
import { StatusEvent } from "@/features/inscriptions/types/selectEvent";
import PageContainer from "@/shared/components/layout/PageContainer";
import { AspectRatio } from "@/shared/components/ui/aspect-ratio";
import { Card, CardBody, CardFooter, Skeleton } from "@heroui/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SelectedEventAdminPage() {
  const router = useRouter();
  const defaultStatusFilter: StatusEvent[] = ["OPEN"];
  const [pendingFilter, setPendingFilter] =
    useState<StatusEvent[]>(defaultStatusFilter);
  const [appliedFilter, setAppliedFilter] =
    useState<StatusEvent[]>(defaultStatusFilter);
  const { events, loading, error, page, pageCount, setPage } =
    useEventsForAnalysis({
      initialPage: 1,
      pageSize: 8,
      status: appliedFilter.length > 0 ? appliedFilter : undefined,
    });

  const handleBack = () => {
    router.push("/admin/home");
  };

  const handleViewEvent = (eventId: string) => {
    router.push(`/admin/inscriptions/avulsa/${eventId}`);
  };

  const handleStatusChange = (value: StatusEvent[]) => {
    setPendingFilter(value);
  };

  const handleApplyStatusFilter = () => {
    setAppliedFilter(pendingFilter);
    setPage(1);
  };

  const getInfoRows = (event: Event) => [
    {
      label: "Inscrições avulsas",
      value: event.countSingleInscriptions,
    },
    {
      label: "Pendentes",
      value: event.countSingleDebit,
    },
  ];

  const renderSkeletonGrid = () => {
    const skeletonCards = Array.from({ length: 6 });

    return (
      <div className="space-y-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-2">
            <Skeleton className="h-10 w-full sm:w-[220px] rounded-full" />
            <Skeleton className="h-10 w-28 rounded-full" />
          </div>
          <Skeleton className="h-10 w-28 rounded-full" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {skeletonCards.map((_, index) => (
            <Card
              key={index}
              className="w-full border border-transparent shadow-md rounded-xl bg-white dark:bg-zinc-900 dark:border-zinc-800"
            >
              <CardBody className="p-0">
                <AspectRatio ratio={16 / 9} className="w-full">
                  <Skeleton className="w-full h-full rounded-t-xl" />
                </AspectRatio>
              </CardBody>
              <CardFooter className="flex flex-col items-start p-4 bg-white dark:bg-zinc-900 border-t border-gray-100 dark:border-zinc-800 rounded-b-xl space-y-3">
                <Skeleton className="h-6 w-3/4" />
                <div className="flex w-full justify-between gap-4">
                  <Skeleton className="h-4 w-1/3" />
                  <Skeleton className="h-4 w-14" />
                </div>
                <div className="flex w-full justify-between gap-4">
                  <Skeleton className="h-4 w-1/4" />
                  <Skeleton className="h-4 w-10" />
                </div>
                <Skeleton className="h-10 w-full rounded-full" />
              </CardFooter>
            </Card>
          ))}
        </div>
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
      <SelectedEvent
        events={events}
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

  return (
    <PageContainer
      title="Inscrições Avulsas"
      description="Visualize eventos e seus status para cadastrar inscrições avulsas."
      showBackButton
      backButtonAction={handleBack}
    >
      {renderContent()}
    </PageContainer>
  );
}
