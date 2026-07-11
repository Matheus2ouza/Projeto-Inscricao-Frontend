// src/features/events/hooks/listEvents/useListEvents.ts
'use client';

import {
  STATUS_EVENT_VALUES,
  UseEventsParams,
  UseEventsResult,
} from '@/features/events/types/listEvents/listEventsTypes';
import { useEffect, useState } from 'react';
import {
  useListEventsQuery,
  usePrefetchListEventsQuery,
} from './useListEventsQuery';

export function useListEvents({
  initialPage = 1,
  pageSize = 8,
  status,
}: UseEventsParams = {}): UseEventsResult {
  const [page, setPage] = useState(initialPage);
  const statusFilter = status?.length ? status : undefined;
  const queryStatuses = statusFilter ?? STATUS_EVENT_VALUES;
  const statusKey = status?.join(',') ?? 'default';

  const {
    data,
    isLoading: loading,
    error,
    refetch,
  } = useListEventsQuery(page, pageSize, queryStatuses);

  const { prefetchNextPage } = usePrefetchListEventsQuery();

  useEffect(() => {
    setPage(initialPage);
  }, [initialPage, statusKey]);

  useEffect(() => {
    if (data && page < data.pageCount) {
      prefetchNextPage(page, pageSize, queryStatuses);
    }
  }, [data, page, pageSize, queryStatuses, prefetchNextPage]);

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
