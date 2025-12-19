import axiosInstance from "@/shared/lib/apiClient";
import {
  CreateExpenseRequest,
  CreateExpenseResponse,
} from "../types/expensesTypes";

export async function createExpense(
  expenseData: CreateExpenseRequest
): Promise<CreateExpenseResponse> {
  try {
    const { data } = await axiosInstance.post<CreateExpenseResponse>(
      "/event-expenses/create",
      expenseData
    );
    return data;
  } catch (error) {
    const axiosError = error as { response?: { data?: { message?: string } } };
    throw new Error(
      axiosError.response?.data?.message || "Falha ao criar gasto"
    );
  }
}
