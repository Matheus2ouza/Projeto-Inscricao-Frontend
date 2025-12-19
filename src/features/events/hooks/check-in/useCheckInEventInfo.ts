import { getCheckInEventInfo } from "@/features/events/api/check-in/getCheckInEventInfo";
import { CheckInEventInfo } from "@/features/events/types/check-in/checkInTypes";
import { useQuery } from "@tanstack/react-query";

export const checkInEventKeys = {
  all: ["check-in-event"] as const,
  detail: (eventId: string) => [...checkInEventKeys.all, eventId] as const,
};

export function useCheckInEventInfo(eventId: string) {
  return useQuery<CheckInEventInfo>({
    queryKey: checkInEventKeys.detail(eventId),
    queryFn: () => getCheckInEventInfo(eventId),
    staleTime: 5 * 60 * 1000,
    retry: 2,
    refetchOnWindowFocus: false,
    enabled: !!eventId,
  });
}
