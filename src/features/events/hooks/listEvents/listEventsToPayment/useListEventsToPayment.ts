'use client';

import type {
  UseListEventsToPaymentParams,
  UseListEventsToPaymentResult,
} from '@/features/events/types/listEvents/listEventsToPayment/listEventsToPaymentTypes';
import { useEffect, useState } from 'react';
import {
  useListEventsToPaymentQuery,
  usePrefetchListEventsToPaymentQuery,
} from './useListEventsToPaymentQuery';

export function useListEventsToPayment({
  initialPage = 1,
  pageSize = 8,
  paymentEnabled,
}: UseListEventsToPaymentParams = {}): UseListEventsToPaymentResult {
  const [page, setPage] = useState(initialPage);
  const paymentEnabledValue =
    paymentEnabled?.length === 1 ? paymentEnabled[0] : undefined;
  const paymentEnabledKey = paymentEnabled?.length
    ? [...paymentEnabled].sort((a, b) => Number(a) - Number(b)).join(',')
    : 'default';

  const { data, isLoading, isFetching, error, refetch } =
    useListEventsToPaymentQuery(page, pageSize, paymentEnabledValue);

  const { prefetchNextPage } = usePrefetchListEventsToPaymentQuery();

  useEffect(() => {
    setPage(initialPage);
  }, [initialPage, paymentEnabledKey]);

  useEffect(() => {
    if (data && page < data.pageCount) {
      prefetchNextPage(page, pageSize, paymentEnabledValue);
    }
  }, [data, pageSize, paymentEnabledValue, prefetchNextPage]);

  return {
    events: data?.events ?? [],
    total: data?.total ?? 0,
    page,
    pageCount: data?.pageCount ?? 0,
    loading: isLoading || isFetching,
    error: error?.message || null,
    setPage,
    refetch: async () => {
      await refetch();
    },
  };
}
