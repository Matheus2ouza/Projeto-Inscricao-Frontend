import { useQuery } from '@tanstack/react-query';
import { getPublicEvents } from '../../api/publicEvents/getPublicEvents';

export const publicEventsKeys = {
  all: ['public-events'] as const,
  lists: () => [...publicEventsKeys.all, 'list'] as const,
  list: () => [...publicEventsKeys.lists()] as const,
};

export function usePublicEventsQuery() {
  return useQuery({
    queryKey: publicEventsKeys.list(),
    queryFn: getPublicEvents,
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos
    retry: 2,
    refetchOnWindowFocus: false,
  });
}
