import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getEvents } from "../api/getEvents";
import type { StatusEvent } from "../types/listEventsForParticipantsTypes";

// Chaves de query para organização - específicas para seleção de eventos
export const selectEventForListParticipantsKeys = {
  all: ["select-event-for-list-participants"] as const,
  lists: () => [...selectEventForListParticipantsKeys.all, "list"] as const,
  list: (
    page: number,
    pageSize: number,
    status?: StatusEvent[],
    guest?: boolean,
  ) =>
    [
      ...selectEventForListParticipantsKeys.lists(),
      { page, pageSize, status, guest },
    ] as const,
  details: () => [...selectEventForListParticipantsKeys.all, "detail"] as const,
  detail: (id: string) =>
    [...selectEventForListParticipantsKeys.details(), id] as const,
};

export function useSelectEventForListParticipantsQuery(
  page: number = 1,
  pageSize: number = 8,
  status?: StatusEvent[],
  guest?: boolean,
) {
  return useQuery({
    queryKey: selectEventForListParticipantsKeys.list(
      page,
      pageSize,
      status,
      guest,
    ),
    queryFn: () => getEvents({ page, pageSize, status, guest }),
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos
    retry: 2,
    refetchOnWindowFocus: false,
  });
}

// Hook para invalidar cache de eventos de análise
export function useInvalidateSelectEventForListParticipants() {
  const queryClient = useQueryClient();

  return {
    invalidateAll: () => {
      // Invalidar tanto as chaves específicas de eventos quanto as unificadas
      queryClient.invalidateQueries({
        queryKey: selectEventForListParticipantsKeys.all,
      });
      queryClient.invalidateQueries({
        queryKey: selectEventForListParticipantsKeys.all,
        predicate: (query) => query.queryKey.includes("inscriptions"),
      });
    },
    invalidateList: () => {
      queryClient.invalidateQueries({
        queryKey: selectEventForListParticipantsKeys.lists(),
      });
      queryClient.invalidateQueries({
        queryKey: selectEventForListParticipantsKeys.all,
        predicate: (query) => query.queryKey.includes("inscriptions"),
      });
    },
    invalidateDetail: (id: string) =>
      queryClient.invalidateQueries({
        queryKey: selectEventForListParticipantsKeys.detail(id),
      }),
  };
}

// Hook para pré-carregar dados de análise
export function usePrefetchSelectEventForListParticipants() {
  const queryClient = useQueryClient();

  return {
    prefetchNextPage: (
      currentPage: number,
      pageSize: number,
      status?: StatusEvent[],
      guest?: boolean,
    ) => {
      queryClient.prefetchQuery({
        queryKey: selectEventForListParticipantsKeys.list(
          currentPage + 1,
          pageSize,
          status,
          guest,
        ),
        queryFn: () =>
          getEvents({
            page: currentPage + 1,
            pageSize,
            status,
            guest,
          }),
        staleTime: 5 * 60 * 1000,
      });
    },
  };
}
