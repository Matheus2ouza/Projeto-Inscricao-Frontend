import {
  EventResponse,
  StatusEvent,
} from '@/features/events/types/combobox/comboboxEventTypes';
import { axiosClient } from '@/lib/axios';
import qs from 'qs';

export async function getEventsCombobox(
  status?: StatusEvent | StatusEvent[],
): Promise<EventResponse> {
  const { data } = await axiosClient.get<EventResponse>('/events/all/names', {
    params: {
      status,
    },
    paramsSerializer: (p) => qs.stringify(p, { arrayFormat: 'repeat' }),
  });
  return data;
}
