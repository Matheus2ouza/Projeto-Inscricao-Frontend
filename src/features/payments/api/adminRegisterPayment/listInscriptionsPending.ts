import axiosInstance from '@/shared/lib/apiClient';

export async function listInscriptionsPending(eventId: string) {
  try {
    const { data } = await axiosInstance.get(`inscriptions/${eventId}/list`, {
      params: {
        status: 'PENDING',
      },
    });
    return data;
  } catch (error) {
    const axiosError = error as {
      response?: { data?: { message?: string } };
      message?: string;
    };

    throw new Error(
      axiosError.response?.data?.message ??
        axiosError.message ??
        'Não foi possível carregar as inscrições pendentes.',
    );
  }
}
