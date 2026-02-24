import { getDetailsInscription } from "@/features/inscriptions/api/list-inscriptions/inscription/getDetailsInscriptions";
import { DetailsInscriptionResponse } from "@/features/inscriptions/types/list-inscriptions/inscription/detailsInscriptionTypes";
import { useQuery, useQueryClient } from "@tanstack/react-query";

export const DetailsInscriptionKey = {
  all: ["details-inscriptions"],
  details: (inscriptionId: string) => [
    ...DetailsInscriptionKey.all,
    inscriptionId,
  ],
  detail: (inscriptionId: string) => [
    ...DetailsInscriptionKey.details(inscriptionId),
    "detail",
  ],
};

export function useDetailsInscriptionQuery(inscriptionId: string) {
  return useQuery<DetailsInscriptionResponse>({
    queryKey: DetailsInscriptionKey.detail(inscriptionId),
    queryFn: () => getDetailsInscription(inscriptionId),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
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
    invalidateDetail: (inscriptionId: string) => {
      queryClient.invalidateQueries({
        queryKey: DetailsInscriptionKey.detail(inscriptionId),
      });
    },
  };
}
