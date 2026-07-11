import {
  CreateExpenseRequest,
  CreateExpenseResponse,
} from '@/features/expenses/types/createExpense/createExpenseTypes';
import { axiosClient } from '@/lib/axios/client';

export async function createExpense(
  expenseData: CreateExpenseRequest,
): Promise<CreateExpenseResponse> {
  try {
    const { data } = await axiosClient.post<CreateExpenseResponse>(
      '/expenses/create',
      expenseData,
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
        'Não foi possível buscar o detalhe deste gasto',
    );
  }
}
