import {
  UseEventManagerParams,
  UseEventManagerResult,
} from "@/features/events/types/manager/eventManagerTypes";
import { useTypeInscriptionsQuery } from "@/features/typeInscription/hook/useTypeInscriptionsQuery";
import { useEventManagerQuery } from "./useEventManagerQuery";

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

  console.log("dentro do useEventManager");
  console.log(event);

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
