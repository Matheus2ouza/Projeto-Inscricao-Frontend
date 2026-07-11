'use client';

import SelectEventForUsers from '@/features/events/components/SelectEventForUsers';
import { useListEvents } from '@/features/events/hooks/listEvents/useListEvents';
import { StatusEvent } from '@/features/events/types/eventTypes';
import PageContainer from '@/shared/components/layout/PageContainer';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { Card, CardBody, CardFooter } from '@heroui/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function EventsPage() {
  const router = useRouter();
  const [pendingFilter, setPendingFilter] = useState<StatusEvent[]>([]);
  const [appliedFilter, setAppliedFilter] = useState<StatusEvent[]>([]);
  const { events, total, page, pageCount, loading, error, setPage, refetch } =
    useListEvents({
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
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <Card
            key={index}
            className="w-full rounded-xl border border-transparent bg-white shadow-md dark:border-zinc-800 dark:bg-zinc-900"
          >
            <CardBody className="p-0">
              <Skeleton className="h-48 w-full rounded-t-xl" />
            </CardBody>
            <CardFooter className="flex flex-col items-start rounded-b-xl border-t border-gray-100 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
              <Skeleton className="mb-2 h-6 w-3/4" />
              <Skeleton className="mb-2 h-4 w-1/2" />
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
        <div className="flex min-h-96 items-center justify-center">
          <div className="text-center">
            <h2 className="mb-2 text-xl font-semibold text-red-600">
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
        buttonLabel="Visualizar Evento"
        page={page}
        pageCount={pageCount}
        onPageChange={setPage}
        onViewEvent={handleDetailsEvent}
        statusFilter={pendingFilter}
        onStatusFilterChange={handleStatusChange}
        onApplyStatusFilter={handleApplyStatusFilter}
      />
    );
  };

  const handleDetailsEvent = (eventId: string) => {
    router.push(`/user/events/${eventId}`);
  };

  const handleBack = () => {
    router.push('/user/home');
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
