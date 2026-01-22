import { ReportGeneralResponse } from "@/features/report/types/reportGeral/reportTypes";
import axiosInstance from "@/shared/lib/apiClient";

const parseDate = (value: Date | string): Date => {
  return value instanceof Date ? value : new Date(value);
};

export async function getReportGeneral(
  eventId: string,
): Promise<ReportGeneralResponse> {
  try {
    const { data } = await axiosInstance.get<ReportGeneralResponse>(
      `/report/${eventId}/general`,
    );

    return {
      ...data,
      startDate: parseDate(data.startDate),
      endDate: parseDate(data.endDate),
    };
  } catch (error) {
    const axiosError = error as { response?: { data?: { message?: string } } };
    throw new Error(
      axiosError.response?.data?.message ||
        "Falha ao carregar relatório do evento",
    );
  }
}
