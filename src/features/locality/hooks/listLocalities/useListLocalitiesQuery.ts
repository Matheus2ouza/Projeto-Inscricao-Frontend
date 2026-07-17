'use client';

import { listLocalitiesAction } from '@/features/locality/actions/listLocalities/listLocalities';
import type { Localities } from '@/features/locality/types/listLocalities/listLocalitiesTypes';
import { useQuery, useQueryClient } from '@tanstack/react-query';

export const listLocalitiesKeys = {
  all: ['list-localities'] as const,
  lists: () => [...listLocalitiesKeys.all, 'list'] as const,
  list: (eventId?: string) => [...listLocalitiesKeys.lists(), eventId] as const,
};

export function useListLocalitiesQuery(eventId?: string) {
  return useQuery<Localities[]>({
    queryKey: listLocalitiesKeys.list(eventId),
    queryFn: () => listLocalitiesAction(eventId),
    enabled: !!eventId,
    staleTime: 10 * 60 * 1000, // 10 minutos (localidades mudam pouco)
    gcTime: 15 * 60 * 1000, // 15 minutos
    retry: 2,
    refetchOnWindowFocus: false,
  });
}

export function useInvalidateListLocalitiesQuery() {
  const queryClient = useQueryClient();

  return {
    invalidateAll: () => {
      queryClient.invalidateQueries({
        queryKey: listLocalitiesKeys.all,
      });
    },

    invalidateLists: () => {
      queryClient.invalidateQueries({
        queryKey: listLocalitiesKeys.lists(),
      });
    },

    invalidateList: (eventId: string) => {
      queryClient.invalidateQueries({
        queryKey: listLocalitiesKeys.list(eventId),
      });
    },

    removeAll: () => {
      queryClient.removeQueries({
        queryKey: listLocalitiesKeys.all,
      });
    },

    removeLists: () => {
      queryClient.removeQueries({
        queryKey: listLocalitiesKeys.lists(),
      });
    },

    removeList: (eventId: string) => {
      queryClient.removeQueries({
        queryKey: listLocalitiesKeys.list(eventId),
      });
    },

    setListData: (eventId: string, data: Localities[]) => {
      queryClient.setQueryData(listLocalitiesKeys.list(eventId), data);
    },
  };
}
