import axiosInstance from "@/shared/lib/apiClient";

type DownloadParticipantsPdfApiResponse = {
  data?: {
    pdfBase64?: string;
    filename?: string;
    message?: string;
  };
  pdfBase64?: string;
  filename?: string;
  message?: string;
};

type DownloadParticipantsPdfOutput = {
  pdfBase64: string;
  filename: string;
};

export async function downloadParticipantsPdf(
  inscriptionId: string
): Promise<DownloadParticipantsPdfOutput> {
  try {
    const response =
      await axiosInstance.get<DownloadParticipantsPdfApiResponse>(
        `/inscriptions/${inscriptionId}/pdf`
      );

    const payload = response.data?.data ?? response.data;
    const pdfBase64 = payload?.pdfBase64;
    const filename =
      payload?.filename ?? `participantes-${inscriptionId.slice(0, 8)}.pdf`;

    if (!pdfBase64) {
      throw new Error("Resposta do servidor não retornou o PDF da lista.");
    }

    return { pdfBase64, filename };
  } catch (error) {
    const axiosError = error as {
      response?: { data?: { message?: string } };
      message?: string;
    };

    throw new Error(
      axiosError.response?.data?.message ??
      axiosError.message ??
      "Não foi possível gerar o PDF da lista de participantes."
    );
  }
}
