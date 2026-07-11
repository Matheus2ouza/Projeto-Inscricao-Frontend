'use client';

import { useListEventsToPayment } from '@/features/events/hooks/listEvents/listEventsToPayment/useListEventsToPayment';
import ListEventsForPayment from '@/features/payments/components/ListEventsForPayment';
import { Event } from '@/features/payments/types/listEventsTypes';
import PageContainer from '@/shared/components/layout/PageContainer';
import { Button } from '@/shared/components/ui/button';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { getFormatCurrency } from '@/shared/utils/getFormatCurrency';
import { Card, CardBody, CardFooter } from '@heroui/react';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

export default function SelectEventForListPaymentAdminPage() {
  const router = useRouter();
  const defaultStatusFilter: boolean[] = [true];
  const [pendingFilter, setPendingFilter] =
    useState<boolean[]>(defaultStatusFilter);
  const [appliedFilter, setAppliedFilter] =
    useState<boolean[]>(defaultStatusFilter);
  const wasClearedRef = useRef(false);
  const { events, total, page, pageCount, loading, error, setPage, refetch } =
    useListEventsToPayment({
      pageSize: 8,
      paymentEnabled: appliedFilter.length > 0 ? appliedFilter : undefined,
    });

  const handleStatusChange = (value: boolean[]) => {
    setPendingFilter(value);
  };

  const handleApplyStatusFilter = () => {
    setAppliedFilter(pendingFilter);
    setPage(1);
  };

  const handleClearStatusFilter = () => {
    wasClearedRef.current = true;
    setPendingFilter([]);
    setAppliedFilter([]);
    setPage(1);
  };

  useEffect(() => {
    if (!wasClearedRef.current) return;
    if (appliedFilter.length > 0) return;
    wasClearedRef.current = false;
    void refetch();
  }, [appliedFilter.length, refetch]);

  const infoRows = (event: Event) => [
    {
      label: 'Total de Pagamentos',
      value: event?.totalPayments || 0,
    },
    {
      label: 'Valor Total',
      value: getFormatCurrency(event?.amountCollected || 0),
    },
  ];

  const handleSelectEvent = (eventId: string) => {
    router.push(`/admin/payments/list-payments/${eventId}`);
  };

  const handleBack = () => {
    router.push('/admin/home');
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
              {error || 'Tente novamente em instantes.'}
            </p>
          </div>
          <Button onClick={() => refetch()} variant="outline">
            Tentar novamente
          </Button>
        </div>
      );
    }

    return (
      <ListEventsForPayment
        buttonLabel="Visualizar Pagamentos"
        events={events}
        total={total}
        page={page}
        disableWhenPaymentDisabled={false}
        pageCount={pageCount}
        statusFilter={pendingFilter}
        showDateLocation={false}
        getInfoRows={infoRows}
        setPage={setPage}
        onSelectEvent={handleSelectEvent}
        onStatusFilterChange={handleStatusChange}
        onApplyStatusFilter={handleApplyStatusFilter}
        onClearStatusFilter={handleClearStatusFilter}
      />
    );
  };

  return (
    <PageContainer
      title="Lista de Pagamentos"
      description="Lista de Pagamentos referentes as Inscrições"
      showBackButton
      backButtonAction={handleBack}
    >
      {renderContent()}
    </PageContainer>
  );
}
