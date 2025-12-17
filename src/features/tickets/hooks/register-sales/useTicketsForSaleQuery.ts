"use client";

import { getTicketsForSale } from "@/features/tickets/api/register-sales/getTicketsForSale";
import type {
  FindTicketsForSaleOutput,
} from "@/features/tickets/types/register-sale/ticketSaleRegisterTypes";
import { useQuery } from "@tanstack/react-query";

export const ticketsForSaleKeys = {
  all: ["tickets-for-sale"] as const,
  detail: (eventId: string) =>
    [...ticketsForSaleKeys.all, "detail", eventId] as const,
};

export function useTicketsForSaleQuery(eventId?: string) {
  return useQuery<FindTicketsForSaleOutput>({
    queryKey: eventId ? ticketsForSaleKeys.detail(eventId) : ticketsForSaleKeys.all,
    queryFn: () => {
      if (!eventId) {
        return Promise.reject(new Error("Evento não informado"));
      }
      return getTicketsForSale(eventId);
    },
    enabled: !!eventId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 2,
    refetchOnWindowFocus: false,
  });
}
