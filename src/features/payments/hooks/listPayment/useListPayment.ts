import {
  useListPaymentQuery,
  usePrefetchListPaymentQuery,
} from '@/features/payments/hooks/listPayment/useListPaymentQuery';
import {
  UseListPaymentParams,
  UseListPaymentResult,
} from '@/features/payments/types/listPayments/listPaymentsTypes';
import { useEffect, useState } from 'react';

export function useListPayment({
  eventId,
  localityId,
  initialPage = 1,
  pageSize = 10,
}: UseListPaymentParams): UseListPaymentResult {
  const [page, setPage] = useState(initialPage);

  const {
    data,
    isLoading: loading,
    isFetching,
    isFetched: fetched,
    error,
    refetch,
  } = useListPaymentQuery(page, pageSize, eventId, localityId);

  const { prefetchNextPage } = usePrefetchListPaymentQuery();

  useEffect(() => {
    if (data && page < data.pageCount) {
      prefetchNextPage(page, pageSize, eventId, localityId);
    }
  }, [page, pageSize, eventId, localityId]);

  return {
    summary: data?.summary || {
      totalPayments: 0,
      totalPaidValue: 0,
      totalUnderReviewValue: 0,
      totalRefusedValue: 0,
    },
    payments: data?.payments || [],
    total: data?.total || 0,
    page: data?.page || 0,
    pageCount: data?.pageCount || 0,

    loading,
    fetching: isFetching,
    fetched,
    error,

    setPage,
    refresh: async () => {
      await refetch();
    },
  };
}
