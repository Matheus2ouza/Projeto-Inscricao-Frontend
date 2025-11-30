import { useQuery } from "@tanstack/react-query";
import { getPaymentDetails } from "../api/getPaymentDetails";
import { PaymentDetailsResponse } from "../types/paymentsDetails.types";

export const paymentDetailQueryKey = (paymentId: string) =>
  ["payments", "detail", paymentId] as const;

export function usePaymentDetail(paymentId?: string) {
  return useQuery<PaymentDetailsResponse>({
    queryKey: paymentDetailQueryKey(paymentId ?? ""),
    queryFn: () => {
      if (!paymentId) {
        return Promise.reject(new Error("Payment ID ausente"));
      }
      return getPaymentDetails(paymentId);
    },
    enabled: !!paymentId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 2,
    refetchOnWindowFocus: false,
  });
}
