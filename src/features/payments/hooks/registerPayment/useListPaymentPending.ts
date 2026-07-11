import {
  UseListPaymentPendingParams,
  UseListPaymentPendingResult,
} from '@/features/payments/types/listPaymentsPeding/listPaymentsPedingTypes';
import { useState } from 'react';
import {
  UseListPaymentPendingQuery,
  usePrefetchListPaymentPendingQuery,
} from './UseListPaymentPendingQuery';

export function useListPaymentPending({
  eventId,
  initialPage = 1,
  pageSize = 20,
}: UseListPaymentPendingParams): UseListPaymentPendingResult {
  const [page, setPage] = useState(initialPage);

  const {
    data,
    isLoading: loading,
    error,
    refetch,
  } = UseListPaymentPendingQuery(eventId, page, pageSize);

  const { prefetchNextPage } = usePrefetchListPaymentPendingQuery();

  if (data && page < data.pageCount) {
    prefetchNextPage(eventId, page, pageSize);
  }

  return {
    inscriptions: data?.inscriptions || [],
    allowCard: data?.allowCard || false,
    total: data?.total || 0,
    page: data?.page || 0,
    pageCount: data?.pageCount || 0,
    loading,
    error,
    setPage,
    refresh: async () => {
      await refetch();
    },
  };
}
