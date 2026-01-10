import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getInscriptionsInAnalisis } from "../../api/registerPayment/getInscriptionsInAnalisis";
import { ListAllPaymentsResponse } from "../../types/registerPayment/registerPaymentTypes";

export const InscriptionsInAnalisisKeys = {
  all: ["inscriptions"] as const,
  lists: () => [...InscriptionsInAnalisisKeys.all, "list"] as const,
  list: (eventId: string, page: number, pageSize: number) =>
    [
      ...InscriptionsInAnalisisKeys.lists(),
      { eventId, page, pageSize },
    ] as const,
  details: () => [...InscriptionsInAnalisisKeys.all, "detail"] as const,
  detail: (id: string) =>
    [...InscriptionsInAnalisisKeys.details(), id] as const,
};

export function UseInscriptionsInAnalisisQuery(
  eventId: string,
  page: number = 1,
  pageSize: number = 20
) {
  return useQuery<ListAllPaymentsResponse>({
    queryKey: InscriptionsInAnalisisKeys.list(eventId, page, pageSize),
    queryFn: () => getInscriptionsInAnalisis(eventId, page, pageSize),
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos
    retry: 2,
    refetchOnWindowFocus: false,
  });
}

export function useInvalidateInscriptionsInAnalisisQuery() {
  const queryClient = useQueryClient();

  return {
    invalidateAll: () => {
      queryClient.invalidateQueries({
        queryKey: InscriptionsInAnalisisKeys.all,
      });
    },

    invalidateLists: () => {
      queryClient.invalidateQueries({
        queryKey: InscriptionsInAnalisisKeys.lists(),
      });
    },

    invalidateDetail: (id: string) => {
      queryClient.invalidateQueries({
        queryKey: InscriptionsInAnalisisKeys.detail(id),
      });
    },
  };
}

// Hook pré-fetch for members
export function usePrefetchInscriptionsInAnalisisQuery() {
  const queryClient = useQueryClient();

  return {
    prefetchNextPage: (eventId: string, page: number, pageSize: number) => {
      queryClient.prefetchQuery({
        queryKey: InscriptionsInAnalisisKeys.list(eventId, page + 1, pageSize),
        queryFn: () =>
          getInscriptionsInAnalisis(eventId, pageSize + 1, pageSize),
        staleTime: 5 * 60 * 1000,
      });
    },
  };
}
