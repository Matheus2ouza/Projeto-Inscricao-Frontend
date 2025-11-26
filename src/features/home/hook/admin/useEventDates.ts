"use client";

import { getEventsDates } from "@/features/home/api/eventsDates";
import { useQuery } from "@tanstack/react-query";

export const eventDatesKeys = {
  all: ["event-dates"] as const,
  list: () => [...eventDatesKeys.all, "list"] as const,
};

export function useEventDates() {
  const query = useQuery({
    queryKey: eventDatesKeys.list(),
    queryFn: getEventsDates,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  return {
    events: query.data?.events ?? [],
    loading: query.isLoading,
    isFetching: query.isFetching,
    error: query.error,
    refetch: query.refetch,
  };
}
