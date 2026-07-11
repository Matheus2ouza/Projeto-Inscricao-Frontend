import { axiosClient } from '@/lib/axios/';
import {
  FindAllWithInscriptionsRequest,
  FindAllWithInscriptionsResponse,
} from '../types/InscriptionsTypes';

export async function getEventsWithInscriptions(
  params: FindAllWithInscriptionsRequest,
): Promise<FindAllWithInscriptionsResponse> {
  const { data } = await axiosClient.get<FindAllWithInscriptionsResponse>(
    '/events/inscriptions',
    {
      params: {
        page: params.page,
        pageSize: params.pageSize,
      },
    },
  );
  return data;
}
