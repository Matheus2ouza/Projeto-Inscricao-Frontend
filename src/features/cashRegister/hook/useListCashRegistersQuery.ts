import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getListCashRegisters } from "../api/getListCashRegisters";
import { listCashRegistersResponse } from "../types/listCashRegisters";

export const listCashRegistersKeys = {
  all: ["list-cash-registers"] as const,
  lists: () => [...listCashRegistersKeys.all, "list"] as const,
};

export function useListCashRegistersQuery() {
  return useQuery<listCashRegistersResponse>({
    queryKey: listCashRegistersKeys.lists(),
    queryFn: () => getListCashRegisters(),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
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
