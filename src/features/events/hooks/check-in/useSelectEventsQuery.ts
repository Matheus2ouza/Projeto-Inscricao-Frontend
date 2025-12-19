import { getEvents } from "@/features/events/api/check-in/getEvent";
import type { StatusEvent } from "@/features/events/types/check-in/selectEvent";
import { useQuery, useQueryClient } from "@tanstack/react-query";

// Chaves de query para organização - específicas para análise
export const analysisEventsKeys = {
  all: ["event-check-in"] as const,
  lists: () => [...analysisEventsKeys.all, "list"] as const,
  list: (page: number, pageSize: number, status?: StatusEvent[]) =>
    [...analysisEventsKeys.lists(), { page, pageSize, status }] as const,
  details: () => [...analysisEventsKeys.all, "detail"] as const,
  detail: (id: string) => [...analysisEventsKeys.details(), id] as const,
};

export function useSelectEventsQuery(
  page: number = 1,
  pageSize: number = 8,
  status?: StatusEvent[]
) {
  return useQuery({
    queryKey: analysisEventsKeys.list(page, pageSize, status),
    queryFn: () => getEvents({ page, pageSize, status }),
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos
    retry: 2,
    refetchOnWindowFocus: false,
  });
}

// Hook para pré-carregar dados de análise
export function usePrefetchSelectEvents() {
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
          getEvents({
            page: currentPage + 1,
            pageSize,
            status,
          }),
        staleTime: 5 * 60 * 1000,
      });
    },
  };
}
