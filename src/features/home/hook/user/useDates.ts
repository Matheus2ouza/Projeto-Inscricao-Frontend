"use client";

import { getEventsDates } from "@/features/home/api/eventsDates";
import { useQuery } from "@tanstack/react-query";

export const eventDatesKeys = {
  all: ["dates"] as const,
  list: () => [...eventDatesKeys.all, "list"] as const,
};

export function useDates() {
  const query = useQuery({
    queryKey: eventDatesKeys.list(),
    queryFn: async () => {
      const [eventsResult] = await Promise.allSettled([getEventsDates()]);

      return {
        events:
          eventsResult.status === "fulfilled" ? eventsResult.value.events : [],
      };
    },
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  return {
    events: query.data?.events ?? [],
    loading: query.isLoading,
    isFetching: query.isFetching,
    error: null, // nunca quebra o hook
    refetch: query.refetch,
  };
}
