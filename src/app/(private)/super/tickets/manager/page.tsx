"use client";

import { useEventsAll } from "@/features/events/hooks/useEventsAll";
import TicketsTable from "@/features/tickets/components/TicketsTable";
import PageContainer from "@/shared/components/layout/PageContainer";
import { Button } from "@/shared/components/ui/button";
import { Card, CardBody, CardFooter, Skeleton } from "@heroui/react";
import { useRouter } from "next/navigation";

export default function TicketsSuperPage() {
  const router = useRouter();
  const { events, page, pageCount, setPage, loading, error, refetch } =
    useEventsAll({
      initialPage: 1,
      pageSize: 8,
    });

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
      <TicketsTable
        events={events}
        buttonLabel="Gerenciar Vendas"
        error={error}
        page={page}
        pageCount={pageCount}
        onPageChange={setPage}
        onViewEvent={handleViewEvent}
      />
    );
  };

  const handleViewEvent = (eventId: string) => {
    router.push(`/super/tickets/manager/analysis/${eventId}`);
  };

  const handleBack = () => {
    router.push("/super/home");
  };

  return (
    <PageContainer
      title="Tickets"
      description="Liste os eventos para gerenciar vendas de tickets de alimentação."
      showBackButton
      backButtonAction={handleBack}
    >
      {renderContent()}
    </PageContainer>
  );
}
