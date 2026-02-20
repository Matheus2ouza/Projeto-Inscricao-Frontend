"use client";

import { useInscriptionsForAnalysisQuery } from "@/features/inscriptions/hooks/analysis/useInscriptionsForAnalysisQuery";
import {
  UseAnalysisParams,
  UseAnalysisResult,
} from "@/features/inscriptions/types/analysis/analysisTypes";
import { useState } from "react";

export function useInscriptionsForAnalysis({
  eventId,
  initialPage = 1,
  pageSize = 15,
}: UseAnalysisParams): UseAnalysisResult {
  const [page, setPage] = useState(initialPage);

  // Usar React Query para buscar inscrições
  const {
    data,
    isLoading: loading,
    error,
    refetch,
  } = useInscriptionsForAnalysisQuery(eventId, page, pageSize);

  return {
    analysisData: data ?? null,
    loading,
    error: (error as Error | null)?.message ?? null,
    page,
    pageCount: 1, // Nova estrutura não tem paginação por enquanto
    total: data?.account?.length ?? 0,
    setPage,
    refetch: async () => {
      await refetch();
    },
  };
}
