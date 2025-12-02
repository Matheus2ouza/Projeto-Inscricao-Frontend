import { useState } from "react";
import {
  UsePaymentsListParams,
  UsePaymentsListResult,
} from "../types/listPayments.types";
import {
  usePaymentsListQuery,
  usePrefetchPaymentsList,
} from "./usePaymentsListQuery";

export function usePaymentsList({
  eventId,
  initialPage = 1,
  pageSize = 10,
}: UsePaymentsListParams): UsePaymentsListResult {
  const [page, setPage] = useState(initialPage);

  const {
    data,
    isLoading: loading,
    error,
    refetch,
  } = usePaymentsListQuery(eventId, page, pageSize);

  const { prefetchNextPage } = usePrefetchPaymentsList();

  if (data && page < data.pageCount) {
    prefetchNextPage(eventId, page, pageSize);
  }

  return {
    payments: data?.payments || [],
    total: data?.total ?? 0,
    page,
    pageCount: data?.pageCount ?? 0,
    loading,
    error:
      error instanceof Error
        ? error.message
        : typeof error === "string"
          ? error
          : null,
    setPage,
    refetch: async () => {
      await refetch();
    },
  };
}
