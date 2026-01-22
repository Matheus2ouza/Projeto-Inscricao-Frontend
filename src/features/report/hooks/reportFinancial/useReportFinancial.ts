import {
  UseReportFinancialParam,
  UseReportFinancialResult,
} from "../../types/reportFinancial/reportFinancialTypes";
import { useReportFinancialQuery } from "./useReportFinancialQuery";

export function useReportFinancial({
  eventId,
  details,
}: UseReportFinancialParam): UseReportFinancialResult {
  const {
    data,
    isLoading: loading,
    error,
    refetch,
  } = useReportFinancialQuery(eventId, details);

  return {
    data: data || null,
    loading,
    error,
    refetch: async () => {
      await refetch();
    },
  };
}
