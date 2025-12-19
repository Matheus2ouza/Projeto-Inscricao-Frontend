import { getEvent } from "@/features/events/api/manager/getEvent";
import { eventsKeys } from "@/features/events/hooks/manager/useEventsQuery";
import { Event } from "@/features/events/types/eventTypes";
import { getTypeInscriptionsByEvent } from "@/features/typeInscription/api/getTypeInscriptionsByEvent";
import { useQuery } from "@tanstack/react-query";

export function useEventManager(eventId: string) {
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
    isLoading,
    error: error instanceof Error ? error.message : null,
    refetch: async () => {
      await refetch();
    },
  };
}
