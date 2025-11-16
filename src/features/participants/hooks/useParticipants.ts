import { useState } from "react";
import { UseParticipantsParams, UseParticipantsResult } from "../types/participantsTypes";
import {
  useParticipantsQuery,
  usePrefetchParticipants,
} from "./useParticipantsQuery";

export function useParticipants({
  eventId,
  initialPage = 1,
  pageSize = 10,
}: UseParticipantsParams): UseParticipantsResult {
  const [page, setPage] = useState(initialPage);

  // Usar React Query para buscar participantes
  const {
    data,
    isLoading: loading,
    error,
    refetch,
  } = useParticipantsQuery(eventId, page, pageSize);

  // Pré-carregar próxima página
  const { prefetchNextPage } = usePrefetchParticipants();

  // Pré-carregar próxima página quando dados carregam
  if (data && page < data.pageCount) {
    prefetchNextPage(eventId, page, pageSize);
  }

  return {
    accounts: data?.account || [],
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
