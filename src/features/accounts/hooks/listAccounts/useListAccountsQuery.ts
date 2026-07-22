'use client';

import { listAccountsAction } from '@/features/accounts/actions/listAccounts/listAccountsAction';
import { ListAccountsResponse } from '@/features/accounts/types/listAccounts/listAccountsTypes';
import { useQuery, useQueryClient } from '@tanstack/react-query';

export const accountsKeys = {
  all: ['accounts'] as const,
  lists: () => [...accountsKeys.all, 'list'] as const,
  list: (page: number, pageSize: number) =>
    [...accountsKeys.lists(), { page, pageSize }] as const,
  details: () => [...accountsKeys.all, 'detail'] as const,
  detail: (id: string) => [...accountsKeys.details(), id] as const,
};

export function useListAccountsQuery(page: number = 1, pageSize: number = 10) {
  return useQuery<ListAccountsResponse>({
    queryKey: accountsKeys.list(page, pageSize),
    queryFn: () => listAccountsAction(page, pageSize),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 2,
    refetchOnWindowFocus: false,
  });
}

export function useInvalidateListAccountsQuery() {
  const queryClient = useQueryClient();

  return {
    invalidateList: (page?: number, pageSize?: number) => {
      if (page && pageSize) {
        return queryClient.invalidateQueries({
          queryKey: accountsKeys.list(page, pageSize),
        });
      }
      return queryClient.invalidateQueries({
        queryKey: accountsKeys.lists(),
      });
    },
    invalidateAll: () =>
      queryClient.invalidateQueries({ queryKey: accountsKeys.all }),
  };
}

// Hook para pré-carregar dados
export function usePrefetchListAccountsQuery() {
  const queryClient = useQueryClient();

  return {
    prefetchNextPage: (currentPage: number, pageSize: number) => {
      const nextPage = currentPage + 1;

      queryClient.prefetchQuery({
        queryKey: accountsKeys.list(nextPage, pageSize),
        queryFn: () => listAccountsAction(nextPage, pageSize),
        staleTime: 5 * 60 * 1000,
      });
    },

    prefetchPreviousPage: (currentPage: number, pageSize: number) => {
      const previousPage = Math.max(1, currentPage - 1);

      // Evita pré-carregar página 0 ou negativa
      if (previousPage === currentPage) return;

      queryClient.prefetchQuery({
        queryKey: accountsKeys.list(previousPage, pageSize),
        queryFn: () => listAccountsAction(previousPage, pageSize),
        staleTime: 5 * 60 * 1000,
      });
    },

    prefetchPage: (page: number, pageSize: number) => {
      queryClient.prefetchQuery({
        queryKey: accountsKeys.list(page, pageSize),
        queryFn: () => listAccountsAction(page, pageSize),
        staleTime: 5 * 60 * 1000,
      });
    },
  };
}
