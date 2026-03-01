import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getCashRegister } from "../../api/cashRegisterDetails/getCashRegister";
import { GetCashRegisterResponse } from "../../types/cashRegisterDetails/cashRegisterDetailsType";

export const cashRegisterDetailsKeys = {
  all: ["cash-register-details"] as const,
  details: () => [...cashRegisterDetailsKeys.all, "detail"] as const,
  detail: (cashRegisterId: string) =>
    [...cashRegisterDetailsKeys.details(), cashRegisterId] as const,
};

export function useCashRegisterDetailsQuery(cashRegisterId: string) {
  return useQuery<GetCashRegisterResponse>({
    queryKey: cashRegisterDetailsKeys.detail(cashRegisterId),
    queryFn: () => getCashRegister(cashRegisterId),
    enabled: Boolean(cashRegisterId),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
}

export function useInvalidateCashRegisterDetailsQuery() {
  const queryClient = useQueryClient();

  return {
    invalidateAll: () => {
      queryClient.invalidateQueries({
        queryKey: cashRegisterDetailsKeys.all,
      });
    },
    invalidateDetails: () => {
      queryClient.invalidateQueries({
        queryKey: cashRegisterDetailsKeys.details(),
      });
    },
    invalidateDetail: (cashRegisterId: string) => {
      queryClient.invalidateQueries({
        queryKey: cashRegisterDetailsKeys.detail(cashRegisterId),
      });
    },
    removeAll: () => {
      queryClient.removeQueries({
        queryKey: cashRegisterDetailsKeys.all,
      });
    },
    removeDetails: () => {
      queryClient.removeQueries({
        queryKey: cashRegisterDetailsKeys.details(),
      });
    },
    removeDetail: (cashRegisterId: string) => {
      queryClient.removeQueries({
        queryKey: cashRegisterDetailsKeys.detail(cashRegisterId),
      });
    },
  };
}
