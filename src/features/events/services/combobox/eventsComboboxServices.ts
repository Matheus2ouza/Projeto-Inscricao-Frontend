'use server';

import {
  EventResponse,
  StatusEvent,
} from '@/features/events/types/combobox/comboboxEventTypes';
import { axiosServer } from '@/lib/axios/server';
import qs from 'qs';

export async function eventsComboboxService(
  status?: StatusEvent | StatusEvent[],
): Promise<EventResponse> {
  const { data } = await axiosServer.get<EventResponse>('/events/all/names', {
    params: {
      status,
    },
    paramsSerializer: (p) => qs.stringify(p, { arrayFormat: 'repeat' }),
  });
  return data;
}
