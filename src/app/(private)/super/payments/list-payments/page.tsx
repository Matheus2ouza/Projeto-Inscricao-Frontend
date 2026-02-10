"use client";

import ListEventsForPayment from "@/features/payment/components/ListEventsForPayment";
import { useEventsForPayment } from "@/features/payment/hooks/useEventsForPayment";
import { Event } from "@/features/payment/types/listEventsTypes";
import PageContainer from "@/shared/components/layout/PageContainer";
import { Button } from "@/shared/components/ui/button";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { getFormatCurrency } from "@/shared/utils/getFormatCurrency";
import { Card, CardBody, CardFooter } from "@heroui/react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export default function SelectEventForListPaymentSuperPage() {
  const router = useRouter();
  const defaultStatusFilter: boolean[] = [true];
  const [pendingFilter, setPendingFilter] =
    useState<boolean[]>(defaultStatusFilter);
  const [appliedFilter, setAppliedFilter] =
    useState<boolean[]>(defaultStatusFilter);
  const wasClearedRef = useRef(false);
  const { events, total, page, pageCount, loading, error, setPage, refetch } =
    useEventsForPayment({
      pageSize: 8,
      paymentEnabled: appliedFilter.length > 0 ? appliedFilter : undefined,
    });

  const infoRows = (event: Event) => [
    {
      label: "Total de Pagamentos",
      value: event?.totalPayments || 0,
    },
    {
      label: "Valor Total",
      value: getFormatCurrency(event?.amountCollected || 0),
    },
  ];

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

  const handleSelectEvent = (eventId: string) => {
    router.push(`/super/payments/list-payments/${eventId}`);
  };

  const handleBack = () => {
    router.push("/super/home");
  };

  const renderSkeletonGrid = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: 8 }).map((_, index) => (
        <Card
          key={index}
          className="w-full border border-transparent shadow-md rounded-xl bg-white dark:bg-zinc-900 dark:border-zinc-800"
        >
          <CardBody className="p-0">
            <Skeleton className="w-full h-48 rounded-t-xl" />
          </CardBody>
          <CardFooter className="flex flex-col items-start p-4 bg-white dark:bg-zinc-900 border-t border-gray-100 dark:border-zinc-800 rounded-b-xl">
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
      <ListEventsForPayment
        buttonLabel="Visualizar Pagamentos"
        events={events}
        total={total}
        page={page}
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
