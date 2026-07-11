'use client';

import { eventDetailsManagerAction } from '@/features/events/actions/manager/eventDetailsManager/eventDetailsManagerActions';
import type { EventDetailsManagerResponse } from '@/features/events/types/manager/eventDetailsManager/eventDetailsManagerTypes';
import { useQuery, useQueryClient } from '@tanstack/react-query';

export const eventDetailsManagerKeys = {
  all: ['event-details-manager'] as const,
  details: () => [...eventDetailsManagerKeys.all, 'detail'] as const,
  detail: (eventId?: string) =>
    [...eventDetailsManagerKeys.details(), eventId] as const,
};

export function useEventDetailsManagerQuery(eventId?: string) {
  return useQuery<EventDetailsManagerResponse>({
    queryKey: eventDetailsManagerKeys.detail(eventId),
    queryFn: () => eventDetailsManagerAction(eventId!),
    enabled: !!eventId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 2,
    refetchOnWindowFocus: false,
  });
}

export function useInvalidateEventDetailsManagerQuery() {
  const queryClient = useQueryClient();

  return {
    invalidateAll: () => {
      queryClient.invalidateQueries({
        queryKey: eventDetailsManagerKeys.all,
      });
    },

    invalidateDetails: () => {
      queryClient.invalidateQueries({
        queryKey: eventDetailsManagerKeys.details(),
      });
    },

    invalidateLists: () => {
      queryClient.invalidateQueries({
        queryKey: eventDetailsManagerKeys.details(),
      });
    },

    invalidateDetail: (eventId: string) => {
      queryClient.invalidateQueries({
        queryKey: eventDetailsManagerKeys.detail(eventId),
      });
    },

    removeAll: () => {
      queryClient.removeQueries({
        queryKey: eventDetailsManagerKeys.all,
      });
    },

    removeDetails: () => {
      queryClient.removeQueries({
        queryKey: eventDetailsManagerKeys.details(),
      });
    },

    removeDetail: (eventId: string) => {
      queryClient.removeQueries({
        queryKey: eventDetailsManagerKeys.detail(eventId),
      });
    },

    setDetailData: (eventId: string, data: EventDetailsManagerResponse) => {
      queryClient.setQueryData(eventDetailsManagerKeys.detail(eventId), data);
    },
  };
}
