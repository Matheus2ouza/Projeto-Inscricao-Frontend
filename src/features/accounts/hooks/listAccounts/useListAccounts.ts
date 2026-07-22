'use client';

import {
  UseListAccountsParam,
  UseListAccountsResult,
} from '@/features/accounts/types/listAccounts/listAccountsTypes';
import { useEffect, useState } from 'react';
import {
  useListAccountsQuery,
  usePrefetchListAccountsQuery,
} from './useListAccountsQuery';

export function useListAccounts({
  initialPage = 1,
  pageSize = 20,
}: UseListAccountsParam): UseListAccountsResult {
  const [page, setPage] = useState(initialPage);

  const { data, isLoading, isFetched, refetch, error } = useListAccountsQuery(
    page,
    pageSize,
  );

  const { prefetchNextPage } = usePrefetchListAccountsQuery();

  useEffect(() => {
    if (data && page < data.pageCount) {
      prefetchNextPage(page, pageSize);
    }
  }, [page, pageSize]);

  return {
    accounts: data?.users || [],
    total: data?.total || 0,
    page,
    pageCount: data?.pageCount || 0,
    loading: isLoading,
    error: error,
    setPage,
    refetch: async () => {
      await refetch();
    },
  };
}
