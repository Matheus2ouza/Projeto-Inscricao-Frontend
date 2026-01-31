import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getDetailsInscription } from "../../api/detailsInscription/getDetailsInscription";

export const detailsInscriptionKeys = {
  all: ["details-inscription"] as const,
  lists: () => [...detailsInscriptionKeys.all, "list"] as const,
  list: (confirmationCode: string) =>
    [...detailsInscriptionKeys.lists(), confirmationCode] as const,
};

export function useDetailsInscriptionQuery(confirmationCode: string) {
  return useQuery({
    queryKey: detailsInscriptionKeys.list(confirmationCode),
    queryFn: () => getDetailsInscription(confirmationCode),
    enabled: !!confirmationCode,
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
        queryKey: detailsInscriptionKeys.all,
      });
    },

    invalidateLists: () => {
      queryClient.invalidateQueries({
        queryKey: detailsInscriptionKeys.lists(),
      });
    },

    invalidateDetail: (confirmationCode: string) => {
      queryClient.invalidateQueries({
        queryKey: detailsInscriptionKeys.list(confirmationCode),
      });
    },
  };
}
