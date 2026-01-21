import { getEvent } from "@/features/events/api/manager/getEvent";
import { getEventResponse } from "@/features/events/types/manager/eventManagerTypes";
import { useQuery, useQueryClient } from "@tanstack/react-query";

export const eventManagerKeys = {
  all: ["events"] as const,
  lists: () => [...eventManagerKeys.all, "list"] as const,
  list: (eventId: string) => [...eventManagerKeys.lists(), eventId] as const,
  details: () => [...eventManagerKeys.all, "detail"] as const,
  detail: (eventId: string) =>
    [...eventManagerKeys.details(), eventId] as const,
};

export function useEventManagerQuery(eventId: string) {
  return useQuery<getEventResponse>({
    queryKey: eventManagerKeys.detail(eventId),
    queryFn: () => getEvent(eventId),
    enabled: Boolean(eventId),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 2,
    refetchOnWindowFocus: false,
  });
}

export function useInvalidateDetailsEventQuery() {
  const queryClient = useQueryClient();

  return {
    invalidateAll: () => {
      queryClient.invalidateQueries({
        queryKey: eventManagerKeys.all,
      });
    },

    invalidateLists: () => {
      queryClient.invalidateQueries({
        queryKey: eventManagerKeys.lists(),
      });
    },

    invalidateDetail: (eventId: string) => {
      queryClient.invalidateQueries({
        queryKey: eventManagerKeys.detail(eventId),
      });
    },
  };
}
