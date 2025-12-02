import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { getPaymentDetails } from "../api/getPaymentDetails";
import type { AnalysisPaymentResponse } from "../types/analysisTypes";

// Chaves de cache para detalhes de pagamento
export const paymentDetailsKeys = {
  all: ["payment-details"] as const,
  detail: (inscriptionId: string, page: number, pageSize: number) =>
    [...paymentDetailsKeys.all, inscriptionId, page, pageSize] as const,
};

export function usePaymentDetailsQuery(
  inscriptionId: string,
  initialPage: number = 1,
  pageSize: number = 3
) {
  const [page, setPage] = useState(initialPage);
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: paymentDetailsKeys.detail(
      inscriptionId,
      page,
      pageSize
    ),
    queryFn: () =>
      getPaymentDetails(inscriptionId, {
        page,
        pageSize,
        inscriptionId,
      }),
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos
    retry: 2,
    refetchOnWindowFocus: false,
    enabled: !!inscriptionId, // Só executa se inscriptionId estiver definido
    placeholderData: (previousData) =>
      previousData as AnalysisPaymentResponse | undefined, // Mantém dados anteriores enquanto carrega novos
  });

  const pageCount = query.data?.pageCount || 0;

  // Prefetch da próxima página quando os dados são carregados
  useEffect(() => {
    if (query.data && pageCount > 0 && page < pageCount) {
      const nextPage = page + 1;
      queryClient.prefetchQuery({
        queryKey: paymentDetailsKeys.detail(inscriptionId, nextPage, pageSize),
        queryFn: () =>
          getPaymentDetails(inscriptionId, {
            page: nextPage,
            pageSize,
            inscriptionId,
          }),
        staleTime: 5 * 60 * 1000,
      });
    }
  }, [
    query.data,
    page,
    pageCount,
    inscriptionId,
    pageSize,
    queryClient,
  ]);

  // Prefetch da página anterior se existir
  useEffect(() => {
    if (query.data && page > 1) {
      const prevPage = page - 1;
      queryClient.prefetchQuery({
        queryKey: paymentDetailsKeys.detail(inscriptionId, prevPage, pageSize),
        queryFn: () =>
          getPaymentDetails(inscriptionId, {
            page: prevPage,
            pageSize,
            inscriptionId,
          }),
        staleTime: 5 * 60 * 1000,
      });
    }
  }, [query.data, page, inscriptionId, pageSize, queryClient]);

  return {
    ...query,
    page,
    setPage,
    pageCount,
    total: query.data?.total || 0,
  };
}

// Hook para invalidar cache de detalhes de pagamento
export function useInvalidatePaymentDetails() {
  const queryClient = useQueryClient();

  return {
    invalidateAll: () =>
      queryClient.invalidateQueries({ queryKey: paymentDetailsKeys.all }),
    invalidateDetail: (inscriptionId: string) =>
      queryClient.invalidateQueries({
        queryKey: ["payment-details", inscriptionId],
      }),
  };
}
