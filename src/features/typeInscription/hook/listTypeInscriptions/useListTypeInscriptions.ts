'use client';

import type {
  UseListTypeInscriptionsParams,
  UseListTypeInscriptionsResult,
} from '@/features/typeInscription/types/listTypeInscriptions/listTypeInscriptionsTypes';
import { useListTypeInscriptionsQuery } from './useListTypeInscriptionsQuery';

export function useListTypeInscriptions({
  eventId,
}: UseListTypeInscriptionsParams): UseListTypeInscriptionsResult {
  const { data, isLoading, isFetching, isFetched, error, refetch } =
    useListTypeInscriptionsQuery(eventId);

  const hasData = Boolean(data?.length);
  const loading = isLoading && !hasData;

  return {
    typeInscriptions: data || [],
    loading,
    fetching: isFetching,
    fetched: isFetched,
    error: error || null,
    refresh: () => {
      refetch();
    },
  };
}
