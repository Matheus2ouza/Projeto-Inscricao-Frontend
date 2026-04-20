import { useQuery } from "@tanstack/react-query";
import { getListReceipts } from "../../api/list-receipts/getListReceipts";
import { ListReceiptsResponse } from "../../types/list-receipts/listReceipts";

export const ListReceiptsKey = {
  all: ["listReceipts"] as const,
  lists: () => [...ListReceiptsKey.all, "list"] as const,
  list: (eventId: string, page: number, pageSize: number) =>
    [...ListReceiptsKey.lists(), { eventId, page, pageSize }] as const,
};

export function useListReceiptsQuery(
  eventId: string,
  page: number = 0,
  pageSize: number = 10,
) {
  return useQuery<ListReceiptsResponse>({
    queryKey: ListReceiptsKey.list(eventId, page, pageSize),
    queryFn: () => getListReceipts(eventId, page, pageSize),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 2,
    refetchOnWindowFocus: false,
  });
}
