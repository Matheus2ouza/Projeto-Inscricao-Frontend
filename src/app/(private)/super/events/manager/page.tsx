'use client';

import SelectedEventManager from '@/features/events/components/manager/SelectedEventManager';
import { useListEventsToManager } from '@/features/events/hooks/listEvents/listEventsToManager/useListEventsToManager';
import { StatusEvent } from '@/features/events/types/selectEvent';
import PageContainer from '@/shared/components/layout/PageContainer';
import { Button } from '@/shared/components/ui/button';
import { Skeleton } from '@heroui/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function SelectEventSuperPage() {
  const router = useRouter();
  const [pendingStatusFilter, setPendingStatusFilter] = useState<StatusEvent[]>(
    [],
  );
  const [appliedStatusFilter, setAppliedStatusFilter] = useState<StatusEvent[]>(
    [],
  );
  const { events, total, page, pageCount, loading, error, setPage, refetch } =
    useListEventsToManager({
      initialPage: 1,
      pageSize: 4,
      status: appliedStatusFilter.length > 0 ? appliedStatusFilter : undefined,
    });

  const handleStatusChange = (value: StatusEvent[]) => {
    setPendingStatusFilter(value);
  };

  const handleApplyStatusFilter = () => {
    setAppliedStatusFilter(pendingStatusFilter);
    setPage(1);
  };

  const renderSkeletonGrid = () => {
    return (
      <div className="relative p-4 sm:p-6">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Skeleton className="mb-2 h-9 w-32" />
            <Skeleton className="h-5 w-64" />
          </div>
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="mb-6 grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="bg-card text-card-foreground flex w-full flex-col overflow-hidden rounded-xl shadow-sm transition-all duration-300 ease-in-out"
            >
              {/* Imagem do Evento */}
              <div className="relative aspect-[16/9] w-full overflow-hidden">
                <Skeleton className="h-full w-full" />
              </div>
              {/* Conteúdo do Card */}
              <div className="flex flex-col gap-4 p-4 sm:gap-6 sm:p-6">
                {/* Header do Card */}
                <div className="flex items-start justify-between">
                  <div className="flex w-full items-center gap-3 sm:gap-4">
                    <Skeleton className="h-10 w-10 flex-shrink-0 rounded-lg sm:h-12 sm:w-12" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-6 w-3/4" />
                      <Skeleton className="h-5 w-24" />
                    </div>
                  </div>
                </div>
                {/* Estatísticas */}
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
                  <Skeleton className="h-20 rounded-lg" />
                  <Skeleton className="h-20 rounded-lg" />
                </div>
                {/* Informações Básicas */}
                <div className="space-y-2 sm:space-y-3">
                  <Skeleton className="h-10 rounded-lg" />
                  <Skeleton className="h-10 rounded-lg" />
                </div>
                {/* Footer do Card */}
                <div className="flex items-center justify-between pt-3 sm:pt-4">
                  <Skeleton className="h-10 w-40" />
                </div>
              </div>
            </div>
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
        <div className="flex min-h-96 items-center justify-center p-6">
          <div className="text-destructive text-center">
            <p className="mb-4">Erro ao carregar eventos: {error}</p>
            <Button onClick={refetch}>Tentar Novamente</Button>
          </div>
        </div>
      );
    }

    return (
      <SelectedEventManager
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
    );
  };

  const handleBack = () => {
    router.replace(`/super/home`);
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

  return (
    <PageContainer
      title="Eventos"
      description="Escolha o evento que deseja gerenciar"
      showBackButton={true}
      backButtonAction={handleBack}
    >
      {renderContent()}
    </PageContainer>
  );
}
