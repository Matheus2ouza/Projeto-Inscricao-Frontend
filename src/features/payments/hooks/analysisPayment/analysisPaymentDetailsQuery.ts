import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getDetailsPayment } from "../../api/analysisPayment/getDetailsPayment";

export const analysisPaymentDetailsKey = {
  all: ["analysisPaymentKey"] as const,
  lists: () => [...analysisPaymentDetailsKey.all, "list"] as const,
  list: (paymentId: string) =>
    [...analysisPaymentDetailsKey.lists(), paymentId] as const,
  details: () => [...analysisPaymentDetailsKey.all, "detail"] as const,
  detail: (paymentId: string) =>
    [...analysisPaymentDetailsKey.details(), paymentId] as const,
};

export function useAnalysisPaymentDetailsQuery(paymentId: string) {
  return useQuery({
    queryKey: analysisPaymentDetailsKey.detail(paymentId),
    queryFn: () => getDetailsPayment(paymentId),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 2,
    refetchOnWindowFocus: false,
  });
}

export function useInvalidateAnalysisPaymentDetailsQuery() {
  const queryClient = useQueryClient();

  return {
    invalidateAll: () => {
      queryClient.invalidateQueries({
        queryKey: analysisPaymentDetailsKey.all,
      });
    },

    invalidateLists: () => {
      queryClient.invalidateQueries({
        queryKey: analysisPaymentDetailsKey.lists(),
      });
    },

    invalidateDetail: (paymentId: string) => {
      queryClient.invalidateQueries({
        queryKey: analysisPaymentDetailsKey.detail(paymentId),
      });
    },
  };
}
