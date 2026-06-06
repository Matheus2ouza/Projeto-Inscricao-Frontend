'use client';

import {
  DetailsExpensesParams,
  DetailsExpensesResult,
} from '../../types/detailsExpense/detailsExpenseTypes';
import { useDetailsExpenseQuery } from './useDetailsExpenseQuery';

export function useDetailsExpense({
  expenseId,
}: DetailsExpensesParams): DetailsExpensesResult {
  const { data, isLoading, isFetched, isFetching, error, refetch } =
    useDetailsExpenseQuery(expenseId);

  return {
    expense: data ?? null,
    loading: isLoading,
    fetching: isFetching,
    fetched: isFetched,
    error: error?.message ?? null,
    refresh: refetch,
  };
}
