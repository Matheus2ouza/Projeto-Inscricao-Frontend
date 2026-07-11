import {
  UpdateGuestParticipantInput,
  UpdateGuestParticipantResult,
} from '@/features/guest/types/detailsInscription/actions/updateParticipantType';
import { axiosClient } from '@/lib/axios';
export async function updateGuestParticipant(
  input: UpdateGuestParticipantInput,
): Promise<UpdateGuestParticipantResult> {
  try {
    const { data } = await axiosClient.put<UpdateGuestParticipantResult>(
      `participants/${input.participantId}/update`,
      input,
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
        'Não foi possível atualizar a inscrição',
    );
  }
}
