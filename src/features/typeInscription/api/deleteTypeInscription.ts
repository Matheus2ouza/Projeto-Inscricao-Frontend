import { axiosClient } from '@/lib/axios/';

export async function deleteTypeInscription(
  typeInscriptionId: string,
): Promise<void> {
  try {
    await axiosClient.delete(`/type-inscription/${typeInscriptionId}`);
  } catch (error) {
    const axiosError = error as {
      response?: { data?: { message?: string } };
      message?: string;
    };

    throw new Error(
      axiosError.response?.data?.message ??
        axiosError.message ??
        'Não foi possível deletar o tipo de inscrição',
    );
  }
}
