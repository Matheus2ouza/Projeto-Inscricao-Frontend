import {
  keepPreviousData,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { getEventsForPayment } from "../api/getEventsForPayment";
import type { EventsListResponse } from "../types/listEventsTypes";

export const eventsForPaymentKeys = {
  all: ["events-for-payment"] as const,
  lists: () => [...eventsForPaymentKeys.all, "list"] as const,
  list: (page: number, pageSize: number, paymentEnabled?: boolean) =>
    [
      ...eventsForPaymentKeys.lists(),
      { page, pageSize, paymentEnabled },
    ] as const,
};

export function useEventsForPaymentQuery(
  page: number,
  pageSize: number,
  paymentEnabled?: boolean,
) {
  return useQuery<EventsListResponse>({
    queryKey: eventsForPaymentKeys.list(page, pageSize, paymentEnabled),
    queryFn: () => getEventsForPayment({ page, pageSize, paymentEnabled }),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    placeholderData: keepPreviousData,
    refetchOnWindowFocus: false,
  });
}

export function useEventsForPaymentPrefetch() {
  const queryClient = useQueryClient();

  return {
    prefetchNextPage: (
      page: number,
      pageSize: number,
      paymentEnabled?: boolean,
    ) => {
      queryClient.prefetchQuery({
        queryKey: eventsForPaymentKeys.list(page + 1, pageSize, paymentEnabled),
        queryFn: () =>
          getEventsForPayment({
            page: page + 1,
            pageSize,
            paymentEnabled,
          }),
        staleTime: 5 * 60 * 1000,
      });
    },
  };
}
