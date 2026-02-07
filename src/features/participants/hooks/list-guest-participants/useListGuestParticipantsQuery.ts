import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getGuestParticipants } from "../../api/list-guest-participants/getGuestParticipants";

// Chaves de query para organização - específicas para seleção de eventos
export const guestParticipantsKeys = {
  all: ["select-event-for-list-participants"] as const,
  lists: () => [...guestParticipantsKeys.all, "list"] as const,
  list: (eventId: string, page: number, pageSize: number) =>
    [...guestParticipantsKeys.lists(), { eventId, page, pageSize }] as const,
  details: () => [...guestParticipantsKeys.all, "detail"] as const,
  detail: (id: string) => [...guestParticipantsKeys.details(), id] as const,
};

export function useListGuestParticipantsQuery(
  eventId: string,
  page: number,
  pageSize: number,
) {
  return useQuery({
    queryKey: guestParticipantsKeys.list(eventId, page, pageSize),
    queryFn: () => getGuestParticipants(eventId, { page, pageSize }),
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos
    retry: 2,
    refetchOnWindowFocus: false,
  });
}

// hook para pré-carregar a próxima página
export function usePrefetchGuestParticipantsQuery() {
  const queryClient = useQueryClient();

  return {
    prefetchNextPage: (eventId: string, page: number, pageSize: number) => {
      queryClient.prefetchQuery({
        queryKey: guestParticipantsKeys.list(eventId, page + 1, pageSize),
        queryFn: () =>
          getGuestParticipants(eventId, { page: page + 1, pageSize }),
        staleTime: 5 * 60 * 1000, // 5 minutos
      });
    },
  };
}

// hook para invalidar o cache dos participantes
export function useInvalidateGuestParticipants() {
  const queryClient = useQueryClient();

  return {
    invalidateAll: () => {
      queryClient.invalidateQueries({
        queryKey: guestParticipantsKeys.all,
      });
    },
    invalidateList: (eventId: string) => {
      queryClient.invalidateQueries({
        queryKey: guestParticipantsKeys.list(eventId, 1, 10),
      });
    },
    invalidateDetail: (id: string) => {
      queryClient.invalidateQueries({
        queryKey: guestParticipantsKeys.detail(id),
      });
    },
  };
}
