import {
  RejectedPaymentResponse,
  ReversePaymentInput,
} from "@/features/payment/types/analysisPayment/actions/reversePaymentTypes";
import axiosInstance from "@/shared/lib/apiClient";

export async function reversePayment({
  paymentId,
}: ReversePaymentInput): Promise<RejectedPaymentResponse> {
  try {
    const { data } = await axiosInstance.post<RejectedPaymentResponse>(
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
