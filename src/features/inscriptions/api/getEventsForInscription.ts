import { axiosClient } from '@/lib/axios/client';
import qs from 'qs';
import type { EventsListResponse, StatusEvent } from '../types/listEventsTypes';

export type GetEventsForInscriptionParams = {
  page: number;
  pageSize: number;
  status?: StatusEvent[];
};

export async function getEventsForInscription(
  params: GetEventsForInscriptionParams,
): Promise<EventsListResponse> {
  const { data } = await axiosClient.get<EventsListResponse>(
    '/events/inscriptions',
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
