"use client";

import { getEventsDates } from "@/features/home/api/eventsDates";
import { getPaymentsDates } from "@/features/home/api/paymentsDates";
import { useQuery } from "@tanstack/react-query";

export const eventDatesKeys = {
  all: ["dates"] as const,
  list: () => [...eventDatesKeys.all, "list"] as const,
};

export function useDates() {
  const query = useQuery({
    queryKey: eventDatesKeys.list(),
    queryFn: async () => {
      const [eventsResult, paymentsResult] = await Promise.allSettled([
        getEventsDates(),
        getPaymentsDates(),
      ]);

      return {
        events:
          eventsResult.status === "fulfilled" ? eventsResult.value.events : [],

        payments:
          paymentsResult.status === "fulfilled" ? paymentsResult.value : [],
      };
    },
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  return {
    events: query.data?.events ?? [],
    payments: query.data?.payments ?? [],
    loading: query.isLoading,
    isFetching: query.isFetching,
    error: null, // nunca quebra o hook
    refetch: query.refetch,
  };
}
