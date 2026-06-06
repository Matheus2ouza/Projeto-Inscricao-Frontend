import { getDetailsExpense } from '@/features/expenses/api/detailsExpense/getDetailsExpense';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { DetailsExpenseResponse } from '../../types/detailsExpense/detailsExpenseTypes';

export const detailsExpenseKeys = {
  all: ['list-inscriptions'] as const,
  lists: () => [...detailsExpenseKeys.all, 'list'] as const,
  list: (expenseId?: string) =>
    [...detailsExpenseKeys.lists(), expenseId] as const,
};

export function useDetailsExpenseQuery(expenseId?: string) {
  return useQuery<DetailsExpenseResponse>({
    queryKey: detailsExpenseKeys.list(expenseId),
    queryFn: () => getDetailsExpense(expenseId),
    enabled: Boolean(expenseId),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
}

export function useInvalidateDetailsExpenseQuery() {
  const queryClient = useQueryClient();

  return {
    invalidateAll: () => {
      queryClient.invalidateQueries({
        queryKey: detailsExpenseKeys.all,
      });
    },

    invalidateLists: () => {
      queryClient.invalidateQueries({
        queryKey: detailsExpenseKeys.lists(),
      });
    },

    invalidateList: (expenseId?: string) => {
      queryClient.invalidateQueries({
        queryKey: detailsExpenseKeys.list(expenseId),
      });
    },
  };
}
