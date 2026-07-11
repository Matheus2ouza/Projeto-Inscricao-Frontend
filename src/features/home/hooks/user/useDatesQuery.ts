'use client';

import { eventsDatesAction } from '@/features/home/actions/eventsDatesActions';
import type { EventsDates } from '@/features/home/types/eventsDatesTypes';
import { useQuery, useQueryClient } from '@tanstack/react-query';

export const datesKeys = {
  all: ['dates'] as const,
  list: () => [...datesKeys.all, 'list'] as const,
};

type DatesData = {
  events: EventsDates[];
};

export function useDatesQuery() {
  return useQuery<DatesData>({
    queryKey: datesKeys.list(),
    queryFn: async () => {
      const eventsResult = await eventsDatesAction();

      return {
        events: eventsResult.events || [],
      };
    },
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
}

export function useInvalidateDatesQuery() {
  const queryClient = useQueryClient();

  return {
    invalidateAll: () => {
      queryClient.invalidateQueries({
        queryKey: datesKeys.all,
      });
    },

    invalidateList: () => {
      queryClient.invalidateQueries({
        queryKey: datesKeys.list(),
      });
    },

    removeAll: () => {
      queryClient.removeQueries({
        queryKey: datesKeys.all,
      });
    },

    removeList: () => {
      queryClient.removeQueries({
        queryKey: datesKeys.list(),
      });
    },

    setListData: (data: DatesData) => {
      queryClient.setQueryData(datesKeys.list(), data);
    },
  };
}
