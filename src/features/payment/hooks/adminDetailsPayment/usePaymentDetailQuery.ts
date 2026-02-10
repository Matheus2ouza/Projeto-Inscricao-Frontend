import { useQuery } from "@tanstack/react-query";
import { getPaymentDetails } from "../../api/adminDetailsPayment/getPaymentDetails";
import type { PaymentsDetailsOutput } from "../../types/adminDetailsPayment/paymentsDetailsTypes";

export const paymentDetailKeys = {
  all: ["payment-details"] as const,
  details: () => [...paymentDetailKeys.all, "detail"] as const,
  detail: (paymentId: string) =>
    [...paymentDetailKeys.details(), paymentId] as const,
};

export function usePaymentDetailQuery(paymentId: string) {
  return useQuery<PaymentsDetailsOutput>({
    queryKey: paymentDetailKeys.detail(paymentId),
    queryFn: () => getPaymentDetails(paymentId),
    enabled: !!paymentId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 2,
    refetchOnWindowFocus: false,
  });
}
