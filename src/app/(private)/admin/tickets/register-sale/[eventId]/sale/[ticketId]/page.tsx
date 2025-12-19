"use client";

import TicketSaleDetailsContent from "@/features/tickets/components/register-sale/sale/TicketSaleDetailsContent";
import { useTicketSaleCache } from "@/features/tickets/hooks/register-sales/sale/useTicketSaleCache";
import { useTicketSaleRegister } from "@/features/tickets/hooks/register-sales/sale/useTicketSaleRegister";
import { SaleGrupRequest } from "@/features/tickets/types/register-sale/ticketSaleRegisterTypes";
import PageContainer from "@/shared/components/layout/PageContainer";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { useParams, useRouter } from "next/navigation";

export default function RegisterSaleTicketSuperPage() {
  const router = useRouter();
  const params = useParams();
  const rawTicketId = params.ticketId;
  const ticketId = Array.isArray(rawTicketId) ? rawTicketId[0] : rawTicketId;
  const rawEventId = params.eventId;
  const eventId = Array.isArray(rawEventId) ? rawEventId[0] : rawEventId;
  const mutation = useTicketSaleRegister(ticketId);
  const { data, isLoading, error } = useTicketSaleCache(ticketId);


  const renderSkeletonGrid = () => {
    return (
      <div className="space-y-4">
        <Skeleton className="h-24 w-full" />
        <div className="space-y-2 rounded-xl border p-6">
          {Array.from({ length: 5 }).map((_, index) => (
            <Skeleton key={index} className="h-10 w-full" />
          ))}
        </div>
      </div>
    )
  }

  const renderContent = () => {
    if (isLoading) {
      renderSkeletonGrid()
    }

    if (error) {
      <div className="flex items-center justify-center py-12">
        <p className="text-sm text-red-600">
          {error instanceof Error ? error.message : "Erro ao carregar o ticket."}
        </p>
      </div>
    }

    return (
      <TicketSaleDetailsContent
        eventId={eventId ?? ""}
        ticket={data!}
        history={data?.TicketSaleItens ?? []}
        onRegisterSubmit={(payload: SaleGrupRequest) =>
          mutation.register(payload)
        }
      />
    )
  }

  const handleBack = () => {
    router.push(`/admin/tickets/register-sale/${eventId}`);
  };

  return (
    <PageContainer
      title="Registrar venda"
      description="Resumo do ticket e histórico de vendas para registrar novas entradas."
      backButtonAction={handleBack}
    >
      {renderContent()}
    </PageContainer>
  );
}
