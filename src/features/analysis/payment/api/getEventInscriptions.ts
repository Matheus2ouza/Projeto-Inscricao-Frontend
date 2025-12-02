import axiosInstance from "@/shared/lib/apiClient";
import { PaymentAnalysisRequest, PaymentAnalysisResponse } from "../types/analysisTypes";

export async function getEventPayments(
  eventId: string,
  params: PaymentAnalysisRequest
): Promise<PaymentAnalysisResponse> {
  try {
    const { data } = await axiosInstance.get<PaymentAnalysisResponse>(
      `/events/${eventId}/analysis/payment`,
      {
        params: {
          page: params.page,
          pageSize: params.pageSize,
          eventId: params.eventId,
        },
      }
    );
    return data;
  } catch (error) {
    console.error("Error fetching event payments analysis:", error);
    const axiosError = error as {
      response?: { data?: { message?: string } };
      message?: string;
    };
    throw new Error(
      axiosError.response?.data?.message ||
      "Falha ao carregar análise de pagamentos do evento"
    );
  }
}
