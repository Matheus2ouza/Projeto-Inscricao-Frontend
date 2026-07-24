import {
  UseAnalysisPaymentDetailsParams,
  UseAnalysisPaymentDetailsResult,
} from '../../types/analysisPayment/analysisPaymentDetails';
import { useAnalysisPaymentDetailsQuery } from './analysisPaymentDetailsQuery';

export function useAnalysisPaymentDetails({
  paymentId,
}: UseAnalysisPaymentDetailsParams): UseAnalysisPaymentDetailsResult {
  const {
    data,
    isLoading: loading,
    isFetching,
    isFetched: fetched,
    error,
    refetch,
  } = useAnalysisPaymentDetailsQuery(paymentId);

  return {
    payment: data || undefined,
    loading,
    fetching: isFetching,
    fetched,
    error,
    refresh: async () => {
      await refetch();
    },
  };
}
