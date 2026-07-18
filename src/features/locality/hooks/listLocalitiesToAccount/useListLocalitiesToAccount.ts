'use client';

import type { UseListLocalitiesToAccountResult } from '@/features/locality/types/listLocalitiesToAccount/listLocalitiesToAccount';
import { useListLocalitiesToAccountQuery } from './useListLocalitiesToAccountQuery';

export function useListLocalitiesToAccount(): UseListLocalitiesToAccountResult {
  const { data, isLoading, isFetching, isFetched, error, refetch } =
    useListLocalitiesToAccountQuery();

  return {
    localities: data || [],
    loading: isLoading,
    fetching: isFetching,
    fetched: isFetched,
    error: error || null,
    refresh: () => {
      refetch();
    },
  };
}
