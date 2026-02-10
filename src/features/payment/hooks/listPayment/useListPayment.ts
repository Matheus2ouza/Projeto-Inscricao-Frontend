import {
  useListPaymentQuery,
  usePrefetchListPaymentQuery,
} from "@/features/payment/hooks/listPayment/useListPaymentQuery";
import {
  UseListPaymentParams,
  UseListPaymentResult,
} from "@/features/payment/types/listPayment/listPaymentTypes";
import { useState } from "react";

export function useListPayment({
  eventId,
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
  } = useListPaymentQuery(eventId, page, pageSize);

  const { prefetchNextPage } = usePrefetchListPaymentQuery();

  if (data && page < data.pageCount) {
    prefetchNextPage(eventId, page, pageSize);
  }

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
