import {
  ListNamesInput,
  ListNamesResponse,
} from '@/features/inscriptions/types/listInscriptions/filters/list-names/listNamesTypes';
import axiosInstance from '@/shared/lib/apiClient';

export async function getListNames({ eventId }: ListNamesInput) {
  try {
    const { data } = await axiosInstance.get<ListNamesResponse>(
      `/inscriptions/${eventId}/all/names`,
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
        'Não foi possível buscar os detalhes da inscrição.',
    );
  }
}
