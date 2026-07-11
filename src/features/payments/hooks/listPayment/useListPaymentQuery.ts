import { ListPaymentsResponse } from '@/features/payments/types/listPayments/listPaymentsTypes';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { listPaymentsAction } from '../../actions/listPayments/listPaymentsAction';

export const ListPaymentKey = {
  all: ['listPayment'] as const,
  lists: () => [...ListPaymentKey.all, 'list'] as const,
  list: (eventId: string, page: number, pageSize: number) =>
    [...ListPaymentKey.lists(), { eventId, page, pageSize }] as const,
  details: () => [...ListPaymentKey.all, 'detail'] as const,
  detail: (id: string) => [...ListPaymentKey.details(), id] as const,
};

export function useListPaymentQuery(
  eventId: string,
  page: number = 0,
  pageSize: number = 10,
) {
  return useQuery<ListPaymentsResponse>({
    queryKey: ListPaymentKey.list(eventId, page, pageSize),
    queryFn: () => listPaymentsAction(eventId, page, pageSize),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 2,
    refetchOnWindowFocus: false,
  });
}

export function useInvalidateListPaymentQuery() {
  const queryClient = useQueryClient();

  return {
    invalidateAll: () => {
      queryClient.invalidateQueries({
        queryKey: ListPaymentKey.all,
      });
    },

    invalidateLists: () => {
      queryClient.invalidateQueries({
        queryKey: ListPaymentKey.lists(),
      });
    },

    invalidateDetail: (id: string) => {
      queryClient.invalidateQueries({
        queryKey: ListPaymentKey.detail(id),
      });
    },
  };
}

// Hook pré-fetch for members
export function usePrefetchListPaymentQuery() {
  const queryClient = useQueryClient();

  return {
    prefetchNextPage: (eventId: string, page: number, pageSize: number) => {
      queryClient.prefetchQuery({
        queryKey: ListPaymentKey.list(eventId, page + 1, pageSize),
        queryFn: () => listPaymentsAction(eventId, page + 1, pageSize),
        staleTime: 5 * 60 * 1000,
      });
    },
  };
}
