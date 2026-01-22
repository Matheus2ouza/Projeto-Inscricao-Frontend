"use client";

import {
  UseReportGeneralParam,
  UseReportGeneralResult,
} from "@/features/report/types/reportGeral/reportTypes";
import { UseReportGeralQuery } from "./useReportGeralQuery";

export function useReportGeneral({
  eventId,
}: UseReportGeneralParam): UseReportGeneralResult {
  const {
    data,
    isLoading: loading,
    error,
    refetch,
  } = UseReportGeralQuery(eventId);

  return {
    data: data ?? null,
    loading,
    error,
    refetch: async () => {
      await refetch();
    },
  };
}
