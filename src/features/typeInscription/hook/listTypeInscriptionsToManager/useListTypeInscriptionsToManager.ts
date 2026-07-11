'use client';

import type {
  UseListTypeInscriptionsToManagerParams,
  UseListTypeInscriptionsToManagerResult,
} from '@/features/typeInscription/types/listTypeInscriptionsToManager/listTypeInscriptionsManagerTypes';
import { useListTypeInscriptionsToManagerQuery } from './useListTypeInscriptionsToManagerQuery';

export function useListTypeInscriptionsToManager({
  eventId,
}: UseListTypeInscriptionsToManagerParams): UseListTypeInscriptionsToManagerResult {
  const { data, isLoading, isFetching, isFetched, error, refetch } =
    useListTypeInscriptionsToManagerQuery(eventId);

  return {
    typeInscriptions: data || [],
    loading: isLoading,
    fetching: isFetching,
    fetched: isFetched,
    error: error || null,
    refresh: () => {
      refetch();
    },
  };
}
