'use client';

import { paymentsDatesAction } from '@/features/home/actions/admin/paymentsDatesActions';
import { eventsDatesAction } from '@/features/home/actions/eventsDatesActions';
import { PaymentsDates } from '@/features/home/types/admin/paymentsDatesTypes';
import { EventsDates } from '@/features/home/types/eventsDatesTypes';
import { useQuery, useQueryClient } from '@tanstack/react-query';

export const datesKeys = {
  all: ['dates'] as const,
  list: () => [...datesKeys.all, 'list'] as const,
};

type DatesData = {
  events: EventsDates[];
  payments: PaymentsDates[];
};

export function useDatesQuery() {
  return useQuery<DatesData>({
    queryKey: datesKeys.list(),
    queryFn: async () => {
      const [eventsResult, paymentsResult] = await Promise.allSettled([
        eventsDatesAction(),
        paymentsDatesAction(),
      ]);

      return {
        events:
          eventsResult.status === 'fulfilled' ? eventsResult.value.events : [],
        payments:
          paymentsResult.status === 'fulfilled' ? paymentsResult.value : [],
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

    setListData: (data: { events: any[]; payments: any[] }) => {
      queryClient.setQueryData(datesKeys.list(), data);
    },
  };
}
