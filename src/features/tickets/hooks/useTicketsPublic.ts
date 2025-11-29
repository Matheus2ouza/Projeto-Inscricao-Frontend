"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getTicketsPublic } from "../api/getTicketsPublic";
import { ticketsKeys } from "../types/ticketsTypes";

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
