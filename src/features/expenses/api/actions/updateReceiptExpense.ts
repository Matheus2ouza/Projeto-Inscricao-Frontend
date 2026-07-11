import { axiosClient } from '@/lib/axios/client';

export type UpdateReceiptExpenseRequest = {
  expenseId: string;
  receipts: string[];
};

export type UpdateReceiptExpenseResponse = {
  receipts: number;
};

export async function updateReceiptExpense({
  expenseId,
  receipts,
}: UpdateReceiptExpenseRequest) {
  try {
    const { data } = await axiosClient.post(
      `expenses/${expenseId}/receipts`,
      {
        receipts,
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
        'Não foi possível atualizar os comprovantes',
    );
  }
}
