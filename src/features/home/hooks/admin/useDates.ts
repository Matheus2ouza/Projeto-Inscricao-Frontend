'use client';

import { PaymentsDates } from '@/features/home/types/admin/paymentsDatesTypes';
import { EventsDates } from '@/features/home/types/eventsDatesTypes';
import { useMemo } from 'react';
import { useDatesQuery } from './useDatesQuery';

interface UseDatesResult {
  events: EventsDates[];
  payments: PaymentsDates[];
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
      payments: data?.payments ?? [],
      loading: isLoading,
      isFetching,
      error: null,
      refetch,
    }),
    [data, isLoading, isFetching, refetch],
  );
}
