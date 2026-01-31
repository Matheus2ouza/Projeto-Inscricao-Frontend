import { Event } from "@/features/guest/types/guestInscription/guestInscriptionTypes";
import { useQuery } from "@tanstack/react-query";
import { getDetailsEvent } from "../../api/guestInscription/getDetailsEvent";

export const eventDetailsKeys = {
  all: ["event-details"] as const,
  lists: () => [...eventDetailsKeys.all, "list"] as const,
  list: (eventId: string) => [...eventDetailsKeys.lists(), eventId] as const,
};

export function useDetailsEventQuery(eventId: string) {
  return useQuery<Event>({
    queryKey: eventDetailsKeys.list(eventId),
    queryFn: () => getDetailsEvent(eventId),
    enabled: !!eventId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 2,
    refetchOnWindowFocus: false,
  });
}
