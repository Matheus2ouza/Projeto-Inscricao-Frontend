import { axiosClient } from '@/lib/axios/client';
import {
  AnalysisPaymentRequest,
  AnalysisPaymentResponse,
} from '../types/analysisTypes';

export async function getPaymentDetails(
  inscriptionId: string,
  params: AnalysisPaymentRequest,
): Promise<AnalysisPaymentResponse> {
  try {
    const { data } = await axiosClient.get<AnalysisPaymentResponse>(
      `/payments/${inscriptionId}/analysis`,
      {
        params: {
          page: params.page,
          pageSize: params.pageSize,
        },
      },
    );

    return data;
  } catch (error) {
    console.error('Error fetching payment details:', error);
    const axiosError = error as {
      response?: { data?: { message?: string } };
      message?: string;
    };
    throw new Error(
      axiosError.response?.data?.message ||
        'Falha ao carregar detalhes do pagamento',
    );
  }
}
