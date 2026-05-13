import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getTypeInscriptionsByEvent } from '../api/getTypeInscriptionsByEvent';
import { getTypeInscriptionsByEventResponse } from '../types/typesInscriptionsTypes';

// Chaves de query para tipos de inscrição
export const typeInscriptionsKeys = {
  all: ['typeInscriptions'] as const,
  lists: () => [...typeInscriptionsKeys.all, 'list'] as const,
  list: (eventId: string) =>
    [...typeInscriptionsKeys.lists(), { eventId }] as const,
  details: () => [...typeInscriptionsKeys.all, 'detail'] as const,
  detail: (eventId: string) =>
    [...typeInscriptionsKeys.details(), eventId] as const,
};

export function useTypeInscriptionsQuery(eventId: string) {
  return useQuery<getTypeInscriptionsByEventResponse>({
    queryKey: typeInscriptionsKeys.detail(eventId),
    queryFn: () => getTypeInscriptionsByEvent(eventId),
    staleTime: 10 * 60 * 1000, // 10 minutos
    gcTime: 15 * 60 * 1000, // 15 minutos
    retry: 2,
    refetchOnWindowFocus: false,
  });
}

export function useInvalidateTypeInscriptionsQuery() {
  const queryClient = useQueryClient();

  return {
    invalidateAll: () => {
      queryClient.invalidateQueries({
        queryKey: typeInscriptionsKeys.all,
      });
    },

    invalidateLists: () => {
      queryClient.invalidateQueries({
        queryKey: typeInscriptionsKeys.lists(),
      });
    },

    invalidateDetail: (eventId: string) => {
      queryClient.invalidateQueries({
        queryKey: typeInscriptionsKeys.detail(eventId),
      });
    },
  };
}
