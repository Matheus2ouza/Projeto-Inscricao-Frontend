"use client";

import { registerTicketSaleGroup } from "@/features/tickets/api/registerTicketSaleGroup";
import { SaleGrupOutput, SaleGrupRequest } from "@/features/tickets/types/ticketSaleRegisterTypes";
import { useMutation } from "@tanstack/react-query";

export function useRegisterTicketSale() {
  return useMutation<SaleGrupOutput, Error, SaleGrupRequest>({
    mutationFn: registerTicketSaleGroup,
  });
}
