import axiosInstance from '@/shared/lib/apiClient';
import { GetListNamesParticipantsResponse } from '../../types/room/listParticipantsRoomTypes';

export async function getListNamesParticipants(
  eventId?: string,
): Promise<GetListNamesParticipantsResponse> {
  try {
    const { data } = await axiosInstance.get(`participants/${eventId}/names`);
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
