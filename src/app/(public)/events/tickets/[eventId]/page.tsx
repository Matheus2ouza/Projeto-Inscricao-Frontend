"use client";

import { SelectedTickets } from "@/features/tickets/components/public/selected-tickets/SelectedTickets";
import { useTicketsPublic } from "@/features/tickets/hooks/public/selected-tickets/useTicketsPublic";
import PageContainer from "@/shared/components/layout/PageContainer";
import { Button } from "@/shared/components/ui/button";
import { CardContent } from "@/shared/components/ui/card";
import { Card, Skeleton } from "@heroui/react";
import { useParams, useRouter } from "next/navigation";

export default function TicketsPage() {
  const router = useRouter();
  const params = useParams();
  const rawEventId = params.eventId;
  const eventId = Array.isArray(rawEventId) ? rawEventId[0] : rawEventId;

  const {
    data: eventTickets,
    isLoading,
    error,
    refetch,
  } = useTicketsPublic(eventId || "");

  const renderSkeletonGrid = () => {
    return (
      <div className="space-y-6">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-6 flex flex-col gap-6 md:flex-row md:items-center">
            <Skeleton className="h-56 w-full rounded-xl md:w-1/2" />
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Skeleton className="h-16 rounded-xl" />
              <Skeleton className="h-16 rounded-xl" />
              <Skeleton className="h-16 rounded-xl sm:col-span-2" />
              <Skeleton className="h-10 w-32" />
            </div>
          </CardContent>
        </Card>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, index) => (
            <Card key={index} className="border border-border/40 shadow-sm">
              <CardContent className="p-6 space-y-4">
                <Skeleton className="h-6 w-1/2" />
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-12 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  const renderContent = () => {
    if (isLoading) {
      return renderSkeletonGrid()
    }

    if (error) {
      return (
        <div className="flex flex-col items-center justify-center gap-4 text-center py-12">
          <div>
            <p className="text-red-600 dark:text-red-400 font-semibold">
              Falha ao carregar dados do evento.
            </p>
            <p className="text-muted-foreground mt-1 max-w-md">{error.message}</p>
          </div>
          <Button onClick={() => refetch()} variant="outline">
            Tentar novamente
          </Button>
        </div>
      )
    }
    if (!eventId) {
      return (
        <div className="text-center text-muted-foreground py-12">
          Link do evento não informado.
        </div>
      );
    }

    if (!eventTickets) {
      return (
        <div className="text-center text-muted-foreground py-12">
          Nenhuma informação do evento encontrada.
        </div>
      )
    }
    return (
      <SelectedTickets eventId={eventId} event={eventTickets} />
    )
  }

  const handleBack = () => {
    router.back();
  };

  return (
    <PageContainer
      title="Comprar Tickets"
      description="Selecione os tickets desejados e finalize sua compra."
      showBackButton
      backButtonAction={handleBack}
    >
      {renderContent()}
    </PageContainer>
  );
}
