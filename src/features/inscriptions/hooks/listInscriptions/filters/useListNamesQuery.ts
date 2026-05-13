import { getListNames } from '@/features/inscriptions/api/listInscriptions/filters/list-names/getListNames';
import { useQuery, useQueryClient } from '@tanstack/react-query';

export const listNamesKey = {
  all: ['list-names'] as const,
  lists: () => [...listNamesKey.all, 'list'] as const,
  list: (eventId: string) => [...listNamesKey.lists(), eventId] as const,
};

export function useListNamesQuery(eventId: string) {
  return useQuery({
    queryKey: listNamesKey.list(eventId),
    queryFn: () => getListNames({ eventId }),
    enabled: !!eventId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
}

export function useInvalidateListNamesQuery() {
  const queryClient = useQueryClient();

  return {
    invalidateAll: () => {
      queryClient.invalidateQueries({
        queryKey: listNamesKey.all,
      });
    },
    invalidateList: (eventId: string) => {
      queryClient.invalidateQueries({
        queryKey: listNamesKey.list(eventId),
      });
    },
    removeAll: () => {
      queryClient.removeQueries({
        queryKey: listNamesKey.all,
      });
    },
    removeList: (eventId: string) => {
      queryClient.removeQueries({
        queryKey: listNamesKey.list(eventId),
      });
    },
  };
}
