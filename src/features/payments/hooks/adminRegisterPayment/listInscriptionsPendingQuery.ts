import { useQuery, useQueryClient } from '@tanstack/react-query';
import { listInscriptionsPending } from '../../api/adminRegisterPayment/listInscriptionsPending';

export const listInscriptionsPendingKey = {
  all: ['listInscriptionsPending'] as const,
  list: (eventId: string) =>
    [...listInscriptionsPendingKey.all, { eventId }] as const,
};

export function useListInscriptionsPendingQuery(eventId: string) {
  return useQuery({
    queryKey: listInscriptionsPendingKey.list(eventId),
    queryFn: () => listInscriptionsPending(eventId),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 2,
    refetchOnWindowFocus: false,
  });
}

export function useInvalidateListInscriptionsPendingQuery() {
  const queryClient = useQueryClient();

  return {
    invalidateAll: () => {
      queryClient.invalidateQueries({
        queryKey: listInscriptionsPendingKey.all,
      });
    },

    invalidateList: (eventId: string, responsible?: string) => {
      queryClient.invalidateQueries({
        queryKey: listInscriptionsPendingKey.list(eventId),
      });
    },
  };
}
