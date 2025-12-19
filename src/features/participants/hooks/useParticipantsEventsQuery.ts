import { useQuery, useQueryClient } from "@tanstack/react-query";
import { FindAllToParticipantsResponse } from "../../events/types/checkout/checkoutTypes";
import { getEvents } from "../api/getEvents";

// Chaves de query para organização - específicas para participantes
export const participantsEventsKeys = {
  all: ["participants-events"] as const,
  lists: () => [...participantsEventsKeys.all, "list"] as const,
  list: (page: number, pageSize: number) =>
    [...participantsEventsKeys.lists(), { page, pageSize }] as const,
  details: () => [...participantsEventsKeys.all, "detail"] as const,
  detail: (id: string) => [...participantsEventsKeys.details(), id] as const,
};

export function useParticipantsEventsQuery(
  page: number = 1,
  pageSize: number = 8
) {
  return useQuery<FindAllToParticipantsResponse>({
    queryKey: participantsEventsKeys.list(page, pageSize),
    queryFn: () => getEvents(page, pageSize),
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos
    retry: 2,
    refetchOnWindowFocus: false,
  });
}

// Hook para invalidar cache de eventos de participantes
export function useInvalidateParticipantsEvents() {
  const queryClient = useQueryClient();

  return {
    invalidateAll: () => {
      queryClient.invalidateQueries({
        queryKey: participantsEventsKeys.all,
      });
    },
    invalidateList: () => {
      queryClient.invalidateQueries({
        queryKey: participantsEventsKeys.lists(),
      });
    },
    invalidateDetail: (id: string) => {
      queryClient.invalidateQueries({
        queryKey: participantsEventsKeys.detail(id),
      });
    },
  };
}

// Hook para pré-carregar dados de participantes
export function usePrefetchParticipantsEvents() {
  const queryClient = useQueryClient();

  return {
    prefetchNextPage: (currentPage: number, pageSize: number) => {
      queryClient.prefetchQuery({
        queryKey: participantsEventsKeys.list(currentPage + 1, pageSize),
        queryFn: () => getEvents(currentPage + 1, pageSize),
        staleTime: 5 * 60 * 1000,
      });
    },
  };
}

