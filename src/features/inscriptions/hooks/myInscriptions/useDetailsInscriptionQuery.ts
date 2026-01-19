import { getDetailsInscription } from "@/features/inscriptions/api/MyInscriptions/getDetailsInscription";
import { DetailsInscriptionResponse } from "@/features/inscriptions/types/MyInscriptions/detailsInscriptionTypes";
import { useQuery, useQueryClient } from "@tanstack/react-query";

export const DetailsInscriptionKey = {
  all: ["detailsInscription"] as const,
  lists: () => [...DetailsInscriptionKey.all, "list"] as const,
  list: (eventId: string, page: number, pageSize: number, limitTime?: string) =>
    [
      ...DetailsInscriptionKey.lists(),
      { eventId, page, pageSize, limitTime },
    ] as const,
  details: () => [...DetailsInscriptionKey.all, "detail"] as const,
  detail: (id: string) => [...DetailsInscriptionKey.details(), id] as const,
};

export function useDetailsInscriptionQuery(inscriptionId: string) {
  return useQuery<DetailsInscriptionResponse>({
    queryKey: DetailsInscriptionKey.detail(inscriptionId),
    queryFn: () => getDetailsInscription(inscriptionId),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 2,
    refetchOnWindowFocus: false,
  });
}

export function useInvalidateDetailsInscriptionQuery() {
  const queryClient = useQueryClient();

  return {
    invalidateAll: () => {
      queryClient.invalidateQueries({
        queryKey: DetailsInscriptionKey.all,
      });
    },

    invalidateLists: () => {
      queryClient.invalidateQueries({
        queryKey: DetailsInscriptionKey.lists(),
      });
    },

    invalidateDetail: (id: string) => {
      queryClient.invalidateQueries({
        queryKey: DetailsInscriptionKey.detail(id),
      });
    },
  };
}
