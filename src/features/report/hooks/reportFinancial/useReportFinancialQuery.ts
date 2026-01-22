import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getReportFinancial } from "../../api/reportFinancial/gerReportFinancial";
import { ReportFinancialResponse } from "../../types/reportFinancial/reportFinancialTypes";

export const ReportFinancialKeys = {
  all: ["reportFinancial"] as const,
  general: (eventId: string, details: boolean) =>
    [...ReportFinancialKeys.all, "geral", eventId, details] as const,
};

export function useReportFinancialQuery(eventId: string, details: boolean) {
  return useQuery<ReportFinancialResponse>({
    queryKey: ReportFinancialKeys.general(eventId, details),
    queryFn: () => getReportFinancial(eventId, details),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 2,
    refetchOnWindowFocus: false,
  });
}

export function invalidateReportFinancialQuery() {
  const queryClient = useQueryClient();

  return {
    invalidateGeneral: (eventId: string, details: boolean) =>
      queryClient.invalidateQueries({
        queryKey: ReportFinancialKeys.general(eventId, details),
      }),
  };
}
