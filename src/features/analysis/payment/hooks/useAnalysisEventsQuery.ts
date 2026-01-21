import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getEventsToAnalysis } from "../api/getEventsForAnalysis";
import { analysisPaymentsKeys } from "./useAnalysisInscriptionsQuery";

// Chaves de query para organização - específicas para análise de pagamento
export const analysisEventsKeys = {
  all: ["analysis-events-payment"] as const,
  lists: () => [...analysisEventsKeys.all, "list"] as const,
  list: (page: number, pageSize: number) =>
    [...analysisEventsKeys.lists(), { page, pageSize }] as const,
  details: () => [...analysisEventsKeys.all, "detail"] as const,
  detail: (id: string) => [...analysisEventsKeys.details(), id] as const,
};

export function useAnalysisEventsQuery(page: number = 1, pageSize: number = 8) {
  return useQuery({
    queryKey: analysisEventsKeys.list(page, pageSize),
    queryFn: () => getEventsToAnalysis({ page, pageSize, status: ["OPEN"] }),
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos
    retry: 2,
    refetchOnWindowFocus: false,
  });
}

// Hook para invalidar cache de eventos de análise
export function useInvalidateAnalysisEvents() {
  const queryClient = useQueryClient();

  return {
    invalidateAll: () => {
      // Invalidar tanto as chaves específicas de eventos quanto as unificadas
      queryClient.invalidateQueries({ queryKey: analysisEventsKeys.all });
      queryClient.invalidateQueries({ queryKey: analysisPaymentsKeys.all });
    },
    invalidateList: () => {
      queryClient.invalidateQueries({ queryKey: analysisEventsKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: analysisPaymentsKeys.all,
        predicate: (query) => query.queryKey.includes("events"),
      });
    },
    invalidateDetail: (id: string) =>
      queryClient.invalidateQueries({
        queryKey: analysisEventsKeys.detail(id),
      }),
  };
}

// Hook para pré-carregar dados de análise
export function usePrefetchAnalysisEvents() {
  const queryClient = useQueryClient();

  return {
    prefetchNextPage: (currentPage: number, pageSize: number) => {
      queryClient.prefetchQuery({
        queryKey: analysisEventsKeys.list(currentPage + 1, pageSize),
        queryFn: () => getEventsToAnalysis({ page: currentPage + 1, pageSize }),
        staleTime: 5 * 60 * 1000,
      });
    },
  };
}
