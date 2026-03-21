"use client";

import { useEffect, useState } from "react";
import {
  STATUS_EVENT_VALUES,
  UseEventsParams,
  UseEventsResult,
} from "../types/listEventsForParticipantsTypes";
import {
  usePrefetchSelectEventForListParticipants,
  useSelectEventForListParticipantsQuery,
} from "./useSelectEventForListParticipantsQuery";

export function useListEventsForParticipants({
  initialPage = 1,
  pageSize = 8,
  status,
  guest,
}: UseEventsParams = {}): UseEventsResult {
  const [page, setPage] = useState(initialPage);
  const statusFilter = status?.length ? status : undefined;
  const queryStatuses = statusFilter ?? STATUS_EVENT_VALUES;
  const statusKey = status?.join(",") ?? "default";

  const {
    data,
    isLoading: loading,
    error,
    refetch,
  } = useSelectEventForListParticipantsQuery(
    page,
    pageSize,
    queryStatuses,
    guest,
  );

  const { prefetchNextPage } = usePrefetchSelectEventForListParticipants();

  useEffect(() => {
    setPage(initialPage);
  }, [initialPage, statusKey]);

  if (data && page < data.pageCount) {
    prefetchNextPage(page, pageSize, queryStatuses, guest);
  }

  return {
    events: data?.events ?? [],
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
