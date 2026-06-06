import axiosInstance from '@/shared/lib/apiClient';
import { DetailsExpenseResponse } from '../../types/detailsExpense/detailsExpenseTypes';

export async function getDetailsExpense(
  expenseId?: string,
): Promise<DetailsExpenseResponse> {
  try {
    const { data } = await axiosInstance.get(`expenses/${expenseId}`);
    return data;
  } catch (error) {
    const axiosError = error as {
      response?: { data?: { message?: string } };
      message?: string;
    };
    throw new Error(
      axiosError.response?.data?.message ??
        axiosError.message ??
        'Não foi possível buscar o detalhe deste gasto',
    );
  }
}
