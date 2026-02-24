import { getListInscriptions } from "@/features/inscriptions/api/list-inscriptions/getListInscriptions";
import { ListInscriptionsResponse } from "@/features/inscriptions/types/list-inscriptions/listInscriptionsTypes";
import { useQuery, useQueryClient } from "@tanstack/react-query";

export const listInscriptionsKeys = {
  all: ["list-inscriptions"] as const,
  lists: () => [...listInscriptionsKeys.all, "list"] as const,
  list: (
    eventId: string,
    page: number,
    pageSize: number,
    isGuest?: boolean,
    orderBy?: "asc" | "desc",
  ) =>
    [
      ...listInscriptionsKeys.lists(),
      eventId,
      page,
      pageSize,
      isGuest,
      orderBy,
    ] as const,
};

export function useListInscritionsQuery(
  eventId: string,
  page: number,
  pageSize: number,
  isGuest?: boolean,
  orderBy?: "asc" | "desc",
) {
  return useQuery<ListInscriptionsResponse>({
    queryKey: listInscriptionsKeys.list(
      eventId,
      page,
      pageSize,
      isGuest,
      orderBy,
    ),
    queryFn: () =>
      getListInscriptions(eventId, page, pageSize, isGuest, orderBy),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
}

export function useInvalidateListInscriptionsQuery() {
  const queryClient = useQueryClient();

  return {
    invalidateAll: () => {
      queryClient.invalidateQueries({
        queryKey: listInscriptionsKeys.all,
      });
    },
    invalidateList: (
      eventId: string,
      page: number,
      pageSize: number,
      isGuest?: boolean,
      orderBy?: "asc" | "desc",
    ) => {
      queryClient.invalidateQueries({
        queryKey: listInscriptionsKeys.list(
          eventId,
          page,
          pageSize,
          isGuest,
          orderBy,
        ),
      });
    },
  };
}
