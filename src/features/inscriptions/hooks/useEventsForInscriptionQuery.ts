import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { getEventsForInscription } from '../api/getEventsForInscription';
import type { EventsListResponse, StatusEvent } from '../types/listEventsTypes';

export const eventsForInscriptionKeys = {
  all: ['events-for-inscription'] as const,
  lists: () => [...eventsForInscriptionKeys.all, 'list'] as const,
  list: (page: number, pageSize: number, status?: StatusEvent[]) =>
    [...eventsForInscriptionKeys.lists(), { page, pageSize, status }] as const,
};

export function useEventsForInscriptionQuery(
  page: number,
  pageSize: number,
  status?: StatusEvent[],
) {
  return useQuery<EventsListResponse>({
    queryKey: eventsForInscriptionKeys.list(page, pageSize, status),
    queryFn: () => getEventsForInscription({ page, pageSize, status }),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    placeholderData: keepPreviousData,
    refetchOnWindowFocus: false,
  });
}
