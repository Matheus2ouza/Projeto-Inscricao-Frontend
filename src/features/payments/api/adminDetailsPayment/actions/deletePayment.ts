import { DeletePaymentInput } from '@/features/payments/types/adminDetailsPayment/actions/deletePaymentTypes';
import { axiosClient } from '@/lib/axios/client';

export async function deletePayment({ paymentId }: DeletePaymentInput) {
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
