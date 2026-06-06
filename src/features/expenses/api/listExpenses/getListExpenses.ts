import { ListExpensesResponse } from '@/features/expenses/types/listExpenses/expensesTypes';
import axiosInstance from '@/shared/lib/apiClient';

export async function getListExpenses(
  page: number,
  pageSize: number,
  eventId?: string,
): Promise<ListExpensesResponse> {
  try {
    const { data } = await axiosInstance.get<ListExpensesResponse>(
      `expenses/list/${eventId}`,
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
        'Não foi possível buscar os a lista de gastos.',
    );
  }
}
