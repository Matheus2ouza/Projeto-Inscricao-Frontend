import { useQuery, useQueryClient } from "@tanstack/react-query";
import { registerPaymentDetails } from "../../api/registerPaymentDetails/registerPaymentDetails";

export const registerPaymentDetailsKeys = {
  all: ["registerPaymentDetails"] as const,
  lists: () => [...registerPaymentDetailsKeys.all, "list"] as const,
  list: (inscriptionId: string, page: number, pageSize: number) =>
    [
      ...registerPaymentDetailsKeys.lists(),
      { inscriptionId, page, pageSize },
    ] as const,
  details: () => [...registerPaymentDetailsKeys.all, "detail"] as const,
  detail: (inscriptionId: string) =>
    [...registerPaymentDetailsKeys.details(), inscriptionId] as const,
};

export function useRegisterPaymentDetailsQuery(
  inscriptionId: string,
  page: number,
  pageSize: number,
) {
  return useQuery({
    queryKey: registerPaymentDetailsKeys.list(inscriptionId, page, pageSize),
    queryFn: () => registerPaymentDetails(inscriptionId, page, pageSize),
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos
    retry: 2,
    refetchOnWindowFocus: true,
  });
}

export function usePrefetchRegisterPaymentDetailsQuery() {
  const queryClient = useQueryClient();

  return {
    prefetchNextPage: (
      inscriptionId: string,
      page: number,
      pageSize: number,
    ) => {
      queryClient.prefetchQuery({
        queryKey: registerPaymentDetailsKeys.list(
          inscriptionId,
          page + 1,
          pageSize,
        ),
        queryFn: () =>
          registerPaymentDetails(inscriptionId, page + 1, pageSize),
        staleTime: 5 * 60 * 1000,
      });
    },
  };
}

export function useInvalidateRegisterPaymentDetailsQuery() {
  const queryClient = useQueryClient();

  return {
    invalidateAll: () => {
      queryClient.invalidateQueries({
        queryKey: registerPaymentDetailsKeys.all,
      });
    },

    invalidateLists: () => {
      queryClient.invalidateQueries({
        queryKey: registerPaymentDetailsKeys.lists(),
      });
    },

    invalidateDetail: (inscriptionId: string) => {
      queryClient.invalidateQueries({
        queryKey: registerPaymentDetailsKeys.detail(inscriptionId),
      });
    },
  };
}
