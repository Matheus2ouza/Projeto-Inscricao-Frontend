import { axiosClient } from '@/lib/axios';

type DownloadParticipantsPdfApiResponse = {
  pdfBase64?: string;
  filename?: string;
  message?: string;
};

type DownloadParticipantsPdfOutput = {
  pdfBase64: string;
  filename: string;
};

export async function downloadSecondCopyPdf(
  ticketSaleId: string,
): Promise<DownloadParticipantsPdfOutput> {
  try {
    const response = await axiosClient.get<DownloadParticipantsPdfApiResponse>(
      `/tickets/${ticketSaleId}/pdf/second-copy`,
    );

    const payload = response.data;
    const pdfBase64 = payload?.pdfBase64;
    const filename =
      payload?.filename ?? `Segunda-via-${ticketSaleId.slice(0, 8)}.pdf`;

    if (!pdfBase64) {
      throw new Error('Resposta do servidor não retornou o PDF da lista.');
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
        'Não foi possível gerar o PDF da lista dos tickets.',
    );
  }
}
