import { getListInscriptions } from '@/features/inscriptions/api/list-inscriptions/getListInscriptions';
import {
  InscriptionStatus,
  ListInscriptionsResponse,
} from '@/features/inscriptions/types/list-inscriptions/listInscriptionsTypes';
import {
  keepPreviousData,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';

export const listInscriptionsKeys = {
  all: ['list-inscriptions'] as const,
  lists: () => [...listInscriptionsKeys.all, 'list'] as const,
  list: (
    eventId: string,
    page: number,
    pageSize: number,
    status?: InscriptionStatus[],
    isGuest?: boolean,
    orderByCreatedAt?: 'asc' | 'desc',
    orderByResponsible?: 'asc' | 'desc',
    period?: string,
    responsible?: string,
  ) =>
    [
      ...listInscriptionsKeys.lists(),
      eventId,
      page,
      pageSize,
      status,
      isGuest,
      orderByCreatedAt,
      orderByResponsible,
      period,
      responsible,
    ] as const,
};

export function useListInscritionsQuery(
  eventId: string,
  page: number,
  pageSize: number,
  status?: InscriptionStatus[],
  isGuest?: boolean,
  orderByCreatedAt?: 'asc' | 'desc',
  orderByResponsible?: 'asc' | 'desc',
  period?: string,
  responsible?: string,
) {
  return useQuery<ListInscriptionsResponse>({
    queryKey: listInscriptionsKeys.list(
      eventId,
      page,
      pageSize,
      status,
      isGuest,
      orderByCreatedAt,
      orderByResponsible,
      period,
      responsible,
    ),
    queryFn: () =>
      getListInscriptions({
        eventId,
        status,
        isGuest,
        orderByCreatedAt,
        orderByResponsible,
        period,
        responsible,
        page,
        pageSize,
      }),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    placeholderData: keepPreviousData,
    refetchOnWindowFocus: false,
  });
}

export function useInvalidateListInscriptionsQuery() {
  const queryClient = useQueryClient();

  return {
    invalidateAll: () => {
      queryClient.invalidateQueries({
        queryKey: listInscriptionsKeys.all,
      });
    },
    invalidateList: (
      eventId: string,
      page: number,
      pageSize: number,
      status?: InscriptionStatus[],
      isGuest?: boolean,
      orderByCreatedAt?: 'asc' | 'desc',
      orderByResponsible?: 'asc' | 'desc',
      period?: string,
      responsible?: string,
    ) => {
      queryClient.invalidateQueries({
        queryKey: listInscriptionsKeys.list(
          eventId,
          page,
          pageSize,
          status,
          isGuest,
          orderByCreatedAt,
          orderByResponsible,
          period,
          responsible,
        ),
      });
    },
  };
}
