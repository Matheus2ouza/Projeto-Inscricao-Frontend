import { useQuery, useQueryClient } from '@tanstack/react-query';
import { listMembersAction } from '../actions/listMembers/listMembers';
import { FindAllToMembersResponse } from '../types/membersType';

export const membersKeys = {
  all: ['members'] as const,
  lists: () => [...membersKeys.all, 'list'] as const,
  list: (page: number, pageSize: number, localityId?: string) =>
    [...membersKeys.lists(), { page, pageSize, localityId }] as const,
  details: () => [...membersKeys.all, 'detail'] as const,
  detail: (id: string) => [...membersKeys.details(), id] as const,
};

export function useMembersQuery(
  localityId?: string,
  page: number = 1,
  pageSize: number = 20,
  autoFetch: boolean = true,
) {
  return useQuery<FindAllToMembersResponse>({
    queryKey: membersKeys.list(page, pageSize, localityId),
    queryFn: () => listMembersAction(page, pageSize, localityId),
    enabled: autoFetch,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 2,
    refetchOnWindowFocus: false,
  });
}

export function useInvalidateMembersQuery() {
  const queryClient = useQueryClient();

  return {
    invalidateAll: () => {
      queryClient.invalidateQueries({
        queryKey: membersKeys.all,
      });
    },

    invalidateLists: () => {
      queryClient.invalidateQueries({
        queryKey: membersKeys.lists(),
      });
    },

    invalidateDetail: (id: string) => {
      queryClient.invalidateQueries({
        queryKey: membersKeys.detail(id),
      });
    },
  };
}

export function usePrefetchMembersQuery() {
  const queryClient = useQueryClient();

  return {
    prefetchNextPage: (
      currentPage: number,
      pageSize: number,
      localityId?: string,
    ) => {
      queryClient.prefetchQuery({
        queryKey: membersKeys.list(currentPage + 1, pageSize, localityId),
        queryFn: () => listMembersAction(currentPage + 1, pageSize, localityId),
        staleTime: 5 * 60 * 1000,
      });
    },
  };
}
