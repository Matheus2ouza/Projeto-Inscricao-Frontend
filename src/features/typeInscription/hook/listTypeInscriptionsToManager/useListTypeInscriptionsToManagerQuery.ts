'use client';

import { listTypeInscriptionsToManagerAction } from '@/features/typeInscription/actions/listTypeInscriptionsToManager/listTypeInscriptionsToManagerAction';
import type { ListTypeInscriptionsToManagerResponse } from '@/features/typeInscription/types/listTypeInscriptionsToManager/listTypeInscriptionsManagerTypes';
import { useQuery, useQueryClient } from '@tanstack/react-query';

export const listTypeInscriptionsToManagerKeys = {
  all: ['list-type-inscriptions'] as const,
  lists: () => [...listTypeInscriptionsToManagerKeys.all, 'list'] as const,
  list: (eventId?: string) =>
    [...listTypeInscriptionsToManagerKeys.lists(), eventId] as const,
};

export function useListTypeInscriptionsToManagerQuery(eventId?: string) {
  return useQuery<ListTypeInscriptionsToManagerResponse>({
    queryKey: listTypeInscriptionsToManagerKeys.list(eventId),
    queryFn: () => listTypeInscriptionsToManagerAction(eventId),
    enabled: !!eventId,
    staleTime: 10 * 60 * 1000, // 10 minutos (tipos de inscrição mudam menos)
    gcTime: 15 * 60 * 1000, // 15 minutos
    retry: 2,
    refetchOnWindowFocus: false,
  });
}

export function useInvalidateListTypeInscriptionsToManagerQuery() {
  const queryClient = useQueryClient();

  return {
    invalidateAll: () => {
      queryClient.invalidateQueries({
        queryKey: listTypeInscriptionsToManagerKeys.all,
      });
    },

    invalidateLists: () => {
      queryClient.invalidateQueries({
        queryKey: listTypeInscriptionsToManagerKeys.lists(),
      });
    },

    invalidateList: (eventId: string) => {
      queryClient.invalidateQueries({
        queryKey: listTypeInscriptionsToManagerKeys.list(eventId),
      });
    },

    removeAll: () => {
      queryClient.removeQueries({
        queryKey: listTypeInscriptionsToManagerKeys.all,
      });
    },

    removeLists: () => {
      queryClient.removeQueries({
        queryKey: listTypeInscriptionsToManagerKeys.lists(),
      });
    },

    removeList: (eventId: string) => {
      queryClient.removeQueries({
        queryKey: listTypeInscriptionsToManagerKeys.list(eventId),
      });
    },

    setListData: (
      eventId: string,
      data: ListTypeInscriptionsToManagerResponse,
    ) => {
      queryClient.setQueryData(
        listTypeInscriptionsToManagerKeys.list(eventId),
        data,
      );
    },
  };
}
