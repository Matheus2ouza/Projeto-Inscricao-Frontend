import { useState } from "react";
import {
  UseAnalysisPaymentParams,
  UseAnalysisPaymentResult,
} from "../../types/analysisPayment/analysisPayment";
import {
  useAnalysisPaymentQuery,
  usePrefetchAnalysisPaymentQuery,
} from "./analysisPaymentQuery";

export function useAnalysisPayment({
  eventId,
  initialPage = 1,
  pageSize = 8,
}: UseAnalysisPaymentParams): UseAnalysisPaymentResult {
  const [page, setPage] = useState(initialPage);

  const {
    data,
    isLoading: loading,
    isFetching,
    isFetched: fetched,
    error,
    refetch,
  } = useAnalysisPaymentQuery(eventId, page, pageSize);

  const { prefetchNextPage } = usePrefetchAnalysisPaymentQuery();

  if (data && page < data.pageCount) {
    prefetchNextPage(eventId, page, pageSize);
  }

  return {
    event: data?.event ?? undefined,
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
