import { getInscriptionDetails } from "@/features/inscriptions/api/analysis/inscription/getInscriptionDetails";
import { AnalysisInscriptionResponse } from "@/features/inscriptions/types/analysis/analysisTypes";
import {
  keepPreviousData,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

export const inscriptionDetailsKeys = {
  all: ["inscriptions-for-analysis"] as const,
  lists: () => [...inscriptionDetailsKeys.all, "list"] as const,
  list: (inscriptionId: string, page: number, pageSize: number) =>
    [
      ...inscriptionDetailsKeys.lists(),
      { inscriptionId, page, pageSize },
    ] as const,
};

export function useInscriptionDetailsQuery(
  inscriptionId: string,
  page: number,
  pageSize: number,
) {
  return useQuery<AnalysisInscriptionResponse>({
    queryKey: inscriptionDetailsKeys.list(inscriptionId, page, pageSize),
    queryFn: () => getInscriptionDetails(inscriptionId, { page, pageSize }),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    placeholderData: keepPreviousData,
    refetchOnWindowFocus: false,
  });
}

export function useInvalidateInscriptionDetailsQuery() {
  const queryClient = useQueryClient();

  return {
    invalidateAll: () => {
      queryClient.invalidateQueries({
        queryKey: inscriptionDetailsKeys.all,
      });
    },
    invalidateLists: () => {
      queryClient.invalidateQueries({
        queryKey: inscriptionDetailsKeys.lists(),
      });
    },
    invalidateList: (inscriptionId: string, page: number, pageSize: number) => {
      queryClient.invalidateQueries({
        queryKey: inscriptionDetailsKeys.list(inscriptionId, page, pageSize),
      });
    },
  };
}

export function usePrefetchInscriptionDetailsQuery() {
  const queryClient = useQueryClient();

  return {
    prefetchNextPage: (
      inscriptionId: string,
      page: number,
      pageSize: number,
    ) => {
      queryClient.prefetchQuery({
        queryKey: inscriptionDetailsKeys.list(
          inscriptionId,
          page + 1,
          pageSize,
        ),
        queryFn: () =>
          getInscriptionDetails(inscriptionId, {
            page: page + 1,
            pageSize,
          }),
        staleTime: 5 * 60 * 1000,
      });
    },
  };
}
