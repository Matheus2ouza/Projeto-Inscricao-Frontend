import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getEventsWithPayments } from "../api/getEventsWithPayments";

export const eventsWithPaymentsKeys = {
  all: ["events-with-payments"] as const,
  lists: () => [...eventsWithPaymentsKeys.all, "list"] as const,
  list: (page: number, pageSize: number) =>
    [...eventsWithPaymentsKeys.lists(), { page, pageSize }] as const,
};

export function useEventsWithPaymentsQuery(page = 1, pageSize = 8) {
  return useQuery({
    queryKey: eventsWithPaymentsKeys.list(page, pageSize),
    queryFn: () =>
      getEventsWithPayments({
        page,
        pageSize,
      }),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 2,
    refetchOnWindowFocus: false,
  });
}

export function usePrefetchEventsWithPaymentsQuery() {
  const queryClient = useQueryClient();

  return {
    prefetchNextPage: (currentPage: number, pageSize: number) => {
      queryClient.prefetchQuery({
        queryKey: eventsWithPaymentsKeys.list(currentPage + 1, pageSize),
        queryFn: () =>
          getEventsWithPayments({
            page: currentPage + 1,
            pageSize,
            status: ["OPEN", "CLOSE"],
          }),
        staleTime: 5 * 60 * 1000,
      });
    },
  };
}
