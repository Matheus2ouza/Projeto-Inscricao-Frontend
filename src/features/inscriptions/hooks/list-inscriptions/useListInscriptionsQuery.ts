import { getListInscriptions } from "@/features/inscriptions/api/list-inscriptions/getListInscriptions";
import {
  InscriptionStatus,
  ListInscriptionsResponse,
} from "@/features/inscriptions/types/list-inscriptions/listInscriptionsTypes";
import { useQuery, useQueryClient } from "@tanstack/react-query";

export const listInscriptionsKeys = {
  all: ["list-inscriptions"] as const,
  lists: () => [...listInscriptionsKeys.all, "list"] as const,
  list: (
    eventId: string,
    page: number,
    pageSize: number,
    status?: InscriptionStatus[],
    isGuest?: boolean,
    orderBy?: "asc" | "desc",
    limitTime?: string,
  ) =>
    [
      ...listInscriptionsKeys.lists(),
      eventId,
      page,
      pageSize,
      status,
      isGuest,
      orderBy,
      limitTime,
    ] as const,
};

export function useListInscritionsQuery(
  eventId: string,
  page: number,
  pageSize: number,
  status?: InscriptionStatus[],
  isGuest?: boolean,
  orderBy?: "asc" | "desc",
  limitTime?: string,
) {
  return useQuery<ListInscriptionsResponse>({
    queryKey: listInscriptionsKeys.list(
      eventId,
      page,
      pageSize,
      status,
      isGuest,
      orderBy,
      limitTime,
    ),
    queryFn: () =>
      getListInscriptions({
        eventId,
        status,
        isGuest,
        orderBy,
        limitTime,
        page,
        pageSize,
      }),
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
      status?: InscriptionStatus[],
      isGuest?: boolean,
      orderBy?: "asc" | "desc",
      limitTime?: string,
    ) => {
      queryClient.invalidateQueries({
        queryKey: listInscriptionsKeys.list(
          eventId,
          page,
          pageSize,
          status,
          isGuest,
          orderBy,
          limitTime,
        ),
      });
    },
  };
}
