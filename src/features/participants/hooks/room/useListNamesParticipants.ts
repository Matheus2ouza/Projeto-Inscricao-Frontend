import {
  UseListNamesParticipantsParams,
  UseListNamesParticipantsResult,
} from '../../types/room/listParticipantsRoomTypes';
import { useListNamesParticipantsQuery } from './useListNamesParticipantsQuery';

export function useListNamesParticipants({
  eventId,
}: UseListNamesParticipantsParams): UseListNamesParticipantsResult {
  const {
    data,
    isLoading: loading,
    error,
    refetch,
  } = useListNamesParticipantsQuery(eventId);

  return {
    participants: data || [],
    loading,
    error: error?.message || null,
    refresh: async () => {
      await refetch();
    },
  };
}
