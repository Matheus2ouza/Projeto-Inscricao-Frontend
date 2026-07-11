import { axiosClient } from '@/lib/axios';
export async function deleteInscription(inscriptionId: string): Promise<void> {
  try {
    await axiosClient.delete(`/inscriptions/${inscriptionId}/delete`);
  } catch (error) {
    const axiosError = error as {
      response?: { data?: { message?: string } };
      message?: string;
    };

    throw new Error(
      axiosError.response?.data?.message || 'Falha ao deletar inscrição',
    );
  }
}
