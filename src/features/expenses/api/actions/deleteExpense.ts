import axiosInstance from '@/shared/lib/apiClient';

export type DeleteExpenseRequest = {
  id: string;
};

export async function deleteExpense({ id }: DeleteExpenseRequest) {
  try {
    await axiosInstance.delete(`expenses/${id}`);
  } catch (error) {
    const axiosError = error as {
      response?: { data?: { message?: string } };
      message?: string;
    };
    throw new Error(
      axiosError.response?.data?.message ??
        axiosError.message ??
        'Não foi deletar o gasto',
    );
  }
}
