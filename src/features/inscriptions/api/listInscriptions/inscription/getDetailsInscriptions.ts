import { DetailsInscriptionResponse } from '@/features/inscriptions/types/listInscriptions/inscription/detailsInscriptionTypes';
import { axiosClient } from '@/lib/axios/client';

export async function getDetailsInscription(
  inscriptionId: string,
): Promise<DetailsInscriptionResponse> {
  try {
    const { data } = await axiosClient.get<DetailsInscriptionResponse>(
      `/inscriptions/${inscriptionId}/details`,
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
