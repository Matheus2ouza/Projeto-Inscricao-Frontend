"use client";

import { createPreSale } from "@/features/tickets/api/public/checkout/createPreSale";
import type { PreSaleSchemaInput } from "@/features/tickets/schema/public/checkout/preSale.schema";
import { ticketsKeys } from "@/features/tickets/types/analysis/ticketsTypes";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function usePreSale(eventId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: PreSaleSchemaInput) => createPreSale(payload),
    onSuccess: async () => {
      if (!eventId) return;
      await queryClient.invalidateQueries({
        queryKey: ticketsKeys.publicByRoute(eventId),
      });
    },
  });
}
