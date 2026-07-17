'use client';

import { listTypeInscriptionsAction } from '@/features/typeInscription/actions/listTypeInscriptions/listTypeInscriptionsActions';
import type { ListTypeInscriptionsResponse } from '@/features/typeInscription/types/listTypeInscriptions/listTypeInscriptionsTypes';
import { useQuery, useQueryClient } from '@tanstack/react-query';

export const listTypeInscriptionsKeys = {
  all: ['list-type-inscriptions'] as const,
  lists: () => [...listTypeInscriptionsKeys.all, 'list'] as const,
  list: (eventId?: string) =>
    [...listTypeInscriptionsKeys.lists(), eventId] as const,
};

export function useListTypeInscriptionsQuery(eventId?: string) {
  return useQuery<ListTypeInscriptionsResponse>({
    queryKey: listTypeInscriptionsKeys.list(eventId),
    queryFn: () => listTypeInscriptionsAction(eventId),
    enabled: !!eventId,
    staleTime: 10 * 60 * 1000, // 10 minutos (tipos de inscrição mudam menos)
    gcTime: 15 * 60 * 1000, // 15 minutos
    retry: 2,
    refetchOnWindowFocus: false,
  });
}

export function useInvalidateListTypeInscriptionsQuery() {
  const queryClient = useQueryClient();

  return {
    invalidateAll: () => {
      queryClient.invalidateQueries({
        queryKey: listTypeInscriptionsKeys.all,
      });
    },

    invalidateLists: () => {
      queryClient.invalidateQueries({
        queryKey: listTypeInscriptionsKeys.lists(),
      });
    },

    invalidateList: (eventId: string) => {
      queryClient.invalidateQueries({
        queryKey: listTypeInscriptionsKeys.list(eventId),
      });
    },

    removeAll: () => {
      queryClient.removeQueries({
        queryKey: listTypeInscriptionsKeys.all,
      });
    },

    removeLists: () => {
      queryClient.removeQueries({
        queryKey: listTypeInscriptionsKeys.lists(),
      });
    },

    removeList: (eventId: string) => {
      queryClient.removeQueries({
        queryKey: listTypeInscriptionsKeys.list(eventId),
      });
    },

    setListData: (eventId: string, data: ListTypeInscriptionsResponse) => {
      queryClient.setQueryData(listTypeInscriptionsKeys.list(eventId), data);
    },
  };
}
