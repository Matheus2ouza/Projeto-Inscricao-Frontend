import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getPaymentsList } from "../api/getPaymentsList";
import { ListAllPaymentsResponse } from "../types/listPayments.types";

export const paymentsListKeys = {
  all: ["payments-list"] as const,
  lists: () => [...paymentsListKeys.all, "list"] as const,
  list: (eventId: string, page: number, pageSize: number) =>
    [...paymentsListKeys.lists(), eventId, { page, pageSize }] as const,
  details: () => [...paymentsListKeys.all, "detail"] as const,
  detail: (id: string) => [...paymentsListKeys.details(), id] as const,
};

export function usePaymentsListQuery(
  eventId: string,
  page: number = 1,
  pageSize: number = 10,
) {
  return useQuery<ListAllPaymentsResponse>({
    queryKey: paymentsListKeys.list(eventId, page, pageSize),
    queryFn: () => getPaymentsList(eventId, page, pageSize),
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
    invalidateList: (eventId: string) =>
      queryClient.invalidateQueries({
        queryKey: paymentsListKeys.list(eventId, 1, 10),
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
      currentPage: number,
      pageSize: number,
    ) => {
      if (!eventId) return;

      queryClient.prefetchQuery({
        queryKey: paymentsListKeys.list(eventId, currentPage + 1, pageSize),
        queryFn: () => getPaymentsList(eventId, currentPage + 1, pageSize),
        staleTime: 5 * 60 * 1000,
      });
    },
  };
}
