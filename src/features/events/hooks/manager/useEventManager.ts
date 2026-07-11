'use client';

import { eventDetailsManagerAction } from '@/features/events/actions/manager/eventDetailsManager/eventDetailsManagerActions';
import type { Event } from '@/features/events/types/manager/eventDetailsManager/eventDetailsManagerTypes';
import { listTypeInscriptionsToManagerAction } from '@/features/typeInscription/actions/listTypeInscriptionsToManager/listTypeInscriptionsToManagerAction';
import type { TypeInscription } from '@/features/typeInscription/types/listTypeInscriptionsToManager/listTypeInscriptionsManagerTypes';
import { useQueries } from '@tanstack/react-query';

interface UseEventManagerDataResult {
  event: Event | null;
  typeInscriptions: TypeInscription[];
  loading: boolean;
  fetching: boolean;
  error: Error | null;
  refresh: () => void;
}

export function useEventManagerData(
  eventId: string,
): UseEventManagerDataResult {
  const results = useQueries({
    queries: [
      {
        queryKey: ['event-details-manager', 'detail', eventId],
        queryFn: () => eventDetailsManagerAction(eventId),
        enabled: !!eventId,
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
        retry: 2,
        refetchOnWindowFocus: false,
      },
      {
        queryKey: ['list-type-inscriptions-to-manager', 'list', eventId],
        queryFn: () => listTypeInscriptionsToManagerAction(eventId),
        enabled: !!eventId,
        staleTime: 10 * 60 * 1000,
        gcTime: 15 * 60 * 1000,
        retry: 2,
        refetchOnWindowFocus: false,
      },
    ],
  });

  const [eventResult, typeInscriptionsResult] = results;

  const isLoading = eventResult.isLoading || typeInscriptionsResult.isLoading;
  const isFetching =
    eventResult.isFetching || typeInscriptionsResult.isFetching;
  const error = eventResult.error || typeInscriptionsResult.error || null;

  const refresh = () => {
    eventResult.refetch();
    typeInscriptionsResult.refetch();
  };

  return {
    event: eventResult.data || null,
    typeInscriptions: typeInscriptionsResult.data || [],
    loading: isLoading,
    fetching: isFetching,
    error,
    refresh,
  };
}
