import { useState } from "react";
import {
  UseListParticipantsParams,
  UseListParticipantsResult,
} from "../../types/list-participants/listParticipantsTypes";
import {
  useListParticipantsQuery,
  usePrefetchListParticipantsQuery,
} from "./useListParticipantsQuery";

export function useListParticipants({
  eventId,
  initialPage,
  pageSize,
}: UseListParticipantsParams): UseListParticipantsResult {
  const [page, setPage] = useState(initialPage);

  const {
    data,
    isLoading: loading,
    error,
    refetch,
  } = useListParticipantsQuery(eventId, page, pageSize);

  const { prefetchNextPage } = usePrefetchListParticipantsQuery();

  if (data && page < data.pageCount) {
    prefetchNextPage(eventId, page, pageSize);
  }

  return {
    participants: data?.participants || [],
    countParticipants: data?.countParticipants || 0,
    countParticipantsMale: data?.countParticipantsMale || 0,
    countParticipantsFemale: data?.countParticipantsFemale || 0,
    total: data?.total || 0,
    page: data?.page || 0,
    pageCount: data?.pageCount || 0,
    loading,
    error: error?.message || null,
    setPage,
    refetch: async () => {
      await refetch();
    },
  };
}
