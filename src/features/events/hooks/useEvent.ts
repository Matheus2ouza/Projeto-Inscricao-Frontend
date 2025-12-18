import { getTypeInscriptionsByEvent } from "@/features/typeInscription/api/getTypeInscriptionsByEvent";
import { useQuery } from "@tanstack/react-query";
import { eventsKeys } from "../../gastos/hooks/useEventsQuery";
import { getEvent } from "../api/getEvent";
import { Event } from "../types/eventTypes";

export function useEvent(eventId: string) {
  const {
    data,
    isLoading,
    error,
    refetch,
  } = useQuery<Event>({
    queryKey: eventsKeys.detail(eventId),
    queryFn: async () => {
      const [eventData, typesInscriptions] = await Promise.all([
        getEvent(eventId),
        getTypeInscriptionsByEvent(eventId),
      ]);

      return {
        ...eventData,
        typesInscriptions,
        countTypeInscriptions: typesInscriptions.length,
      };
    },
    enabled: Boolean(eventId),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
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
