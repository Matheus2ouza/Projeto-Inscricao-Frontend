import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getEventPayments } from "../api/getEventInscriptions";

// Chaves de cache para análise de pagamentos
export const analysisPaymentsKeys = {
  all: ["analysis-payments"] as const,
  eventPayments: (eventId: string, page: number, pageSize: number) =>
    [
      ...analysisPaymentsKeys.all,
      "eventPayments",
      eventId,
      { page, pageSize },
    ] as const,
  events: (page: number, pageSize: number) =>
    [...analysisPaymentsKeys.all, "events", { page, pageSize }] as const,
};

export function useAnalysisPaymentsQuery(
  eventId: string,
  page: number = 1,
  pageSize: number = 15
) {
  return useQuery({
    queryKey: analysisPaymentsKeys.eventPayments(eventId, page, pageSize),
    queryFn: async () =>
      await getEventPayments(eventId, { page, pageSize, eventId }),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 2,
    refetchOnWindowFocus: false,
    enabled: !!eventId,
  });
}

// Hook para invalidar cache de análise de pagamentos
export function useInvalidateAnalysisPayments() {
  const queryClient = useQueryClient();

  return {
    invalidateAll: () =>
      queryClient.invalidateQueries({ queryKey: analysisPaymentsKeys.all }),
    invalidateEventPayments: (eventId: string) =>
      queryClient.invalidateQueries({
        queryKey: analysisPaymentsKeys.eventPayments(eventId, 1, 15),
      }),
    invalidateEvents: () =>
      queryClient.invalidateQueries({
        queryKey: analysisPaymentsKeys.all,
        predicate: (query) =>
          query.queryKey.includes("events") || query.queryKey.includes("eventPayments"),
      }),
  };
}

export function usePrefetchAnalysisPayments() {
  const queryClient = useQueryClient();

  return {
    prefetchNextPage: (
      eventId: string,
      currentPage: number,
      pageSize: number
    ) => {
      queryClient.prefetchQuery({
        queryKey: analysisPaymentsKeys.eventPayments(
          eventId,
          currentPage + 1,
          pageSize
        ),
        queryFn: async () =>
          await getEventPayments(eventId, {
            page: currentPage + 1,
            pageSize,
            eventId,
          }),
        staleTime: 5 * 60 * 1000,
      });
    },
  };
}
