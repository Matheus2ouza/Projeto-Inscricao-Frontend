import { useState } from "react";
import {
  UseInscriptionsInAnalisisParams,
  UseInscriptionsInAnalisisResult,
} from "../../types/registerPayment/registerPaymentTypes";
import {
  UseInscriptionsInAnalisisQuery,
  usePrefetchInscriptionsInAnalisisQuery,
} from "./UseInscriptionsInAnalisisQuery";

export function useInscriptionsInAnalysis({
  eventId,
  initialPage = 1,
  pageSize = 20,
}: UseInscriptionsInAnalisisParams): UseInscriptionsInAnalisisResult {
  const [page, setPage] = useState(initialPage);

  const {
    data,
    isLoading: loading,
    error,
    refetch,
  } = UseInscriptionsInAnalisisQuery(eventId, page, pageSize);

  const { prefetchNextPage } = usePrefetchInscriptionsInAnalisisQuery();

  if (data && page < data.pageCount) {
    prefetchNextPage(eventId, page, pageSize);
  }

  return {
    inscriptions: data?.inscriptions || [],
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
