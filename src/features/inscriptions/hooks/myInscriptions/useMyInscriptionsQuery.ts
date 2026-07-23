import { myInscriptionsAction } from '@/features/inscriptions/actions/myInscriptions/myInscriptionsAction';
import { MyInscriptionsResponse } from '@/features/inscriptions/types/myInscriptions/myInscriptionsTypes';
import { useQuery, useQueryClient } from '@tanstack/react-query';

export const MyInscriptionsKey = {
  all: ['myInscriptions'] as const,
  lists: () => [...MyInscriptionsKey.all, 'list'] as const,
  list: (
    eventId: string,
    page: number,
    pageSize: number,
    localityId?: string,
    limitTime?: string,
  ) =>
    [
      ...MyInscriptionsKey.lists(),
      { eventId, page, pageSize, localityId, limitTime },
    ] as const,
  details: () => [...MyInscriptionsKey.all, 'detail'] as const,
  detail: (id: string) => [...MyInscriptionsKey.details(), id] as const,
};

export function useMyInscriptionsQuery(
  eventId: string,
  page: number = 0,
  pageSize: number = 10,
  localityId?: string,
  limitTime?: string,
) {
  return useQuery<MyInscriptionsResponse>({
    queryKey: MyInscriptionsKey.list(
      eventId,
      page,
      pageSize,
      localityId,
      limitTime,
    ),
    queryFn: () =>
      myInscriptionsAction(eventId, page, pageSize, localityId, limitTime),
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
      localityId?: string,
      limitTime?: string,
    ) => {
      queryClient.prefetchQuery({
        queryKey: MyInscriptionsKey.list(
          eventId,
          page,
          pageSize,
          localityId,
          limitTime,
        ),
        queryFn: () =>
          myInscriptionsAction(eventId, page, pageSize, localityId, limitTime),
      });
    },
  };
}
