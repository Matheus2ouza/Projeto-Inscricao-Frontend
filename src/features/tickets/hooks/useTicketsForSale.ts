"use client";

import { useTicketsForSaleQuery } from "@/features/tickets/hooks/useTicketsForSaleQuery";
import type { FindTicketsForSaleOutput } from "@/features/tickets/types/ticketSaleRegisterTypes";

type UseTicketsForSaleResult = {
  data?: FindTicketsForSaleOutput;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<unknown>;
};

export function useTicketsForSale(eventId?: string): UseTicketsForSaleResult {
  const query = useTicketsForSaleQuery(eventId);

  return {
    data: query.data,
    loading: query.isLoading,
    error:
      query.isError && query.error instanceof Error
        ? query.error.message
        : query.isError
          ? "Erro ao carregar tickets"
          : null,
    refetch: query.refetch as () => Promise<unknown>,
  };
}
