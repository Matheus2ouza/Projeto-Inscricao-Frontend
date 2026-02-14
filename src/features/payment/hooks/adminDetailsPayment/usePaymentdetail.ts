import {
  PaymentDetailParams,
  PaymentDetailResult,
} from "../../types/adminDetailsPayment/paymentsDetailsTypes";
import { usePaymentDetailQuery } from "./usePaymentDetailQuery";

export function usePaymentDetail({
  paymentId,
}: PaymentDetailParams): PaymentDetailResult {
  const { data, isLoading, error, refetch } = usePaymentDetailQuery(paymentId);

  return {
    payment: data || null,
    allocations: data?.allocations || [],
    installments: data?.installments || [],
    loading: isLoading,
    error: error?.message || null,
    refetch: async () => {
      await refetch();
    },
  };
}
