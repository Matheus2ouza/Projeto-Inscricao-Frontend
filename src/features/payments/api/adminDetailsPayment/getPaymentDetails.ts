import type { PaymentsDetailsResponse } from '@/features/payments/types/adminDetailsPayment/paymentsDetailsTypes';
import { axiosClient } from '@/lib/axios/client';

export async function getPaymentDetails(
  paymentId: string,
): Promise<PaymentsDetailsResponse> {
  try {
    const { data } = await axiosClient.get<PaymentsDetailsResponse>(
      `/payments/${paymentId}/details`,
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
        'Não foi possível carregar os pagamentos',
    );
  }
}
