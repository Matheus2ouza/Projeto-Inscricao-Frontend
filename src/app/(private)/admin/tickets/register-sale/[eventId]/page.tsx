"use client";

import TicketsForSaleList from "@/features/tickets/components/TicketsForSaleList";
import { useTicketsForSale } from "@/features/tickets/hooks/useTicketsForSale";
import PageContainer from "@/shared/components/layout/PageContainer";
import { AlertCircle } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

export default function RegisterTicketSaleAdminPage() {
  const router = useRouter();
  const params = useParams();
  const rawEventId = params.eventId;
  const eventId = Array.isArray(rawEventId) ? rawEventId[0] : rawEventId;

  const { data, loading, error } = useTicketsForSale(eventId);

  const handleBack = () => {
    router.push("/admin/tickets/list-sales");
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
      {loading && (
        <div className="flex items-center justify-center py-12">
          <span className="text-sm text-muted-foreground">
            Carregando tickets...
          </span>
        </div>
      )}

      {error && (
        <div className="flex items-center justify-center gap-2 text-sm text-red-600">
          <AlertCircle className="h-4 w-4" />
          {error}
        </div>
      )}

      {data && (
        <TicketsForSaleList
          event={data}
          onRegisterTicket={handleRegisterTicket}
        />
      )}
      {!loading && !error && !data && (
        <div className="flex items-center justify-center py-12">
          <span className="text-sm text-muted-foreground">
            Nenhum ticket foi encontrado para este evento.
          </span>
        </div>
      )}
    </PageContainer>
  );
}
