import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getListExpenses } from '../../api/listExpenses/getListExpenses';
import { ListExpensesResponse } from '../../types/listExpenses/expensesTypes';

export const listExpensesKeys = {
  all: ['list-inscriptions'] as const,
  lists: () => [...listExpensesKeys.all, 'list'] as const,
  list: (page: number, pageSize: number, eventId?: string) =>
    [...listExpensesKeys.lists(), eventId, page, pageSize] as const,
};

export function useListExpensesQuery(
  page: number,
  pageSize: number,
  eventId?: string,
) {
  return useQuery<ListExpensesResponse>({
    queryKey: listExpensesKeys.list(page, pageSize, eventId),
    queryFn: () => getListExpenses(page, pageSize, eventId),
    enabled: Boolean(eventId),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
}

export function usePrefetchListExpensesQuery() {
  const queryClient = useQueryClient();

  return {
    prefetchNextPage: (page: number, pageSize: number, eventId?: string) => {
      queryClient.prefetchQuery({
        queryKey: listExpensesKeys.list(page + 1, pageSize, eventId),
        queryFn: () => getListExpenses(page + 1, pageSize, eventId),
        staleTime: 5 * 60 * 1000,
      });
    },
  };
}

export function useInvalidateListExpensesQuery() {
  const queryClient = useQueryClient();

  return {
    invalidateAll: () => {
      queryClient.invalidateQueries({
        queryKey: listExpensesKeys.all,
      });
    },

    invalidateLists: () => {
      queryClient.invalidateQueries({
        queryKey: listExpensesKeys.lists(),
      });
    },

    invalidateList: (page: number, pageSize: number, eventId?: string) => {
      queryClient.invalidateQueries({
        queryKey: listExpensesKeys.list(page, pageSize, eventId),
      });
    },
  };
}
