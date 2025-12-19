"use client";

import { getTicketsPublic } from "@/features/tickets/api/public/selected-tickets/getTicketsPublic";
import { ticketsKeys } from "@/features/tickets/types/analysis/ticketsTypes";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

export function useTicketsPublic(eventId: string) {
  return useQuery({
    queryKey: ticketsKeys.publicByRoute(eventId),
    queryFn: () => getTicketsPublic(eventId),
    enabled: !!eventId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    placeholderData: keepPreviousData,
    refetchOnWindowFocus: false,
  });
}
