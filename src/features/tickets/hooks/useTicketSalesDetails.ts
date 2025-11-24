"use client";

import { useQuery } from "@tanstack/react-query";
import { getTicketSalesDetails } from "../api/getTicketSalesDetails";
import { ticketsKeys } from "../types/ticketsTypes";

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
