import { useState } from "react";
import {
  UseListReceiptsParams,
  UseListReceiptsResult,
} from "../../types/list-receipts/listReceipts";
import { useListReceiptsQuery } from "./useListReceiptsQuery";

export function useListReceipts({
  eventId,
  initialPage = 1,
  pageSize = 10,
}: UseListReceiptsParams): UseListReceiptsResult {
  const [page, setPage] = useState(initialPage);

  const { data, isLoading, isFetching, isFetched, error, refetch } =
    useListReceiptsQuery(eventId, page, pageSize);

  return {
    receipts: data?.receipts || [],
    total: data?.total || 0,
    page: data?.page || 0,
    pageCount: data?.pageCount || 0,
    loading: isLoading,
    fetching: isFetching,
    fetched: isFetched,
    error: error || null,
    setPage,
    refresh: async () => await refetch(),
  };
}
