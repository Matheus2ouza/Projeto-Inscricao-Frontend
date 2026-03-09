import { useListInscritionsQuery } from "@/features/inscriptions/hooks/list-inscriptions/useListInscriptionsQuery";
import {
  ListInscriptionsParams,
  ListInscriptionsResult,
} from "@/features/inscriptions/types/list-inscriptions/listInscriptionsTypes";
import { useState } from "react";

export function useListInscriptions({
  eventId,
  initialPage,
  pageSize,
  status,
  isGuest,
  orderByCreatedAt,
  orderByResponsible,
  limitTime,
  responsible,
}: ListInscriptionsParams): ListInscriptionsResult {
  const [page, setPage] = useState(initialPage);

  const { data, isLoading, isFetching, isFetched, error, refetch } =
    useListInscritionsQuery(
      eventId,
      page,
      pageSize,
      status,
      isGuest,
      orderByCreatedAt,
      orderByResponsible,
      limitTime,
      responsible,
    );

  const hasData = Boolean(data?.event);
  const loading = isLoading && !hasData;

  return {
    event: data?.event || null,
    inscriptions: data?.event?.inscriptions || [],
    total: data?.total || 0,
    page: data?.page || initialPage,
    pageCount: data?.pageCount || 0,
    loading,
    fetching: isFetching,
    fetched: isFetched,
    error: error || null,
    setPage,
    refresh: async () => await refetch(),
  };
}
