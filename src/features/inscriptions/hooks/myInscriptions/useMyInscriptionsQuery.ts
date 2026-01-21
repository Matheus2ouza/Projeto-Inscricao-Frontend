import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getMyInscriptions } from "../../api/MyInscriptions/getInscripions";
import { MyInscriptionsResponse } from "../../types/MyInscriptions/myInscriptionsTypes";

export const MyInscriptionsKey = {
  all: ["myInscriptions"] as const,
  lists: () => [...MyInscriptionsKey.all, "list"] as const,
  list: (eventId: string, page: number, pageSize: number, limitTime?: string) =>
    [
      ...MyInscriptionsKey.lists(),
      { eventId, page, pageSize, limitTime },
    ] as const,
  details: () => [...MyInscriptionsKey.all, "detail"] as const,
  detail: (id: string) => [...MyInscriptionsKey.details(), id] as const,
};

export function useMyInscriptionsQuery(
  eventId: string,
  page: number = 0,
  pageSize: number = 10,
  limitTime?: string,
) {
  return useQuery<MyInscriptionsResponse>({
    queryKey: MyInscriptionsKey.list(eventId, page, pageSize, limitTime),
    queryFn: () => getMyInscriptions(eventId, page, pageSize, limitTime),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 2,
    refetchOnWindowFocus: false,
  });
}

export function useInvalidateMyInscriptionsQuery() {
  const queryClient = useQueryClient();

  return {
    invalidateAll: () => {
      queryClient.invalidateQueries({
        queryKey: MyInscriptionsKey.all,
      });
    },

    invalidateLists: () => {
      queryClient.invalidateQueries({
        queryKey: MyInscriptionsKey.lists(),
      });
    },

    invalidateDetail: (id: string) => {
      queryClient.invalidateQueries({
        queryKey: MyInscriptionsKey.detail(id),
      });
    },
  };
}

export function usePrefetchMyInscriptionsQuery() {
  const queryClient = useQueryClient();

  return {
    prefetchNextPage: (
      eventId: string,
      page: number = 0,
      pageSize: number = 10,
      limitTime?: string,
    ) => {
      queryClient.prefetchQuery({
        queryKey: MyInscriptionsKey.list(eventId, page, pageSize, limitTime),
        queryFn: () => getMyInscriptions(eventId, page, pageSize, limitTime),
      });
    },
  };
}
