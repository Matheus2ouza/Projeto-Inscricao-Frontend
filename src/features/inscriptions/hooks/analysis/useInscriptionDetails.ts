"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { getInscriptionDetails } from "../../api/analysis/getInscriptionDetails";
import {
  AnalysisInscriptionResponse,
  UseInscriptionDetailParams,
  UseInscriptionDetailResult,
} from "../../types/analysis/analysisTypes";
import { analysisInscriptionsKeys } from "./useAnalysisInscriptionsQuery";

export function useInscriptionDetails({
  inscriptionId,
  initialPage = 1,
  pageSize = 10,
  enabled = true,
}: UseInscriptionDetailParams): UseInscriptionDetailResult {
  const [page, setPage] = useState(initialPage);
  const queryClient = useQueryClient();

  // Verificar se a inscrição foi deletada usando useMemo para reatividade
  const isDeleted = useMemo(() => {
    const deletedInscriptions = queryClient.getQueryData<Set<string>>(["deleted-inscriptions"]);
    return deletedInscriptions?.has(inscriptionId) || false;
  }, [inscriptionId, queryClient]);

  // Se a inscrição foi deletada, não executar a query
  const shouldExecuteQuery = enabled && !!inscriptionId && !isDeleted;

  const { data, isLoading, error, refetch } = useQuery<AnalysisInscriptionResponse>({
    queryKey: analysisInscriptionsKeys.inscriptionDetails(
      inscriptionId,
      page,
      pageSize
    ),
    queryFn: async () => {
      return await getInscriptionDetails(inscriptionId, { page, pageSize });
    },
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos
    retry: 2,
    refetchOnWindowFocus: false,
    enabled: shouldExecuteQuery, // Usar a variável calculada
  });

  // Pré-carregar próxima página quando possível (apenas quando as dependências mudarem)
  useEffect(() => {
    if (!inscriptionId || !data) return;
    if (page < (data.pageCount ?? 0)) {
      void queryClient.prefetchQuery<AnalysisInscriptionResponse>({
        queryKey: analysisInscriptionsKeys.inscriptionDetails(
          inscriptionId,
          page + 1,
          pageSize
        ),
        queryFn: async () =>
          await getInscriptionDetails(inscriptionId, {
            page: page + 1,
            pageSize,
          }),
        staleTime: 5 * 60 * 1000,
      });
    }
  }, [inscriptionId, data, page, pageSize, queryClient]);

  return {
    inscriptionData: data ?? null,
    loading: isLoading,
    error: (error as Error | null)?.message ?? null,
    page,
    pageCount: data?.pageCount ?? 0,
    total: data?.total ?? 0,
    setPage,
    refetch: async () => {
      await refetch();
    },
  };
}
