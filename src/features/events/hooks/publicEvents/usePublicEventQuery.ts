'use client';

import { publicEventAction } from '@/features/events/actions/publicEvents/publicEvent';
import type { Event } from '@/features/events/types/publicEvents/publicEventsTypes';
import { useQuery } from '@tanstack/react-query';

export const publicEventKeys = {
  all: ['public-event'] as const,
  detail: (slug: string) => [...publicEventKeys.all, slug] as const,
};

export function usePublicEventQuery(slug: string) {
  return useQuery<Event>({
    queryKey: publicEventKeys.detail(slug),
    queryFn: () => publicEventAction(slug),
    enabled: !!slug,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 2,
    refetchOnWindowFocus: false,
  });
}
