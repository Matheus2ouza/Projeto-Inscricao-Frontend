import { getCheckInAccountDetails } from "@/features/events/api/check-in/details/getCheckInAccountDetails";
import { FindAccountsDetailsResponse } from "@/features/events/types/check-in/checkInTypes";
import { useQuery } from "@tanstack/react-query";

export const checkInAccountDetailsKeys = {
  all: ["check-in-account"] as const,
  detail: (eventId: string, accountId: string) =>
    [...checkInAccountDetailsKeys.all, eventId, accountId] as const,
};

export function useCheckInAccountDetails(eventId: string, accountId: string) {
  return useQuery<FindAccountsDetailsResponse>({
    queryKey: checkInAccountDetailsKeys.detail(eventId, accountId),
    queryFn: () => getCheckInAccountDetails(eventId, accountId),
    staleTime: 5 * 60 * 1000,
    retry: 2,
    refetchOnWindowFocus: false,
    enabled: !!eventId && !!accountId,
  });
}
