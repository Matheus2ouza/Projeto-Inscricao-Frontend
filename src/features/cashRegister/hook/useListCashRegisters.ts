import { useState } from "react";
import {
  ListCashRegistersParams,
  UseListCashRegistersResult,
} from "../types/listCashRegisters";
import { useListCashRegistersQuery } from "./useListCashRegistersQuery";

export function useListCashRegisters({
  status,
  initialPage = 1,
  pageSize = 8,
}: ListCashRegistersParams = {}): UseListCashRegistersResult {
  const [page, setPage] = useState(initialPage);
  const {
    data,
    isLoading,
    isFetching,
    error,
    refetch: queryRefetch,
  } = useListCashRegistersQuery(status, page, pageSize);

  return {
    cashRegisters: data?.cashRegisters ?? [],
    total: data?.total ?? 0,
    page,
    pageCount: data?.pageCount ?? 0,
    loading: isLoading || isFetching,
    error: error?.message || null,
    setPage,
    refetch: async () => {
      await queryRefetch();
    },
  };
}
