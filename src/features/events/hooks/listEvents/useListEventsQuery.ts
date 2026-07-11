'use client';

import { listEventsAction } from '@/features/events/actions/listEvents/listEventsAction';
import type { StatusEvent } from '@/features/events/types/listEvents/listEventsTypes';
import { useQuery, useQueryClient } from '@tanstack/react-query';

// Chaves de query para organização
export const listEventsKeys = {
  all: ['list-events'] as const,
  lists: () => [...listEventsKeys.all, 'list'] as const,
  list: (page: number, pageSize: number, status?: StatusEvent[]) =>
    [...listEventsKeys.lists(), { page, pageSize, status }] as const,
};

export function useListEventsQuery(
  page: number = 1,
  pageSize: number = 8,
  status?: StatusEvent[],
) {
  return useQuery({
    queryKey: listEventsKeys.list(page, pageSize, status),
    queryFn: () => listEventsAction({ page, pageSize, status }),
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos
    retry: 2,
    refetchOnWindowFocus: false,
  });
}

// Hook para invalidar cache de eventos
export function useInvalidateListEventsQuery() {
  const queryClient = useQueryClient();

  return {
    invalidateAll: () =>
      queryClient.invalidateQueries({ queryKey: listEventsKeys.all }),
    invalidateList: () =>
      queryClient.invalidateQueries({ queryKey: listEventsKeys.lists() }),
    invalidateListParams: (
      page: number,
      pageSize: number,
      status?: StatusEvent[],
    ) =>
      queryClient.invalidateQueries({
        queryKey: listEventsKeys.list(page, pageSize, status),
      }),
  };
}

// Hook para pré-carregar dados
export function usePrefetchListEventsQuery() {
  const queryClient = useQueryClient();

  return {
    prefetchNextPage: (
      currentPage: number,
      pageSize: number,
      status?: StatusEvent[],
    ) => {
      queryClient.prefetchQuery({
        queryKey: listEventsKeys.list(currentPage + 1, pageSize, status),
        queryFn: () =>
          listEventsAction({
            page: currentPage + 1,
            pageSize,
            status,
          }),
        staleTime: 5 * 60 * 1000,
      });
    },
  };
}
