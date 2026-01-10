import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getEventsForPayment } from "../api/getEventsForPayment";
import type { EventsListResponse } from "../types/listEventsTypes";

export const eventsForPaymentKeys = {
  all: ["events-for-payment"] as const,
  lists: () => [...eventsForPaymentKeys.all, "list"] as const,
  list: (page: number, pageSize: number) =>
    [...eventsForPaymentKeys.lists(), { page, pageSize }] as const,
};

export function useEventsForPaymentQuery(page: number, pageSize: number) {
  return useQuery<EventsListResponse>({
    queryKey: eventsForPaymentKeys.list(page, pageSize),
    queryFn: () => getEventsForPayment({ page, pageSize }),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    placeholderData: keepPreviousData,
    refetchOnWindowFocus: false,
  });
}
