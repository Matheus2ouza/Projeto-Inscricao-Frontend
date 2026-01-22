import { getReportGeneral } from "@/features/report/api/reportGeral/getReportGeral";
import { ReportGeneralResponse } from "@/features/report/types/reportGeral/reportTypes";
import { useQuery, useQueryClient } from "@tanstack/react-query";

export const reportGeralKeys = {
  all: ["report"] as const,
  general: (eventId: string) =>
    [...reportGeralKeys.all, "geral", eventId] as const,
};

export function UseReportGeralQuery(eventId: string) {
  return useQuery<ReportGeneralResponse>({
    queryKey: reportGeralKeys.general(eventId),
    queryFn: () => getReportGeneral(eventId),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 2,
    refetchOnWindowFocus: false,
  });
}

export function invalidateReportGeralQuery() {
  const queryClient = useQueryClient();

  return {
    invalidateGeneral: (eventId: string) =>
      queryClient.invalidateQueries({
        queryKey: reportGeralKeys.general(eventId),
      }),
  };
}
