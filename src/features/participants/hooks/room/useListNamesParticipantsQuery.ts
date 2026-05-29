import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getListNamesParticipants } from '../../api/room/getListNamesParticipants';

// Chaves de query para organização - específicas para seleção de eventos
export const listNamesParticipantsKeys = {
  all: ['list-participants'] as const,
  lists: () => [...listNamesParticipantsKeys.all, 'list'] as const,
  list: (eventId?: string) =>
    [
      ...listNamesParticipantsKeys.lists(),
      {
        eventId,
      },
    ] as const,
  details: () => [...listNamesParticipantsKeys.all, 'detail'] as const,
  detail: (id: string) => [...listNamesParticipantsKeys.details(), id] as const,
};

export function useListNamesParticipantsQuery(eventId?: string) {
  return useQuery({
    queryKey: listNamesParticipantsKeys.list(eventId),
    queryFn: () => getListNamesParticipants(eventId),
    enabled: !!eventId,
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos
    retry: 2,
    refetchOnWindowFocus: false,
  });
}

// hook para invalidar o cache dos participantes
export function useInvalidateListNamesParticipants() {
  const queryClient = useQueryClient();

  return {
    invalidateAll: () => {
      queryClient.invalidateQueries({
        queryKey: listNamesParticipantsKeys.all,
      });
    },

    invalidateLists: () => {
      queryClient.invalidateQueries({
        queryKey: listNamesParticipantsKeys.lists(),
      });
    },

    invalidateList: (eventId?: string) => {
      queryClient.invalidateQueries({
        queryKey: listNamesParticipantsKeys.list(eventId),
      });
    },
    invalidateDetail: (id: string) => {
      queryClient.invalidateQueries({
        queryKey: listNamesParticipantsKeys.detail(id),
      });
    },
  };
}
