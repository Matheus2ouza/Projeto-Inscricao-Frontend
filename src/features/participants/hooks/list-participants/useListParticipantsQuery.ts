import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getListParticipants } from '../../api/list-participants/getListParticipants';
import { InscriptionsStatus } from '../../types/list-participants/listParticipantsTypes';

// Chaves de query para organização - específicas para seleção de eventos
export const listParticipantsKeys = {
  all: ['list-participants'] as const,
  lists: () => [...listParticipantsKeys.all, 'list'] as const,
  list: (
    eventId: string,
    page: number,
    pageSize: number,
    inscriptionStatus?: InscriptionsStatus[],
    typeInscriptions?: string[],
    orderByName?: 'asc' | 'desc',
  ) =>
    [
      ...listParticipantsKeys.lists(),
      {
        eventId,
        page,
        pageSize,
        inscriptionStatus,
        typeInscriptions,
        orderByName,
      },
    ] as const,
  details: () => [...listParticipantsKeys.all, 'detail'] as const,
  detail: (id: string) => [...listParticipantsKeys.details(), id] as const,
};

export function useListParticipantsQuery(
  eventId: string,
  page: number,
  pageSize: number,
  inscriptionStatus?: InscriptionsStatus[],
  typeInscriptions?: string[],
  orderByName?: 'asc' | 'desc',
) {
  return useQuery({
    queryKey: listParticipantsKeys.list(
      eventId,
      page,
      pageSize,
      inscriptionStatus,
      typeInscriptions,
      orderByName,
    ),
    queryFn: () =>
      getListParticipants(
        eventId,
        page,
        pageSize,
        inscriptionStatus,
        typeInscriptions,
        orderByName,
      ),
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos
    retry: 2,
    refetchOnWindowFocus: false,
  });
}

// hook para pré-carregar a próxima página
export function usePrefetchListParticipantsQuery() {
  const queryClient = useQueryClient();

  return {
    prefetchNextPage: (
      eventId: string,
      page: number,
      pageSize: number,
      inscriptionStatus?: InscriptionsStatus[],
      typeInscriptions?: string[],
      orderByName?: 'asc' | 'desc',
    ) => {
      queryClient.prefetchQuery({
        queryKey: listParticipantsKeys.list(
          eventId,
          page + 1,
          pageSize,
          inscriptionStatus,
          typeInscriptions,
          orderByName,
        ),
        queryFn: () =>
          getListParticipants(
            eventId,
            page + 1,
            pageSize,
            inscriptionStatus,
            typeInscriptions,
            orderByName,
          ),
        staleTime: 5 * 60 * 1000, // 5 minutos
      });
    },
  };
}

// hook para invalidar o cache dos participantes
export function useInvalidateParticipants() {
  const queryClient = useQueryClient();

  return {
    invalidateAll: () => {
      queryClient.invalidateQueries({
        queryKey: listParticipantsKeys.all,
      });
    },

    invalidateLists: () => {
      queryClient.invalidateQueries({
        queryKey: listParticipantsKeys.lists(),
      });
    },

    invalidateList: (
      eventId: string,
      page: number,
      pageSize: number,
      inscriptionStatus?: InscriptionsStatus[],
      typeInscriptions?: string[],
      orderByName?: 'asc' | 'desc',
    ) => {
      queryClient.invalidateQueries({
        queryKey: listParticipantsKeys.list(
          eventId,
          page,
          pageSize,
          inscriptionStatus,
          typeInscriptions,
          orderByName,
        ),
      });
    },
    invalidateDetail: (id: string) => {
      queryClient.invalidateQueries({
        queryKey: listParticipantsKeys.detail(id),
      });
    },
  };
}
