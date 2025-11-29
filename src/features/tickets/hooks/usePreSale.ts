"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createPreSale } from "../api/createPreSale";
import type { PreSaleSchemaInput } from "../schema/preSale.schema";
import { ticketsKeys } from "../types/ticketsTypes";

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
