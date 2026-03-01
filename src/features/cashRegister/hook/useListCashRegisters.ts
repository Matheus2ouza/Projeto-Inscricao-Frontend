import { useListCashRegistersResult } from "../types/listCashRegisters";
import { useListCashRegistersQuery } from "./useListCashRegistersQuery";

export function useListCashRegisters(): useListCashRegistersResult {
  const { data, isLoading, error, refetch } = useListCashRegistersQuery();

  return {
    cashRegisters: data ?? null,
    loading: isLoading,
    error: error?.message ?? null,
    refetch: async () => {
      await refetch();
    },
  };
}
