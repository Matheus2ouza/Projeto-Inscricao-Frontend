import { useQuery } from "@tanstack/react-query";
import { eventsKeys } from "../../expenses/hooks/useSelectEventsQuery";
import { getDetailsEvent } from "../api/getdetailsEvent";
import { FindDetailsEventResponse } from "../types/eventTypes";

export function useDetailsEvent(eventId: string) {
  const { data, isLoading, error, refetch } =
    useQuery<FindDetailsEventResponse>({
      queryKey: [...eventsKeys.detail(eventId), "details"],
      queryFn: async () => {
        return await getDetailsEvent(eventId);
      },
      enabled: Boolean(eventId),
      staleTime: 5 * 60 * 1000, // 5 minutos
      gcTime: 10 * 60 * 1000, // 10 minutos
      retry: 2,
      refetchOnWindowFocus: false,
    });

  return {
    event: data ?? null,
    loading: isLoading,
    error: error instanceof Error ? error.message : null,
    refetch: async () => {
      await refetch();
    },
  };
}
