import { axiosClient } from '@/lib/axios/client';
export async function deletePayment(paymentId: string): Promise<void> {
  try {
    await axiosClient.delete(`/payments/${paymentId}/delete`);
  } catch (error) {
    const axiosError = error as {
      response?: { data?: { message?: string } };
      message?: string;
    };

    throw new Error(
      axiosError.response?.data?.message || 'Erro ao deletar pagamento',
    );
  }
}
