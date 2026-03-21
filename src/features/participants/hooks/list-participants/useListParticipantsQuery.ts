import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getListParticipants } from "../../api/list-participants/getListParticipants";

// Chaves de query para organização - específicas para seleção de eventos
export const listParticipantsKeys = {
  all: ["list-participants"] as const,
  lists: () => [...listParticipantsKeys.all, "list"] as const,
  list: (eventId: string, page: number, pageSize: number) =>
    [...listParticipantsKeys.lists(), { eventId, page, pageSize }] as const,
  details: () => [...listParticipantsKeys.all, "detail"] as const,
  detail: (id: string) => [...listParticipantsKeys.details(), id] as const,
};

export function useListParticipantsQuery(
  eventId: string,
  page: number,
  pageSize: number,
) {
  return useQuery({
    queryKey: listParticipantsKeys.list(eventId, page, pageSize),
    queryFn: () => getListParticipants(eventId, { page, pageSize }),
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos
    retry: 2,
    refetchOnWindowFocus: false,
  });
}

// hook para pré-carregar a próxima página
export function usePrefetchListParticipantsQuery() {
  const queryClient = useQueryClient();

  return {
    prefetchNextPage: (eventId: string, page: number, pageSize: number) => {
      queryClient.prefetchQuery({
        queryKey: listParticipantsKeys.list(eventId, page + 1, pageSize),
        queryFn: () =>
          getListParticipants(eventId, { page: page + 1, pageSize }),
        staleTime: 5 * 60 * 1000, // 5 minutos
      });
    },
  };
}

// hook para invalidar o cache dos participantes
export function useInvalidateParticipants() {
  const queryClient = useQueryClient();

  return {
    invalidateAll: () => {
      queryClient.invalidateQueries({
        queryKey: listParticipantsKeys.all,
      });
    },
    invalidateList: (eventId: string) => {
      queryClient.invalidateQueries({
        queryKey: listParticipantsKeys.list(eventId, 1, 10),
      });
    },
    invalidateDetail: (id: string) => {
      queryClient.invalidateQueries({
        queryKey: listParticipantsKeys.detail(id),
      });
    },
  };
}
