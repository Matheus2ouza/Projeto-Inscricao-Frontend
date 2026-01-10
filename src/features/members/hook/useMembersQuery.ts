import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getMembers } from "../api/getMembers";
import { FindAllToMembersResponse } from "../types/membersType";

// Query keys for members
export const membersKeys = {
  all: ["members"] as const,
  lists: () => [...membersKeys.all, "list"] as const,
  list: (page: number, pageSize: number) =>
    [...membersKeys.lists(), { page, pageSize }] as const,
  details: () => [...membersKeys.all, "detail"] as const,
  detail: (id: string) => [...membersKeys.details(), id] as const,
};

export function useMembersQuery(page: number = 1, pageSize: number = 20) {
  return useQuery<FindAllToMembersResponse>({
    queryKey: membersKeys.list(page, pageSize),
    queryFn: () => getMembers(page, pageSize),
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos
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

// Hook pré-fetch for members
export function usePrefetchMembersQuery() {
  const queryClient = useQueryClient();

  return {
    prefetchNextPage: (currentPage: number, pageSize: number) => {
      queryClient.prefetchQuery({
        queryKey: membersKeys.list(currentPage + 1, pageSize),
        queryFn: () => getMembers(currentPage + 1, pageSize),
        staleTime: 5 * 60 * 1000,
      });
    },
  };
}
