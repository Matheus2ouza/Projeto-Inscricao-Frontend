"use client";

import TicketsForSaleList from "@/features/tickets/components/register-sale/TicketsForSaleList";
import { useTicketsForSale } from "@/features/tickets/hooks/register-sales/useTicketsForSale";
import PageContainer from "@/shared/components/layout/PageContainer";
import { CardContent } from "@/shared/components/ui/card";
import { Card, Skeleton } from "@heroui/react";
import { AlertCircle } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

export default function RegisterTicketSaleAdminPage() {
  const router = useRouter();
  const params = useParams();
  const rawEventId = params.eventId;
  const eventId = Array.isArray(rawEventId) ? rawEventId[0] : rawEventId;

  const { data, loading, error } = useTicketsForSale(eventId);

  const renderSkeletonGrid = () => {
    return (
      <div className="space-y-6">
        {/* Skeleton do título do evento */}
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-6 w-32" />
        </div>

        {/* Grid de skeletons dos tickets */}
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <Card
              key={index}
              className="rounded-2xl border border-muted/30 shadow"
            >
              <CardContent className="space-y-3 pt-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <Skeleton className="h-6 w-32" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                  <Skeleton className="h-6 w-16" />
                </div>

                <Skeleton className="h-4 w-36" />

                <div className="flex items-center justify-between">
                  <Skeleton className="h-7 w-24" />
                  <Skeleton className="h-9 w-32" />
                </div>

                <Skeleton className="h-3 w-48" />
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex justify-end pt-4">
          <Skeleton className="h-10 w-40" />
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
        <div className="flex items-center justify-center gap-2 text-sm text-red-600">
          <AlertCircle className="h-4 w-4" />
          {error}
        </div>
      );
    }

    return (
      <TicketsForSaleList
        event={data}
        onRegisterTicket={handleRegisterTicket}
      />
    );
  };

  const handleBack = () => {
    router.push("/admin/tickets/register-sale");
  };

  const handleRegisterTicket = (ticketId: string) => {
    router.push(`/admin/tickets/register-sale/${eventId}/sale/${ticketId}`);
  };

  return (
    <PageContainer
      title="Registrar Venda de Ticket"
      description="Selecione o ticket e registre a venda."
      showBackButton
      backButtonAction={handleBack}
    >
      {renderContent()}
    </PageContainer>
  );
}
