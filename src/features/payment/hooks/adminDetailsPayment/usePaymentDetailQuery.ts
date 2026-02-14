import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getPaymentDetails } from "../../api/adminDetailsPayment/getPaymentDetails";
import type { PaymentsDetailsResponse } from "../../types/adminDetailsPayment/paymentsDetailsTypes";

export const paymentDetailKeys = {
  all: ["payment-details"] as const,
  details: () => [...paymentDetailKeys.all, "detail"] as const,
  detail: (paymentId: string) =>
    [...paymentDetailKeys.details(), paymentId] as const,
};

export function usePaymentDetailQuery(paymentId: string) {
  return useQuery<PaymentsDetailsResponse>({
    queryKey: paymentDetailKeys.detail(paymentId),
    queryFn: () => getPaymentDetails(paymentId),
    enabled: !!paymentId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 2,
    refetchOnWindowFocus: false,
  });
}

export function useInvalidatePaymentDetailQuery() {
  const queryClient = useQueryClient();

  return {
    invalidateAll: () => {
      queryClient.invalidateQueries({
        queryKey: paymentDetailKeys.all,
      });
    },

    invalidateDetails: () => {
      queryClient.invalidateQueries({
        queryKey: paymentDetailKeys.details(),
      });
    },

    invalidateDetail: (id: string) => {
      queryClient.invalidateQueries({
        queryKey: paymentDetailKeys.detail(id),
      });
    },
  };
}
