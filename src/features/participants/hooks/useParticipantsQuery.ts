import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ListParticipantsResponse } from "../../events/types/checkout/checkoutTypes";
import { getParticipants } from "../api/getParticipants";

// Chaves de query para organização - específicas para participantes
export const participantsKeys = {
  all: ["participants"] as const,
  lists: () => [...participantsKeys.all, "list"] as const,
  list: (eventId: string, page: number, pageSize: number) =>
    [...participantsKeys.lists(), eventId, { page, pageSize }] as const,
  details: () => [...participantsKeys.all, "detail"] as const,
  detail: (id: string) => [...participantsKeys.details(), id] as const,
};

export function useParticipantsQuery(
  eventId: string,
  page: number = 1,
  pageSize: number = 10,
) {
  return useQuery<ListParticipantsResponse>({
    queryKey: participantsKeys.list(eventId, page, pageSize),
    queryFn: () => getParticipants(eventId, page, pageSize),
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos
    retry: 2,
    refetchOnWindowFocus: false,
  });
}

// Hook para invalidar cache de participantes
export function useInvalidateParticipants() {
  const queryClient = useQueryClient();

  return {
    invalidateAll: () => {
      queryClient.invalidateQueries({
        queryKey: participantsKeys.all,
      });
    },
    invalidateList: (eventId: string) => {
      queryClient.invalidateQueries({
        queryKey: participantsKeys.list(eventId, 1, 10),
      });
    },
    invalidateDetail: (id: string) => {
      queryClient.invalidateQueries({
        queryKey: participantsKeys.detail(id),
      });
    },
  };
}

// Hook para pré-carregar dados de participantes
export function usePrefetchParticipants() {
  const queryClient = useQueryClient();

  return {
    prefetchNextPage: (
      eventId: string,
      currentPage: number,
      pageSize: number,
    ) => {
      queryClient.prefetchQuery({
        queryKey: participantsKeys.list(eventId, currentPage + 1, pageSize),
        queryFn: () => getParticipants(eventId, currentPage + 1, pageSize),
        staleTime: 5 * 60 * 1000,
      });
    },
  };
}
