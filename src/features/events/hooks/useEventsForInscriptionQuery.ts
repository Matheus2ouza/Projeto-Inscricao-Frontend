import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getEventsForInscription } from "../api/getEventsForInscription";
import type { EventsListResponse } from "../types/listEventsTypes";

export const eventsForInscriptionKeys = {
  all: ["events-for-inscription"] as const,
  lists: () => [...eventsForInscriptionKeys.all, "list"] as const,
  list: (page: number, pageSize: number) =>
    [...eventsForInscriptionKeys.lists(), { page, pageSize }] as const,
};

export function useEventsForInscriptionQuery(
  page: number,
  pageSize: number
) {
  return useQuery<EventsListResponse>({
    queryKey: eventsForInscriptionKeys.list(page, pageSize),
    queryFn: () => getEventsForInscription({ page, pageSize }),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    placeholderData: keepPreviousData,
    refetchOnWindowFocus: false,
  });
}
