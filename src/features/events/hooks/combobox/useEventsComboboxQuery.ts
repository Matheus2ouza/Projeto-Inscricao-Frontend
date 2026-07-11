'use client';

import { eventsComboboxAction } from '@/features/events/actions/combobox/eventsComboboxActions';
import type {
  EventResponse,
  StatusEvent,
} from '@/features/events/types/combobox/comboboxEventTypes';
import {
  keepPreviousData,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';

export const eventComboboxKeys = {
  all: ['event-combobox'] as const,
  lists: () => [...eventComboboxKeys.all, 'list'] as const,
  list: (status?: StatusEvent | StatusEvent[]) =>
    [...eventComboboxKeys.lists(), status] as const,
};

export function useEventsComboboxQuery(status?: StatusEvent | StatusEvent[]) {
  return useQuery<EventResponse>({
    queryKey: eventComboboxKeys.list(status),
    queryFn: () => eventsComboboxAction(status),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    placeholderData: keepPreviousData,
    refetchOnWindowFocus: false,
  });
}

export function useInvalidateEventsComboboxQuery() {
  const queryClient = useQueryClient();

  return {
    invalidateAll: () => {
      queryClient.invalidateQueries({
        queryKey: eventComboboxKeys.all,
      });
    },

    invalidateLists: () => {
      queryClient.invalidateQueries({
        queryKey: eventComboboxKeys.lists(),
      });
    },

    invalidateList: (status?: StatusEvent | StatusEvent[]) => {
      queryClient.invalidateQueries({
        queryKey: eventComboboxKeys.list(status),
      });
    },

    removeAll: () => {
      queryClient.removeQueries({
        queryKey: eventComboboxKeys.all,
      });
    },

    removeLists: () => {
      queryClient.removeQueries({
        queryKey: eventComboboxKeys.lists(),
      });
    },

    removeList: (status?: StatusEvent | StatusEvent[]) => {
      queryClient.removeQueries({
        queryKey: eventComboboxKeys.list(status),
      });
    },

    setListData: (
      status: StatusEvent | StatusEvent[] | undefined,
      data: EventResponse,
    ) => {
      queryClient.setQueryData(eventComboboxKeys.list(status), data);
    },
  };
}
