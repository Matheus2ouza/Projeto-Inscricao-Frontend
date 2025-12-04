import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getAccountsToCheckIn } from "../api/getAccountsToCheckIn";
import { FindAccountsToCheckInResponse } from "../types/checkInTypes";

export const checkInKeys = {
  all: ["check-in"] as const,
  lists: () => [...checkInKeys.all, "list"] as const,
  list: (eventId: string, page: number, pageSize: number) =>
    [...checkInKeys.lists(), eventId, { page, pageSize }] as const,
};

export function useAccountsToCheckIn(
  eventId: string,
  page: number = 1,
  pageSize: number = 10
) {
  return useQuery<FindAccountsToCheckInResponse>({
    queryKey: checkInKeys.list(eventId, page, pageSize),
    queryFn: () => getAccountsToCheckIn(eventId, page, pageSize),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 2,
    refetchOnWindowFocus: false,
    enabled: !!eventId,
  });
}

export function usePrefetchAccountsToCheckIn() {
  const queryClient = useQueryClient();

  return {
    prefetch: (eventId: string, page: number, pageSize: number) => {
      queryClient.prefetchQuery({
        queryKey: checkInKeys.list(eventId, page, pageSize),
        queryFn: () => getAccountsToCheckIn(eventId, page, pageSize),
        staleTime: 5 * 60 * 1000,
      });
    },
  };
}
