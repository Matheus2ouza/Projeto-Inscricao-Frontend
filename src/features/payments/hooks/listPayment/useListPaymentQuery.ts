import { ListPaymentsResponse } from '@/features/payments/types/listPayments/listPaymentsTypes';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { listPaymentsAction } from '../../actions/listPayments/listPaymentsAction';

export const ListPaymentKey = {
  all: ['listPayment'] as const,
  lists: () => [...ListPaymentKey.all, 'list'] as const,
  list: (
    page: number,
    pageSize: number,
    eventId?: string,
    localityId?: string,
  ) =>
    [
      ...ListPaymentKey.lists(),
      { eventId, page, pageSize, localityId },
    ] as const,
  details: () => [...ListPaymentKey.all, 'detail'] as const,
  detail: (id: string) => [...ListPaymentKey.details(), id] as const,
};

export function useListPaymentQuery(
  page: number = 0,
  pageSize: number = 10,
  eventId?: string,
  localityId?: string,
) {
  return useQuery<ListPaymentsResponse>({
    queryKey: ListPaymentKey.list(page, pageSize, eventId, localityId),
    queryFn: () => listPaymentsAction(page, pageSize, eventId, localityId),
    enabled: !!eventId,
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
    prefetchNextPage: (
      page: number,
      pageSize: number,
      eventId?: string,
      localityId?: string,
    ) => {
      queryClient.prefetchQuery({
        queryKey: ListPaymentKey.list(page + 1, pageSize, eventId, localityId),
        queryFn: () =>
          listPaymentsAction(page + 1, pageSize, eventId, localityId),
        staleTime: 5 * 60 * 1000,
      });
    },
  };
}
