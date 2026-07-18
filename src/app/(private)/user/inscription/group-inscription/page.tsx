'use client';

import { useListEventsToInscription } from '@/features/events/hooks/listEvents/listEventsToInscription/useListEventsToInscription';
import ListEventsForInscription from '@/features/inscriptions/components/ListEventsForInscription';
import { StatusEvent } from '@/features/inscriptions/types/listEventsTypes';
import PageContainer from '@/shared/components/layout/PageContainer';
import { Button } from '@/shared/components/ui/button';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { Card, CardBody, CardFooter } from '@heroui/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function SelectedEventInscriptionGroupPage() {
  const router = useRouter();
  const [pendingFilter, setPendingFilter] = useState<StatusEvent[]>([]);
  const [appliedFilter, setAppliedFilter] = useState<StatusEvent[]>([]);
  const { events, total, page, pageCount, loading, error, setPage, refresh } =
    useListEventsToInscription({
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

  const handleSelectEvent = (eventId: string) => {
    router.push(`/user/inscription/group-inscription/${eventId}`);
  };

  const handleBack = () => {
    router.push('/user/home');
  };

  const renderSkeletonGrid = () => (
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

  const renderContent = () => {
    if (loading) {
      return renderSkeletonGrid();
    }

    if (error) {
      return (
        <div className="flex flex-col items-center justify-center gap-4 py-12 text-center">
          <div>
            <p className="font-semibold text-red-600 dark:text-red-400">
              Não foi possível carregar os eventos.
            </p>
            <p className="text-muted-foreground mt-1 max-w-md">
              {error.message || 'Tente novamente em instantes.'}
            </p>
          </div>
          <Button onClick={() => refresh()} variant="outline">
            Tentar novamente
          </Button>
        </div>
      );
    }

    return (
      <ListEventsForInscription
        events={events}
        total={total}
        page={page}
        pageCount={pageCount}
        statusFilter={pendingFilter}
        onStatusFilterChange={handleStatusChange}
        onApplyStatusFilter={handleApplyStatusFilter}
        setPage={setPage}
        onSelectEvent={handleSelectEvent}
      />
    );
  };

  return (
    <PageContainer
      title="Inscrição em Grupo"
      description="Escolha um evento para iniciar sua inscrição em grupo."
      showBackButton={true}
      backButtonAction={handleBack}
    >
      {renderContent()}
    </PageContainer>
  );
}
