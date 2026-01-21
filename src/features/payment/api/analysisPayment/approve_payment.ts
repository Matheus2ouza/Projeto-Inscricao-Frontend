import axiosInstance from "@/shared/lib/apiClient";
import { PaymentActionsResponse } from "../../types/analysisPayment/analysisPaymentDetails";

export async function approvePayment(
  paymentId: string,
): Promise<PaymentActionsResponse> {
  try {
    const { data } = await axiosInstance.post<PaymentActionsResponse>(
      `payments/${paymentId}/analysis/approve`,
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
        "Não foi possível carregar os membros.",
    );
  }
}
