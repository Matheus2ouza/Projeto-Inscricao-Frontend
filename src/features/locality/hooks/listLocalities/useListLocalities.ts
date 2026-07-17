'use client';

import type {
  UseListLocalitiesParams,
  UseListLocalitiesResult,
} from '@/features/locality/types/listLocalities/listLocalitiesTypes';
import { useListLocalitiesQuery } from './useListLocalitiesQuery';

export function useListLocalities({
  eventId,
}: UseListLocalitiesParams): UseListLocalitiesResult {
  const { data, isLoading, isFetching, isFetched, error, refetch } =
    useListLocalitiesQuery(eventId);

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
