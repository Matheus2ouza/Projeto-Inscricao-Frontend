'use client';

import { ListEventsToPaymentAction } from '@/features/events/actions/listEvents/listEventsToPayment/listEventsToPaymentAction';
import type { ListEventsToPaymentResponse } from '@/features/events/types/listEvents/listEventsToPayment/listEventsToPaymentTypes';
import { useQuery, useQueryClient } from '@tanstack/react-query';

export const listEventsToPaymentKeys = {
  all: ['list-events-to-payment'] as const,
  lists: () => [...listEventsToPaymentKeys.all, 'list'] as const,
  list: (page: number, pageSize: number, paymentEnabled?: boolean) =>
    [
      ...listEventsToPaymentKeys.lists(),
      { page, pageSize, paymentEnabled },
    ] as const,
};

export function useListEventsToPaymentQuery(
  page: number = 1,
  pageSize: number = 8,
  paymentEnabled?: boolean,
) {
  return useQuery<ListEventsToPaymentResponse>({
    queryKey: listEventsToPaymentKeys.list(page, pageSize, paymentEnabled),
    queryFn: () =>
      ListEventsToPaymentAction({
        page,
        pageSize,
        paymentEnabled,
      }),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 2,
    refetchOnWindowFocus: false,
  });
}

export function useInvalidateListEventsToPaymentQuery() {
  const queryClient = useQueryClient();

  return {
    invalidateAll: () => {
      queryClient.invalidateQueries({
        queryKey: listEventsToPaymentKeys.all,
      });
    },

    invalidateLists: () => {
      queryClient.invalidateQueries({
        queryKey: listEventsToPaymentKeys.lists(),
      });
    },

    invalidateList: (
      page: number,
      pageSize: number,
      paymentEnabled?: boolean,
    ) => {
      queryClient.invalidateQueries({
        queryKey: listEventsToPaymentKeys.list(page, pageSize, paymentEnabled),
      });
    },

    removeAll: () => {
      queryClient.removeQueries({
        queryKey: listEventsToPaymentKeys.all,
      });
    },

    removeLists: () => {
      queryClient.removeQueries({
        queryKey: listEventsToPaymentKeys.lists(),
      });
    },

    removeList: (page: number, pageSize: number, paymentEnabled?: boolean) => {
      queryClient.removeQueries({
        queryKey: listEventsToPaymentKeys.list(page, pageSize, paymentEnabled),
      });
    },

    setListData: (
      page: number,
      pageSize: number,
      paymentEnabled: boolean | undefined,
      data: ListEventsToPaymentResponse,
    ) => {
      queryClient.setQueryData(
        listEventsToPaymentKeys.list(page, pageSize, paymentEnabled),
        data,
      );
    },
  };
}

// Hook para pré-carregar dados
export function usePrefetchListEventsToPaymentQuery() {
  const queryClient = useQueryClient();

  return {
    prefetchNextPage: (
      currentPage: number,
      pageSize: number,
      paymentEnabled?: boolean,
    ) => {
      queryClient.prefetchQuery({
        queryKey: listEventsToPaymentKeys.list(
          currentPage + 1,
          pageSize,
          paymentEnabled,
        ),
        queryFn: () =>
          ListEventsToPaymentAction({
            page: currentPage + 1,
            pageSize,
            paymentEnabled,
          }),
        staleTime: 5 * 60 * 1000,
      });
    },
  };
}
