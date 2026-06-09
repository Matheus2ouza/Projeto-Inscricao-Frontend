import axiosInstance from '@/shared/lib/apiClient';

export type DeleteReceiptExpenseRequest = {
  id: string;
  receiptIndex: number;
};

export type DeleteReceiptExpenseReponse = {
  deleted: boolean;
  remainingReceipts: number;
};

export async function deleteReceiptExpense({
  id,
  receiptIndex,
}: DeleteReceiptExpenseRequest) {
  try {
    const { data } = await axiosInstance.delete(`expenses/${id}/receipts`, {
      params: {
        receiptIndex,
      },
    });
    return data;
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
