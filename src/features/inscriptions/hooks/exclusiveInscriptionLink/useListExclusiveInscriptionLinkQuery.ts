import {
  keepPreviousData,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { getListExclusiveInscriptionLinks } from '../../api/exclusiveInscriptionLink/getListExclusiveInscriptionLinks';
import { ListExclusiveInscriptionLinksResponse } from '../../types/exclusiveInscriptionLink/exclusiveInscriptionLinkTypes';

export const exclusiveInscriptionLinkKeys = {
  all: ['exclusiveInscriptionLinks'] as const,
  lists: () => [...exclusiveInscriptionLinkKeys.all, 'list'] as const,
  list: (page: number, pageSize: number, eventId?: string) =>
    [...exclusiveInscriptionLinkKeys.lists(), eventId, page, pageSize] as const,
  listsByEvent: (eventId?: string) =>
    [...exclusiveInscriptionLinkKeys.lists(), eventId] as const,
};

export function useListExclusiveInscriptionLinkQuery(
  page: number,
  pageSize: number,
  eventId?: string,
) {
  return useQuery<ListExclusiveInscriptionLinksResponse>({
    queryKey: exclusiveInscriptionLinkKeys.list(page, pageSize, eventId),
    queryFn: () =>
      getListExclusiveInscriptionLinks({
        eventId,
        page,
        pageSize,
      }),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    enabled: Boolean(eventId),
    placeholderData: keepPreviousData,
    refetchOnWindowFocus: false,
  });
}

export function useInvalidateListExclusiveInscriptionLinkQuery() {
  const queryClient = useQueryClient();

  return {
    invalidateAll: () =>
      queryClient.invalidateQueries({
        queryKey: exclusiveInscriptionLinkKeys.all,
      }),

    invalidateList: (page: number, pageSize: number, eventId?: string) =>
      queryClient.invalidateQueries({
        queryKey: exclusiveInscriptionLinkKeys.list(page, pageSize, eventId),
      }),

    invalidateLists: (eventId?: string) =>
      queryClient.invalidateQueries({
        queryKey: exclusiveInscriptionLinkKeys.listsByEvent(eventId),
      }),
  };
}
