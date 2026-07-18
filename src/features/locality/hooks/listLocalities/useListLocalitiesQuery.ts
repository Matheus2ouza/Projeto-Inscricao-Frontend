'use client';

import { listLocalitiesAction } from '@/features/locality/actions/listLocalities/listLocalities';
import type { Localities } from '@/features/locality/types/listLocalities/listLocalitiesTypes';
import { useQuery, useQueryClient } from '@tanstack/react-query';

export const listLocalitiesKeys = {
  all: ['list-localities'] as const,
  lists: () => [...listLocalitiesKeys.all, 'list'] as const,
  // Removeu o eventId do list
  list: () => [...listLocalitiesKeys.lists()] as const,
};

export function useListLocalitiesQuery() {
  return useQuery<Localities[]>({
    queryKey: listLocalitiesKeys.list(),
    queryFn: () => listLocalitiesAction(),
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

    // Removeu os métodos que dependiam de eventId
    invalidateList: () => {
      queryClient.invalidateQueries({
        queryKey: listLocalitiesKeys.list(),
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

    removeList: () => {
      queryClient.removeQueries({
        queryKey: listLocalitiesKeys.list(),
      });
    },

    setListData: (data: Localities[]) => {
      queryClient.setQueryData(listLocalitiesKeys.list(), data);
    },
  };
}
