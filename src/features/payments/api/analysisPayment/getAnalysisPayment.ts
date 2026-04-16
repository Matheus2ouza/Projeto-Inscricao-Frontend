import { AnalysisPaymentsResponse } from '@/features/payments/types/analysisPayment/analysisPayment';
import axiosInstance from '@/shared/lib/apiClient';

export async function getAnalysisPayment(
  eventId: string,
  page: number,
  pageSize: number,
): Promise<AnalysisPaymentsResponse> {
  try {
    const { data } = await axiosInstance.get<AnalysisPaymentsResponse>(
      `/payments/${eventId}/analysis-pending`,
      {
        params: {
          page,
          pageSize,
        },
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
