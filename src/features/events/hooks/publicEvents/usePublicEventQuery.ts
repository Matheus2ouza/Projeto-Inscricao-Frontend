'use client';

import { getPublicEvent } from '@/features/events/api/publicEvents/getPublicEvent';
import type { Event } from '@/features/events/types/publicEvents/publicEventsTypes';
import { useQuery } from '@tanstack/react-query';

export const publicEventKeys = {
  all: ['public-event'] as const,
  detail: (eventId: string) => [...publicEventKeys.all, eventId] as const,
};

export function usePublicEventQuery(eventId: string) {
  return useQuery<Event>({
    queryKey: publicEventKeys.detail(eventId),
    queryFn: () => getPublicEvent(eventId),
    enabled: !!eventId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 2,
    refetchOnWindowFocus: false,
  });
}
