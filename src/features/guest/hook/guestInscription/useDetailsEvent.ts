import {
  UseDetailsEventParams,
  UseDetailsEventResult,
} from "../../types/guestInscription/guestInscriptionTypes";
import { useDetailsEventQuery } from "./useDetailsEventQuery";

export function useDetailsEvent({
  eventId,
}: UseDetailsEventParams): UseDetailsEventResult {
  const { data, isLoading, error, refetch } = useDetailsEventQuery(eventId);

  return {
    event: data || null,
    loading: isLoading,
    error: error?.message || null,
    refetch: async () => {
      await refetch();
    },
  };
}
