import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getDetailsInscription } from "../../api/detailsInscription/getDetailsInscription";

export const detailsGuestInscriptionKeys = {
  all: ["details-guest-inscription"] as const,
  lists: () => [...detailsGuestInscriptionKeys.all, "list"] as const,
  list: (confirmationCode: string) =>
    [...detailsGuestInscriptionKeys.lists(), confirmationCode] as const,
};

export function useDetailsInscriptionQuery(confirmationCode: string) {
  return useQuery({
    queryKey: detailsGuestInscriptionKeys.list(confirmationCode),
    queryFn: () => getDetailsInscription(confirmationCode),
    enabled: !!confirmationCode,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 2,
    refetchOnWindowFocus: false,
  });
}

export function useInvalidateDetailsGuestInscriptionQuery() {
  const queryClient = useQueryClient();

  return {
    invalidateAll: () => {
      queryClient.invalidateQueries({
        queryKey: detailsGuestInscriptionKeys.all,
      });
    },

    invalidateLists: () => {
      queryClient.invalidateQueries({
        queryKey: detailsGuestInscriptionKeys.lists(),
      });
    },

    invalidateDetail: (confirmationCode: string) => {
      queryClient.invalidateQueries({
        queryKey: detailsGuestInscriptionKeys.list(confirmationCode),
      });
    },
  };
}
