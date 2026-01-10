import { useState } from "react";
import {
  UseEventsParams,
  UseEventsResult,
} from "../../events/types/checkout/checkoutTypes";
import {
  useParticipantsEventsQuery,
  usePrefetchParticipantsEvents,
} from "./useParticipantsEventsQuery";

export function useEventsForParticipants({
  initialPage = 1,
  pageSize = 8,
}: UseEventsParams = {}): UseEventsResult {
  const [page, setPage] = useState(initialPage);

  // Usar React Query para buscar eventos
  const {
    data,
    isLoading: loading,
    error,
    refetch,
  } = useParticipantsEventsQuery(page, pageSize);

  // Pré-carregar próxima página
  const { prefetchNextPage } = usePrefetchParticipantsEvents();

  // Pré-carregar próxima página quando dados carregam
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
