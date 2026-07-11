import { axiosClient } from '@/lib/axios/client';
import { GetListNamesParticipantsResponse } from '../../types/room/listParticipantsRoomTypes';

export async function getListNamesParticipants(
  eventId?: string,
): Promise<GetListNamesParticipantsResponse> {
  try {
    const { data } = await axiosClient.get(`participants/${eventId}/names`);
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
