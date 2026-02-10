import { getPaymentsList } from "@/features/payment/api/adminListPaymants/getPaymentsList";
import { ListAllPaymentsResponse } from "@/features/payment/types/adminListPaymants/listPayments.types";
import { useQuery, useQueryClient } from "@tanstack/react-query";

export const paymentsListKeys = {
  all: ["payments-list"] as const,
  lists: () => [...paymentsListKeys.all, "list"] as const,
  list: (eventId: string, accountId: string, page: number, pageSize: number) =>
    [
      ...paymentsListKeys.lists(),
      { eventId, accountId, page, pageSize },
    ] as const,
  details: () => [...paymentsListKeys.all, "detail"] as const,
  detail: (id: string) => [...paymentsListKeys.details(), id] as const,
};

export function usePaymentsListQuery(
  eventId: string,
  accountId: string,
  page: number = 1,
  pageSize: number = 10,
) {
  return useQuery<ListAllPaymentsResponse>({
    queryKey: paymentsListKeys.list(eventId, accountId, page, pageSize),
    queryFn: () => getPaymentsList({ eventId, accountId, page, pageSize }),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 2,
    refetchOnWindowFocus: false,
    enabled: !!eventId,
  });
}

export function useInvalidatePaymentsList() {
  const queryClient = useQueryClient();

  return {
    invalidateAll: () =>
      queryClient.invalidateQueries({
        queryKey: paymentsListKeys.all,
      }),
    invalidateList: (eventId: string, accountId: string) =>
      queryClient.invalidateQueries({
        queryKey: paymentsListKeys.list(eventId, accountId, 1, 10),
      }),
    invalidateDetail: (id: string) =>
      queryClient.invalidateQueries({
        queryKey: paymentsListKeys.detail(id),
      }),
  };
}

export function usePrefetchPaymentsList() {
  const queryClient = useQueryClient();

  return {
    prefetchNextPage: (
      eventId: string,
      accountId: string,
      currentPage: number,
      pageSize: number,
    ) => {
      if (!eventId) return;

      queryClient.prefetchQuery({
        queryKey: paymentsListKeys.list(
          eventId,
          accountId,
          currentPage + 1,
          pageSize,
        ),
        queryFn: () =>
          getPaymentsList({
            eventId,
            accountId,
            page: currentPage + 1,
            pageSize,
          }),
        staleTime: 5 * 60 * 1000,
      });
    },
  };
}
