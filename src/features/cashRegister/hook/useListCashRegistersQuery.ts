import {
  keepPreviousData,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { getListCashRegisters } from "../api/getListCashRegisters";
import {
  CashRegisterStatus,
  ListCashRegistersResponse,
} from "../types/listCashRegisters";

export const listCashRegistersKeys = {
  all: ["list-cash-registers"] as const,
  lists: () => [...listCashRegistersKeys.all, "list"] as const,
  list: (page?: number, pageSize?: number, status?: CashRegisterStatus[]) =>
    [...listCashRegistersKeys.lists(), { page, pageSize, status }] as const,
};

export function useListCashRegistersQuery(
  status?: CashRegisterStatus[],
  page?: number,
  pageSize?: number,
) {
  return useQuery<ListCashRegistersResponse>({
    queryKey: listCashRegistersKeys.list(page, pageSize, status),
    queryFn: () => getListCashRegisters(status, page, pageSize),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    placeholderData: keepPreviousData,
    refetchOnWindowFocus: false,
  });
}

export function useInvalidateListCashRegistersQuery() {
  const queryClient = useQueryClient();

  return {
    invalidateAll: () => {
      queryClient.invalidateQueries({
        queryKey: listCashRegistersKeys.all,
      });
    },
    invalidateLists: () => {
      queryClient.invalidateQueries({
        queryKey: listCashRegistersKeys.lists(),
      });
    },
    removeAll: () => {
      queryClient.removeQueries({
        queryKey: listCashRegistersKeys.all,
      });
    },
    removeLists: () => {
      queryClient.removeQueries({
        queryKey: listCashRegistersKeys.lists(),
      });
    },
  };
}
