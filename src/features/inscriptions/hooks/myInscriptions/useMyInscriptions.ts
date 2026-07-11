import { useState } from 'react';
import {
  UseMyInscriptionsParams,
  UseMyInscriptionsResult,
} from '../../types/myInscriptions/myInscriptionsTypes';
import {
  useMyInscriptionsQuery,
  usePrefetchMyInscriptionsQuery,
} from './useMyInscriptionsQuery';

export function useMyInscriptions({
  eventId,
  initialPage = 1,
  pageSize = 10,
  limitTime,
}: UseMyInscriptionsParams): UseMyInscriptionsResult {
  const [page, setPage] = useState(initialPage);

  const {
    data,
    isLoading: loading,
    isFetching,
    isFetched: fetched,
    error,
    refetch,
  } = useMyInscriptionsQuery(eventId, page, pageSize, limitTime);

  const { prefetchNextPage } = usePrefetchMyInscriptionsQuery();

  if (data && page < data.pageCount) {
    prefetchNextPage(eventId, page, pageSize, limitTime);
  }

  return {
    event: data?.event || null,
    inscriptions: data?.event.inscriptions || [],
    total: data?.total || 0,
    page: data?.page || 0,
    pageCount: data?.pageCount || 0,

    loading,
    fetching: isFetching,
    fetched,
    error,

    setPage,
    refresh: async () => {
      await refetch();
    },
  };
}
