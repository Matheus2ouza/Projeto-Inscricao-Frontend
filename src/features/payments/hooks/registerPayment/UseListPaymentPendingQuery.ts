import { ListPaymentsPedingResponse } from '@/features/payments/types/listPaymentsPeding/listPaymentsPedingTypes';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { listPaymentsPedingAction } from '../../actions/listPaymentsPeding/listPaymentsPedingAction';

export const ListPaymentPendingKeys = {
  all: ['listPaymentPending'] as const,
  lists: () => [...ListPaymentPendingKeys.all, 'list'] as const,
  list: (
    eventId: string,
    page: number,
    pageSize: number,
    localityId?: string,
  ) =>
    [
      ...ListPaymentPendingKeys.lists(),
      { eventId, page, pageSize, localityId },
    ] as const,
  details: () => [...ListPaymentPendingKeys.all, 'detail'] as const,
  detail: (id: string) => [...ListPaymentPendingKeys.details(), id] as const,
};

export function UseListPaymentPendingQuery(
  eventId: string,
  page: number = 1,
  pageSize: number = 20,
  localityId?: string,
) {
  return useQuery<ListPaymentsPedingResponse>({
    queryKey: ListPaymentPendingKeys.list(eventId, page, pageSize, localityId),
    queryFn: () =>
      listPaymentsPedingAction(eventId, page, pageSize, localityId),
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos
    retry: 2,
    refetchOnWindowFocus: false,
  });
}

export function useInvalidateListPaymentPendingQuery() {
  const queryClient = useQueryClient();

  return {
    invalidateAll: () => {
      queryClient.invalidateQueries({
        queryKey: ListPaymentPendingKeys.all,
      });
    },

    invalidateLists: () => {
      queryClient.invalidateQueries({
        queryKey: ListPaymentPendingKeys.lists(),
      });
    },

    invalidateDetail: (id: string) => {
      queryClient.invalidateQueries({
        queryKey: ListPaymentPendingKeys.detail(id),
      });
    },
  };
}

// Hook pré-fetch for members
export function usePrefetchListPaymentPendingQuery() {
  const queryClient = useQueryClient();

  return {
    prefetchNextPage: (
      eventId: string,
      page: number,
      pageSize: number,
      localityId?: string,
    ) => {
      queryClient.prefetchQuery({
        queryKey: ListPaymentPendingKeys.list(
          eventId,
          page + 1,
          pageSize,
          localityId,
        ),
        queryFn: () =>
          listPaymentsPedingAction(eventId, page + 1, pageSize, localityId),
        staleTime: 5 * 60 * 1000,
      });
    },
  };
}
