'use client';

import { eventDetailsToGuestInscriptionAction } from '@/features/guest/actions/guestInscription/eventDetailsToGuestInscription';
import { Event } from '@/features/guest/types/guestInscription/eventDetailsToGuestInscriptionTypes';
import { useQuery, useQueryClient } from '@tanstack/react-query';

export const eventDetailsKeys = {
  all: ['event-details'] as const,
  details: () => [...eventDetailsKeys.all, 'detail'] as const,
  detail: (eventId?: string) =>
    [...eventDetailsKeys.details(), eventId] as const,
};

export function useEventDetailsToGuestInscriptionQuery(eventId?: string) {
  return useQuery<Event>({
    queryKey: eventDetailsKeys.detail(eventId),
    queryFn: () => eventDetailsToGuestInscriptionAction(eventId!),
    enabled: !!eventId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 2,
    refetchOnWindowFocus: false,
  });
}

export function useInvalidateEventDetailsToGuestInscriptionQuery() {
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

    invalidateLists: () => {
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

    setDetailData: (eventId: string, data: Event) => {
      queryClient.setQueryData(eventDetailsKeys.detail(eventId), data);
    },
  };
}
