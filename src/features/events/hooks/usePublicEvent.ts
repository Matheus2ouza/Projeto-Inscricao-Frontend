"use client";

import { useQuery } from "@tanstack/react-query";
import { getPublicEvent, PublicEvent } from "../api/getPublicEvent";

export function usePublicEvent(eventId: string) {
  const query = useQuery<PublicEvent>({
    queryKey: ["public-event", eventId],
    queryFn: () => getPublicEvent(eventId),
    enabled: !!eventId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 2,
    refetchOnWindowFocus: false,
  });

  return {
    event: query.data ?? null,
    loading: query.isLoading,
    error: query.error ? (query.error instanceof Error ? query.error.message : String(query.error)) : null,
    refetch: query.refetch,
  };
}

