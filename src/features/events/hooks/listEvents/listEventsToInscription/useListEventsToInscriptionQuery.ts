'use client';

import { listEventsToInscriptionAction } from '@/features/events/actions/listEvents/listEventsToInscription/listEventsToInscriptionAction';
import type { ListEventsToInscriptionResponse } from '@/features/events/types/listEvents/listEventsToInscription/listEventsToInscriptionTypes';
import { useQuery, useQueryClient } from '@tanstack/react-query';

export const listEventsToInscriptionKeys = {
  all: ['list-events-to-inscription'] as const,
  lists: () => [...listEventsToInscriptionKeys.all, 'list'] as const,
  list: (page: number, pageSize: number, status?: string[]) =>
    [
      ...listEventsToInscriptionKeys.lists(),
      { page, pageSize, status },
    ] as const,
};

export function useListEventsToInscriptionQuery(
  page: number = 1,
  pageSize: number = 8,
  status?: string[],
) {
  return useQuery<ListEventsToInscriptionResponse>({
    queryKey: listEventsToInscriptionKeys.list(page, pageSize, status),
    queryFn: () =>
      listEventsToInscriptionAction({
        page,
        pageSize,
        status: status as any,
      }),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 2,
    refetchOnWindowFocus: false,
  });
}

export function useInvalidateListEventsToInscriptionQuery() {
  const queryClient = useQueryClient();

  return {
    invalidateAll: () => {
      queryClient.invalidateQueries({
        queryKey: listEventsToInscriptionKeys.all,
      });
    },

    invalidateLists: () => {
      queryClient.invalidateQueries({
        queryKey: listEventsToInscriptionKeys.lists(),
      });
    },

    invalidateList: (page: number, pageSize: number, status?: string[]) => {
      queryClient.invalidateQueries({
        queryKey: listEventsToInscriptionKeys.list(page, pageSize, status),
      });
    },

    removeAll: () => {
      queryClient.removeQueries({
        queryKey: listEventsToInscriptionKeys.all,
      });
    },

    removeLists: () => {
      queryClient.removeQueries({
        queryKey: listEventsToInscriptionKeys.lists(),
      });
    },

    removeList: (page: number, pageSize: number, status?: string[]) => {
      queryClient.removeQueries({
        queryKey: listEventsToInscriptionKeys.list(page, pageSize, status),
      });
    },

    setListData: (
      page: number,
      pageSize: number,
      status: string[] | undefined,
      data: ListEventsToInscriptionResponse,
    ) => {
      queryClient.setQueryData(
        listEventsToInscriptionKeys.list(page, pageSize, status),
        data,
      );
    },
  };
}

// Hook para pré-carregar dados
export function usePrefetchListEventsToInscriptionQuery() {
  const queryClient = useQueryClient();

  return {
    prefetchNextPage: (
      currentPage: number,
      pageSize: number,
      status?: string[],
    ) => {
      queryClient.prefetchQuery({
        queryKey: listEventsToInscriptionKeys.list(
          currentPage + 1,
          pageSize,
          status,
        ),
        queryFn: () =>
          listEventsToInscriptionAction({
            page: currentPage + 1,
            pageSize,
            status: status as any,
          }),
        staleTime: 5 * 60 * 1000,
      });
    },
  };
}
