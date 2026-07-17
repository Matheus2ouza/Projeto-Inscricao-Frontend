import { useState } from 'react';
import { UseEventsParams, UseEventsResult } from '../types/eventTypes';
import {
  useAnalysisEventsQuery,
  usePrefetchAnalysisEvents,
} from './useAnalysisEventsQuery';

export function useEventsForAnalysis({
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
  } = useAnalysisEventsQuery(page, pageSize);

  // Pré-carregar próxima página
  const { prefetchNextPage } = usePrefetchAnalysisEvents();

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
