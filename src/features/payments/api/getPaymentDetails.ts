import axiosInstance from "@/shared/lib/apiClient";
import { PaymentDetailsResponse } from "../types/paymentsDetails.types";

type PaymentDetailsApiResponse = PaymentDetailsResponse;

export async function getPaymentDetails(paymentInscriptionId: string): Promise<PaymentDetailsApiResponse> {
  try {
    const { data } = await axiosInstance.get<PaymentDetailsApiResponse>(`/payments/${paymentInscriptionId}/details`)

    return data
  } catch (error) {
    const axiosError = error as {
      response?: { data?: { message?: string } };
      message?: string;
    };

    throw new Error(
      axiosError.response?.data?.message ??
      axiosError.message ??
      "Não foi possível carregar os pagamentos"
    );
  }
}
