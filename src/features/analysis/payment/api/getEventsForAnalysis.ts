import { axiosClient } from '@/lib/axios/';
import qs from 'qs';
import { getAllEventsResponse } from '../types/eventTypes';

export async function getEventsToAnalysis(params: {
  page: number;
  pageSize: number;
  status?: string[];
}): Promise<getAllEventsResponse> {
  const { data } = await axiosClient.get<getAllEventsResponse>(
    '/events/analysis/payment',
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
