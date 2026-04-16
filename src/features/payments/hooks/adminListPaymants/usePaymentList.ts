import {
  usePaymentsListQuery,
  usePrefetchPaymentsList,
} from '@/features/payments/hooks/adminListPaymants/usePaymentsListQuery';
import {
  UsePaymentsListParams,
  UsePaymentsListResult,
} from '@/features/payments/types/adminListPaymants/listPayments.types';
import { useState } from 'react';

export function usePaymentList({
  eventId,
  accountId,
  initialPage = 1,
  pageSize = 10,
}: UsePaymentsListParams): UsePaymentsListResult {
  const [page, setPage] = useState(initialPage);
  const accountIdValue = accountId ?? '';

  const {
    data,
    isLoading: loading,
    error,
    refetch,
  } = usePaymentsListQuery(eventId, accountIdValue, page, pageSize);

  const { prefetchNextPage } = usePrefetchPaymentsList();

  if (data && page < data.pageCount) {
    prefetchNextPage(eventId, accountIdValue, page, pageSize);
  }

  return {
    summary: data?.summary || {
      totalPayments: 0,
      totalPaidValue: 0,
      totalUnderReviewValue: 0,
      totalRefusedValue: 0,
    },
    payments: data?.payments || [],
    total: data?.total ?? 0,
    page: data?.page ?? page,
    pageCount: data?.pageCount ?? 0,
    loading,
    error: error?.message || null,
    setPage,
    refetch: async () => {
      await refetch();
    },
  };
}
