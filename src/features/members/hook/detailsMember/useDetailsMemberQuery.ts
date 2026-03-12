import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getDetailsMember } from "../../api/detailsMember/detailsMember";
import { getDetailsMemberResponse } from "../../types/detailsMember/detailsMemberType";

export const useDetailsMemberKeys = {
  all: ["detailsMember"] as const,
  details: () => [...useDetailsMemberKeys.all, "detail"] as const,
  detail: (memberId: string) =>
    [...useDetailsMemberKeys.details(), memberId] as const,
};

export function useDetailsMemberQuery(memberId: string) {
  return useQuery<getDetailsMemberResponse>({
    queryKey: useDetailsMemberKeys.detail(memberId),
    queryFn: () => getDetailsMember(memberId),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
}

export function useInvalidateDetailsMemberQuery() {
  const queryClient = useQueryClient();

  return {
    invalidateAll: () => {
      queryClient.invalidateQueries({
        queryKey: useDetailsMemberKeys.all,
      });
    },
    invalidateDetails: () => {
      queryClient.invalidateQueries({
        queryKey: useDetailsMemberKeys.details(),
      });
    },
    invalidateDetail: (memberId: string) => {
      queryClient.invalidateQueries({
        queryKey: useDetailsMemberKeys.detail(memberId),
      });
    },
    removeAll: () => {
      queryClient.removeQueries({
        queryKey: useDetailsMemberKeys.all,
      });
    },
    removeDetails: () => {
      queryClient.removeQueries({
        queryKey: useDetailsMemberKeys.details(),
      });
    },
    removeDetail: (memberId: string) => {
      queryClient.removeQueries({
        queryKey: useDetailsMemberKeys.detail(memberId),
      });
    },
  };
}
