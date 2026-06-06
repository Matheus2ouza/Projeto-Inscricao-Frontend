import {
  CreateExpenseRequest,
  CreateExpenseResponse,
} from '@/features/expenses/types/createExpense/createExpenseTypes';
import axiosInstance from '@/shared/lib/apiClient';

export async function createExpense(
  expenseData: CreateExpenseRequest,
): Promise<CreateExpenseResponse> {
  try {
    const { data } = await axiosInstance.post<CreateExpenseResponse>(
      '/expenses/create',
      expenseData,
    );
    return data;
  } catch (error) {
    const axiosError = error as { response?: { data?: { message?: string } } };
    throw new Error(
      axiosError.response?.data?.message || 'Falha ao criar gasto',
    );
  }
}
