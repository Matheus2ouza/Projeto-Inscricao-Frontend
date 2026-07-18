'use client';

import type { UseListLocalitiesResult } from '@/features/locality/types/listLocalities/listLocalitiesTypes';
import { useListLocalitiesQuery } from './useListLocalitiesQuery';

export function useListLocalities(): UseListLocalitiesResult {
  const { data, isLoading, isFetching, isFetched, error, refetch } =
    useListLocalitiesQuery();

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
