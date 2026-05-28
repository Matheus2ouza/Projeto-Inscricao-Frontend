'use client';

import { useState } from 'react';
import type {
  UseEventsForInscriptionParams,
  UseEventsForInscriptionResult,
} from '../types/listEventsTypes';
import { useEventsForInscriptionQuery } from './useEventsForInscriptionQuery';

export function useEventsForInscription({
  initialPage = 1,
  pageSize = 8,
  status,
}: UseEventsForInscriptionParams = {}): UseEventsForInscriptionResult {
  const [page, setPage] = useState(initialPage);
  const {
    data,
    isLoading,
    isFetching,
    error,
    refetch: queryRefetch,
  } = useEventsForInscriptionQuery(page, pageSize, status);

  return {
    events: data?.events ?? [],
    total: data?.total ?? 0,
    page,
    pageCount: data?.pageCount ?? 0,
    loading: isLoading || isFetching,
    error: error?.message || null,
    setPage,
    refetch: async () => {
      await queryRefetch();
    },
  };
}
