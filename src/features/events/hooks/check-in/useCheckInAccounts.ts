import { getCheckInAccounts } from "@/features/events/api/check-in/getCheckInAccounts";
import { AccountsPaginatedResponse } from "@/features/events/types/check-in/checkInTypes";
import { useQuery } from "@tanstack/react-query";

export const checkInAccountsKeys = {
  all: ["check-in-accounts"] as const,
  list: (eventId: string, page: number, pageSize: number, onlyWithDebt: boolean) =>
    [...checkInAccountsKeys.all, eventId, { page, pageSize, onlyWithDebt }] as const,
};

export function useCheckInAccounts(
  eventId: string,
  page: number = 1,
  pageSize: number = 10,
  onlyWithDebt: boolean = false
) {
  return useQuery<AccountsPaginatedResponse>({
    queryKey: checkInAccountsKeys.list(eventId, page, pageSize, onlyWithDebt),
    queryFn: () => getCheckInAccounts(eventId, page, pageSize, onlyWithDebt),
    staleTime: 5 * 60 * 1000,
    retry: 2,
    refetchOnWindowFocus: false,
    enabled: !!eventId,
  });
}
