import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getEvent } from "../../api/registerPaymentPublic/getEvent";

export const registerPaymentPublicKeys = {
  all: ["registerPaymentPublic"] as const,
  lists: () => [...registerPaymentPublicKeys.all, "list"] as const,
  list: (eventId: string) =>
    [...registerPaymentPublicKeys.lists(), { eventId }] as const,
  details: () => [...registerPaymentPublicKeys.all, "detail"] as const,
  detail: (eventId: string) =>
    [...registerPaymentPublicKeys.details(), eventId] as const,
};

export function useRegisterPaymentPublicQuery(eventId: string) {
  return useQuery({
    queryKey: registerPaymentPublicKeys.list(eventId),
    queryFn: () => getEvent(eventId),
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos
    retry: 2,
    refetchOnWindowFocus: true,
  });
}
export function useInvalidateRegisterPaymentDetailsPublicQuery() {
  const queryClient = useQueryClient();

  return {
    invalidateAll: () => {
      queryClient.invalidateQueries({
        queryKey: registerPaymentPublicKeys.all,
      });
    },

    invalidateLists: () => {
      queryClient.invalidateQueries({
        queryKey: registerPaymentPublicKeys.lists(),
      });
    },

    invalidateDetail: (eventId: string) => {
      queryClient.invalidateQueries({
        queryKey: registerPaymentPublicKeys.detail(eventId),
      });
    },
  };
}
