'use client';

import type {
  UseEventDetailsParams,
  UseEventDetailsResult,
} from '@/features/events/types/eventDetails/eventDetailsTypes';
import { useEventDetailsQuery } from './useEventDetailsQuery';

export function useEventDetails({
  eventId,
}: UseEventDetailsParams): UseEventDetailsResult {
  const { data, isLoading, isFetching, isFetched, error, refetch } =
    useEventDetailsQuery(eventId);

  const hasData = Boolean(data);
  const loading = isLoading && !hasData;

  return {
    event: data || null,
    loading,
    fetching: isFetching,
    fetched: isFetched,
    error: error || null,
    refresh: () => {
      refetch();
    },
  };
}
