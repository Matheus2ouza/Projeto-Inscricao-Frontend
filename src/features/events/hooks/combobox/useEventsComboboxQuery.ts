import {
  EventResponse,
  StatusEvent,
} from '@/features/events/types/combobox/comboboxEventTypes';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { getEventsCombobox } from '../../api/combobox/getEventsCombobox';

export const eventComboboxKeys = {
  all: ['event-combobox'] as const,
  lists: () => [...eventComboboxKeys.all, 'list'] as const,
  list: (status?: StatusEvent | StatusEvent[]) =>
    [...eventComboboxKeys.lists(), status] as const,
};

export function useEventsComboboxQuery(status?: StatusEvent | StatusEvent[]) {
  return useQuery<EventResponse>({
    queryKey: eventComboboxKeys.list(status),
    queryFn: () => getEventsCombobox(status),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    placeholderData: keepPreviousData,
    refetchOnWindowFocus: false,
  });
}
