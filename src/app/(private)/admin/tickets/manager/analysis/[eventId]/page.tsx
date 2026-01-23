"use client";

import TicketsByEvent from "@/features/tickets/components/analysis/TicketsByEvent";
import { useCreateTicket } from "@/features/tickets/hooks/analysis/createTicket/useCreateTicket";
import { useTicketSaleStatus } from "@/features/tickets/hooks/analysis/useTicketSaleStatus";
import { useTicketsByEvent } from "@/features/tickets/hooks/analysis/useTicketsByEvent";
import PageContainer from "@/shared/components/layout/PageContainer";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { useParams, useRouter } from "next/navigation";

export default function TicketsAnalysisByEventAdminPage() {
  const params = useParams();
  const router = useRouter();
  const rawEventId = params.eventId;
  const eventId = Array.isArray(rawEventId) ? rawEventId[0] : rawEventId;

  if (!eventId) {
    return null;
  }

  const {
    data: tickets,
    isLoading,
    error,
    refetch,
  } = useTicketsByEvent(eventId);
  const { form, onSubmit, submitting } = useCreateTicket(eventId);
  const { loading: updatingSaleStatus, updateTicketSaleStatus } =
    useTicketSaleStatus();

  const handleBack = () => {
    router.push("/admin/tickets/manager");
  };

  const handleViewSales = (ticketId: string) => {
    router.push(
      `/admin/tickets/manager/analysis/${eventId}/ticket/${ticketId}`,
    );
  };

  const handleToggleTicketSale = async () => {
    if (!tickets) {
      return;
    }

    const nextStatus = !Boolean(tickets.ticketEnabled);
    const success = await updateTicketSaleStatus(eventId, nextStatus);

    if (success) {
      refetch();
    }
  };

  const renderLoadingState = () => (
    <div className="space-y-6">
      <Card className="border-0 shadow-sm">
        <CardContent className="p-6 flex flex-col gap-6 md:flex-row md:items-center">
          <Skeleton className="h-48 w-full rounded-xl md:w-1/3" />
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Skeleton className="h-20 rounded-xl" />
            <Skeleton className="h-20 rounded-xl" />
            <Skeleton className="h-20 rounded-xl sm:col-span-2" />
          </div>
        </CardContent>
      </Card>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, index) => (
          <Card key={index} className="border border-border/40 shadow-sm">
            <CardContent className="p-6 space-y-4">
              <Skeleton className="h-6 w-1/2" />
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-4 w-1/2" />
              <div className="flex justify-end">
                <Skeleton className="h-9 w-24" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderErrorState = () => {
    const message =
      error instanceof Error
        ? error.message
        : "Não foi possível carregar os tickets deste evento.";

    return (
      <div className="flex flex-col items-center justify-center gap-4 text-center py-12">
        <div>
          <p className="text-red-600 dark:text-red-400 font-semibold">
            Falha ao carregar dados do evento.
          </p>
          <p className="text-muted-foreground mt-1 max-w-md">{message}</p>
        </div>
        <Button onClick={() => refetch()} variant="outline">
          Tentar novamente
        </Button>
      </div>
    );
  };

  const renderContent = () => {
    if (isLoading) {
      return renderLoadingState();
    }

    if (error) {
      return renderErrorState();
    }

    if (!tickets) {
      return (
        <div className="text-center text-muted-foreground py-12">
          Nenhuma informação do evento encontrada.
        </div>
      );
    }

    return (
      <TicketsByEvent
        eventId={eventId}
        tickets={tickets}
        form={form}
        onSubmit={onSubmit}
        submitting={submitting}
        onViewSales={handleViewSales}
        onToggleTicketSale={handleToggleTicketSale}
        ticketSaleLoading={updatingSaleStatus}
      />
    );
  };

  return (
    <PageContainer
      title="Tickets do Evento"
      description="Gerencie a oferta de tickets e acompanhe as vendas."
      showBackButton
      backButtonAction={handleBack}
    >
      {renderContent()}
    </PageContainer>
  );
}
