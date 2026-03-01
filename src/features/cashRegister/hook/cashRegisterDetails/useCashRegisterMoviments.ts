import { useState } from "react";
import {
  CashRegisterMovimentsParam,
  CashRegisterMovimentsResult,
} from "../../types/cashRegisterDetails/cashRegisterDetailsType";
import {
  useCashRegisterMovimentsQuery,
  usePrefetchCashRegisterMovimentsQuery,
} from "./cashRegisterMovimentsQuery";

export function useCashRegisterMoviments({
  cashRegisterId,
  type,
  limitTime,
  orderBy,
  initialPage,
  pageSize,
}: CashRegisterMovimentsParam): CashRegisterMovimentsResult {
  const [page, setPage] = useState(initialPage);

  const { data, isLoading, isFetching, error, refetch } =
    useCashRegisterMovimentsQuery(
    cashRegisterId,
    page,
    pageSize,
    type,
    limitTime,
    orderBy,
  );

  const { prefetchNextPage } = usePrefetchCashRegisterMovimentsQuery();

  if (data && page < data.pageCount) {
    prefetchNextPage(cashRegisterId, page, pageSize, type, limitTime, orderBy);
  }

  return {
    moviments: data?.moviments || null,
    totalMoviments: data?.totalMoviments || 0,
    totalIncome: data?.totalIncome || 0,
    totalExpense: data?.totalExpense || 0,
    page: data?.page || 0,
    pageCount: data?.pageCount || 0,
    loading: isLoading,
    fetching: isFetching,
    error: error?.message || null,
    setPage,
    refetch: async () => {
      await refetch();
    },
  };
}
