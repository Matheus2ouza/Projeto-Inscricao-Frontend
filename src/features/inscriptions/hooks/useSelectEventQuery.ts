import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getEventsToAnalysis } from "../api/getEvents";
import type { StatusEvent } from "../types/selectEvent";
import { analysisInscriptionsKeys } from "./analysis/useAnalysisInscriptionsQuery";

// Chaves de query para organização - específicas para análise
export const analysisEventsKeys = {
  all: ["analysis-events"] as const,
  lists: () => [...analysisEventsKeys.all, "list"] as const,
  list: (page: number, pageSize: number, status?: StatusEvent[]) =>
    [...analysisEventsKeys.lists(), { page, pageSize, status }] as const,
  details: () => [...analysisEventsKeys.all, "detail"] as const,
  detail: (id: string) => [...analysisEventsKeys.details(), id] as const,
};

export function useAnalysisEventsQuery(
  page: number = 1,
  pageSize: number = 8,
  status?: StatusEvent[]
) {
  return useQuery({
    queryKey: analysisEventsKeys.list(page, pageSize, status),
    queryFn: () => getEventsToAnalysis({ page, pageSize, status }),
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
      queryClient.invalidateQueries({ queryKey: analysisInscriptionsKeys.all });
    },
    invalidateList: () => {
      queryClient.invalidateQueries({ queryKey: analysisEventsKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: analysisInscriptionsKeys.all,
        predicate: (query) => query.queryKey.includes("events")
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
    prefetchNextPage: (
      currentPage: number,
      pageSize: number,
      status?: StatusEvent[]
    ) => {
      queryClient.prefetchQuery({
        queryKey: analysisEventsKeys.list(
          currentPage + 1,
          pageSize,
          status
        ),
        queryFn: () =>
          getEventsToAnalysis({
            page: currentPage + 1,
            pageSize,
            status,
          }),
        staleTime: 5 * 60 * 1000,
      });
    },
  };
}
