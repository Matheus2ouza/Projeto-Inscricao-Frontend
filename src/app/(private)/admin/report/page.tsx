"use client";

import SelectEventForReport from "@/features/report/components/SelectEventForReport";
import { useSelectEvents } from "@/features/report/hooks/useSelectEvents";
import { Event, StatusEvent } from "@/features/report/types/selectEvent";
import PageContainer from "@/shared/components/layout/PageContainer";
import { Card, CardBody, CardFooter, Skeleton } from "@heroui/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ReportSuperPage() {
  const router = useRouter();
  const [pendingFilter, setPendingFilter] = useState<StatusEvent[]>([]);
  const [appliedFilter, setAppliedFilter] = useState<StatusEvent[]>([]);
  const { events, page, pageCount, setPage, loading, error } = useSelectEvents({
    initialPage: 1,
    pageSize: 8,
    status: appliedFilter.length > 0 ? appliedFilter : undefined,
  });

  const handleStatusChange = (value: StatusEvent[]) => {
    setPendingFilter(value);
  };

  const handleApplyStatusFilter = () => {
    setAppliedFilter(pendingFilter);
    setPage(1);
  };

  const getInfoRows = (event: Event) => [
    {
      label: "Total de Localidades",
      value: event.countAccounts,
    },
    {
      label: "Total de Participantes",
      value: event.countParticipants,
    },
  ];

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
      <SelectEventForReport
        events={events}
        buttonLabel="Visualizar Relatório"
        page={page}
        pageCount={pageCount}
        onPageChange={setPage}
        onViewEvent={handleViewReport}
        statusFilter={pendingFilter}
        onStatusFilterChange={handleStatusChange}
        onApplyStatusFilter={handleApplyStatusFilter}
        getInfoRows={getInfoRows}
      />
    );
  };

  const handleViewReport = (eventId: string) => {
    router.push(`/admin/report/${eventId}`);
  };

  const handleBack = () => {
    router.push("/admin/home");
  };

  return (
    <PageContainer
      title="Relatórios"
      description="Consulte o desempenho financeiro dos eventos."
      showBackButton
      backButtonAction={handleBack}
    >
      {renderContent()}
    </PageContainer>
  );
}
