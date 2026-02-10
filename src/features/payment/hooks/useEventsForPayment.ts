"use client";

import { useEffect, useState } from "react";
import {
  type UseEventsForPaymentParams,
  type UseEventsForPaymentResult,
} from "../types/listEventsTypes";
import {
  useEventsForPaymentPrefetch,
  useEventsForPaymentQuery,
} from "./useEventsForPaymentQuery";

export function useEventsForPayment({
  initialPage = 1,
  pageSize = 8,
  paymentEnabled,
}: UseEventsForPaymentParams = {}): UseEventsForPaymentResult {
  const [page, setPage] = useState(initialPage);
  const paymentEnabledValue =
    paymentEnabled?.length === 1 ? paymentEnabled[0] : undefined;
  const paymentEnabledKey = paymentEnabled?.length
    ? [...paymentEnabled].sort((a, b) => Number(a) - Number(b)).join(",")
    : "default";
  const { data, isLoading, isFetching, error, refetch } =
    useEventsForPaymentQuery(page, pageSize, paymentEnabledValue);

  const { prefetchNextPage } = useEventsForPaymentPrefetch();

  useEffect(() => {
    setPage(initialPage);
  }, [initialPage, paymentEnabledKey]);

  if (data && page < data.pageCount) {
    prefetchNextPage(page, pageSize, paymentEnabledValue);
  }

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
