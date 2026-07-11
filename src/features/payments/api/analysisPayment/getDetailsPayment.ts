import { axiosClient } from '@/lib/axios';
import { AnalysisPaymentsDetailsResponse } from '../../types/analysisPayment/analysisPaymentDetails';

export async function getDetailsPayment(
  paymentId: string,
): Promise<AnalysisPaymentsDetailsResponse> {
  try {
    const { data } = await axiosClient.get<AnalysisPaymentsDetailsResponse>(
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
        'Não foi possível carregar os membros.',
    );
  }
}
