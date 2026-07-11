'use client';

import type { EventsDates } from '@/features/home/types/eventsDatesTypes';
import { useMemo } from 'react';
import { useDatesQuery } from './useDatesQuery';

interface UseDatesResult {
  events: EventsDates[];
  loading: boolean;
  isFetching: boolean;
  error: null;
  refetch: ReturnType<typeof useDatesQuery>['refetch'];
}

export function useDates(): UseDatesResult {
  const { data, isLoading, isFetching, refetch } = useDatesQuery();

  return useMemo(
    () => ({
      events: data?.events ?? [],
      loading: isLoading,
      isFetching,
      error: null,
      refetch,
    }),
    [data, isLoading, isFetching, refetch],
  );
}
