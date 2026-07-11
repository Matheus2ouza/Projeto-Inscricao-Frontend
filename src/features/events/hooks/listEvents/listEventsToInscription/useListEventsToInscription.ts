'use client';

import type {
  UseListEventsToInscriptionParams,
  UseListEventsToInscriptionResult,
} from '@/features/events/types/listEvents/listEventsToInscription/listEventsToInscriptionTypes';
import { useEffect, useState } from 'react';
import {
  useListEventsToInscriptionQuery,
  usePrefetchListEventsToInscriptionQuery,
} from './useListEventsToInscriptionQuery';

export function useListEventsToInscription({
  initialPage = 1,
  pageSize = 8,
  status,
}: UseListEventsToInscriptionParams = {}): UseListEventsToInscriptionResult {
  const [page, setPage] = useState(initialPage);

  const { data, isLoading, isFetching, isFetched, error, refetch } =
    useListEventsToInscriptionQuery(page, pageSize, status);

  const { prefetchNextPage } = usePrefetchListEventsToInscriptionQuery();

  const hasData = Boolean(data?.events?.length);
  const loading = isLoading && !hasData;

  useEffect(() => {
    setPage(initialPage);
  }, [initialPage]);

  useEffect(() => {
    if (data && page < data.pageCount) {
      prefetchNextPage(page, pageSize, status);
    }
  }, [data, page, pageSize, status, prefetchNextPage]);

  return {
    events: data?.events || [],
    total: data?.total || 0,
    page: data?.page || initialPage,
    pageCount: data?.pageCount || 0,
    loading,
    fetching: isFetching,
    fetched: isFetched,
    error: error || null,
    setPage,
    refresh: () => {
      refetch();
    },
  };
}
