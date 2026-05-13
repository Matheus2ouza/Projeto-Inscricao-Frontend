import axiosInstance from '@/shared/lib/apiClient';
import {
  ListExclusiveInscriptionLinksInput,
  ListExclusiveInscriptionLinksResponse,
} from '../../types/exclusiveInscriptionLink/exclusiveInscriptionLinkTypes';

export async function getListExclusiveInscriptionLinks({
  eventId,
  page,
  pageSize,
}: ListExclusiveInscriptionLinksInput): Promise<ListExclusiveInscriptionLinksResponse> {
  try {
    const { data } = await axiosInstance.get(
      `exclusive-inscription/find-all/${eventId}`,
      {
        params: {
          page,
          pageSize,
        },
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
        'Não foi possível buscar os links de inscrição.',
    );
  }
}
