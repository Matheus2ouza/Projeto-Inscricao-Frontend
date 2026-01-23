import axiosInstance from "@/shared/lib/apiClient";
import { ReportFinancialResponse } from "../../types/reportFinancial/reportFinancialTypes";

export async function getReportFinancial(eventId: string, details: boolean) {
  try {
    const { data } = await axiosInstance.get<ReportFinancialResponse>(
      `/report/${eventId}/financial`,
      {
        params: {
          details,
        },
      },
    );
    return data;
  } catch (error) {
    const axiosError = error as { response?: { data?: { message?: string } } };
    throw new Error(
      axiosError.response?.data?.message ||
        "Falha ao carregar relatório do evento",
    );
  }
}
