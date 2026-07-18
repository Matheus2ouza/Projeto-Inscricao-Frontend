'use client';

import type { Localities } from '@/features/locality/types/listLocalities/listLocalitiesTypes';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { listLocalitiesToAccountAction } from '../../actions/listLocalitiesToAccount/listLocalitiesToAccount';

export const listLocalitiesToAccountKeys = {
  all: ['list-localities-to-account'] as const,
  lists: () => [...listLocalitiesToAccountKeys.all, 'list'] as const,
  list: () => [...listLocalitiesToAccountKeys.lists()] as const,
};

export function useListLocalitiesToAccountQuery() {
  return useQuery<Localities[]>({
    queryKey: listLocalitiesToAccountKeys.list(),
    queryFn: () => listLocalitiesToAccountAction(),
    staleTime: 10 * 60 * 1000, // 10 minutos
    gcTime: 15 * 60 * 1000, // 15 minutos
    retry: 2,
    refetchOnWindowFocus: false,
  });
}

export function useInvalidateListLocalitiesToAccountQuery() {
  const queryClient = useQueryClient();

  return {
    invalidateAll: () => {
      queryClient.invalidateQueries({
        queryKey: listLocalitiesToAccountKeys.all,
      });
    },

    invalidateLists: () => {
      queryClient.invalidateQueries({
        queryKey: listLocalitiesToAccountKeys.lists(),
      });
    },

    invalidateList: () => {
      queryClient.invalidateQueries({
        queryKey: listLocalitiesToAccountKeys.list(),
      });
    },

    removeAll: () => {
      queryClient.removeQueries({
        queryKey: listLocalitiesToAccountKeys.all,
      });
    },

    removeLists: () => {
      queryClient.removeQueries({
        queryKey: listLocalitiesToAccountKeys.lists(),
      });
    },

    removeList: () => {
      queryClient.removeQueries({
        queryKey: listLocalitiesToAccountKeys.list(),
      });
    },

    setListData: (data: Localities[]) => {
      queryClient.setQueryData(listLocalitiesToAccountKeys.list(), data);
    },
  };
}
