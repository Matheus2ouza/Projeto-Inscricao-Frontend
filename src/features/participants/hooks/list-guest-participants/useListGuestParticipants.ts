import { useState } from "react";
import {
  UseListGuestParticipantsParams,
  UseListGuestParticipantsResult,
} from "../../types/list-guest-participants/guestParticipantsTypes";
import {
  useListGuestParticipantsQuery,
  usePrefetchGuestParticipantsQuery,
} from "./useListGuestParticipantsQuery";

export function useListGuestParticipants({
  eventId,
  initialPage,
  pageSize,
}: UseListGuestParticipantsParams): UseListGuestParticipantsResult {
  const [page, setPage] = useState(initialPage);

  const {
    data,
    isLoading: loading,
    error,
    refetch,
  } = useListGuestParticipantsQuery(eventId, page, pageSize);

  const { prefetchNextPage } = usePrefetchGuestParticipantsQuery();

  if (data && page < data.pageCount) {
    prefetchNextPage(eventId, page, pageSize);
  }

  return {
    guestParticipants: data?.guestParticipants || [],
    countGuestParticipants: data?.countGuestParticipants || 0,
    countGuestParticipantsMale: data?.countGuestParticipantsMale || 0,
    countGuestParticipantsFemale: data?.countGuestParticipantsFemale || 0,
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
