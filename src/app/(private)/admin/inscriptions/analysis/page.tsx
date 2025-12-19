"use client";

import type { Event } from "@/features/events/types/selectEvent";
import SelectedEventForInscription from "@/features/inscriptions/components/SelectedEvent";
import { useEventsForAnalysis } from "@/features/inscriptions/hooks/useSelectEvent";
import { StatusEvent } from "@/features/inscriptions/types/selectEvent";
import PageContainer from "@/shared/components/layout/PageContainer";
import { Card, CardBody, CardFooter, Skeleton } from "@heroui/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SelectedEventForAnalysisInscriptionAdminPage() {
  const router = useRouter();
  const [pendingFilter, setPendingFilter] = useState<StatusEvent[]>([]);
  const [appliedFilter, setAppliedFilter] = useState<StatusEvent[]>([]);
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
    router.push(`/admin/inscriptions/analysis/${eventId}`);
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
      label: "Total de Inscrições",
      value: event.countInscriptions,
    },
    {
      label: "Pendentes",
      value: event.countInscriptionsAnalysis,
    },
  ];

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
      <SelectedEventForInscription
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
      title="Análise de Inscrições"
      description="Monitore o progresso da análise das inscrições dos eventos."
      showBackButton
      backButtonAction={handleBack}
    >
      {renderContent()}
    </PageContainer>
  );
}
