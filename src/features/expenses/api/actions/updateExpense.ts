import {
  CategoryExpense,
  PaymentMethod,
} from '@/features/expenses/types/detailsExpense/detailsExpenseTypes';
import axiosInstance from '@/shared/lib/apiClient';

export type UpdateExpenseRequest = {
  expenseId: string;
  description?: string;
  value?: number;
  paymentMethod?: PaymentMethod;
  responsible?: string;
  category?: CategoryExpense;
  createdAt?: Date;
};

export type UpdateExpenseResponse = {
  id: string;
  updated: boolean;
};

export async function updateExpense({
  expenseId,
  description,
  value,
  paymentMethod,
  responsible,
  category,
  createdAt,
}: UpdateExpenseRequest) {
  try {
    const { data } = await axiosInstance.patch(`expenses/${expenseId}`, {
      description,
      value,
      paymentMethod,
      responsible,
      category,
      createdAt,
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
        'Não foi possível atualizar o gasto',
    );
  }
}
