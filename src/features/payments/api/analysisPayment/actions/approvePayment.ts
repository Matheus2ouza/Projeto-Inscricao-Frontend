import {
  ApprovePaymentInput,
  ApprovePaymentResponse,
} from '@/features/payments/types/analysisPayment/actions/approvePaymentTypes';
import axiosInstance from '@/shared/lib/apiClient';

export async function approvePayment({
  paymentId,
}: ApprovePaymentInput): Promise<ApprovePaymentResponse> {
  try {
    const { data } = await axiosInstance.post<ApprovePaymentResponse>(
      `payments/${paymentId}/analysis/approve`,
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
