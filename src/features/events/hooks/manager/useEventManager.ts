import { useEventManagerQuery } from "@/features/events/hooks/manager/useEventManagerQuery";
import {
  UseEventManagerParams,
  UseEventManagerResult,
} from "@/features/events/types/manager/eventManagerTypes";
import { useTypeInscriptionsQuery } from "@/features/typeInscription/hook/useTypeInscriptionsQuery";

export function useEventManager({
  eventId,
}: UseEventManagerParams): UseEventManagerResult {
  const {
    data: event,
    isLoading: loadingEvent,
    isFetching: fetchingEvent,
    isFetched: fetchedEvent,
    error: errorEvent,
    refetch: refetchEvent,
  } = useEventManagerQuery(eventId);

  const {
    data: typeInscriptions,
    isLoading: loadingTypeInscriptions,
    isFetching: fetchingTypeInscriptions,
    isFetched: fetchedTypeInscriptions,
    error: errorTypeInscriptions,
    refetch: refetchTypeInscriptions,
  } = useTypeInscriptionsQuery(eventId);

  return {
    // Event
    event: event || null,
    loadingEvent,
    fetchingEvent,
    fetchedEvent,
    errorEvent: errorEvent || null,
    refetchEvent: async () => {
      await refetchEvent();
    },

    // Type Inscriptions
    typeInscriptions: typeInscriptions || null,
    loadingTypeInscriptions,
    fetchingTypeInscriptions,
    fetchedTypeInscriptions,
    errorTypeInscriptions: errorTypeInscriptions || null,
    refetchTypeInscriptions: async () => {
      await refetchTypeInscriptions();
    },
  };
}
