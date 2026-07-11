import { axiosClient } from '@/lib/axios/';
import {
  FindAllPaginatedInscriptionRequest,
  FindAllPaginatedInscriptionResponse,
} from '../types/InscriptionsTypes';

export async function getAllInscriptions(
  eventId: string,
  params: FindAllPaginatedInscriptionRequest,
): Promise<FindAllPaginatedInscriptionResponse> {
  const { data } = await axiosClient.get<FindAllPaginatedInscriptionResponse>(
    `/inscriptions/${eventId}`,
    {
      params: {
        page: params.page,
        pageSize: params.pageSize,
        limitTime: params.limitTime,
      },
    },
  );
  return data;
}
