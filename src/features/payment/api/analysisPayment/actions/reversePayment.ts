import {
  ReversePaymentInput,
  ReversePaymentResponse,
} from "@/features/payment/types/analysisPayment/actions/reversePaymentTypes";
import axiosInstance from "@/shared/lib/apiClient";

export async function reversePayment({
  paymentId,
}: ReversePaymentInput): Promise<ReversePaymentResponse> {
  try {
    const { data } = await axiosInstance.post<ReversePaymentResponse>(
      `payments/${paymentId}/analysis/reverse`,
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
