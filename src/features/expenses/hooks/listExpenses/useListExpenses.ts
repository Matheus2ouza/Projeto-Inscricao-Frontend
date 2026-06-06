'use client';

import {
  ListExpensesParams,
  ListExpensesResult,
} from '@/features/expenses/types/listExpenses/expensesTypes';
import { useState } from 'react';
import {
  useListExpensesQuery,
  usePrefetchListExpensesQuery,
} from './useListExpensesQuery';

export function useListExpense({
  eventId,
  initialPage,
  pageSize,
}: ListExpensesParams): ListExpensesResult {
  const [page, setPage] = useState(initialPage);

  const { data, isLoading, isFetched, isFetching, error, refetch } =
    useListExpensesQuery(page, pageSize, eventId);

  const { prefetchNextPage } = usePrefetchListExpensesQuery();

  if (data && page < data.pageCount) {
    prefetchNextPage(page, pageSize, eventId);
  }

  return {
    expense: data?.expenses ?? [],
    total: data?.total || 0,
    page: data?.page || initialPage,
    pageCount: data?.pageCount || 0,
    loading: isLoading,
    fetching: isFetching,
    fetched: isFetched,
    error: error || null,
    setPage,
    refresh: async () => await refetch(),
  };
}
