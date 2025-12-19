"use client";

import { getTicketSalesDetails } from "@/features/tickets/api/ticketDetails/getTicketSalesDetails";
import { ticketsKeys } from "@/features/tickets/types/analysis/ticketsTypes";
import { useQuery } from "@tanstack/react-query";

export function useTicketSalesDetails(ticketId?: string) {
  const query = useQuery({
    queryKey: ticketId ? ticketsKeys.detail(ticketId) : ticketsKeys.all,
    queryFn: () => {
      if (!ticketId) {
        throw new Error("Ticket inválido");
      }

      return getTicketSalesDetails(ticketId);
    },
    enabled: !!ticketId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  return {
    ...query,
    showSkeleton: query.isLoading && !query.data,
    hasData: !!query.data,
  };
}
