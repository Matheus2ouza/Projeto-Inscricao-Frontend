import { useState } from "react";
import { FindAllWithPaymentsOutput } from "../types/eventsForPayments.types";
import {
  useEventsWithPaymentsQuery,
  usePrefetchEventsWithPaymentsQuery,
} from "./useEventsWithPaymentsQuery";

export type UseEventsWithPaymentsParams = {
  initialPage?: number;
  pageSize?: number;
};

export type UseEventsWithPaymentsResult = {
  events: FindAllWithPaymentsOutput["events"];
  total: number;
  page: number;
  pageCount: number;
  loading: boolean;
  error: string | null;
  setPage: (page: number) => void;
  refetch: () => Promise<void>;
};

export function useEventsWithPaymentsAll({
  initialPage = 1,
  pageSize = 8,
}: UseEventsWithPaymentsParams = {}): UseEventsWithPaymentsResult {
  const [page, setPage] = useState(initialPage);

  const { data, isLoading: loading, error, refetch } =
    useEventsWithPaymentsQuery(page, pageSize, ["OPEN", "CLOSE", "FINALIZED"]);

  const { prefetchNextPage } = usePrefetchEventsWithPaymentsQuery();

  if (data && page < data.pageCount) {
    prefetchNextPage(page, pageSize);
  }

  return {
    events: data?.events || [],
    total: data?.total || 0,
    page,
    pageCount: data?.pageCount || 0,
    loading,
    error: error?.message || null,
    setPage,
    refetch: async () => {
      await refetch();
    },
  };
}
