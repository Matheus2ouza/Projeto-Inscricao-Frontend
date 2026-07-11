import { getAllEventsResponse } from '@/features/tickets/types/selectEvent';
import { axiosClient } from '@/lib/axios';
import qs from 'qs';
import type { StatusEvent } from '../types/selectEvent';

export async function getEvents(params: {
  page: number;
  pageSize: number;
  status?: StatusEvent[];
}): Promise<getAllEventsResponse> {
  const { data } = await axiosClient.get<getAllEventsResponse>(
    '/events/tickets',
    {
      params: {
        page: params.page,
        pageSize: params.pageSize,
        status: params.status,
      },
      paramsSerializer: (p) => qs.stringify(p, { arrayFormat: 'repeat' }),
    },
  );
  return data;
}
