'use client';

import { listRegionsAction } from '@/features/regions/actions/listRegions/listRegionsAction';
import { ListRegionsResponse } from '@/features/regions/types/listRegions/listRegionsTypes';
import { useQuery, useQueryClient } from '@tanstack/react-query';

export const regionsKeys = {
  all: ['regions'] as const,
  lists: () => [...regionsKeys.all, 'list'] as const,
  list: () => [...regionsKeys.lists()] as const,
  details: () => [...regionsKeys.all, 'detail'] as const,
  detail: (id: string) => [...regionsKeys.details(), id] as const,
};

export function useListRegionsQuery() {
  return useQuery<ListRegionsResponse>({
    queryKey: regionsKeys.list(),
    queryFn: () => listRegionsAction(),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 2,
    refetchOnWindowFocus: false,
  });
}

export function useInvalidateListRegionsQuery() {
  const queryClient = useQueryClient();

  return {
    invalidateList: () => {
      return queryClient.invalidateQueries({
        queryKey: regionsKeys.lists(),
      });
    },
    invalidateAll: () =>
      queryClient.invalidateQueries({ queryKey: regionsKeys.all }),
  };
}

export function usePrefetchListRegionsQuery() {
  const queryClient = useQueryClient();

  return {
    prefetchList: () => {
      queryClient.prefetchQuery({
        queryKey: regionsKeys.list(),
        queryFn: () => listRegionsAction(),
        staleTime: 5 * 60 * 1000,
      });
    },
  };
}
