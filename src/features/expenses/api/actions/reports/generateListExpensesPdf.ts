import {
  GenerateListeExpensesPdfInput,
  GenerateListeExpensesPdfResponse,
} from '@/features/expenses/types/actions/reports/generateListeExpensesPdfTypes';
import axiosInstance from '@/shared/lib/apiClient';
import qs from 'qs';

export async function generateListExpensesPdf({
  eventId,
  category,
  paymentMethod,
  startCreatedAt,
  endCreatedAt,
}: GenerateListeExpensesPdfInput): Promise<GenerateListeExpensesPdfResponse> {
  try {
    const { data } = await axiosInstance.get<GenerateListeExpensesPdfResponse>(
      `expenses/${eventId}/all/pdf`,
      {
        params: {
          category,
          paymentMethod,
          startCreatedAt,
          endCreatedAt,
        },
        paramsSerializer: (p) => qs.stringify(p, { arrayFormat: 'repeat' }),
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
        'Não foi possível gerar o relatorio dos gastos.',
    );
  }
}
