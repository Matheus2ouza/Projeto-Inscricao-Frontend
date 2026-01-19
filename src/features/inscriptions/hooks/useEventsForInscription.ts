"use client";

import { useGlobalLoading } from "@/components/GlobalLoading";
import { useEffect, useMemo, useState } from "react";
import type {
  UseEventsForInscriptionParams,
  UseEventsForInscriptionResult,
} from "../types/listEventsTypes";
import { useEventsForInscriptionQuery } from "./useEventsForInscriptionQuery";

export function useEventsForInscription({
  initialPage = 1,
  pageSize = 8,
  status,
}: UseEventsForInscriptionParams = {}): UseEventsForInscriptionResult {
  const [page, setPage] = useState(initialPage);
  const { setLoading: setGlobalLoading } = useGlobalLoading();
  const {
    data,
    isLoading,
    isFetching,
    error,
    refetch: queryRefetch,
  } = useEventsForInscriptionQuery(page, pageSize, status);

  useEffect(() => {
    setGlobalLoading(isFetching);

    return () => {
      setGlobalLoading(false);
    };
  }, [isFetching, setGlobalLoading]);

  const errorMessage = useMemo(() => {
    if (!error) {
      return null;
    }

    return error instanceof Error
      ? error.message
      : "Não foi possível carregar os eventos.";
  }, [error]);

  return {
    events: data?.events ?? [],
    total: data?.total ?? 0,
    page,
    pageCount: data?.pageCount ?? 0,
    loading: isLoading || isFetching,
    error: errorMessage,
    setPage,
    refetch: async () => {
      await queryRefetch();
    },
  };
}
