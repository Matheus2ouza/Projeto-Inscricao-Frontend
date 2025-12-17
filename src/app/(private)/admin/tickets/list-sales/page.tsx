"use client";

import SelectedEventForTicket from "@/features/tickets/components/SelectedEvent";
import { useSelectEvents } from "@/features/tickets/hooks/useSelectEvent";
import type { StatusEvent } from "@/features/tickets/types/selectEvent";
import { Event } from "@/features/tickets/types/selectEvent";
import PageContainer from "@/shared/components/layout/PageContainer";
import { Button } from "@/shared/components/ui/button";
import { Card, CardBody, CardFooter, Skeleton } from "@heroui/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SelectEventAdminPage() {
  const router = useRouter();
  const [pendingFilter, setPendingFilter] = useState<StatusEvent[]>([]);
  const [appliedFilter, setAppliedFilter] = useState<StatusEvent[]>([]);
  const { events, page, pageCount, setPage, loading, error, refetch } =
    useSelectEvents({
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
      label: "Total de tickets",
      value: event.countTickets
    },
    {
      label: "Total de Vendas",
      value: event.countSaleTickets
    }
  ]

  const renderSkeletonGrid = () => (
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

  const renderContent = () => {
    if (loading) {
      return renderSkeletonGrid();
    }

    if (error) {
      return (
        <div className="flex flex-col items-center justify-center py-12 gap-4 text-center">
          <div>
            <p className="text-red-600 dark:text-red-400 font-semibold">
              Não foi possível carregar os eventos.
            </p>
            <p className="text-muted-foreground mt-1 max-w-md">
              {error || "Tente novamente em instantes."}
            </p>
          </div>
          <Button onClick={() => refetch()} variant="outline">
            Tentar novamente
          </Button>
        </div>
      );
    }

    return (
      <SelectedEventForTicket
        events={events}
        buttonLabel="Gerenciar Tickets"
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
    router.push(`/admin/tickets/list-sales/${eventId}`);
  };

  const handleBack = () => {
    router.push("/admin/home");
  };

  return (
    <PageContainer
      title="Tickets"
      description="Lista de vendas dos tickets de alimentação."
      showBackButton
      backButtonAction={handleBack}
    >
      {renderContent()}
    </PageContainer>
  );
}
