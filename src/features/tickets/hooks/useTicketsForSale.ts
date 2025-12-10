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

  const data = query.data as FindTicketsForSaleOutput | undefined;

  const error = (() => {
    if (query.error instanceof Error) {
      return query.error.message;
    }

    if (query.isError) {
      return "Erro ao carregar tickets";
    }

    return null;
  })();

  return {
    data,
    loading: query.isLoading,
    error,
    refetch: query.refetch as () => Promise<unknown>,
  };
}
