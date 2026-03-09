"use client";

import { useGlobalLoading } from "@/components/GlobalLoading";
import { useEffect, useMemo, useState } from "react";
import type {
  UseTicketsEventsParams,
  UseTicketsEventsResult,
} from "../../inscriptions/types/listEventsTypes";
import { useTicketsEventsQuery } from "./useEventsForTicketQuery";

export function useTicketsEvents({
  initialPage = 1,
  pageSize = 10,
}: UseTicketsEventsParams = {}): UseTicketsEventsResult {
  const [page, setPage] = useState(initialPage);
  const { setLoading: setGlobalLoading } = useGlobalLoading();
  const { data, isLoading, isFetching, error, refetch } = useTicketsEventsQuery(
    page,
    pageSize,
  );

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

    return error instanceof Error ? error.message : "Falha ao carregar eventos";
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
      await refetch();
    },
  };
}
