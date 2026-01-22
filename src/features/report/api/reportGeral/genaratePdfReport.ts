import axiosInstance from "@/shared/lib/apiClient";
import type {
  GenaratePdfReportInput,
  GenaratePdfReportOutput,
} from "../../types/reportGeral/reportTypes";

type GenaratePdfReportApiResponse = {
  data?: {
    pdfBase64?: string;
    filename?: string;
  };
  pdfBase64?: string;
  filename?: string;
  message?: string;
};

export async function genaratePdfReport({
  eventId,
}: GenaratePdfReportInput): Promise<GenaratePdfReportOutput> {
  try {
    const response = await axiosInstance.get<GenaratePdfReportApiResponse>(
      `/report/${eventId}/general/pdf`,
    );

    const payload = response.data?.data ?? response.data;
    const pdfBase64 = payload?.pdfBase64;
    const filename = payload?.filename ?? `relatorio-${eventId}.pdf`;

    if (!pdfBase64) {
      throw new Error("Resposta do servidor não contém o PDF gerado.");
    }

    return {
      pdfBase64,
      filename,
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
