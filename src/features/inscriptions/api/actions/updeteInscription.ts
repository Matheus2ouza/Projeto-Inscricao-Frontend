import {
  UpdateInscriptionParams,
  UpdateInscriptionResponse,
} from '@/features/inscriptions/types/actions/updeteInscriptionType';
import { axiosClient } from '@/lib/axios';
export async function updateInscription({
  id,
  responsible,
  phone,
  email,
  observation,
}: UpdateInscriptionParams): Promise<UpdateInscriptionResponse> {
  try {
    const response = await axiosClient.put<UpdateInscriptionResponse>(
      `inscriptions/${id}`,
      {
        responsible,
        phone,
        email,
        observation,
      },
    );
    return response.data;
  } catch (error) {
    const axiosError = error as {
      response?: { data?: { message?: string } };
      message?: string;
    };
    throw new Error(
      axiosError.response?.data?.message ??
        axiosError.message ??
        'Não foi possível atualizar os dados da inscrição.',
    );
  }
}
