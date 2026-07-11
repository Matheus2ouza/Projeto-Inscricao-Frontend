import {
  ReversePaymentInput,
  ReversePaymentResponse,
} from '@/features/payments/types/analysisPayment/actions/reversePaymentTypes';
import { axiosClient } from '@/lib/axios/client';

export async function reversePayment({
  paymentId,
}: ReversePaymentInput): Promise<ReversePaymentResponse> {
  try {
    const { data } = await axiosClient.post<ReversePaymentResponse>(
      `payments/${paymentId}/analysis/reverse`,
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
