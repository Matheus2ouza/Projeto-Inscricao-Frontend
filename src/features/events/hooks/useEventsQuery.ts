import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getEvents } from "../api/getEvents";

// Chaves de query para organização
export const eventsKeys = {
  all: ["events"] as const,
  lists: () => [...eventsKeys.all, "list"] as const,
  list: (page: number, pageSize: number) =>
    [...eventsKeys.lists(), { page, pageSize }] as const,
  details: () => [...eventsKeys.all, "detail"] as const,
  detail: (id: string) => [...eventsKeys.details(), id] as const,
};

export function useEventsQuery(page: number = 1, pageSize: number = 8) {
  return useQuery({
    queryKey: eventsKeys.list(page, pageSize),
    queryFn: () => getEvents({ page, pageSize, status: ['OPEN', 'CLOSE'] }),
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos
    retry: 2,
    refetchOnWindowFocus: false,
  });
}

// Hook para invalidar cache de eventos
export function useInvalidateEventsQuery() {
  const queryClient = useQueryClient();

  return {
    invalidateAll: () =>
      queryClient.invalidateQueries({ queryKey: eventsKeys.all }),
    invalidateList: () =>
      queryClient.invalidateQueries({ queryKey: eventsKeys.lists() }),
    invalidateDetail: (id: string) =>
      queryClient.invalidateQueries({ queryKey: eventsKeys.detail(id) }),
  };
}

// Hook para pré-carregar dados
export function usePrefetchEventsQuery() {
  const queryClient = useQueryClient();

  return {
    prefetchNextPage: (currentPage: number, pageSize: number) => {
      queryClient.prefetchQuery({
        queryKey: eventsKeys.list(currentPage + 1, pageSize),
        queryFn: () => getEvents({ page: currentPage + 1, pageSize }),
        staleTime: 5 * 60 * 1000,
      });
    },
  };
}

