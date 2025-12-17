"use client";

import { getTicketDetails } from "@/features/tickets/api/ticketDetails/getTicketDetails";
import { FindTicketDetailsResponse } from "@/features/tickets/types/ticketDetails/ticketDetailsTypes";
import { useQuery } from "@tanstack/react-query";

export const ticketDetailsKeys = {
  all: ["ticket-details"] as const,
  detail: (ticketId: string) =>
    [...ticketDetailsKeys.all, "detail", ticketId] as const,
};

export function useTicketDetails(ticketId?: string) {
  return useQuery<FindTicketDetailsResponse>({
    queryKey: ticketId ? ticketDetailsKeys.detail(ticketId) : ticketDetailsKeys.all,
    queryFn: () => {
      if (!ticketId) return Promise.reject(new Error("Ticket não informado"));
      return getTicketDetails(ticketId);
    },
    enabled: !!ticketId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
}
