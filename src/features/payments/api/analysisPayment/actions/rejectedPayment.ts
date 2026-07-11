import {
  RejectedPaymentInput,
  RejectedPaymentResponse,
} from '@/features/payments/types/analysisPayment/actions/rejectedPaymentTypes';
import { axiosClient } from '@/lib/axios/client';
export async function rejectPayment({
  paymentId,
  rejectionReason,
}: RejectedPaymentInput): Promise<RejectedPaymentResponse> {
  try {
    const { data } = await axiosClient.post<RejectedPaymentResponse>(
      `payments/${paymentId}/analysis/rejected`,
      {
        rejectionReason,
      },
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
