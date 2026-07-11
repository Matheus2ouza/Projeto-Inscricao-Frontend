import {
  UpdateGuestInscriptionInput,
  UpdateGuestInscriptionResult,
} from '@/features/guest/types/detailsInscription/actions/updateInscriptionType';
import { axiosClient } from '@/lib/axios';
export async function updateGuestInscription(
  input: UpdateGuestInscriptionInput,
): Promise<UpdateGuestInscriptionResult> {
  try {
    const { data } = await axiosClient.put<UpdateGuestInscriptionResult>(
      `/inscriptions/${input.inscriptionId}/guest`,
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
