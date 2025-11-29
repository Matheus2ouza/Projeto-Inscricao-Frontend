import axiosInstance from "@/shared/lib/apiClient";
import type { AnalysisPreSaleResponse } from "../types/ticketSalesAnalysisTypes";

type GetTicketSalesAnalysisParams = {
  page: number;
  pageSize: number;
};

export async function getTicketSalesAnalysis(
  eventId: string,
  params: GetTicketSalesAnalysisParams
): Promise<AnalysisPreSaleResponse> {
  try {
    const { data } = await axiosInstance.get<AnalysisPreSaleResponse>(
      `/tickets/${eventId}/analysis`,
      { params }
    );
    return data;
  } catch (error) {
    const axiosError = error as { response?: { data?: { message?: string } } };
    throw new Error(
      axiosError.response?.data?.message ||
      "Falha ao carregar a análise de vendas dos tickets."
    );
  }
}
