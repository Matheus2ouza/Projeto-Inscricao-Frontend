import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getAnalysisPayment } from "../../api/analysisPayment/getAnalysisPayment";

export const analysisPaymentKey = {
  all: ["analysisPaymentKey"] as const,
  lists: () => [...analysisPaymentKey.all, "list"] as const,
  list: (eventId: string, page: number, pageSize: number) =>
    [...analysisPaymentKey.lists(), { eventId, page, pageSize }] as const,
  details: () => [...analysisPaymentKey.all, "detail"] as const,
  detail: (id: string) => [...analysisPaymentKey.details(), id] as const,
};

export function useAnalysisPaymentQuery(
  eventId: string,
  page: number,
  pageSize: number,
) {
  return useQuery({
    queryKey: analysisPaymentKey.list(eventId, page, pageSize),
    queryFn: () => getAnalysisPayment(eventId, page, pageSize),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 2,
    refetchOnWindowFocus: false,
  });
}

export function useInvalidateAnalysisPaymentQuery() {
  const queryClient = useQueryClient();

  return {
    invalidateAll: () => {
      queryClient.invalidateQueries({
        queryKey: analysisPaymentKey.all,
      });
    },

    invalidateLists: () => {
      queryClient.invalidateQueries({
        queryKey: analysisPaymentKey.lists(),
      });
    },

    invalidateDetail: (eventId: string) => {
      queryClient.invalidateQueries({
        queryKey: analysisPaymentKey.detail(eventId),
      });
    },
  };
}

export function usePrefetchAnalysisPaymentQuery() {
  const queryClient = useQueryClient();

  return {
    prefetchNextPage: (eventId: string, page: number, pageSize: number) => {
      queryClient.prefetchQuery({
        queryKey: analysisPaymentKey.list(eventId, page, pageSize),
        queryFn: () => getAnalysisPayment(eventId, page, pageSize),
      });
    },
  };
}
