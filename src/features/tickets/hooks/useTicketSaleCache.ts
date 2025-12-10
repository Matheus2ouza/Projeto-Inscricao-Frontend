"use client";

import { ticketDetailsKeys, useTicketDetails } from "@/features/tickets/hooks/useTicketDetails";
import { useQueryClient } from "@tanstack/react-query";

export function useTicketSaleCache(ticketId?: string) {
  const query = useTicketDetails(ticketId);
  const queryClient = useQueryClient();

  const invalidate = () => {
    if (!ticketId) return;
    queryClient.invalidateQueries({
      queryKey: ticketDetailsKeys.detail(ticketId),
    });
  };

  return {
    ...query,
    invalidate,
  };
}
