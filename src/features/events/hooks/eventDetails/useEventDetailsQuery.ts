'use client';

import { getEventDetailsAction } from '@/features/events/actions/eventDetails/eventDetailsActions';
import type { FindEventDetailsResponse } from '@/features/events/types/eventDetails/eventDetailsTypes';
import { useQuery, useQueryClient } from '@tanstack/react-query';

export const eventDetailsKeys = {
  all: ['event-details'] as const,
  details: () => [...eventDetailsKeys.all, 'detail'] as const,
  detail: (eventId?: string) =>
    [...eventDetailsKeys.details(), eventId] as const,
};

export function useEventDetailsQuery(eventId?: string) {
  return useQuery<FindEventDetailsResponse>({
    queryKey: eventDetailsKeys.detail(eventId),
    queryFn: () => getEventDetailsAction(eventId),
    enabled: !!eventId,
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos
    retry: 2,
    refetchOnWindowFocus: false,
  });
}

export function useInvalidateEventDetailsQuery() {
  const queryClient = useQueryClient();

  return {
    invalidateAll: () => {
      queryClient.invalidateQueries({
        queryKey: eventDetailsKeys.all,
      });
    },

    invalidateDetails: () => {
      queryClient.invalidateQueries({
        queryKey: eventDetailsKeys.details(),
      });
    },

    invalidateDetail: (eventId: string) => {
      queryClient.invalidateQueries({
        queryKey: eventDetailsKeys.detail(eventId),
      });
    },

    removeAll: () => {
      queryClient.removeQueries({
        queryKey: eventDetailsKeys.all,
      });
    },

    removeDetails: () => {
      queryClient.removeQueries({
        queryKey: eventDetailsKeys.details(),
      });
    },

    removeDetail: (eventId: string) => {
      queryClient.removeQueries({
        queryKey: eventDetailsKeys.detail(eventId),
      });
    },

    setDetailData: (eventId: string, data: FindEventDetailsResponse) => {
      queryClient.setQueryData(eventDetailsKeys.detail(eventId), data);
    },
  };
}
