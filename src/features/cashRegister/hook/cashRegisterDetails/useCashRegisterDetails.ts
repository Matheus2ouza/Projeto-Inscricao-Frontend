import {
  CashRegisterDetailsParam,
  CashRegisterDetailsResult,
} from '../../types/cashRegisterDetails/cashRegisterDetailsType';
import { useCashRegisterDetailsQuery } from './cashRegisterDetailsQuery';

export function useCashRegisterDetails({
  cashRegisterId,
}: CashRegisterDetailsParam): CashRegisterDetailsResult {
  const { data, isLoading, isFetching, error, refetch } =
    useCashRegisterDetailsQuery(cashRegisterId);

  return {
    cashRegisters: data || null,
    loading: isLoading,
    fetching: isFetching,
    error: error?.message || null,
    refetch: async () => {
      await refetch();
    },
  };
}
