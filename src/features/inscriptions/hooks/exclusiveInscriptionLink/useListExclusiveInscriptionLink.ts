import { useState } from 'react';
import {
  ListExclusiveInscriptionLinksParams,
  ListExclusiveInscriptionLinksResult,
} from '../../types/exclusiveInscriptionLink/exclusiveInscriptionLinkTypes';
import { useListExclusiveInscriptionLinkQuery } from './useListExclusiveInscriptionLinkQuery';

export function useListExclusiveInscriptionLink({
  eventId,
  initialPage,
  pageSize,
}: ListExclusiveInscriptionLinksParams): ListExclusiveInscriptionLinksResult {
  const [page, setPage] = useState(initialPage);

  const { data, isLoading, isFetching, isFetched, error, refetch } =
    useListExclusiveInscriptionLinkQuery(page, pageSize, eventId);

  return {
    event: data?.event || null,
    exclusiveInscriptionLinks: data?.exclusiveInscriptionLinks || [],
    total: data?.total || 0,
    page: data?.page || initialPage,
    pageCount: data?.pageCount || 0,
    loading: isLoading,
    fetching: isFetching,
    fetched: isFetched,
    error: error || null,
    setPage,
    refresh: async () => await refetch(),
  };
}
