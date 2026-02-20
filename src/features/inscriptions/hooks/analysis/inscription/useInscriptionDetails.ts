"use client";

import {
  UseInscriptionDetailParams,
  UseInscriptionDetailResult,
} from "@/features/inscriptions/types/analysis/analysisTypes";
import { useState } from "react";
import {
  useInscriptionDetailsQuery,
  usePrefetchInscriptionDetailsQuery,
} from "./useInscriptionDetailsQuery";

export function useInscriptionDetails({
  inscriptionId,
  initialPage = 1,
  pageSize = 10,
}: UseInscriptionDetailParams): UseInscriptionDetailResult {
  const [page, setPage] = useState(initialPage);

  const { data, isLoading, error, refetch } = useInscriptionDetailsQuery(
    inscriptionId,
    page,
    pageSize,
  );

  const { prefetchNextPage } = usePrefetchInscriptionDetailsQuery();

  if (data && page < data.pageCount) {
    prefetchNextPage(inscriptionId, page, pageSize);
  }

  return {
    inscriptionDetails: data || null,
    participants: data?.participants || null,
    loading: isLoading,
    error: error?.message || null,
    page,
    pageCount: data?.pageCount || 0,
    total: data?.total || 0,
    setPage,
    refetch: async () => {
      await refetch();
      setPage(initialPage);
    },
  };
}
