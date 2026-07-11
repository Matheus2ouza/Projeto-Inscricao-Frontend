import type { StatusEvent } from '@/features/expenses/types/selectEvent';
import { getAllEventsResponse } from '@/features/expenses/types/selectEvent';
import { axiosClient } from '@/lib/axios/client';
import qs from 'qs';

export async function getEvents(params: {
  page: number;
  pageSize: number;
  status?: StatusEvent[];
}): Promise<getAllEventsResponse> {
  const { data } = await axiosClient.get<getAllEventsResponse>(
    '/events/expenses',
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
