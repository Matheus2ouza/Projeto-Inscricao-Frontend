import { getEventInscriptions } from "@/features/inscriptions/api/analysis/getEventInscriptions";
import { useQuery, useQueryClient } from "@tanstack/react-query";

// Chaves de cache para análise de inscrições
export const inscriptionsForAnalysisKeys = {
  all: ["inscriptions-for-analysis"] as const,
  eventInscriptions: (eventId: string, page: number, pageSize: number) =>
    [
      ...inscriptionsForAnalysisKeys.all,
      "eventInscriptions",
      eventId,
      { page, pageSize },
    ] as const,
  // Base key for all pages of a specific inscription's details
  inscriptionDetailsBase: (inscriptionId: string) =>
    [
      ...inscriptionsForAnalysisKeys.all,
      "inscriptionDetails",
      inscriptionId,
    ] as const,
  inscriptionDetails: (inscriptionId: string, page: number, pageSize: number) =>
    [
      ...inscriptionsForAnalysisKeys.inscriptionDetailsBase(inscriptionId),
      { page, pageSize },
    ] as const,
  // Chave para eventos de análise
  events: (page: number, pageSize: number) =>
    [...inscriptionsForAnalysisKeys.all, "events", { page, pageSize }] as const,
};

export function useInscriptionsForAnalysisQuery(
  eventId: string,
  page: number = 1,
  pageSize: number = 15,
) {
  return useQuery({
    queryKey: inscriptionsForAnalysisKeys.eventInscriptions(
      eventId,
      page,
      pageSize,
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
      queryClient.invalidateQueries({
        queryKey: inscriptionsForAnalysisKeys.all,
      }),
    invalidateEventInscriptions: (eventId: string) =>
      queryClient.invalidateQueries({
        queryKey: inscriptionsForAnalysisKeys.eventInscriptions(eventId, 1, 15),
      }),
    // Invalidate all pages of inscription details using the base key
    invalidateInscriptionDetails: (inscriptionId: string) =>
      queryClient.invalidateQueries({
        queryKey:
          inscriptionsForAnalysisKeys.inscriptionDetailsBase(inscriptionId),
      }),
    // Remove all pages of inscription details from cache (e.g., after delete)
    removeInscriptionDetails: (inscriptionId: string) =>
      queryClient.removeQueries({
        queryKey:
          inscriptionsForAnalysisKeys.inscriptionDetailsBase(inscriptionId),
      }),
    // Cancel any in-flight requests for this inscription's details
    cancelInscriptionDetails: (inscriptionId: string) =>
      queryClient.cancelQueries({
        queryKey:
          inscriptionsForAnalysisKeys.inscriptionDetailsBase(inscriptionId),
      }),
    // Invalidate events cache
    invalidateEvents: () =>
      queryClient.invalidateQueries({
        queryKey: inscriptionsForAnalysisKeys.all,
        predicate: (query) =>
          query.queryKey.includes("events") ||
          query.queryKey.includes("eventInscriptions"),
      }),
    // Remove specific inscription from all caches
    removeInscriptionFromAllCaches: (inscriptionId: string) => {
      // Remove inscription details
      queryClient.removeQueries({
        queryKey:
          inscriptionsForAnalysisKeys.inscriptionDetailsBase(inscriptionId),
      });
      // Cancel any ongoing requests for this inscription
      queryClient.cancelQueries({
        queryKey:
          inscriptionsForAnalysisKeys.inscriptionDetailsBase(inscriptionId),
      });
      // Invalidate event inscriptions to refresh lists
      queryClient.invalidateQueries({
        queryKey: inscriptionsForAnalysisKeys.all,
        predicate: (query) => query.queryKey.includes("eventInscriptions"),
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
      pageSize: number,
    ) => {
      queryClient.prefetchQuery({
        queryKey: inscriptionsForAnalysisKeys.eventInscriptions(
          eventId,
          currentPage + 1,
          pageSize,
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
