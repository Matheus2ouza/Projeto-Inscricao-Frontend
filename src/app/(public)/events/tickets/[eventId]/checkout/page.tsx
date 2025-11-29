"use client";

import { CheckoutSaleTicketContent } from "@/features/tickets/components/CheckoutSaleTicketContent";
import { useTicketsPublic } from "@/features/tickets/hooks/useTicketsPublic";
import PageContainer from "@/shared/components/layout/PageContainer";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { useParams, useRouter } from "next/navigation";

export default function CheckoutSaleTicketPage() {
  const router = useRouter();
  const params = useParams();
  const eventParam = params.eventId;
  const eventId = Array.isArray(eventParam) ? eventParam[0] : eventParam;
  const {
    data: eventTickets,
    isLoading,
    error,
    refetch,
  } = useTicketsPublic(eventId || "");

  const handleBack = () => {
    router.push(`/events/tickets/${eventId ?? ""}`);
  };

  if (!eventId) {
    return (
      <PageContainer
        title="Checkout"
        description="Revise seus dados para finalizar a compra."
        showBackButton
        backButtonAction={() => router.back()}
      >
        <div className="text-center text-muted-foreground py-12">
          Evento não encontrado.
        </div>
      </PageContainer>
    );
  }

  if (isLoading) {
    return (
      <PageContainer
        title="Checkout"
        description="Revise seus dados para finalizar a compra."
        showBackButton
        backButtonAction={handleBack}
      >
        <div className="space-y-6">
          <Card className="border-0 shadow-sm">
            <CardContent className="p-6 flex flex-col gap-6 md:flex-row md:items-center">
              <Skeleton className="h-60 w-full rounded-xl md:w-1/2" />
              <div className="flex-1 space-y-4">
                <Skeleton className="h-8 w-1/2" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <Skeleton key={index} className="h-12 w-full" />
              ))}
            </CardContent>
          </Card>
        </div>
      </PageContainer>
    );
  }

  if (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Não foi possível carregar os dados do evento.";

    return (
      <PageContainer
        title="Checkout"
        description="Revise seus dados para finalizar a compra."
        showBackButton
        backButtonAction={handleBack}
      >
        <Card className="border border-red-200 bg-red-50">
          <CardContent className="p-6 text-center space-y-4">
            <p className="text-red-700 font-semibold">{message}</p>
            <div className="flex items-center justify-center gap-3">
              <Button variant="outline" onClick={() => refetch()}>
                Tentar novamente
              </Button>
              <Button variant="ghost" onClick={handleBack}>
                Voltar
              </Button>
            </div>
          </CardContent>
        </Card>
      </PageContainer>
    );
  }

  if (!eventTickets) {
    return (
      <PageContainer
        title="Checkout"
        description="Revise seus dados para finalizar a compra."
        showBackButton
        backButtonAction={handleBack}
      >
        <div className="text-center text-muted-foreground py-12">
          Evento não encontrado.
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer
      title="Checkout"
      description="Confirme seus dados, anexe o comprovante e finalize o pedido."
      showBackButton
      backButtonAction={handleBack}
    >
      <CheckoutSaleTicketContent eventId={eventId} event={eventTickets} />
    </PageContainer>
  );
}
