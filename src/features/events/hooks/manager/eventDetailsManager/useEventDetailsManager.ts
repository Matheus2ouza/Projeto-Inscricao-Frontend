'use client';

import type {
  UseEventDetailsManagerParams,
  UseEventDetailsManagerResult,
} from '@/features/events/types/manager/eventDetailsManager/eventDetailsManagerTypes';
import { useEventDetailsManagerQuery } from './useEventDetailsManagerQuery';

export function useEventDetailsManager({
  eventId,
}: UseEventDetailsManagerParams): UseEventDetailsManagerResult {
  const { data, isLoading, isFetching, isFetched, error, refetch } =
    useEventDetailsManagerQuery(eventId);

  return {
    event: data || null,
    loading: isLoading,
    fetching: isFetching,
    fetched: isFetched,
    error: error || null,
    refresh: () => {
      refetch();
    },
  };
}
