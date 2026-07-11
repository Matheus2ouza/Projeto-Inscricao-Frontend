import { InscriptionDetails } from '@/features/guest/types/detailsInscription/detailsInscriptionType';
import { axiosClient } from '@/lib/axios';
export async function getDetailsInscription(
  confirmationCode: string,
): Promise<InscriptionDetails> {
  try {
    const { data } = await axiosClient.get<InscriptionDetails>(
      `inscription/guest/${confirmationCode}/details`,
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
        'Não foi possível carregar os membros.',
    );
  }
}
