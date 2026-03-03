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
    responsible?: string,
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
      responsible,
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
  responsible?: string,
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
      responsible,
    ),
    queryFn: () =>
      getListInscriptions({
        eventId,
        status,
        isGuest,
        orderBy,
        limitTime,
        responsible,
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
      responsible?: string,
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
          responsible,
        ),
      });
    },
  };
}
