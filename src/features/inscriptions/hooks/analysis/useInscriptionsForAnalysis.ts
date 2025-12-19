"use client";

import { useState } from "react";
import { UseAnalysisParams, UseAnalysisResult } from "../../types/analysis/analysisTypes";
import {
  useAnalysisInscriptionsQuery,
  usePrefetchAnalysisInscriptions,
} from "./useAnalysisInscriptionsQuery";

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
  } = useAnalysisInscriptionsQuery(eventId, page, pageSize);

  // Pré-carregar próxima página
  const { prefetchNextPage } = usePrefetchAnalysisInscriptions();


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
