import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getEventInscriptions } from "../../api/analysis/getEventInscriptions";

// Chaves de cache para análise de inscrições
export const analysisInscriptionsKeys = {
  all: ["analysis-inscriptions"] as const,
  eventInscriptions: (eventId: string, page: number, pageSize: number) =>
    [
      ...analysisInscriptionsKeys.all,
      "eventInscriptions",
      eventId,
      { page, pageSize },
    ] as const,
  // Base key for all pages of a specific inscription's details
  inscriptionDetailsBase: (inscriptionId: string) =>
    [...analysisInscriptionsKeys.all, "inscriptionDetails", inscriptionId] as const,
  inscriptionDetails: (inscriptionId: string, page: number, pageSize: number) =>
    [
      ...analysisInscriptionsKeys.inscriptionDetailsBase(inscriptionId),
      { page, pageSize },
    ] as const,
  // Chave para eventos de análise
  events: (page: number, pageSize: number) =>
    [...analysisInscriptionsKeys.all, "events", { page, pageSize }] as const,
};

export function useAnalysisInscriptionsQuery(
  eventId: string,
  page: number = 1,
  pageSize: number = 15
) {
  return useQuery({
    queryKey: analysisInscriptionsKeys.eventInscriptions(
      eventId,
      page,
      pageSize
    ),
    queryFn: async () =>
      await getEventInscriptions(eventId, { page, pageSize }),
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos
    retry: 2,
    refetchOnWindowFocus: false,
    enabled: !!eventId, // Só executa se eventId estiver definido
  });
}

// Hook para invalidar cache de análise de inscrições
export function useInvalidateAnalysisInscriptions() {
  const queryClient = useQueryClient();

  return {
    invalidateAll: () =>
      queryClient.invalidateQueries({ queryKey: analysisInscriptionsKeys.all }),
    invalidateEventInscriptions: (eventId: string) =>
      queryClient.invalidateQueries({
        queryKey: analysisInscriptionsKeys.eventInscriptions(eventId, 1, 15),
      }),
    // Invalidate all pages of inscription details using the base key
    invalidateInscriptionDetails: (inscriptionId: string) =>
      queryClient.invalidateQueries({
        queryKey: analysisInscriptionsKeys.inscriptionDetailsBase(inscriptionId),
      }),
    // Remove all pages of inscription details from cache (e.g., after delete)
    removeInscriptionDetails: (inscriptionId: string) =>
      queryClient.removeQueries({
        queryKey: analysisInscriptionsKeys.inscriptionDetailsBase(inscriptionId),
      }),
    // Cancel any in-flight requests for this inscription's details
    cancelInscriptionDetails: (inscriptionId: string) =>
      queryClient.cancelQueries({
        queryKey: analysisInscriptionsKeys.inscriptionDetailsBase(inscriptionId),
      }),
    // Invalidate events cache
    invalidateEvents: () =>
      queryClient.invalidateQueries({
        queryKey: analysisInscriptionsKeys.all,
        predicate: (query) =>
          query.queryKey.includes("events") || query.queryKey.includes("eventInscriptions"),
      }),
    // Remove specific inscription from all caches
    removeInscriptionFromAllCaches: (inscriptionId: string) => {
      // Remove inscription details
      queryClient.removeQueries({
        queryKey: analysisInscriptionsKeys.inscriptionDetailsBase(inscriptionId),
      });
      // Cancel any ongoing requests for this inscription
      queryClient.cancelQueries({
        queryKey: analysisInscriptionsKeys.inscriptionDetailsBase(inscriptionId),
      });
      // Invalidate event inscriptions to refresh lists
      queryClient.invalidateQueries({
        queryKey: analysisInscriptionsKeys.all,
        predicate: (query) =>
          query.queryKey.includes("eventInscriptions"),
      });
    },
  };
}

// Hook para pré-carregar dados de análise
export function usePrefetchAnalysisInscriptions() {
  const queryClient = useQueryClient();

  return {
    prefetchNextPage: (
      eventId: string,
      currentPage: number,
      pageSize: number
    ) => {
      queryClient.prefetchQuery({
        queryKey: analysisInscriptionsKeys.eventInscriptions(
          eventId,
          currentPage + 1,
          pageSize
        ),
        queryFn: async () =>
          await getEventInscriptions(eventId, {
            page: currentPage + 1,
            pageSize,
          }),
        staleTime: 5 * 60 * 1000,
      });
    },
  };
}
