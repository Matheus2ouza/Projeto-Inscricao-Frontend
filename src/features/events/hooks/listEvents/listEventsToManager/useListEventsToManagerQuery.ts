'use client';

import { listEventsAction } from '@/features/events/actions/listEvents/listEventsToManager/listEventsToManagerAction';
import type { StatusEvent } from '@/features/events/types/listEvents/listEventsToManager/listEventsToManagerTypes';
import { useQuery, useQueryClient } from '@tanstack/react-query';

// Chaves de query para organização
export const listEventsToManagerKeys = {
  all: ['list-events-to-manager'] as const,
  lists: () => [...listEventsToManagerKeys.all, 'list'] as const,
  list: (page: number, pageSize: number, status?: StatusEvent[]) =>
    [...listEventsToManagerKeys.lists(), { page, pageSize, status }] as const,
  details: () => [...listEventsToManagerKeys.all, 'detail'] as const,
  detail: (id: string) => [...listEventsToManagerKeys.details(), id] as const,
};

export function useListEventsToManagerQuery(
  page: number = 1,
  pageSize: number = 8,
  status?: StatusEvent[],
) {
  return useQuery({
    queryKey: listEventsToManagerKeys.list(page, pageSize, status),
    queryFn: () => listEventsAction({ page, pageSize, status }),
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos
    retry: 2,
    refetchOnWindowFocus: false,
  });
}

// Hook para invalidar cache de eventos
export function useInvalidateListEventsToManagerQuery() {
  const queryClient = useQueryClient();

  return {
    invalidateAll: () =>
      queryClient.invalidateQueries({ queryKey: listEventsToManagerKeys.all }),
    invalidateList: () =>
      queryClient.invalidateQueries({
        queryKey: listEventsToManagerKeys.lists(),
      }),
    invalidateListParams: (
      page: number,
      pageSize: number,
      status?: StatusEvent[],
    ) =>
      queryClient.invalidateQueries({
        queryKey: listEventsToManagerKeys.list(page, pageSize, status),
      }),
    invalidateDetail: (id: string) =>
      queryClient.invalidateQueries({
        queryKey: listEventsToManagerKeys.detail(id),
      }),
  };
}

// Hook para pré-carregar dados
export function usePrefetchListEventsToManagerQuery() {
  const queryClient = useQueryClient();

  return {
    prefetchNextPage: (
      currentPage: number,
      pageSize: number,
      status?: StatusEvent[],
    ) => {
      queryClient.prefetchQuery({
        queryKey: listEventsToManagerKeys.list(
          currentPage + 1,
          pageSize,
          status,
        ),
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
