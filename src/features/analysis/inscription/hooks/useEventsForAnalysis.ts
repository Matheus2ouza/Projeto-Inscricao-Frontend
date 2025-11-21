"use client";

import { useEffect, useState } from "react";
import { getEventInscriptions } from "../api/getEventInscriptions";
import { UseEventsParams, UseEventsResult } from "../types/eventTypes";
import {
  useAnalysisEventsQuery,
  usePrefetchAnalysisEvents,
} from "./useAnalysisEventsQuery";

export function useEventsForAnalysis({
  initialPage = 1,
  pageSize = 8,
}: UseEventsParams = {}): UseEventsResult {
  const [page, setPage] = useState(initialPage);
  const [eventsWithAnalysisCount, setEventsWithAnalysisCount] = useState<any[]>([]);

  // Usar React Query para buscar eventos
  const {
    data,
    isLoading: loading,
    error,
    refetch,
  } = useAnalysisEventsQuery(page, pageSize);

  // Pré-carregar próxima página
  const { prefetchNextPage } = usePrefetchAnalysisEvents();

  // Pré-carregar próxima página quando dados carregam
  if (data && page < data.pageCount) {
    prefetchNextPage(page, pageSize);
  }

  // Função para buscar inscrições em análise de cada evento
  const fetchInscriptionsUnderReview = async (events: any[]) => {
    const eventsWithCounts = await Promise.all(
      events.map(async (event) => {
        try {
          // Buscar todas as inscrições do evento (primeira página com tamanho grande)
          const inscriptionsData = await getEventInscriptions(event.id, {
            page: 1,
            pageSize: 1000, // Buscar muitas inscrições para contar
          });

          // Contar inscrições com status "under_review"
          const underReviewCount = inscriptionsData.account.reduce(
            (total, account) =>
              total +
              account.inscriptions.filter(
                (inscription) => inscription.status.toLowerCase() === "under_review"
              ).length,
            0
          );

          return {
            ...event,
            countInscritpionsUnderReview: underReviewCount,
          };
        } catch (error) {
          console.error(`Erro ao buscar inscrições do evento ${event.id}:`, error);
          return {
            ...event,
            countInscritpionsUnderReview: 0,
          };
        }
      })
    );

    return eventsWithCounts;
  };

  // Atualizar eventos com contagem de inscrições em análise
  useEffect(() => {
    if (data?.events && data.events.length > 0) {
      fetchInscriptionsUnderReview(data.events).then(setEventsWithAnalysisCount);
    }
  }, [data?.events]);

  return {
    events: eventsWithAnalysisCount.length > 0 ? eventsWithAnalysisCount : (data?.events || []),
    total: data?.total || 0,
    page,
    pageCount: data?.pageCount || 0,
    loading,
    error: error?.message || null,
    setPage,
    refetch: async () => {
      await refetch();
    },
  };
}
