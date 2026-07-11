import { axiosClient } from '@/lib/axios';
export async function deletePayment(paymentId: string) {
  try {
    const { data } = await axiosClient.delete(`/payments/${paymentId}`);
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
