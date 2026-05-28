import axiosInstance from '@/shared/lib/apiClient';
import qs from 'qs';
import {
  GetListParticipantsResponse,
  InscriptionsStatus,
} from '../../types/list-participants/listParticipantsTypes';

export async function getListParticipants(
  eventId: string,
  page: number,
  pageSize: number,
  // filters
  inscriptionStatus?: InscriptionsStatus[],
  typeInscriptions?: string[],
  orderByName?: 'asc' | 'desc',
): Promise<GetListParticipantsResponse> {
  try {
    const { data } = await axiosInstance.get<GetListParticipantsResponse>(
      `/participants/${eventId}`,
      {
        params: {
          page: page,
          pageSize: pageSize,
          inscriptionStatus: inscriptionStatus,
          typeInscriptions: typeInscriptions,
          orderByName: orderByName,
        },
        paramsSerializer: (p) => qs.stringify(p, { arrayFormat: 'repeat' }),
      },
    );
    return data;
  } catch (error) {
    const axiosError = error as {
      response?: { data?: { message?: string } };
      message?: string;
    };

    throw new Error(
      axiosError.response?.data?.message ??
        axiosError.message ??
        'Não foi possível carregar os participantes',
    );
  }
}
