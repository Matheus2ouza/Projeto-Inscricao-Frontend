import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getCashRegisterMoviments } from '../../api/cashRegisterDetails/getCashRegisterMoviments';
import {
  CashEntryType,
  GetCashRegisterMovimentsResponse,
} from '../../types/cashRegisterDetails/cashRegisterDetailsType';

export const cashRegisterMovimentsKeys = {
  all: ['cash-register-moviments'] as const,
  lists: () => [...cashRegisterMovimentsKeys.all, 'list'] as const,
  list: (
    cashRegisterId: string,
    page: number,
    pageSize: number,
    type?: CashEntryType[],
    limitTime?: string,
    orderBy?: 'asc' | 'desc',
  ) =>
    [
      ...cashRegisterMovimentsKeys.lists(),
      { cashRegisterId, page, pageSize, type, limitTime, orderBy },
    ] as const,
};

export function useCashRegisterMovimentsQuery(
  cashRegisterId: string,
  page: number = 0,
  pageSize: number = 10,
  type?: CashEntryType[],
  limitTime?: string,
  orderBy?: 'asc' | 'desc',
) {
  return useQuery<GetCashRegisterMovimentsResponse>({
    queryKey: cashRegisterMovimentsKeys.list(
      cashRegisterId,
      page,
      pageSize,
      type,
      limitTime,
      orderBy,
    ),
    queryFn: () =>
      getCashRegisterMoviments(
        cashRegisterId,
        page,
        pageSize,
        type,
        limitTime,
        orderBy,
      ),
    enabled: Boolean(cashRegisterId),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 2,
    refetchOnWindowFocus: false,
  });
}

export function useInvalidateCashRegisterMovimentsQuery() {
  const queryClient = useQueryClient();

  return {
    invalidateAll: () => {
      queryClient.invalidateQueries({
        queryKey: cashRegisterMovimentsKeys.all,
      });
    },
    invalidateLists: () => {
      queryClient.invalidateQueries({
        queryKey: cashRegisterMovimentsKeys.lists(),
      });
    },
    invalidateList: (
      cashRegisterId: string,
      page: number,
      pageSize: number,
      type?: CashEntryType[],
      limitTime?: string,
      orderBy?: 'asc' | 'desc',
    ) => {
      queryClient.invalidateQueries({
        queryKey: cashRegisterMovimentsKeys.list(
          cashRegisterId,
          page,
          pageSize,
          type,
          limitTime,
          orderBy,
        ),
      });
    },

    invalidateListsByCashRegisterId: (cashRegisterId: string) => {
      queryClient.invalidateQueries({
        predicate: (query) => {
          const key = query.queryKey;
          if (!Array.isArray(key)) return false;
          if (key[0] !== cashRegisterMovimentsKeys.all[0]) return false;
          const last = key[key.length - 1];
          return (
            typeof last === 'object' &&
            last !== null &&
            'cashRegisterId' in last &&
            (last as { cashRegisterId?: unknown }).cashRegisterId ===
              cashRegisterId
          );
        },
      });
    },

    removeAll: () => {
      queryClient.removeQueries({
        queryKey: cashRegisterMovimentsKeys.all,
      });
    },

    removeLists: () => {
      queryClient.removeQueries({
        queryKey: cashRegisterMovimentsKeys.lists(),
      });
    },

    removeList: (
      cashRegisterId: string,
      page: number,
      pageSize: number,
      type?: CashEntryType[],
      limitTime?: string,
      orderBy?: 'asc' | 'desc',
    ) => {
      queryClient.removeQueries({
        queryKey: cashRegisterMovimentsKeys.list(
          cashRegisterId,
          page,
          pageSize,
          type,
          limitTime,
          orderBy,
        ),
      });
    },

    removeListsByCashRegisterId: (cashRegisterId: string) => {
      queryClient.removeQueries({
        predicate: (query) => {
          const key = query.queryKey;
          if (!Array.isArray(key)) return false;
          if (key[0] !== cashRegisterMovimentsKeys.all[0]) return false;
          const last = key[key.length - 1];
          return (
            typeof last === 'object' &&
            last !== null &&
            'cashRegisterId' in last &&
            (last as { cashRegisterId?: unknown }).cashRegisterId ===
              cashRegisterId
          );
        },
      });
    },
  };
}

export function usePrefetchCashRegisterMovimentsQuery() {
  const queryClient = useQueryClient();

  return {
    prefetchNextPage: (
      cashRegisterId: string,
      page: number,
      pageSize: number,
      type?: CashEntryType[],
      limitTime?: string,
      orderBy?: 'asc' | 'desc',
    ) => {
      queryClient.prefetchQuery({
        queryKey: cashRegisterMovimentsKeys.list(
          cashRegisterId,
          page + 1,
          pageSize,
          type,
          limitTime,
          orderBy,
        ),
        queryFn: () =>
          getCashRegisterMoviments(
            cashRegisterId,
            page + 1,
            pageSize,
            type,
            limitTime,
            orderBy,
          ),
        staleTime: 5 * 60 * 1000,
      });
    },
  };
}
