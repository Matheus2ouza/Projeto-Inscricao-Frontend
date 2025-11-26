import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getEventsForTicket } from "../api/getEventsForTicket";
import type { EventsListResponse } from "../types/listEventsTypes";

export const ticketEventsKeys = {
  all: ["ticket-events"] as const,
  lists: () => [...ticketEventsKeys.all, "list"] as const,
  list: (page: number, pageSize: number) =>
    [...ticketEventsKeys.lists(), { page, pageSize }] as const,
};

export function useTicketsEventsQuery(page: number, pageSize: number) {
  return useQuery<EventsListResponse>({
    queryKey: ticketEventsKeys.list(page, pageSize),
    queryFn: () => getEventsForTicket({ page, pageSize }),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    placeholderData: keepPreviousData,
    refetchOnWindowFocus: false,
  });
}
