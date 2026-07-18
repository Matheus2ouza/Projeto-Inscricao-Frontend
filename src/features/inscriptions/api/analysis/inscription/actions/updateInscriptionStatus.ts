import { axiosClient } from '@/lib/axios';
export async function updateInscriptionStatus(
  inscriptionId: string,
  status: 'PENDING' | 'CANCELLED',
): Promise<void> {
  try {
    await axiosClient.patch(
      `/inscriptions/${inscriptionId}/status`,
      {},
      {
        params: {
          status: status,
        },
      },
    );
  } catch (error) {
    console.error('Error updating inscription status:', error);
    const axiosError = error as {
      response?: { data?: { message?: string } };
      message?: string;
    };

    throw new Error(
      axiosError.response?.data?.message ||
        'Falha ao atualizar status da inscrição',
    );
  }
}
