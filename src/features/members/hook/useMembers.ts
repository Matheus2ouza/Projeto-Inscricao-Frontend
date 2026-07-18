'use client';

import { useEffect, useState } from 'react';
import { UseMembersParams, UseMembersResult } from '../types/membersType';
import { useMembersQuery, usePrefetchMembersQuery } from './useMembersQuery';

export function useMembers({
  localityId,
  initialPage = 1,
  pageSize = 20,
  autoFetch = true,
}: UseMembersParams): UseMembersResult {
  const [page, setPage] = useState(initialPage);

  const {
    data,
    isLoading: loading,
    error,
    refetch,
  } = useMembersQuery(localityId, page, pageSize, autoFetch);

  const { prefetchNextPage } = usePrefetchMembersQuery();

  useEffect(() => {
    if (data && page < data.pageCount) {
      prefetchNextPage(page, pageSize);
    }
  }, [page, pageSize]);

  return {
    members: data?.members || [],
    total: data?.total || 0,
    page: data?.page || 0,
    pageCount: data?.pageCount || 0,
    loading,
    error,
    setPage,
    refresh: async () => {
      await refetch();
    },
  };
}
