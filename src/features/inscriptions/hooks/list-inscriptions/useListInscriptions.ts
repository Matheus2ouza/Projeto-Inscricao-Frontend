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
  orderBy,
  limitTime,
}: ListInscriptionsParams): ListInscriptionsResult {
  const [page, setPage] = useState(initialPage);

  const { data, isLoading, error, refetch } = useListInscritionsQuery(
    eventId,
    page,
    pageSize,
    status,
    isGuest,
    orderBy,
    limitTime,
  );

  return {
    event: data?.event || null,
    inscriptions: data?.event?.inscriptions || [],
    total: data?.total || 0,
    page: data?.page || initialPage,
    pageCount: data?.pageCount || 0,
    loading: isLoading,
    fetching: isLoading,
    fetched: !isLoading,
    error: error || null,
    setPage,
    refresh: async () => await refetch(),
  };
}
