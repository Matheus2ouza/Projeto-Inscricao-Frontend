"use client";

import EventsTable from "@/features/events/components/EventsTable";
import { useEventsAll } from "@/features/gastos/hooks/useEventsAll";
import PageContainer from "@/shared/components/layout/PageContainer";
import { Button } from "@/shared/components/ui/button";
import { Skeleton } from "@heroui/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
export const PAGE_SIZE = 4;

export default function SelectEventSuperPage() {
  const router = useRouter();
  const [pendingStatusFilter, setPendingStatusFilter] = useState<string[]>([]);
  const [appliedStatusFilter, setAppliedStatusFilter] = useState<string[]>([]);
  const { events, total, page, pageCount, loading, error, setPage, refetch } =
    useEventsAll({
      initialPage: 1,
      pageSize: 4,
      status: appliedStatusFilter.length > 0 ? appliedStatusFilter : undefined,
    });

  const handleBack = () => {
    router.push(`/super/home`);
  };

  const handleCreateEvent = () => {
    router.push(`/super/events/manager/create`);
  };

  const handleManagerEvent = (eventId: string) => {
    router.push(`/super/events/manager/${eventId}`);
  };

  const handleListInscriptions = (eventId: string) => {
    router.push(`/super/events/list-inscription/${eventId}`);
  };

  const handleStatusChange = (value: string[]) => {
    setPendingStatusFilter(value);
  };

  const handleApplyStatusFilter = () => {
    setAppliedStatusFilter(pendingStatusFilter);
    setPage(1);
  };

  // Estados de loading e error
  if (loading) {
    return (
      <div className="p-4 sm:p-6 relative">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
          <div>
            <Skeleton className="h-9 w-32 mb-2" />
            <Skeleton className="h-5 w-64" />
          </div>
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6">
          {Array.from({ length: PAGE_SIZE }).map((_, index) => (
            <div
              key={index}
              className="bg-card text-card-foreground flex flex-col transition-all duration-300 ease-in-out shadow-sm w-full overflow-hidden rounded-xl"
            >
              {/* Imagem do Evento */}
              <div className="relative w-full aspect-[16/9] overflow-hidden">
                <Skeleton className="w-full h-full" />
              </div>
              {/* Conteúdo do Card */}
              <div className="flex flex-col gap-4 sm:gap-6 p-4 sm:p-6">
                {/* Header do Card */}
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3 sm:gap-4 w-full">
                    <Skeleton className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex-shrink-0" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-6 w-3/4" />
                      <Skeleton className="h-5 w-24" />
                    </div>
                  </div>
                </div>
                {/* Estatísticas */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <Skeleton className="h-20 rounded-lg" />
                  <Skeleton className="h-20 rounded-lg" />
                </div>
                {/* Informações Básicas */}
                <div className="space-y-2 sm:space-y-3">
                  <Skeleton className="h-10 rounded-lg" />
                  <Skeleton className="h-10 rounded-lg" />
                </div>
                {/* Footer do Card */}
                <div className="flex justify-between items-center pt-3 sm:pt-4">
                  <Skeleton className="h-10 w-40" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 flex items-center justify-center min-h-96">
        <div className="text-center text-destructive">
          <p className="mb-4">Erro ao carregar eventos: {error}</p>
          <Button onClick={refetch}>Tentar Novamente</Button>
        </div>
      </div>
    );
  }

  return (
    <PageContainer
      title="Eventos"
      description="Escolha o evento que deseja gerenciar"
      showBackButton={true}
      backButtonAction={handleBack}
    >
      <EventsTable
        events={events}
        total={total}
        page={page}
        pageCount={pageCount}
        onPageChange={setPage}
        onCreateEvent={handleCreateEvent}
        onManagerEvent={handleManagerEvent}
        onListInscriptions={handleListInscriptions}
        statusFilter={pendingStatusFilter}
        onStatusFilterChange={handleStatusChange}
        onApplyStatusFilter={handleApplyStatusFilter}
      />
    </PageContainer>
  );
}
