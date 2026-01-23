import axiosInstance from "@/shared/lib/apiClient";
import qs from "qs";
import type {
  GenaratePdfFinancialInput,
  GenaratePdfFinancialOutput,
} from "../../types/reportFinancial/reportFinancialTypes";

type GenaratePdfFinancialReportApiResponse = {
  pdfBase64?: string;
  filename?: string;
};

export async function genaratePdfFinancialReport({
  eventId,
  details,
}: GenaratePdfFinancialInput): Promise<GenaratePdfFinancialOutput> {
  try {
    const response =
      await axiosInstance.get<GenaratePdfFinancialReportApiResponse>(
        `/report/${eventId}/financial/pdf`,
        {
          params: {
            details,
          },
          paramsSerializer: (p) => qs.stringify(p, { arrayFormat: "repeat" }),
        },
      );
    return {
      pdfBase64: response.data.pdfBase64,
      filename: response.data.filename || `relatorio-${eventId}.pdf`,
    };
  } catch (error) {
    const axiosError = error as {
      response?: {
        data?: { message?: string };
      };
      message?: string;
    };

    throw new Error(
      axiosError.response?.data?.message ??
        axiosError.message ??
        "Falha ao gerar PDF do relatório do evento",
    );
  }
}
