'use client';

import {
  STATUS_EVENT_VALUES,
  UseEventsParams,
  UseEventsResult,
} from '@/features/events/types/listEvents/listEventsToManager/listEventsToManagerTypes';
import { useEffect, useState } from 'react';
import {
  useListEventsToManagerQuery,
  usePrefetchListEventsToManagerQuery,
} from './useListEventsToManagerQuery';

export function useListEventsToManager({
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
  } = useListEventsToManagerQuery(page, pageSize, queryStatuses);

  const { prefetchNextPage } = usePrefetchListEventsToManagerQuery();

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
