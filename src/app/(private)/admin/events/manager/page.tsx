'use client';

import SelectedEventManager from '@/features/events/components/manager/SelectedEventManager';
import { useListEventsToManager } from '@/features/events/hooks/listEvents/listEventsToManager/useListEventsToManager';
import { StatusEvent } from '@/features/events/types/selectEvent';
import PageContainer from '@/shared/components/layout/PageContainer';
import { Button } from '@/shared/components/ui/button';
import { Skeleton } from '@heroui/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function SelectEventAdminPage() {
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
      <div className="relative">
        {/* Header */}
        <div className="mb-4 flex flex-col gap-2 sm:gap-4">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex items-center gap-2">
              <Skeleton className="h-9 w-[220px]" />
              <Skeleton className="h-9 w-24" />
            </div>

            <Skeleton className="h-10 w-32" />
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="bg-card overflow-hidden rounded-xl shadow-sm"
            >
              {/* Banner */}
              <Skeleton className="aspect-[16/8] w-full" />

              {/* Content */}
              <div className="space-y-4 p-4 sm:p-5">
                {/* Header */}
                <div className="flex items-center gap-3">
                  <Skeleton className="h-10 w-10 rounded-lg sm:h-12 sm:w-12" />

                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-3">
                  <Skeleton className="h-16 rounded-lg" />
                  <Skeleton className="h-16 rounded-lg" />
                </div>

                {/* URL */}
                <div className="space-y-2 border-t pt-3">
                  <Skeleton className="h-4 w-20" />

                  <div className="flex items-center gap-2">
                    <Skeleton className="h-8 flex-1 rounded-md" />
                    <Skeleton className="h-8 w-8 rounded-md" />
                    <Skeleton className="h-8 w-8 rounded-md" />
                  </div>
                </div>

                {/* Footer */}
                <div className="flex justify-end gap-2 pt-2">
                  <Skeleton className="h-9 w-32 rounded-md" />
                  <Skeleton className="h-9 w-32 rounded-md" />
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
    router.replace(`/admin/home`);
  };

  const handleCreateEvent = () => {
    router.push(`/admin/events/manager/create`);
  };

  const handleManagerEvent = (eventId: string) => {
    router.push(`/admin/events/manager/${eventId}`);
  };

  const handleListInscriptions = (eventId: string) => {
    router.push(`/admin/events/list-inscription/${eventId}`);
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
